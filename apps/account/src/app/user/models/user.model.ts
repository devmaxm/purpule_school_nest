import {IUser, IUserCourse, PaymentState, UserRole} from "@purpule-school/interfaces";
import {Prop, SchemaFactory, Schema} from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';


@Schema()
export class UserCourses extends Document implements IUserCourse {
  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true, enum: PaymentState, type: String })
  paymentState: PaymentState;
}

export const UserCoursesSchema = SchemaFactory.createForClass(UserCourses);

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

  @Prop({ type: [UserCoursesSchema], _id: false })
  courses: Types.Array<UserCourses>
}

export const UserSchema = SchemaFactory.createForClass(User);
