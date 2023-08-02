import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Typeidentificationrules } from './Typeidentificationrules.entity';

@Entity('usertypes', { schema: 'acesso' })
export class Usertypes {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('varchar', { name: 'name', nullable: true, length: 50 })
  name: string | null;

  @OneToMany(
    () => Typeidentificationrules,
    (typeidentificationrules) => typeidentificationrules.idType2,
  )
  typeidentificationrules: Typeidentificationrules[];
}
