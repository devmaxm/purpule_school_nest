import {IsString, MinLength} from "class-validator";

export namespace AccountLogin {
  export const topic = 'account.login.command'

  export class Request {
    @IsString()
    email: string

    @IsString()
    @MinLength(7)
    password: string
  }

  export class Response {

  }
}

