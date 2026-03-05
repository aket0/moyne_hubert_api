import { EntitySchema } from 'typeorm';

export const ProductSchema = new EntitySchema({
  name: 'Product',
  tableName: 'products',
  columns: {
    id: {
      type: 'varchar',
      length: 36,
      primary: true,
      generated: 'uuid',
    },
    name: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: false,
    },
    category: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
  },
});
