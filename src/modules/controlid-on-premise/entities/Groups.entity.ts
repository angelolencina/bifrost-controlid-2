import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Usergroups } from './Usergroups.entity';
import { Operatortypegroups } from './Operatortypegroups.entity';
import { Groupidentificationrules } from './Groupidentificationrules.entity';

@Entity('groups', { schema: 'acesso' })
export class Groups {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('varchar', { name: 'name', nullable: true, length: 200 })
  name: string | null;

  @Column('bit', { name: 'disableADE' })
  disableAde: boolean;

  @Column('bit', { name: 'controlVisitors' })
  controlVisitors: boolean;

  @Column('bigint', { name: 'maxVisitors' })
  maxVisitors: string;

  @Column('bit', { name: 'contingency', nullable: true })
  contingency: boolean | null;

  @Column('int', { name: 'maxTimeInside', nullable: true })
  maxTimeInside: number | null;

  @Column('int', { name: 'id2', nullable: true })
  id2: number | null;

  @Column('int', { name: 'idType' })
  idType: number;

  @OneToMany(() => Usergroups, (usergroups) => usergroups.idGroup2)
  usergroups: Usergroups[];

  @OneToMany(
    () => Operatortypegroups,
    (operatortypegroups) => operatortypegroups.idGroup2,
  )
  operatortypegroups: Operatortypegroups[];

  @OneToMany(
    () => Groupidentificationrules,
    (groupidentificationrules) => groupidentificationrules.idGroup2,
  )
  groupidentificationrules: Groupidentificationrules[];
}
