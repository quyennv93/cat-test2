import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateAccountDto } from './dto/create-account.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly acccountRepo: Repository<Account>,
    private readonly jwtService: JwtService,
  ) {}

  async register(accountDto: CreateAccountDto): Promise<CreateAccountDto> {
    const hashPassword = await this.hashPassword(accountDto.password);
    await this.acccountRepo.save({ ...accountDto, password: hashPassword });
    return accountDto;
  }

  async generateToken(payload: Account) {
    return await this.jwtService.sign({ id: payload.id });
  }

  async authentication(username: string, password: string) {
    const account = await this.findOneByUsername(username);
    if (account) {
      if (await this.comparePassword(password, account.password)) {
        return account;
      }
    }
    throw new UnauthorizedException();
  }

  async hashPassword(password: string): Promise<any> {
    return await bcrypt.hash(password, 12);
  }

  async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }

  async findOneByUsername(username: string): Promise<Account> {
    return this.acccountRepo.findOne({ where: { username } });
  }

  async findOneById(id: number): Promise<Account> {
    return await this.acccountRepo.findOne({
      where: { id },
      relations: ['cats'],
    });
  }
  async findAll() {
    return await this.acccountRepo.find();
  }
}
