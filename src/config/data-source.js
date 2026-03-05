import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { ProductSchema } from '../entities/product.entity.js';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3307,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV !== 'production', 
  logging: process.env.DB_LOGGING === 'true',
  entities: [ProductSchema],
  poolSize: Number(process.env.DB_CONN_LIMIT) || 5,
});
