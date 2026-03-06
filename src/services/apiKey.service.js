import crypto from 'crypto';
import { AppDataSource } from '../config/data-source.js';
import { ApiKeySchema } from '../entities/apiKey.entity.js';

const getRepo = () => AppDataSource.getRepository(ApiKeySchema);

const getSigningSecret = () => {
  const secret = process.env.API_KEY_SIGNING_SECRET;
  if (!secret) {
    throw new Error('API_KEY_SIGNING_SECRET manquant');
  }
  return secret;
};

const getJwtSecret = () => {
  const secret = process.env.API_JWT_SECRET;
  if (!secret) {
    throw new Error('API_JWT_SECRET manquant');
  }
  return secret;
};

const getJwtTtlSeconds = () => {
  const ttlRaw = process.env.API_JWT_TTL_SECONDS ?? '3600';
  const ttl = Number.parseInt(ttlRaw, 10);

  if (!Number.isFinite(ttl) || ttl <= 0) {
    throw new Error('API_JWT_TTL_SECONDS invalide');
  }

  return ttl;
};

const hashApiKey = (apiKey) =>
  crypto
    .createHmac('sha256', getSigningSecret())
    .update(apiKey)
    .digest('hex');

const generateRawApiKey = () => {
  const token = crypto.randomBytes(32).toString('hex');
  return `exo_${token}`;
};

const encodeBase64Url = (value) =>
  Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (normalized.length % 4)) % 4;
  return Buffer.from(normalized + '='.repeat(padLength), 'base64').toString('utf8');
};

const signJwt = (payload) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = encodeBase64Url(JSON.stringify(header));
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac('sha256', getJwtSecret())
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${data}.${signature}`;
};

const verifyJwtSignature = (data, signature) => {
  const expected = crypto
    .createHmac('sha256', getJwtSecret())
    .update(data)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
};

const generateAccessToken = (apiKey) => {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresIn = getJwtTtlSeconds();
  const payload = {
    sub: apiKey.id,
    keyPrefix: apiKey.keyPrefix,
    type: 'api_key',
    iat: issuedAt,
    exp: issuedAt + expiresIn,
  };

  return {
    accessToken: signJwt(payload),
    expiresIn,
    tokenType: 'Bearer',
  };
};

export const verifyAccessToken = (token) => {
  if (!token) {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;

  if (!verifyJwtSignature(data, signature)) {
    return null;
  }

  let header;
  let payload;

  try {
    header = JSON.parse(decodeBase64Url(encodedHeader));
    payload = JSON.parse(decodeBase64Url(encodedPayload));
  } catch {
    return null;
  }

  if (header?.alg !== 'HS256' || header?.typ !== 'JWT') {
    return null;
  }

  if (payload?.type !== 'api_key' || typeof payload?.sub !== 'string') {
    return null;
  }

  if (typeof payload?.exp !== 'number' || payload.exp <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
};

export const createApiKey = async (data = {}) => {
  const repo = getRepo();
  const rawApiKey = generateRawApiKey();
  const signature = hashApiKey(rawApiKey);
  const keyPrefix = rawApiKey.slice(0, 12);

  const apiKey = repo.create({
    name: data.name ?? null,
    keyPrefix,
    signature,
    isActive: true,
  });

  const saved = await repo.save(apiKey);
  const token = generateAccessToken(saved);

  return {
    apiKey: rawApiKey,
    token,
    metadata: {
      id: saved.id,
      name: saved.name,
      keyPrefix: saved.keyPrefix,
      isActive: saved.isActive,
      createdAt: saved.createdAt,
    },
  };
};

export const validateApiKey = async (rawApiKey) => {
  if (!rawApiKey) return null;

  const repo = getRepo();
  const signature = hashApiKey(rawApiKey);
  const key = await repo.findOneBy({ signature, isActive: true });

  if (!key) return null;

  key.lastUsedAt = new Date();
  await repo.save(key);

  return key;
};

export const validateApiKeyById = async (id) => {
  if (!id) return null;

  const repo = getRepo();
  const key = await repo.findOneBy({ id, isActive: true });
  if (!key) return null;

  key.lastUsedAt = new Date();
  await repo.save(key);

  return key;
};
