import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { toGlobalId } from 'graphql-relay';

const authConfig = {
  secret: process.env.SESSION_SECRET,
  expiresIn: 86400 * 10, // 10 days
};

const roles = {
  guest: 'guest',
  user: 'user',
  admin: 'admin',
};

const checkToken = async req => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return { user: null, role: roles.guest };
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userLogged = { accountId: decoded.accountId, role: decoded.role };
    return req.userLogged;
  } catch (err) {
    return false;
  }
};

const generateToken = ({ account, role }) =>
  jwt.sign(
    { accountId: toGlobalId('token', account.id), role },
    authConfig.secret,
    {
      expiresIn: authConfig.expiresIn,
    },
  );

export default {
  checkToken,
  generateToken,
};
