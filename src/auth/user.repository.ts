import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { userInfo } from 'os';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentials: AuthCredentialsDto): Promise<void> {
    const { username, email, password } = authCredentials;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User();
    user.username = username;
    user.email = email;
    user.password = hashedPassword;
    user.salt = salt;

    try {
      await user.save();
    } catch (err) {
      if (err.code == 23505) {
        throw new ConflictException('Username or Email already exists.');
      }
      throw new InternalServerErrorException('Something went wrong.Try Again.');
    }
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return user.validatePassword(password);
  }
}
