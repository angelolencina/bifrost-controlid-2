import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';
import { Groups } from './Groups';

@Index('fkUserGroups', ['idUser'], {})
@Index('fkUserGroups2', ['idGroup'], {})
@Entity('usergroups', { schema: 'acesso' })
export class Usergroups {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('bigint', { name: 'idUser' })
  idUser: string;

  @Column('bigint', { name: 'idGroup' })
  idGroup: string;

  @Column('int', { name: 'isVisitor', nullable: true })
  isVisitor: number | null;

  @ManyToOne(() => Users, (users) => users.usergroups, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'idUser', referencedColumnName: 'id' }])
  idUser2: Users;

  @ManyToOne(() => Groups, (groups) => groups.usergroups, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'idGroup', referencedColumnName: 'id' }])
  idGroup2: Groups;
}
