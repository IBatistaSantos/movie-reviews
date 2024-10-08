import { Body, Controller, Post } from '@nestjs/common';

import { SignInDto } from './dtos/signIn.dto';
import { AuthenticationService } from '../services/auth.service';
import { ForgotPasswordService } from '../services/forgot-password.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDTO } from './dtos/forgotPassword.dto';
import { ResetPasswordService } from '../services/reset-password.service';
import { ResetPasswordDTO } from './dtos/resetPassword.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly resetPasswordService: ResetPasswordService,
  ) {}

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

  @Post('forgot-password')
  @ApiResponse({
    status: 200,
    description: 'Send an email with a link to reset the password.',
  })
  async forgotPassword(@Body() params: ForgotPasswordDTO) {
    return await this.forgotPasswordService.execute(params);
  }

  @Post('reset-password')
  @ApiResponse({
    status: 200,
    description: 'Reset the user password.',
  })
  async resetPassword(@Body() params: ResetPasswordDTO) {
    return await this.resetPasswordService.execute(params);
  }
}
