import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentService } from './payment-service.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatusDto } from './dto/get-payment-status.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(@Body() CreatePaymentDto: CreatePaymentDto) {
    return this.paymentService.initiatePayment(CreatePaymentDto);
  }

  @Get(':reference')
  async getPaymentStatus(@Param('reference') dto: PaymentStatusDto) {
    return this.paymentService.getPaymentStatus(dto.reference);
  }
}
