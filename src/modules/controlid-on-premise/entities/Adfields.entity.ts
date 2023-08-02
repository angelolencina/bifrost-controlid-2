import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('adfields', { schema: 'acesso' })
export class Adfields {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'Id' })
  id: string;

  @Column('varchar', { name: 'DBColumn', nullable: true, length: 50 })
  dbColumn: string | null;

  @Column('varchar', { name: 'ADFieldName', nullable: true, length: 50 })
  adFieldName: string | null;
}
