import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Useridentificationrules } from './Useridentificationrules.entity';
import { Typeidentificationrules } from './Typeidentificationrules.entity';
import { Modeidentificationrules } from './Modeidentificationrules.entity';
import { Groupidentificationrules } from './Groupidentificationrules.entity';

@Entity('identificationrules', { schema: 'acesso' })
export class Identificationrules {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('varchar', { name: 'name', nullable: true, length: 50 })
  name: string | null;

  @OneToMany(
    () => Useridentificationrules,
    (useridentificationrules) => useridentificationrules.idIdentificationRule2,
  )
  useridentificationrules: Useridentificationrules[];

  @OneToMany(
    () => Typeidentificationrules,
    (typeidentificationrules) => typeidentificationrules.idIdentificationRule2,
  )
  typeidentificationrules: Typeidentificationrules[];

  @OneToMany(
    () => Modeidentificationrules,
    (modeidentificationrules) => modeidentificationrules.idIdentificationRule2,
  )
  modeidentificationrules: Modeidentificationrules[];

  @OneToMany(
    () => Groupidentificationrules,
    (groupidentificationrules) =>
      groupidentificationrules.idIdentificationRule2,
  )
  groupidentificationrules: Groupidentificationrules[];
}
