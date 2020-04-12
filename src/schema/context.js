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

  categoriesByBusinessId = new DataLoader(keys =>
    db
      .table('business_category')
      .join('category', 'business_category.category', 'category.id')
      .whereIn('business', keys)
      .orderBy('priority', 'desc')
      .select()
      .then(mapToMany(keys, x => x.business)),
  );

  servicesByBusinessId = new DataLoader(keys =>
    db
      .table('business_service')
      .join('service', 'business_service.service', 'service.id')
      .whereIn('business', keys)
      .orderBy('priority', 'desc')
      .select()
      .then(mapToMany(keys, x => x.business)),
  );

  paymentTypesByBusinessId = new DataLoader(keys =>
    db
      .table('business_payment_type')
      .join('payment_type', 'business_payment_type.payment_type', 'payment_type.id')
      .whereIn('business', keys)
      .orderBy('priority', 'desc')
      .select()
      .then(mapToMany(keys, x => x.business)),
  );

  businessChannelsByBusinessId = new DataLoader(keys =>
    db
      .table('business_channel')
      .join('channel', 'business_channel.channel', 'channel.id')
      .whereIn('business', keys)
      .select()
      .then(mapToMany(keys, x => x.business)),
  );

  addressesByBusinessId = new DataLoader(keys =>
    db
      .table('address')
      .whereIn('business', keys)
      .orderBy('created_at', 'desc')
      .select()
      .then(mapToMany(keys, x => x.business)),
  );

  picturesByBusinessId = new DataLoader(keys =>
    db
      .table('picture')
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

  pictureById = new DataLoader(keys =>
    db
      .table('picture')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id)),
  );

  pictureFileById = new DataLoader(keys =>
    db
      .table('picture_file')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id)),
  );

  paymentTypeById = new DataLoader(keys =>
    db
      .table('payment_type')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id)),
  );

  personByAccount = new DataLoader(keys =>
    db
      .table('person')
      .whereIn('account', keys)
      .select()
      .then(mapTo(keys, x => x.account)),
  );

  personById = new DataLoader(keys =>
    db
      .table('person')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id)),
  );

  accountById = new DataLoader(keys =>
    db
      .table('account')
      .whereIn('id', keys)
      .select()
      .then(mapTo(keys, x => x.id)),
  );
}

export default Context;
