import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivitiesService } from '../activities/activities.service';
import { ActivityType, ContractStatus } from '@inf-crm/types';

@Injectable()
export class ContractsService {
    constructor(
        private prisma: PrismaService,
        private activities: ActivitiesService,
    ) { }

    async create(tenantId: string, dealId: string, data: { fileKey: string; fileName: string; status?: ContractStatus }) {
        const deal = await this.prisma.deal.findFirst({
            where: { id: dealId, tenantId },
        });
        if (!deal) throw new NotFoundException('Deal not found');

        const contract = await this.prisma.contractFile.create({
            data: {
                ...data,
                dealId,
                tenantId,
            },
        });

        await this.activities.log({
            tenantId,
            dealId,
            type: ActivityType.FILE_UPLOADED,
            message: `Contract uploaded: ${data.fileName}`,
        });

        return contract;
    }

    async generateAutoContract(tenantId: string, dealId: string) {
        const deal = await this.prisma.deal.findFirst({
            where: { id: dealId, tenantId },
            include: { brand: true, tenant: true, contact: true }
        });
        if (!deal) throw new NotFoundException('Deal not found');

        const date = new Date().toLocaleDateString('tr-TR');
        const amount = Number(deal.totalAmount).toLocaleString('tr-TR');

        const contractContent = `
# HİZMET SÖZLEŞMESİ

**TARAFLAR**
Bir tarafta **$${deal.tenant.name}** (Bundan böyle "AJANS" olarak anılacaktır) ile diğer tarafta **$${deal.brand.name}** (Bundan böyle "MÜŞTERİ" olarak anılacaktır) arasında aşağıdaki şartlarda anlaşmaya varılmıştır.

**1. SÖZLEŞMENİN KONUSU**
İşbu sözleşmenin konusu, MÜŞTERİ'ye ait "$${deal.title}" isimli kampanya kapsamında AJANS'ın sağlayacağı hizmetlerin ve tarafların hak ve yükümlülüklerinin belirlenmesidir.

**2. HİZMET BEDELİ VE ÖDEME ŞARTLARI**
AJANS tarafından verilecek hizmetlerin toplam bedeli KDV hariç **$${amount} $${deal.currency}** olarak belirlenmiştir.
Ödeme Tipi: $${deal.paymentType}

**3. SÜRE VE FESİH**
İşbu sözleşme **$${date}** tarihinde imzalanarak yürürlüğe girmiş olup, kampanya bitiminde kendiliğinden sona erecektir.

**4. E-İMZA VE ONAY**
Bu sözleşme dijital ortamda oluşturulmuş olup, onaylandığı an itibariyle taraflarca kabul edilmiş sayılır.

---
**Ajans Kaşe/İmza:** $${deal.tenant.name} Yetkilisi
**Müşteri Kaşe/İmza:** $${deal.contact?.name || '.........................'}
        `;

        return { content: contractContent.trim() };
    }

    async findAll(tenantId: string, dealId: string) {
        return this.prisma.contractFile.findMany({
            where: { tenantId, dealId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateStatus(tenantId: string, id: string, status: ContractStatus) {
        const contract = await this.prisma.contractFile.findFirst({
            where: { id, tenantId },
        });
        if (!contract) throw new NotFoundException('Contract not found');

        const updated = await this.prisma.contractFile.update({
            where: { id },
            data: { status },
        });

        if (status === ContractStatus.SIGNED) {
            await this.activities.log({
                tenantId,
                dealId: contract.dealId,
                type: ActivityType.CONTRACT_SIGNED,
                message: `Contract signed: ${contract.fileName}`,
            });
        }

        return updated;
    }

    async remove(tenantId: string, id: string) {
        const contract = await this.prisma.contractFile.findFirst({
            where: { id, tenantId },
        });
        if (!contract) throw new NotFoundException('Contract not found');

        return this.prisma.contractFile.delete({ where: { id } });
    }
}
