export enum UserRole {
  Teacher = 'Teacher',
  Student = 'Student'
}

export enum PaymentState {
  Started= 'Started',
  WaitingForPayment = 'WaitingForPayment',
  Purchased = 'Purchased',
  Canceled = 'Canceled'
}

export interface IUser {
  _id?: string
  displayName?: string
  email: string
  hashPassword: string
  role: UserRole
  courses?: IUserCourse[]
}

export interface IUserCourse {
  courseId: string;
  paymentState: PaymentState;
}
