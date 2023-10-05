import {BuyCourseState} from "./buy-course.state";
import {UserEntity} from "../entities/user.entity";
import {CourseGetCourse, PaymentCheck, PaymentGenerateLink, PaymentStatus} from "@purpule-school/contracts";
import {HttpException, HttpStatus} from "@nestjs/common";
import {PaymentState} from "@purpule-school/interfaces";


export class BuyCourseSagaStateStarted extends BuyCourseState {
  async pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    const {course} = await this.saga.rmqService.send<CourseGetCourse.Request, CourseGetCourse.Response>(
      CourseGetCourse.topic,
      {id: this.saga.courseId}
    );
    if (!course) {
      throw new HttpException('Course doesn\'t exist', HttpStatus.NOT_FOUND)
    }
    ;
    if (course.price == 0) {
      this.saga.setState(PaymentState.Purchased, course._id);
      return {paymentLink: null, user: this.saga.user}
    }
    ;
    const {paymentLink} = await this.saga.rmqService.send<PaymentGenerateLink.Request, PaymentGenerateLink.Response>(
      PaymentGenerateLink.topic,
      {
        courseId: this.saga.courseId,
        userId: this.saga.user._id,
        sum: course.price
      }
    );
    this.saga.setState(PaymentState.WaitingForPayment, course._id);
    return {paymentLink, user: this.saga.user};
  }

  async checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    throw new HttpException('Can\'t check payment that has not been started', HttpStatus.BAD_REQUEST)
  }

  async cancel(): Promise<{ user: UserEntity }> {
    this.saga.setState(PaymentState.Canceled, this.saga.courseId)
    return {user: this.saga.user}
  }
}

export class BuyCourseSagaStateWaitingForPayment extends BuyCourseState {
  async pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new HttpException('Can\'t create purchase link during the process', HttpStatus.BAD_REQUEST)
  }

  async checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    const {status} = await this.saga.rmqService.send<PaymentCheck.Request, PaymentCheck.Response>(PaymentCheck.topic, {
      userId: this.saga.user._id,
      courseId: this.saga.courseId
    });
    if (status === 'canceled') {
      this.saga.setState(PaymentState.Canceled, this.saga.courseId);
      return {user: this.saga.user, status: 'canceled'};
    }
    if (status === 'success') {
      return {user: this.saga.user, status: 'success'};
    }
    this.saga.setState(PaymentState.Purchased, this.saga.courseId);
    return {user: this.saga.user, status: 'progress'};
  }

  async cancel(): Promise<{ user: UserEntity }> {
    throw new HttpException('Can\'t cancel purchase during the process', HttpStatus.BAD_REQUEST)
  }
}


export class BuyCourseSagaStatePurchased extends BuyCourseState {
  async cancel(): Promise<{ user: UserEntity }> {
    throw new HttpException('Can\'t cancel purchased course', HttpStatus.BAD_REQUEST)
  }

  async checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    throw new HttpException('Can\'t check payment for purchased course', HttpStatus.BAD_REQUEST)
  }

  async pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new HttpException('Can\'t pay for purchased course', HttpStatus.BAD_REQUEST)
  }
}


export class BuyCourseSagaStateCanceled extends BuyCourseState {
  async cancel(): Promise<{ user: UserEntity }> {
    throw new HttpException('Can\'t pay cancel canceled course', HttpStatus.BAD_REQUEST)
  }

  async checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
    throw new HttpException('Can\'t check payment for canceled course', HttpStatus.BAD_REQUEST)
  }

  async pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    this.saga.setState(PaymentState.Started, this.saga.courseId)
    return this.saga.getState().pay();
  }

}
