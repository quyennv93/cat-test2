import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CurrentAccount } from 'src/common/decorators/current-user';
import { Roles } from 'src/common/decorators/role';
import { EnumRole } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guard/local-auth.guard';
import { RolesGuard } from 'src/guard/role.guard';
import { Account } from './account.entity';
import { AuthService } from './auth.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { LoginAccountDto } from './dto/login-account.dto';
@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(@Body() accountDto: CreateAccountDto) {
    return this.authService.register(accountDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @UsePipes(ValidationPipe)
  login(
    @Body() loginAccountDto: LoginAccountDto,
    @CurrentAccount() account: Account,
  ) {
    return this.authService.generateToken(account);
  }

  @Get('accounts')
  @Roles(EnumRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  findAll() {
    return this.authService.findAll();
  }

  @Get('accounts/:id')
  findOne(@Param('id') id: string) {
    return this.authService.findOneById(+id);
  }
}
