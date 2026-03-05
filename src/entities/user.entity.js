import { EntitySchema } from 'typeorm';

export const UserSchema = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'varchar',
      length: 36,
      primary: true,
      generated: 'uuid',
    },
    firstName: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    lastName: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    email: {
      type: 'varchar',
      length: 255,
      unique: true,
      nullable: false,
    },
  },
  relations: {
    orders: {
      type: 'one-to-many',
      target: 'Order',
      inverseSide: 'user',
    },
    ratings: {
      type: 'one-to-many',
      target: 'Rating',
      inverseSide: 'user',
    },
  },
});
