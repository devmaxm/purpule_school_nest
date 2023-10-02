import {Document} from 'mongoose'
import {IUser, UserRole} from "@purpule-school/interfaces";
import {Prop, SchemaFactory, Schema} from "@nestjs/mongoose";

@Schema()
export class User extends Document implements IUser {
  @Prop()
  displayName?: string;

  @Prop({required: true, unique: true})
  email: string;

  @Prop({required: true})
  hashPassword: string;

  @Prop({required: true, enum: UserRole, type: String, default: UserRole.Student})
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
