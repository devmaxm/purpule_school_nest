import {RMQService} from "nestjs-rmq";
import {UserEntity} from "../entities/user.entity";
import {PaymentState} from "@purpule-school/interfaces";
import {BuyCourseState} from "./buy-course.state";
import {
  BuyCourseSagaStateCanceled,
  BuyCourseSagaStatePurchased,
  BuyCourseSagaStateStarted,
  BuyCourseSagaStateWaitingForPayment
} from "./buy-course.steps";

export class BuyCourseSaga {
  private state: BuyCourseState

  constructor(
    public rmqService: RMQService,
    public user: UserEntity,
    public courseId: string
  ) {
  }

  setState(state: PaymentState, courseId: string) {
    switch (state) {
      case PaymentState.Started:
        this.state = new BuyCourseSagaStateStarted()
        break;
      case PaymentState.WaitingForPayment:
        this.state = new BuyCourseSagaStateWaitingForPayment();
        break;
      case PaymentState.Purchased:
        this.state = new BuyCourseSagaStatePurchased()
        break;
      case PaymentState.Canceled:
        this.state = new BuyCourseSagaStateCanceled()
        break;
    }
    this.state.setContext(this)
    this.user.updateCoursePaymentState(courseId, state)
  }

  getState() {
    return this.state
  }
}
