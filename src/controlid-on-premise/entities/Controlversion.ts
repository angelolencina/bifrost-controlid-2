import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('controlversion', { schema: 'acesso' })
export class Controlversion {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('int', { name: 'Versao' })
  versao: number;

  @Column('datetime', { name: 'Data' })
  data: Date;

  @Column('varchar', { name: 'Software', nullable: true, length: 50 })
  software: string | null;

  @Column('varchar', { name: 'IP', nullable: true, length: 50 })
  ip: string | null;

  @Column('varchar', { name: 'Info', nullable: true, length: 1000 })
  info: string | null;
}
