import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import BadRequestError from '../errors/bad-request-error';
import Product from '../models/product';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items, total } = req.body;

    // Проверка на непустой массив items
    if (!items || items.length === 0) {
      throw new BadRequestError('Массив товаров не может быть пустым');
    }

    // Поиск товаров в базе по _id
    const foundItems = await Product.find({ _id: { $in: items } });

    // Проверка существования всех товаров
    if (foundItems.length !== items.length) {
      throw new BadRequestError('Один или несколько товаров не найдены');
    }

    // Проверка, что все товары продаются (price !== null)
    const unsellableItems = foundItems.filter((item) => item.price === null);
    if (unsellableItems.length > 0) {
      throw new BadRequestError('Один или несколько товаров недоступны для продажи');
    }

    // Проверка соответствия суммы заказа
    const calculatedTotal = foundItems.reduce((sum, item) => sum + item.price, 0);
    if (calculatedTotal !== total) {
      throw new BadRequestError('Неверная общая сумма заказа');
    }

    const orderId = faker.string.uuid();
    res.status(200).send({
      id: orderId,
      total,
    });
  } catch (error) {
    next(error);
  }
};

export default createOrder;
