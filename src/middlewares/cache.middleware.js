const CACHE_TTL = Number(process.env.CACHE_TTL) || 600; 

export const cacheControl = (req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', `public, max-age=${CACHE_TTL}`);
  } else {
    res.set('Cache-Control', 'no-store');
  }
  next();
};
