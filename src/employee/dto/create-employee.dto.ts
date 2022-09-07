import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MinLength
} from 'class-validator';

export class CreateEmployeeDto {
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

  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    // Força de senha
    message: 'Senha fraca',
  })
  password: string;

  @IsInt()
  roleId: number;
}
