import { IsEmail, IsInt, IsNotEmpty } from 'class-validator';

export default class CreateUserDTO {
  @IsInt()
  tenant_id!: number;

  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;
}