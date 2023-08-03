import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Operatortypegroups } from './Operatortypegroups.entity';

@Entity('operatortypes', { schema: 'acesso' })
export class Operatortypes {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('varchar', { name: 'name', nullable: true, length: 50 })
  name: string | null;

  @Column('boolean', { name: 'restrictGroups', default: () => "'b'0''" })
  restrictGroups: boolean;

  @Column('boolean', { name: 'allowVisitors', default: () => "'b'0''" })
  allowVisitors: boolean;

  @Column('boolean', { name: 'allowPersons', default: () => "'b'0''" })
  allowPersons: boolean;

  @OneToMany(
    () => Operatortypegroups,
    (operatortypegroups) => operatortypegroups.idOperatorType2,
  )
  operatortypegroups: Operatortypegroups[];
}
