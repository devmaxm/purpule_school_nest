import {IsOptional, IsString, MinLength} from "class-validator";

export namespace AccountRegister {
  export const topic = 'account.register.command'

  export class Request {
    @IsString()
    email: string

    @IsString()
    @MinLength(7)
    password: string

    @IsString()
    @IsOptional()
    displayName?: string
  }

  export class Response {
    email: string
  }
}

