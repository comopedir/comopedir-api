import accents from 'remove-accents';
import db from '../../services/db';

import CategoryController from '../CategoryController';
import ServiceController from '../ServiceController';

/*
{ 
  airtableId: 'rec0JVpYXErZXY5wg',
  name: 'Restaurante Manu',
  services: [ 'Delivery', 'Retirada', 'Gift Card' ],
  channels: [ 'DM no Instagram', 'Whatsapp', 'Telefone', 'James Delivery' ],
  categories: [ 'Brasileira', 'Ingredientes' ],
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
  createOrAssignCategory: async (businessId, categoryName) => {

    const categorySlug = AirtableController.makeSlug(categoryName);
    let category = await CategoryController.getByParam(
      'slug', 
      categorySlug
    );

    if (!category) {
      category = await db
        .table('category')
        .insert({
          slug: categorySlug
        })
        .returning('*')
        .then(rows => rows[0])
    }

    await db
      .table('business_category')
      .insert({
        business: businessId,
        category: category.id,
      })
      .returning('*')
      .then(rows => rows[0])

    return Promise.resolve('ok');
  },
  createOrAssignService: async (businessId, serviceName) => {

    const serviceSlug = AirtableController.makeSlug(serviceName);
    let service = await ServiceController.getByParam(
      'slug', 
      serviceSlug
    );

    if (!service) {
      service = await db
        .table('service')
        .insert({
          slug: serviceSlug
        })
        .returning('*')
        .then(rows => rows[0])
    }

    await db
      .table('business_service')
      .insert({
        business: businessId,
        service: service.id,
      })
      .returning('*')
      .then(rows => rows[0])

    return Promise.resolve('ok');
  },
  import: async (input) => {
    try {
      const business = await db
        .table('business')
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
              category
            )
          )
        )
      }

      console.log('Categories..');

      if (input.services) {
        await Promise.all(
          input.services.map(
            service => AirtableController.createOrAssignService(
              business.id,
              service
            )
          )
        )
      }

      console.log('Services..');

      return { business: { ...business } };
    } catch (err) {
      return err;
    }
  },
};
export default AirtableController;
