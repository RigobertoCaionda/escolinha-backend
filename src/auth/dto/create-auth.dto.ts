import { IsEmail, IsInt, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class CreateAuthDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsEmail()
  email: string;

  @MinLength(2)
  name: string;

  @IsInt()
  age: number;

  @IsString()
  gender: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    // Força de senha
    message: 'Senha fraca',
  })
  password: string;

  @IsInt()
  roleId: number;
}
