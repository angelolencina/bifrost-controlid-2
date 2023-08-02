import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('logmessages', { schema: 'acesso' })
export class Logmessages {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'idLog' })
  idLog: string;

  @Column('bigint', { name: 'idOperator' })
  idOperator: string;

  @Column('datetime', { name: 'time' })
  time: Date;

  @Column('varchar', { name: 'info', nullable: true, length: 100 })
  info: string | null;
}
