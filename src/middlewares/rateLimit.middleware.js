import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,                  
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Trop de requêtes. Veuillez réessayer dans une heure.',
  },
});
