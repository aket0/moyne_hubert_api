import { EntitySchema } from 'typeorm';

export const OrderSchema = new EntitySchema({
  name: 'Order',
  tableName: 'orders',
  columns: {
    id: {
      type: 'varchar',
      length: 36,
      primary: true,
      generated: 'uuid',
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      nullable: false,
      onDelete: 'RESTRICT',
      joinColumn: {
        name: 'userId',
      },
    },
    products: {
      type: 'many-to-many',
      target: 'Product',
      cascade: false,
      joinTable: {
        name: 'order_products',
        joinColumn: {
          name: 'orderId',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'productId',
          referencedColumnName: 'id',
        },
      },
    },
  },
});
