import DataLoader from 'dataloader';
import { fromGlobalId } from 'graphql-relay';

import db from '../services/db';
import { mapTo } from '../utils';
import { UnauthorizedError } from '../errors';

class Context {
  request;
  userLogged;

  constructor(request) {
    this.request = request;
    this.t = request.t;
  }

  get userLogged() {
    if (this.request.userLogged !== undefined) {
      const accountId = fromGlobalId(this.request.userLogged.accountId).id;
      return { ...this.request.userLogged, accountId };
    }

    return null;
  }

  isAuthorized(roles, isTrue) {
    if (this.userLogged == undefined) throw new UnauthorizedError();
    if (isTrue) return roles.includes(this.userLogged.role);
    if (!roles.includes(this.userLogged.role)) throw new UnauthorizedError();
    return true;
  }

  networkById = new DataLoader(keys =>
    db
      .table('network')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id)),
  );

  businessById = new DataLoader(keys =>
    db
      .table('business')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id)),
  );

  // death line

  accountById = new DataLoader(keys =>
    db
      .table('account')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id)),
  );

  accountByPhoneNumber = new DataLoader(keys =>
    db
      .table('account')
      .whereIn('phone_number', keys)
      .select()
      .then(mapTo(keys, x => x.phoneNumber)),
  );

  addressByBusiness = new DataLoader(keys =>
    db
      .table('address')
      .whereIn('business', keys)
      .select()
      .then(mapTo(keys, x => x.person)),
  );

  userById = new DataLoader(keys =>
    db
      .table('users')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id)),
  );

  categoryById = new DataLoader(keys =>
    db
      .table('category')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id)),
  );

  languageById = new DataLoader(keys =>
    db
      .table('language')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id)),
  );

  translationById = new DataLoader(keys =>
    db
      .table('translation')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id)),
  );
}

export default Context;
