import { Body, Controller, Post } from '@nestjs/common';

import { SignInDto } from './dtos/signIn.dto';
import { AuthenticationService } from '../services/auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully authenticated.',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
          },
        },
      },
    },
  })
  async signIn(@Body() authenticationDto: SignInDto) {
    return await this.authService.execute(authenticationDto);
  }
}
