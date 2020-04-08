import DataLoader from 'dataloader';
import { fromGlobalId } from 'graphql-relay';

import db from '../services/db';
import { mapTo, mapToMany } from '../utils';
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

  translationsByCategoryId = new DataLoader(keys =>
    db
      .table('category_translation')
      .join('translation', 'category_translation.translation', 'translation.id')
      .whereIn('category', keys)
      .select()
      .then(mapToMany(keys, x => x.category)),
  );

  translationsByServiceId = new DataLoader(keys =>
    db
      .table('service_translation')
      .join('translation', 'service_translation.translation', 'translation.id')
      .whereIn('service', keys)
      .select()
      .then(mapToMany(keys, x => x.service)),
  );

  translationsByPaymentTypeId = new DataLoader(keys =>
    db
      .table('payment_type_translation')
      .join('translation', 'payment_type_translation.translation', 'translation.id')
      .whereIn('payment_type', keys)
      .select()
      .then(mapToMany(keys, x => x.payment_type)),
  );

  addressesByBusinessId = new DataLoader(keys =>
    db
      .table('address')
      .whereIn('business', keys)
      .orderBy('created_at', 'desc')
      .select()
      .then(mapToMany(keys, x => x.business)),
  );

  categoryById = new DataLoader(keys =>
    db
      .table('category')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id)),
  );

  serviceById = new DataLoader(keys =>
    db
      .table('service')
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
  
  channelById = new DataLoader(keys =>
    db
      .table('channel')
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

  userById = new DataLoader(keys =>
    db
      .table('users')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id)),
  );
}

export default Context;
