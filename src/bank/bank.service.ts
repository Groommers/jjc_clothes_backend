import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { response } from 'express';
import { Model } from 'mongoose';
import { Bank_Active_DTO, Bank_BD_DTO, Status_Transaction } from './bank.model';

@Injectable()
export class Bank_Service {
  // Nombre User se definio en mongooseModule en user.module.ts
  constructor(
    @InjectModel('Bank') private readonly bankModel: Model<Bank_BD_DTO>,
    @InjectModel('Bank_Active')
    private readonly bankActiveModel: Model<Bank_Active_DTO>,
  ) {}

  async decrypt(msg: string) {
    const fernet = await import('fernet');

    const SECRET_KEY = 'ltACBPhnjdCMRs3LQNr1seE5h4gZDV99JjvdlBQ_0o8';
    const secret = new fernet.Secret(SECRET_KEY);

    const token = new fernet.Token({
      secret: secret,
      token: msg,
      ttl: 0,
    });
    return token.decode();
  }

  // FUNCION - guardar respuesta del banco
  async create_bank_response(key: string) {
    console.log('\n\n\n\n<- Bank service, create bank key ->', key);

    const decrypt_key = await this.decrypt(key);

    if (decrypt_key.status == Status_Transaction.APPROVED) {
      console.log('\n\n\n\n<- Bank service, APPROVED ->', decrypt_key.status);
    }

    const newBank_response = new this.bankModel({
      transaction_number: decrypt_key.transaction_number,
      order: decrypt_key.order,
      reason: decrypt_key.reason,
      amount: decrypt_key.amount,
      status: decrypt_key.status,
      date: new Date(),
    });

    const response_insert = await newBank_response.save();

    console.log('<- Bank service, create bank decrypt key ->', decrypt_key);
    console.log(
      '<- Bank service, create bank response ->',
      response_insert,
      '\n\n\n',
    );
    return key;
  }

  // FUNCION - obtener todas las respuestas
  async get_bank_responses() {
    const response_getAll = await this.bankModel
      .find()
      .sort({ date: 1 })
      .exec();

    console.log('<- Bank service, get all responses ->', response_getAll);
    return response_getAll;
  }

  // FUNCION - cambiar el banco activo, aparicio de mierda
  async change_active_bank(bank_name: string) {
    try {
      const response_active = await this.bankActiveModel.find().exec();

      if (bank_name == 'degva' || bank_name == 'dakiti') {
        console.log(
          '<- Bank service, get active bank ->',
          bank_name,
          response_active,
        );

        response_active[0].name = bank_name;

        await response_active[0].save();

        return response_active;
      } else {
        return {
          statusCode: 400,
          error: 'bank_name should be either degva or dakiti',
        };
      }
    } catch (error) {
      // No encontro nada en la bd
      console.log('<- Bank service, get active bank not found ->', bank_name);
    }
  }

  // FUNCION - cambiar el banco activo, aparicio recontra mmgvo
  async get_active_bank() {
    try {
      const response_active = await this.bankActiveModel.find().exec();

      return response_active[0];
    } catch (error) {
      // No encontro nada en la bd
      console.log('<- Bank service, get active bank not found ->');
    }
  }
}
