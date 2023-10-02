import {IUser, UserRole} from "@purpule-school/interfaces";
import {User} from "../models/user.model";
import * as bcrypt from 'bcrypt'

export class UserEntity implements IUser {
  _id?: string;
  displayName?: string
  email: string
  hashPassword: string
  role: UserRole

  constructor(user: IUser) {
    this._id = user._id
    this.displayName = user.displayName
    this.email = user.email
    this.hashPassword = user.hashPassword
    this.role = user.role
  }

  public async setPassword(password: string) {
    this.hashPassword = await bcrypt.hash(password, 10)
    return this
  }

  public async validatePassword(password: string) {
    return await bcrypt.compare(password, this.hashPassword)
  }
}
