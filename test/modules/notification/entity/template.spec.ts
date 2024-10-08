import { Template } from '@/modules/notification/entity/template';

describe('Template', () => {
  it('should create the template', () => {
    const template = new Template({
      body: `Olá {{name}}`,
      context: 'FORGOT_PASSWORD',
      subject: 'Recuperação de senha',
    });

    expect(template.id).toBeDefined();
    expect(template.context).toBe('FORGOT_PASSWORD');
    expect(template.subject).toBe('Recuperação de senha');
    expect(template.body).toBe('Olá {{name}}');
  });

  it('should throw an exception when trying to create a template without context', () => {
    expect(() => {
      new Template({
        body: `Olá {{name}}`,
        context: null,
        subject: 'Recuperação de senha',
      });
    }).toThrow();
  });

  it('should throw an exception when trying to create a template without a body', () => {
    expect(() => {
      new Template({
        body: null,
        context: 'FORGOT_PASSWORD',
        subject: 'Recuperação de senha',
      });
    }).toThrow();
  });

  it('should throw an exception when trying to create a template without a subject', () => {
    expect(() => {
      new Template({
        body: `Olá {{name}}`,
        context: 'FORGOT_PASSWORD',
        subject: null,
      });
    }).toThrow();
  });

  describe('parse', () => {
    it(' should replace the variables in the email body', () => {
      const template = new Template({
        body: `Olá {{name}}`,
        context: 'FORGOT_PASSWORD',
        subject: 'Recuperação de senha',
      });

      const parsed = template.parse({ name: 'Fulano' });

      expect(parsed.body).toBe('Olá Fulano');
    });

    it('should replace the email subject variables', () => {
      const template = new Template({
        body: `Olá {{name}}`,
        context: 'FORGOT_PASSWORD',
        subject: 'Recuperação de senha para {{name}}',
      });

      const parsed = template.parse({ name: 'Fulano' });

      expect(parsed.subject).toBe('Recuperação de senha para Fulano');
      expect(parsed.body).toBe('Olá Fulano');
    });

    it('should replace the email body and subject variables', () => {
      const template = new Template({
        body: `Olá {{name}}`,
        context: 'FORGOT_PASSWORD',
        subject:
          'Recuperação de senha para {{name}} para o evento {{eventName}}',
      });

      const parsed = template.parse({ name: 'Fulano', eventName: 'Evento' });

      expect(parsed.subject).toBe(
        'Recuperação de senha para Fulano para o evento Evento',
      );
      expect(parsed.body).toBe('Olá Fulano');
    });

    it('should replace body variables in an object', () => {
      const template = new Template({
        body: 'Olá {{user.name}}',
        context: 'FORGOT_PASSWORD',
        subject: 'Recuperação de senha',
      });

      const parsed = template.parse({
        user: {
          name: 'Fulano',
        },
      });

      expect(parsed.body).toBe('Olá Fulano');
    });
  });
});
