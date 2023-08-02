import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Identificationrules } from './Identificationrules';
import { Groups } from './Groups';

@Index('fkGroupIdentificationRules', ['idIdentificationRule'], {})
@Index('fkGroupIdentificationRules2', ['idGroup'], {})
@Entity('groupidentificationrules', { schema: 'acesso' })
export class Groupidentificationrules {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'idIdentificationRule' })
  idIdentificationRule: string;

  @Column('bigint', { name: 'idGroup' })
  idGroup: string;

  @ManyToOne(
    () => Identificationrules,
    (identificationrules) => identificationrules.groupidentificationrules,
    { onDelete: 'CASCADE', onUpdate: 'RESTRICT' },
  )
  @JoinColumn([{ name: 'idIdentificationRule', referencedColumnName: 'id' }])
  idIdentificationRule2: Identificationrules;

  @ManyToOne(() => Groups, (groups) => groups.groupidentificationrules, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'idGroup', referencedColumnName: 'id' }])
  idGroup2: Groups;
}
