import accents from 'remove-accents';
import { toGlobalId } from 'graphql-relay';

import db from '../../services/db';

import CategoryController from '../CategoryController';
import ServiceController from '../ServiceController';
import ChannelController from '../ChannelController';
import PictureController from '../PictureController';

/*
{ 
x  airtableId: 'rec0JVpYXErZXY5wg',
x  name: 'Restaurante Manu',
x  services: [ 'Delivery', 'Retirada', 'Gift Card' ],
x  channels: [ 'DM no Instagram', 'Whatsapp', 'Telefone', 'James Delivery' ],
x  categories: [ 'Brasileira', 'Ingredientes' ],
  pictures: 
   [ { id: 'attvDOJEk1umWlE5Z',
       url: 'https://dl.airtable.com/.attachments/0a27686efedcbea73a141f5b424b81bf/031de7dc/4.Berinjelacocoebroademilho_CrditoRubensKato.jpg',
       filename: '4. Berinjela, coco e broa de milho_Crédito Rubens Kato.jpg',
       size: 16706194,
       type: 'image/jpeg',
       thumbnails: [Object] } ],
  website: [ 'www.restaurantemanu.com.br ' ],
  whatsapp: null,
  phone: null,
  state: 'PR',
  city: 'Curitiba',
  instagram: '@restaurantemanu',
  email: 'reservas@restaurantemanu.com.br',
  approved: 'Sim' 
}
*/


const AirtableController = {
  makeSlug: text => accents.remove(text.toLowerCase().replace(/\s/g, "")),
  createOrAssignCategory: async (businessId, categoryName, TransactionDB) => {
    try {
      const categorySlug = AirtableController.makeSlug(categoryName);
      let category = await CategoryController.getByParamWithTransaction(
        'slug', 
        categorySlug,
        TransactionDB
      );
  
      if (!category) {
        category = await db
          .table('category')
          .transacting(TransactionDB)
          .insert({
            slug: categorySlug
          })
          .returning('*')
          .then(rows => rows[0]);
      }
  
      await db
        .table('business_category')
        .transacting(TransactionDB)
        .insert({
          business: businessId,
          category: category.id,
        })
        .returning('*')
        .then(rows => rows[0])
  
      return Promise.resolve('ok');
    }
    catch(err) {
      console.log(err);
      throw new Error('Error inserting categories.');
    }
  },
  createOrAssignService: async (businessId, serviceName, TransactionDB) => {

    try {
      const serviceSlug = AirtableController.makeSlug(serviceName);
      let service = await ServiceController.getByParamWithTransaction(
        'slug', 
        serviceSlug,
        TransactionDB
      );
  
      if (!service) {
        service = await db
          .table('service')
          .transacting(TransactionDB)
          .insert({
            slug: serviceSlug
          })
          .returning('*')
          .then(rows => rows[0]);
      }
  
      await db
        .table('business_service')
        .transacting(TransactionDB)
        .insert({
          business: businessId,
          service: service.id,
        })
        .returning('*')
        .then(rows => rows[0])
  
      return Promise.resolve('ok');
    } catch(err) {
      console.log(err);
      throw new Error('Error inserting businesses.');
    }
  },
  createOrAssignChannel: async (businessId, channelName, channelValue, TransactionDB) => {

    try {
      const channelSlug = AirtableController.makeSlug(channelName);
      let channel = await ChannelController.getByParamWithTransaction(
        'slug', 
        channelSlug,
        TransactionDB,
      );
  
      if (!channel) {
        channel = await db
          .table('channel')
          .transacting(TransactionDB)
          .insert({
            name: channelName,
            slug: channelSlug
          })
          .returning('*')
          .then(rows => rows[0]);
      }
  
      await db
        .table('business_channel')
        .transacting(TransactionDB)
        .insert({
          business: businessId,
          channel: channel.id,
          value: channelValue,
        })
        .returning('*')
        .then(rows => rows[0])
  
      return Promise.resolve('ok');      
    } catch (err) {
      console.log(err);
      throw new Error('Error inserting channels.');
    }
  },
  createPicture: async (businessId, pictureInfo, TransactionDB) => {
    try {
      const picture = {
        business: toGlobalId('business', businessId),
        url: pictureInfo.url,
      }

      await PictureController.createFromUrl(picture, TransactionDB);

      return Promise.resolve('ok');
    }
    catch (err) {
      throw new Error('Error inserting pictures.');
    }
  },
  import: async (input) => {
    const trx = await db.transaction();

    try {
      const business = await db
        .table('business')
        .transacting(trx)
        .insert({
          network: null,
          airtable_id: input.airtableId,
          slug: AirtableController.makeSlug(input.name),
          name: input.name,
        })
        .returning('*')
        .then(rows => rows[0]);

      console.log('Business..');

      if (input.categories) {
        await Promise.all(
          input.categories.map(
            category => AirtableController.createOrAssignCategory(
              business.id,
              category,
              trx
            )
          )
        )
      }

      console.log('Categories..', input.categories);

      if (input.services) {
        await Promise.all(
          input.services.map(
            service => AirtableController.createOrAssignService(
              business.id,
              service,
              trx
            )
          )
        )
      }

      console.log('Services..', input.services);

      if (input.channels) {
        await Promise.all(
          input.channels.map(
            channel => AirtableController.createOrAssignChannel(
              business.id,
              channel,
              null,
              trx
            )
          )
        )
      }

      console.log('Channels..', input.channels);

      if (input.pictures) {
        await Promise.all(
          input.pictures.map(
            picture => AirtableController.createPicture(
              business.id,
              picture,
              trx
            )
          )
        )
      }

      console.log('Pictures..');

      await trx.commit();

      return { business: { ...business } };
    } catch (err) {
      await trx.rollback();
      return err;
    }
  },
};
export default AirtableController;
