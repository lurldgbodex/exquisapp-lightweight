import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { PaymentService } from './payment-service.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatusDto } from './dto/get-payment-status.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/transact')
  async createPayment(@Body() CreatePaymentDto: CreatePaymentDto, @Req() req: Request) {
    const userId = req.headers['x-user-id']
    return this.paymentService.initiatePayment(CreatePaymentDto, userId);
  }

  @Get(':reference')
  async getPaymentStatus(@Param('reference') dto: PaymentStatusDto) {
    return this.paymentService.getPaymentStatus(dto.reference);
  }
}
