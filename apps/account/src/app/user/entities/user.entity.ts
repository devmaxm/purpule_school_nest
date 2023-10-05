import {IDomainEvent, IUser, IUserCourse, PaymentState, UserRole} from "@purpule-school/interfaces";
import * as bcrypt from 'bcrypt'
import {HttpException, HttpStatus} from "@nestjs/common";
import {AccountChangedCourse} from "@purpule-school/contracts";

export class UserEntity implements IUser {
  _id?: string;
  displayName?: string;
  email: string;
  hashPassword: string;
  role: UserRole;
  courses: IUserCourse[];
  events: IDomainEvent[] = [];

  constructor(user: IUser) {
    this._id = user._id
    this.displayName = user.displayName
    this.email = user.email
    this.hashPassword = user.hashPassword
    this.role = user.role
    this.courses = user.courses
  }

  public async updateCoursePaymentState(courseId: string, state: PaymentState) {
    const exist = this.courses.find(c => c.courseId === courseId)
    if (!exist) {
      this.courses.push({
        courseId,
        paymentState: state
      })
    }
    if (state === PaymentState.Canceled) {
      this.courses.filter(c => c.courseId !== courseId)
      return this
    }

    this.courses.map(c => {
      if (c.courseId === courseId) {
        c.paymentState = state
      }
      return c
    })
    this.events.push({
      topic: AccountChangedCourse.topic,
      data: {courseId, userId: this._id, state}
    })
    return this
  }

  public async setPassword(password: string) {
    this.hashPassword = await bcrypt.hash(password, 10)
    return this
  }

  public async validatePassword(password: string) {
    return await bcrypt.compare(password, this.hashPassword)
  }

  public getPublicProfile() {
    return {
      email: this.email,
      role: this.role,
      displayName: this.displayName
    }
  }

  public updateProfile(displayName: string) {
    this.displayName = displayName
    return this
  }
}
