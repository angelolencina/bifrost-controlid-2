import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('operators', { schema: 'acesso' })
export class Operators {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('varchar', { name: 'name', nullable: true, length: 50 })
  name: string | null;

  @Column('varchar', { name: 'user', nullable: true, length: 50 })
  user: string | null;

  @Column('varchar', { name: 'hash', nullable: true, length: 50 })
  hash: string | null;

  @Column('int', { name: 'idType' })
  idType: number;
}
