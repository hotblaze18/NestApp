import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
import { SignInCredentialsDto } from './dto/signIn-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './user.entity';

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
  @UseGuards(AuthGuard())
  check(@GetUser() user: User): { username: string; email: string } {
    const { username, email } = user;
    return { username, email };
  }
}
