import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from '../application/auth.service';
import {LoginDto} from './dto/login.dto';
import {RegisterDto} from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload.email, payload.password);
  }

  @Post('register')
  register(@Body() payload: RegisterDto) {
    return this.authService.register(payload.email, payload.password, payload.name);
  }
}
