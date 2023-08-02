import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('grouptypes', { schema: 'acesso' })
export class Grouptypes {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('varchar', { name: 'name', nullable: true, length: 50 })
  name: string | null;
}
