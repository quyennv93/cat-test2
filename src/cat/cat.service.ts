import {
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/auth/account.entity';
import { EnumCatGender } from 'src/common/enums/cat-gender.enum';
import { AppError } from 'src/common/exceptions/app-error';
import {
  PaginationMeta,
  PaginationsParams,
} from 'src/common/paginations/pagination';
import { Repository } from 'typeorm';
import { Cat } from './cat.entity';
import { PaginatedCat } from './dto/cat-pagination.dto';
import { CreateCatDto } from './dto/create-cat.dto';

@Injectable({ scope: Scope.REQUEST })
export class CatService {
  constructor(
    @InjectRepository(Cat) private readonly catRepo: Repository<Cat>,
  ) {}

  async findall(pagination: PaginationsParams): Promise<PaginatedCat> {
    const catBuilder = this.catRepo.createQueryBuilder('cat');
    const [data, total] = await catBuilder
      .skip(pagination.skip)
      .take(pagination.take)
      .getManyAndCount();

    return new PaginatedCat(
      data,
      new PaginationMeta({ params: pagination, total }),
    );
  }

  async findOne(id: number): Promise<Cat> {
    return await this.catRepo.findOne({
      where: { id },
      relations: ['owner'],
    });
  }

  async create(createCatDto: CreateCatDto, by: Account): Promise<Cat> {
    if (
      createCatDto.gender &&
      !Object.values(EnumCatGender).includes(createCatDto.gender)
    ) {
      throw new AppError('invalid gender', 400);
    }

    if (by) {
      const newCat = await this.catRepo.create({ ...createCatDto, owner: by });

      return await this.catRepo.save(newCat);
    }
    throw new UnauthorizedException();
  }

  async delete(id: number, by: Account): Promise<any> {
    const currentCat = await this.catRepo.findOne({ where: { id } });

    if (!currentCat) {
      throw new NotFoundException('noy found');
    }

    const isOwner = currentCat.owner.id === by.id;

    if (isOwner) {
      return await this.catRepo.delete({ id });
    }

    throw new UnauthorizedException();
  }

  async update(
    id: number,
    createCatDto: CreateCatDto,
    by: Account,
  ): Promise<Cat> {
    const currentCat = await this.catRepo.findOne({ where: { id } });
    if (!currentCat) {
      throw new NotFoundException('not found');
    }

    if (by && currentCat.owner.id === by.id) {
      return await this.catRepo.save({ ...currentCat, ...createCatDto, id });
    }

    throw new UnauthorizedException();
  }

  async findByAccount(id: number) {
    const [cats] = await this.catRepo
      .createQueryBuilder('cat')
      .where('cat.ownerId = :id', { id })
      .getManyAndCount();

    return cats;
  }
}
