import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notifications')
export class NotificationSchema {
  @PrimaryColumn({
    primary: true,
  })
  id: number;

  @Column()
  context: string;

  @Column()
  subject: string;

  @Column()
  body: string;

  @Column()
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
