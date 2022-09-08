import { Controller, Get, Query } from '@nestjs/common';
import { Public } from './auth/decorators/skip-auth';
import appConfig from './auth/env-helper/app.config';
const open = require('open');
const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: 'sandbox',
  client_id: appConfig().client_id,
  client_secret: appConfig().client_secret,
});

@Controller()
export class AppController {
  constructor() {}
  @Public()
  @Get('/success')
  sucesso(@Query() query) {
    const payerId = query.PayerID;
    const paymentId = query.paymentId;
    const price = query.price;
    const id = query.id;
    const valor = {
        "currency": "BRL",
        "total": Number(price).toFixed(2)
    };
    const executePaymentJson = ({ payerId, valor }) => ({
        "payer_id": payerId,
        "transactions": [{
            "amount": valor
        }]
    });

    const execute_payment_json = executePaymentJson({ payerId, valor });
    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      (error, payment) => {
        if (error) {
          console.warn(error.response);
          throw error;
        } else {
          console.log('Agora sim o pagamento foi concluido com sucesso');
          console.log(JSON.stringify(payment));
          open(`${appConfig().frontURL}/payment_success?price=${price}&id=${id}`);
        }
      },
    );
  }

  @Public()
  @Get('/payment')
  getHello(@Query() query) {
    const { price, id } = query;
    const carrinho = [
      {
        "name": "Doação monetária", // Nome Produto
        "sku": 1, // id do produto
        "price": Number(price).toFixed(2),
        "currency": "BRL",
        "quantity": 1,
      },
    ];
    
    const valor = { "currency": "BRL", "total": Number(price).toFixed(2) };
    const descricao = 'Ajudando pessoas doando dinheiro.';
    const json_pagamento = {
      "intent": "sale", // É para dizer se a intencao é venda ou que
      "payer": { "payment_method": "paypal" }, // Metodo de pagamento
      "redirect_urls": {
        "return_url": `${appConfig().baseURL}/success?price=${price}&id=${id}`,
        "cancel_url": `${appConfig().baseURL}/donations`
      },
      transactions: [
        {
          "item_list": { "items": carrinho },
          "amount": valor,
          "description": descricao,
        },
      ],
    };

    paypal.payment.create(json_pagamento, (err, pagamento) => {
      if (err) {
        console.warn(err);
      } else {
        pagamento.links.forEach((link) => {
          if (link.rel === 'approval_url') {
            open(link.href);
          }
        });
      }
    });
  }
}
