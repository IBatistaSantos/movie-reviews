import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserService } from '../services/create-user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ProfileUserService } from '../services/profile-user.service';
import { UserProps } from '../entities/user.entity';
import { GetUser } from '../../shared/decorator/get-user.decorator';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly profileService: ProfileUserService,
  ) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    const { name, email, password } = body;

    const response = await this.createUserService.execute(
      name,
      email,
      password,
    );

    return response;
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async profile(@GetUser() user: any): Promise<Omit<UserProps, 'password'>> {
    const response = await this.profileService.execute(user.id);
    return response;
  }
}
