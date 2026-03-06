import { AppDataSource } from '../config/data-source.js';
import { In } from 'typeorm';
import { OrderSchema } from '../entities/order.entity.js';
import { UserSchema } from '../entities/user.entity.js';
import { ProductSchema } from '../entities/product.entity.js';

const getOrderRepo = () => AppDataSource.getRepository(OrderSchema);
const getUserRepo = () => AppDataSource.getRepository(UserSchema);
const getProductRepo = () => AppDataSource.getRepository(ProductSchema);

const toMoney = (value) => Number.parseFloat(Number(value).toFixed(2));
const computeTotalPrice = (products) => toMoney(products.reduce((sum, product) => sum + Number(product.price), 0));

const normalize = (order) => ({
  id: order.id,
  userId: order.user?.id,
  productIds: order.products?.map((product) => product.id) || [],
  totalPrice: toMoney(order.totalPrice ?? 0),
});

const resolveOrderRelations = async ({ userId, productIds }) => {
  const user = await getUserRepo().findOneBy({ id: userId });
  if (!user) {
    const err = new Error('Utilisateur introuvable');
    err.status = 404;
    throw err;
  }

  const uniqueProductIds = [...new Set(productIds)];
  const products = uniqueProductIds.length
    ? await getProductRepo().findBy({ id: In(uniqueProductIds) })
    : [];

  if (products.length !== uniqueProductIds.length) {
    const err = new Error('Un ou plusieurs produits sont introuvables');
    err.status = 404;
    throw err;
  }

  return { user, products };
};

export const findAll = async () => {
  const orders = await getOrderRepo().find({ relations: ['user', 'products'] });
  return orders.map(normalize);
};

export const findById = async (id) => {
  const order = await getOrderRepo().findOne({ where: { id }, relations: ['user', 'products'] });
  if (!order) return null;
  return normalize(order);
};

export const create = async ({ userId, productIds }) => {
  const { user, products } = await resolveOrderRelations({ userId, productIds });
  const totalPrice = computeTotalPrice(products);
  const repo = getOrderRepo();
  const order = repo.create({ user, products, totalPrice });
  const saved = await repo.save(order);
  return normalize({ ...saved, user, products, totalPrice });
};

export const update = async (id, data) => {
  const repo = getOrderRepo();
  const order = await repo.findOne({ where: { id }, relations: ['user', 'products'] });
  if (!order) return null;

  const nextUserId = data.userId ?? order.user.id;
  const nextProductIds = data.productIds ?? order.products.map((product) => product.id);

  const { user, products } = await resolveOrderRelations({ userId: nextUserId, productIds: nextProductIds });
  const totalPrice = computeTotalPrice(products);
  order.user = user;
  order.products = products;
  order.totalPrice = totalPrice;

  const saved = await repo.save(order);
  return normalize(saved);
};

export const remove = async (id) => {
  const repo = getOrderRepo();
  const order = await repo.findOneBy({ id });
  if (!order) return null;

  await repo.remove(order);
  return true;
};
