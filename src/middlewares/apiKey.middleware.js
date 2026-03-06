import * as apiKeyService from '../services/apiKey.service.js';

const getMasterSecret = () => process.env.API_KEY_MASTER_SECRET;

const extractBearerToken = (authorizationHeader = '') => {
  const [scheme, token] = authorizationHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

export const verifyApiKeyCreationAccess = (req, res, next) => {
  const configuredMasterSecret = getMasterSecret();
  if (!configuredMasterSecret) {
    return res.status(500).json({ error: 'API_KEY_MASTER_SECRET manquant' });
  }

  if (req.body?.masterSecret !== configuredMasterSecret) {
    return res.status(403).json({ error: 'Acces refuse a la creation de cle API' });
  }

  delete req.body.masterSecret;
  next();
};

export const apiKeyAuth = async (req, res, next) => {
  const rawBearerHeader = req.header('authorization');
  const token = extractBearerToken(rawBearerHeader);

  if (!token) {
    return res.status(401).json({ error: 'Token JWT manquant (header Authorization: Bearer <token>)' });
  }

  try {
    const payload = apiKeyService.verifyAccessToken(token);

    if (!payload) {
      return res.status(401).json({ error: 'Token JWT invalide ou expire' });
    }

    const key = await apiKeyService.validateApiKeyById(payload.sub);

    if (!key) {
      return res.status(401).json({ error: 'Cle API invalide ou inactive' });
    }

    req.apiKey = {
      id: key.id,
      name: key.name,
      keyPrefix: key.keyPrefix,
      tokenType: payload.type,
      tokenExp: payload.exp,
    };

    next();
  } catch (err) {
    next(err);
  }
};
