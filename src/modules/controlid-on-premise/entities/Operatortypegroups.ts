import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Operatortypes } from './Operatortypes';
import { Groups } from './Groups';

@Index('fkOperatorTypeGroups', ['idOperatorType'], {})
@Index('fkOperatorTypeGroups2', ['idGroup'], {})
@Entity('operatortypegroups', { schema: 'acesso' })
export class Operatortypegroups {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'idOperatorType' })
  idOperatorType: string;

  @Column('bigint', { name: 'idGroup' })
  idGroup: string;

  @ManyToOne(
    () => Operatortypes,
    (operatortypes) => operatortypes.operatortypegroups,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'idOperatorType', referencedColumnName: 'id' }])
  idOperatorType2: Operatortypes;

  @ManyToOne(() => Groups, (groups) => groups.operatortypegroups, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'idGroup', referencedColumnName: 'id' }])
  idGroup2: Groups;
}
