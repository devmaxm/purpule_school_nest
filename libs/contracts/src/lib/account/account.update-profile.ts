import {IsOptional, IsString} from "class-validator";
import {IUser} from "@purpule-school/interfaces";

export namespace AccountUpdateProfile {
  export const topic = 'account.update-profile.command'

  export class Request {
    @IsString()
    id: string

    @IsString()
    displayName: string
  }

  export class Response {}
}

