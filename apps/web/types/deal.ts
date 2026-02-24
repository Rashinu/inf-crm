import { DealStage, Platform } from "@inf-crm/types";

export interface Deal {
    id: string;
    title: string;
    brandId: string;
    brand: {
        name: string;
    };
    contactId?: string;
    contact?: {
        name: string;
        email: string;
    };
    value?: number;
    stage: DealStage;
    platform: Platform;
    description?: string;
    createdAt: string;
    updatedAt: string;
}
