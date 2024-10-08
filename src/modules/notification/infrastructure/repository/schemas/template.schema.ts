import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('templates')
export class TemplateSchema {
  @PrimaryColumn({
    primary: true,
  })
  id: string;

  @Column()
  context: string;

  @Column()
  subject: string;

  @Column()
  body: string;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
