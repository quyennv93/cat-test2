import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { EnumRole } from 'src/common/enums/role.enum';
import { Cat } from 'src/cat/cat.entity';
@Entity('account')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { unique: true })
  username: string;

  @Exclude()
  @Column('varchar')
  password: string;

  @Column('enum', { enum: EnumRole, default: EnumRole.USER })
  role: EnumRole;

  @OneToMany(() => Cat, (cat) => cat.owner, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  cats: Cat[];
}
