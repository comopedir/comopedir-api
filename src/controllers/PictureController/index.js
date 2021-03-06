import { fromGlobalId } from 'graphql-relay';

import db from '../../services/db';
import tinify from '../../services/tinify';

import BusinessController from '../BusinessController';

const PictureController = {
  getByParam: async (key, value) =>
    db
      .table('picture')
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),

  createFromUrl: async (input, TransactionDB) => {
    const trx = TransactionDB || (await db.transaction());
    try {
      let business;

      if (input.business) {
        business = await BusinessController.getByParamWithTransaction(
          'id', 
          fromGlobalId(input.business).id,
          trx
        );
      }

      if (!business) {
        throw new Error('Business not found.')
      }

      const raw = await tinify.fromUrl(input.url);
      const small = await raw.resize({
        method: 'cover',
        width: 500,
        height: 500,
      });
      const large = await raw.resize({
        method: 'scale',
        width: 1280,
      });

      const rawData = await tinify.toS3(raw);
      const smallData = await tinify.toS3(small);
      const largeData = await tinify.toS3(large);
    
      let picture = await db
        .table('picture')
        .transacting(trx)
        .insert({
          business: business.id,
          type: rawData.mediaType,
          origin_id: input.url,
        })
        .returning('*')
        .then(rows => rows[0]);

      const rawPictureFile = await db
        .table('picture_file')
        .transacting(trx)
        .insert({
          url: rawData.url,
          size: rawData.size,
          width: rawData.width,
          height: rawData.height,
        })
        .returning('*')
        .then(rows => rows[0]);

      const smallPictureFile = await db
        .table('picture_file')
        .transacting(trx)
        .insert({
          url: smallData.url,
          size: smallData.size,
          width: smallData.width,
          height: smallData.height,
        })
        .returning('*')
        .then(rows => rows[0]);

      const largePictureFile = await db
        .table('picture_file')
        .transacting(trx)
        .insert({
          url: largeData.url,
          size: largeData.size,
          width: largeData.width,
          height: largeData.height,
        })
        .returning('*')
        .then(rows => rows[0]);    
        
      picture = await db
        .table('picture')
        .transacting(trx)
        .update({
          raw: rawPictureFile.id,
          small: smallPictureFile.id,
          large: largePictureFile.id,
        })
        .where({
          id: picture.id,
        })
        .returning('*')
        .then(rows => rows[0]);

      if (!TransactionDB) await trx.commit();

      return { picture: { ...picture } };
    } catch (err) {
      console.error(err);
      trx.rollback();
      return err;
    }
  },
};
export default PictureController;
