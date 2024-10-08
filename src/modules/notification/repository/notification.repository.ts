import { Template, TemplateContextValue } from '../entity/template';

export interface SaveSenderEmailParams {
  messageId: string;
  context: TemplateContextValue;
  to: string;
  templateId: string;
}

export interface NotificationRepository {
  findByContext(context: TemplateContextValue): Promise<Template>;
  save(params: SaveSenderEmailParams): Promise<void>;
}
