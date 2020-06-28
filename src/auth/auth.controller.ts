import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
import { SignInCredentialsDto } from './dto/signIn-credentials.dto';
import { stringify } from 'querystring';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentials: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentials);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) signInCredentials: SignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(signInCredentials);
  }

  @Get('/check')
  check(@Headers('authorization') authHeader: string) {
    const accessToken = authHeader.split(' ')[1];
    return this.authService.validateToken(accessToken);
  }
}
