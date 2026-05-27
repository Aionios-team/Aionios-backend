import { Controller, Post, Body, Get, Param, Patch, Delete, Headers, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import Stripe from 'stripe';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { Request } from 'express';
import { EstadoPago } from '@prisma/client';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';


@Controller('payments')
export class PaymentsController {
	constructor(private paymentsService: PaymentsService) {}

	@Post()
	@Roles('cliente', 'administrador de negocio', 'super administrador')
	create(@Body() body: CreatePaymentDto) {
		return this.paymentsService.create(body);
	}

	@Get()
	@Roles('administrador de negocio', 'super administrador')
	findAll() {
		return this.paymentsService.findAll();
	}

	@Get('negocio/:negocioId')
	@Roles('administrador de negocio', 'super administrador')
	findByNegocio(@Param('negocioId') negocioId: string) {
		return this.paymentsService.findByNegocio(Number(negocioId));
	}

	@Get(':id')
	@Roles('administrador de negocio', 'super administrador')
	findOne(@Param('id') id: string) {
		return this.paymentsService.findOne(Number(id));
	}

	@Patch(':id')
	@Roles('administrador de negocio', 'super administrador')
	update(@Param('id') id: string, @Body() body: UpdatePaymentDto) {
		return this.paymentsService.update(Number(id), body);
	}

	@Delete(':id')
	@Roles('super administrador')
	remove(@Param('id') id: string) {
		return this.paymentsService.remove(Number(id));
	}

	@Post('webhook/stripe')
	@Public()
	async handleStripeWebhook(
		@Req() req: Request & { rawBody?: Buffer },
		@Headers('stripe-signature') signature?: string,
	) {
		const secret = await this.paymentsService.ensureWebhookSecret(process.env.STRIPE_WEBHOOK_SECRET);
		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
		});

		const rawBody = req.rawBody;
		if (!rawBody) {
			throw new Error('Missing raw body for webhook verification');
		}

		const event = stripe.webhooks.constructEvent(rawBody, signature ?? '', secret);

		if (event.type === 'payment_intent.succeeded') {
			const paymentIntent = event.data.object as Stripe.PaymentIntent;
			const transactionId = paymentIntent.id;
			await this.paymentsService.updateStatusByTransaction(transactionId, EstadoPago.COMPLETADO);
		}

		return { received: true };
	}
}
