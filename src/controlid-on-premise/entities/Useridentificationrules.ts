import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Identificationrules } from './Identificationrules';
import { Users } from './Users';

@Index('fkUserIdentificationRules', ['idIdentificationRule'], {})
@Index('fkUserIdentificationRules2', ['idUser'], {})
@Entity('useridentificationrules', { schema: 'acesso' })
export class Useridentificationrules {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'idIdentificationRule' })
  idIdentificationRule: string;

  @Column('bigint', { name: 'idUser' })
  idUser: string;

  @ManyToOne(
    () => Identificationrules,
    (identificationrules) => identificationrules.useridentificationrules,
    { onDelete: 'CASCADE', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'idIdentificationRule', referencedColumnName: 'id' }])
  idIdentificationRule2: Identificationrules;

  @ManyToOne(() => Users, (users) => users.useridentificationrules, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'idUser', referencedColumnName: 'id' }])
  idUser2: Users;
}
