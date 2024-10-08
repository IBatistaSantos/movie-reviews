import { BaseEntity, BaseEntityProps } from '@/core/entity/base-entity';
import { BadException } from '@/core/errors/bad-exception';

enum TemplateContext {
  FORGOT_PASSWORD = 'forgot_password',
}

export type TemplateContextValue = keyof typeof TemplateContext;

interface TemplateProps extends BaseEntityProps {
  subject: string;
  body: string;
  context: TemplateContextValue;
}

export class Template extends BaseEntity {
  private _context: TemplateContextValue;
  private _subject: string;
  private _body: string;

  constructor(props: TemplateProps) {
    super(props);
    this._context = props.context;
    this._subject = props.subject;
    this._body = props.body;

    this.validate();
  }

  get context() {
    return this._context;
  }

  get subject() {
    return this._subject;
  }

  get body() {
    return this._body;
  }

  private parseBody(variables: Record<string, any>) {
    let bodyParsed = this._body;
    Object.keys(variables).forEach((key) => {
      if (typeof variables[key] === 'object') {
        Object.keys(variables[key]).forEach((value) => {
          bodyParsed = bodyParsed.replace(
            `{{${key}.${value}}}`,
            variables[key][value] as string,
          );
        });
      } else {
        bodyParsed = bodyParsed.replace(`{{${key}}}`, variables[key] as string);
      }
    });

    return bodyParsed;
  }

  parse(variables: Record<string, any>) {
    let subjectParsed = this._subject;
    Object.keys(variables).forEach((key) => {
      subjectParsed = subjectParsed.replace(
        `{{${key}}}`,
        variables[key] as string,
      );
    });

    return { body: this.parseBody(variables), subject: subjectParsed };
  }

  private validate() {
    if (!this._subject) {
      throw new BadException('The subject is required');
    }

    if (!this._body) {
      throw new BadException('The body is required');
    }

    if (!this._context) {
      throw new BadException('The context is required');
    }
  }

  toJSON(): TemplateProps {
    return {
      ...super.toJSON(),
      context: this._context,
      subject: this._subject,
      body: this._body,
    };
  }
}
