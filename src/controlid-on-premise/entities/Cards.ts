import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';

@Index('fkCards1', ['idUser'], {})
@Entity('cards', { schema: 'acesso' })
export class Cards {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'idUser', nullable: true })
  idUser: string | null;

  @Column('bigint', { name: 'number' })
  number: string;

  @Column('int', { name: 'idType', nullable: true })
  idType: number | null;

  @Column('int', { name: 'type' })
  type: number;

  @Column('varchar', { name: 'numberStr', nullable: true, length: 50 })
  numberStr: string | null;

  @Column('bigint', { name: 'idVehicle', nullable: true })
  idVehicle: string | null;

  @ManyToOne(() => Users, (users) => users.cards, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'idUser', referencedColumnName: 'id' }])
  idUser2: Users;
}
