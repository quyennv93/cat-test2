import { Account } from 'src/auth/account.entity';
import { EnumCatGender } from 'src/common/enums/cat-gender.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cat')
export class Cat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: false })
  name: string;

  @Column('enum', {
    enum: EnumCatGender,
    default: EnumCatGender.MALE,
  })
  gender: EnumCatGender;

  @Column('varchar', { nullable: true })
  image: string;

  @Column('float', { unsigned: true, default: 0 })
  age: number;

  @ManyToOne(() => Account, (owner: Account) => owner.cats)
  owner: Account;
}
