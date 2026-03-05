import { AppDataSource } from '../config/data-source.js';
import { UserSchema } from '../entities/user.entity.js';

const getRepo = () => AppDataSource.getRepository(UserSchema);

export const findAll = async () => getRepo().find();

export const findById = async (id) => getRepo().findOneBy({ id });

export const create = async (data) => {
  const repo = getRepo();
  const user = repo.create(data);
  return repo.save(user);
};

export const update = async (id, data) => {
  const repo = getRepo();
  const user = await repo.findOneBy({ id });
  if (!user) return null;

  Object.assign(user, data);
  return repo.save(user);
};

export const remove = async (id) => {
  const repo = getRepo();
  const user = await repo.findOneBy({ id });
  if (!user) return null;

  await repo.remove(user);
  return true;
};
