import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
import { SignInCredentialsDto } from './dto/signIn-credentials.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentials: AuthCredentialsDto): Promise<void> {
    return await this.userRepository.signUp(authCredentials);
  }

  async signIn(
    signinCredentials: SignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = signinCredentials;

    const user = await this.userRepository.findOne({ username });
    if (!user) {
      throw new BadRequestException('Incorrect username or password');
    }
    const authenticated = await this.userRepository.validatePassword(
      user,
      password,
    );
    if (!authenticated) {
      throw new BadRequestException('Incorrect username or password');
    }

    const payload = {
      username,
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
