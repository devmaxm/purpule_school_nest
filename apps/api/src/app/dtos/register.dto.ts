import {IsOptional, IsString, MinLength} from "class-validator";

export class RegisterDto {
  @IsString()
  email: string

  @IsString()
  @MinLength(7)
  password: string

  @IsString()
  @IsOptional()
  displayName?: string
}
