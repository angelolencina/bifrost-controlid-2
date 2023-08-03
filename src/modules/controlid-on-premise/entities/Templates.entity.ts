import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users.entity';

@Index('fkTemplates', ['idUser'], {})
@Entity('templates', { schema: 'acesso' })
export class Templates {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'idUser' })
  idUser: string;

  @Column('boolean', { name: 'panic' })
  panic: boolean;

  @Column('int', { name: 'idType' })
  idType: number;

  @Column('text', { name: 'templatePC', nullable: true })
  templatePc: string | null;

  @Column('text', { name: 'templateDevice', nullable: true })
  templateDevice: string | null;

  @ManyToOne(() => Users, (users) => users.templates, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'idUser', referencedColumnName: 'id' }])
  idUser2: Users;
}
