import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationsParams } from 'src/common/paginations/pagination';
import { CatService } from './cat.service';
import { Response } from 'express';
import { join } from 'path';
import * as xlsx from 'xlsx';
import { Cat } from './cat.entity';
import { createReadStream } from 'fs';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { CurrentAccount } from 'src/common/decorators/current-user';
import { Account } from 'src/auth/account.entity';
import { CreateCatDto } from './dto/create-cat.dto';

@ApiTags('Cat')
@Controller('cats')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @Get()
  async findAll(@Query() pagination: PaginationsParams) {
    return await this.catService.findall(pagination);
  }

  @Get('excel')
  async exportExel(
    @Res() res: Response,
    @Query() pagination: PaginationsParams,
  ) {
    const path = join(process.cwd(), 'excels');
    const fileName = 'excel.xlsx';
    const fullPath = join(path, fileName);

    const { data } = await this.findAll(pagination);
    const workSheet = xlsx.utils.json_to_sheet(data as Cat[]);
    const workBook = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(workBook, workSheet, 'data');
    xlsx.write(workBook, { bookType: 'xlsx', type: 'buffer' });
    xlsx.writeFile(workBook, fullPath);

    const file = createReadStream(fullPath);
    res.set({
      'Content-type':
        'aapplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    file.pipe(res);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Body() createCatDto: CreateCatDto,
    @CurrentAccount() by: Account,
  ) {
    return this.catService.create(createCatDto, by);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentAccount() by: Account,
  ) {
    return await this.catService.delete(id, by);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() cat: CreateCatDto,
    @CurrentAccount() by: Account,
  ) {
    return await this.catService.update(+id, cat, by);
  }

  @Get('by-account/:id')
  async findByAccount(@Param('id') id: string) {
    return await this.catService.findByAccount(+id);
  }
}
