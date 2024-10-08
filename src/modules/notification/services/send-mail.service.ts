import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { mailerConfig } from '../config/mailer.config';
import { MailProvider } from '../providers/mail.provider';
import { NotificationRepository } from '../repository/notification.repository';
import { TemplateContextValue } from '../entity/template';

interface SendEmailParams {
  context: TemplateContextValue;
  to: {
    name: string;
    email: string;
  };
  organizationId?: string;
  eventId?: string;
  variables?: Record<string, unknown>;
}

@Injectable()
export class SendMailUseCase {
  constructor(
    @Inject('MailProvider')
    private readonly provider: MailProvider,

    @Inject('NotificationRepository')
    private readonly repository: NotificationRepository,
  ) {}

  async execute(params: SendEmailParams): Promise<void> {
    const { context, to, variables } = params;

    const template = await this.repository.findByContext(context);
    if (!template) {
      throw new NotFoundException('Template nao encontrado');
    }

    const templateParsed = template.parse(variables);
    let subject = templateParsed.subject;

    if (process.env.ENVIRONMENT === 'local') {
      subject = `[DEV] - ${template.subject}`;
      to.email = mailerConfig.email_development;
    }

    const messageId = await this.provider.send({
      to,
      subject,
      body: templateParsed.body,
    });

    console.log(`Email sent with messageId: ${messageId}`);

    await this.repository.save({
      messageId,
      templateId: template.id,
      to: to.email,
      context,
    });
  }
}
