export enum UserRole {
  Teacher = 'Teacher',
  Student = 'Student'
}

export interface IUser {
  _id?: string
  displayName?: string
  email: string
  hashPassword: string
  role: UserRole
}
