import {
    IsInt,
    IsNotEmpty,
    IsString,
  } from 'class-validator';
  
  export class HandleUserRequestDto {
    @IsInt()
    requestId: number;
  
    @IsString()
    @IsNotEmpty()
    answer: string;
  }
  