import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from '../email/email.service';

@Processor('outreach')
export class OutreachProcessor extends WorkerHost {
  constructor(private emailService: EmailService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { to, subject, body } = job.data;
    
    console.log(`Processing outreach email to: ${to}`);
    
    await this.emailService.sendGenericEmail(to, subject, body);
    
    return { sent: true };
  }
}
