import { AppDataSource } from '../config/data-source.js';
import { ProductSchema } from '../entities/product.entity.js';

const getRepo = () => AppDataSource.getRepository(ProductSchema);

const normalize = (product) => ({
  ...product,
  price: parseFloat(product.price),
});

export const findAll = async ({ sortBy, order } = {}) => {
  const repo = getRepo();
  const qb = repo.createQueryBuilder('product');

  if (sortBy) {
    qb.orderBy(`product.${sortBy}`, order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
  }

  const results = await qb.getMany();
  return results.map(normalize);
};

export const findById = async (id) => {
  const product = await getRepo().findOneBy({ id });
  if (!product) return null;
  return normalize(product);
};

export const create = async (data) => {
  const repo = getRepo();
  const product = repo.create(data);
  const saved = await repo.save(product);
  return normalize(saved);
};

export const update = async (id, data) => {
  const repo = getRepo();
  const product = await repo.findOneBy({ id });
  if (!product) return null;

  Object.assign(product, data);
  const saved = await repo.save(product);
  return normalize(saved);
};

export const remove = async (id) => {
  const repo = getRepo();
  const product = await repo.findOneBy({ id });
  if (!product) return null;

  await repo.remove(product);
  return true;
};
