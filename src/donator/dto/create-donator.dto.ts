import { IsArray, IsInt, IsObject, IsOptional, IsString } from "class-validator";

export class CreateDonatorDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  donatedItem: string;

  @IsString()
  donationId?: number;

  @IsString()
  userId: number;

  @IsOptional()
  @IsString()
  cash?: number;

  @IsOptional()
  @IsArray({ message: 'url precisa ser um array' }) // Vai verificar se é um Array, os 2 devem ser combinados
  @IsObject({ each: true }) // Vai verificar se cada item do array é uma string
  image?: Express.Multer.File[];
}
