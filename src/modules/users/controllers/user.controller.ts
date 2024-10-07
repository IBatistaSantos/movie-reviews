import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserService } from '../services/create-user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';
import { ProfileUserService } from '../services/profile-user.service';
import { UserProps } from '../entities/user.entity';
import { GetUser } from '../../shared/decorator/get-user.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly profileService: ProfileUserService,
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
      },
    },
  })
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
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully returned.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  async profile(@GetUser() user: any): Promise<Omit<UserProps, 'password'>> {
    const response = await this.profileService.execute(user.id);
    return response;
  }
}
