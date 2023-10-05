import {RMQRoute, RMQService} from "nestjs-rmq";
import {AccountBuyCourse, AccountCheckPayment, AccountUpdateProfile} from "@purpule-school/contracts";
import {Body, HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {UserEntity} from "./entities/user.entity";
import {BuyCourseSaga} from "./sagas/buy-course.saga";
import {UserRepository} from "./repositories/user.repository";
import {UserEventEmitter} from "./user.event-emitter";

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rmqService: RMQService,
    private readonly userEventEmitter: UserEventEmitter
  ) {
  }

  async updateProfile(id: string, displayName: string) {
    const user = await this.userRepository.findUserById(id)
    if(!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    const newUserEntity = new UserEntity(user).updateProfile(displayName)
    await this.updateUser(newUserEntity)
    return {}
  }

  async buyCourse(userId: string, courseId: string) {
    const existedUser = await this.userRepository.findUserById(userId)
    if (!existedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    const userEntity = new UserEntity(existedUser)
    const saga = new BuyCourseSaga(
      this.rmqService,
      userEntity,
      courseId
    )
    const {paymentLink, user} = await saga.getState().pay()
    await this.updateUser(user)
    return {paymentLink}
  }

  async checkPayment(userId: string, courseId: string) {
    const existedUser = await this.userRepository.findUserById(userId)
    if (!existedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    const userEntity = new UserEntity(existedUser)
    const saga = new BuyCourseSaga(
      this.rmqService,
      userEntity,
      courseId
    )
    const {user, status} = await saga.getState().checkPayment()
    await this.updateUser(user)
    return {status}
  }

  async updateUser(user: UserEntity) {
    return Promise.all([
      this.userEventEmitter.handle(user),
      this.userRepository.updateUser(user)
    ])
  }
}
