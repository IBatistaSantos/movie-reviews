import { randomUUID } from 'crypto';
import { Status } from './value-object/status';

interface BaseEntityParams {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}

export type BaseEntityProps = Partial<BaseEntityParams>;

export class BaseEntity {
  private _id: string;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _status: Status;

  constructor(props: BaseEntityProps) {
    this._id = props.id || randomUUID();
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
    this._status = new Status(props.status);
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get status(): Status {
    return this._status;
  }

  public activate(): void {
    this._status = new Status('ACTIVE');
  }

  public deactivate(): void {
    this._status = new Status('INACTIVE');
  }

  toJSON(): BaseEntityProps {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      status: this.status.value,
    };
  }
}
