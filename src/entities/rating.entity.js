import { EntitySchema } from 'typeorm';

export const RatingSchema = new EntitySchema({
  name: 'Rating',
  tableName: 'ratings',
  columns: {
    id: {
      type: 'varchar',
      length: 36,
      primary: true,
      generated: 'uuid',
    },
    score: {
      type: 'int',
      nullable: false,
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      nullable: false,
      onDelete: 'CASCADE',
      joinColumn: {
        name: 'userId',
      },
    },
    product: {
      type: 'many-to-one',
      target: 'Product',
      nullable: false,
      onDelete: 'CASCADE',
      joinColumn: {
        name: 'productId',
      },
    },
  },
});
