import auth from '../services/auth';

export default async (req, res, next) => {
  const response = await auth.checkToken(req, res, next);
  if (!response) {
    res.status(401).json({ error: 'Token invalid', message: response });
  } else {
    next();
  }
};
