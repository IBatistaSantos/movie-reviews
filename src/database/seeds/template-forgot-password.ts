import { TemplateSchema } from '@/modules/notification/infrastructure/repository/schemas/template.schema';
import { randomUUID } from 'crypto';
import { DataSource } from 'typeorm';

export class CreateForgotPasswordTemplateSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(TemplateSchema);

    const template = repository.create({
      id: randomUUID(),
      status: 'ACTIVE',
      subject: 'Recuperação de Senha',
      body: '<p>Olá,</p><p>Você solicitou a recuperação da sua senha. Por favor, clique no link abaixo para redefinir sua senha:</p><p><a href="{{link}}">Redefinir Senha</a></p>',
      context: 'FORGOT_PASSWORD',
    });

    await repository.save(template);
  }
}
