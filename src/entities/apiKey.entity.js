import { EntitySchema } from 'typeorm';

export const ApiKeySchema = new EntitySchema({
  name: 'ApiKey',
  tableName: 'api_keys',
  columns: {
    id: {
      type: 'varchar',
      length: 36,
      primary: true,
      generated: 'uuid',
    },
    name: {
      type: 'varchar',
      length: 100,
      nullable: true,
    },
    keyPrefix: {
      type: 'varchar',
      length: 16,
      nullable: false,
    },
    signature: {
      type: 'varchar',
      length: 64,
      unique: true,
      nullable: false,
    },
    isActive: {
      type: 'boolean',
      default: true,
      nullable: false,
    },
    lastUsedAt: {
      type: 'datetime',
      nullable: true,
    },
    createdAt: {
      type: 'datetime',
      createDate: true,
      nullable: false,
    },
    updatedAt: {
      type: 'datetime',
      updateDate: true,
      nullable: false,
    },
  },
});
