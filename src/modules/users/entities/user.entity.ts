import { BaseEntity, BaseEntityProps } from '../../../core/entity/base-entity';
import { Email } from './value-object/email';

export interface UserProps extends BaseEntityProps {
  name: string;
  email: string;
  password: string;
  forgotPasswordToken?: string;
}

export class User extends BaseEntity {
  private _name: string;
  private _email: Email;
  private _password: string;
  private _forgotPasswordToken: string | null;

  constructor(props: UserProps) {
    super(props);

    this._name = props.name;
    this._email = new Email(props.email);
    this._password = props.password;
    this._forgotPasswordToken = props.forgotPasswordToken || null;
  }

  setForgotPasswordToken(token: string) {
    this._forgotPasswordToken = token;
  }

  get name(): string {
    return this._name;
  }

  get email(): Email {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get forgotPasswordToken(): string | null {
    return this._forgotPasswordToken;
  }

  toJSON(): UserProps {
    return {
      ...super.toJSON(),
      name: this.name,
      email: this.email.value,
      password: this._password,
      forgotPasswordToken: this._forgotPasswordToken,
    };
  }
}
