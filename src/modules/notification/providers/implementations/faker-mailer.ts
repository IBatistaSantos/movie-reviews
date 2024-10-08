import { MailProvider, MailProviderParams } from '../mail.provider';

export class FakerMailer implements MailProvider {
  async send(params: MailProviderParams): Promise<string> {
    console.log('Sending email with params:', params);
    return 'Email sent';
  }
}
