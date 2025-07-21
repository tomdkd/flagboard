import { IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

export default class UpdateUserDTO {
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNotEmpty()
  password?: string;
}