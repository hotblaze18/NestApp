import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Entity, Unique } from 'typeorm';

@Entity()
@Unique(['username', 'email'])
export class AuthCredentialsDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
