import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('confignamesvalues', { schema: 'acesso' })
export class Confignamesvalues {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('varchar', { name: 'Name', nullable: true, length: 50 })
  name: string | null;

  @Column('varchar', { name: 'Value', nullable: true, length: 4000 })
  value: string | null;
}
