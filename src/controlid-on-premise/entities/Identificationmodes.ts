import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Modeidentificationrules } from './Modeidentificationrules';

@Entity('identificationmodes', { schema: 'acesso' })
export class Identificationmodes {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('varchar', { name: 'name', nullable: true, length: 200 })
  name: string | null;

  @Column('int', { name: 'priorityMode' })
  priorityMode: number;

  @OneToMany(
    () => Modeidentificationrules,
    (modeidentificationrules) => modeidentificationrules.idIdentificationMode2,
  )
  modeidentificationrules: Modeidentificationrules[];
}
