import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDonationDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  desc: string;

  @IsOptional()
  @IsString()
  userId?: number;

  @IsOptional()
  @IsString()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  employeeId?: number;

  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;

  @IsOptional()
  @IsString()
  role?: string;

  @IsString()
  categoryId: number;

  @IsOptional()
  @IsArray({ message: 'url precisa ser um array' }) // Vai verificar se é um Array, os 2 devem ser combinados
  @IsObject({ each: true }) // Vai verificar se cada item do array é uma string
  images?: Express.Multer.File[];
}
