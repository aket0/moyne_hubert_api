import { AppDataSource } from '../config/data-source.js';
import { RatingSchema } from '../entities/rating.entity.js';
import { UserSchema } from '../entities/user.entity.js';
import { ProductSchema } from '../entities/product.entity.js';

const getRatingRepo = () => AppDataSource.getRepository(RatingSchema);
const getUserRepo = () => AppDataSource.getRepository(UserSchema);
const getProductRepo = () => AppDataSource.getRepository(ProductSchema);

const normalize = (rating) => ({
  id: rating.id,
  score: rating.score,
  userId: rating.user?.id,
  productId: rating.product?.id,
});

export const findAll = async () => {
  const ratings = await getRatingRepo().find({ relations: ['user', 'product'] });
  return ratings.map(normalize);
};

export const findById = async (id) => {
  const rating = await getRatingRepo().findOne({ where: { id }, relations: ['user', 'product'] });
  if (!rating) return null;
  return normalize(rating);
};

export const create = async ({ userId, productId, score }) => {
  const [user, product] = await Promise.all([
    getUserRepo().findOneBy({ id: userId }),
    getProductRepo().findOneBy({ id: productId }),
  ]);

  if (!user) {
    const err = new Error('Utilisateur introuvable');
    err.status = 404;
    throw err;
  }

  if (!product) {
    const err = new Error('Produit introuvable');
    err.status = 404;
    throw err;
  }

  const repo = getRatingRepo();
  const rating = repo.create({ score, user, product });
  const saved = await repo.save(rating);
  return normalize({ ...saved, user, product });
};

export const update = async (id, data) => {
  const repo = getRatingRepo();
  const rating = await repo.findOne({ where: { id }, relations: ['user', 'product'] });
  if (!rating) return null;

  Object.assign(rating, data);
  const saved = await repo.save(rating);
  return normalize(saved);
};

export const remove = async (id) => {
  const repo = getRatingRepo();
  const rating = await repo.findOneBy({ id });
  if (!rating) return null;

  await repo.remove(rating);
  return true;
};
