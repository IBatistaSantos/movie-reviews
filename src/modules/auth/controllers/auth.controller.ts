import { Body, Controller, Post } from '@nestjs/common';

import { SignInDto } from './dtos/signIn.dto';
import { AuthenticationService } from '../services/auth.service';

@Controller(`auth`)
export class AuthController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post()
  async signIn(@Body() authenticationDto: SignInDto) {
    return await this.authService.execute(authenticationDto);
  }
}
