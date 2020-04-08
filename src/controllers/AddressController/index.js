import db from '../../services/db';

const AddressController = {
  getByParam: async (key, value) =>
    db
      .table('address')
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),

  create: async (input, { accountId }) => {
    try {
      const person = await PersonController.getByParam('account', accountId);
      if (!person) throw new Error('person not exist');

      const lastAddress = await db
        .table('address')
        .where('person', person.id)
        .orderBy('created_at', 'desc')
        .limit(1)
        .then(rows => rows[0]);

      if (lastAddress) {
        await db
          .table('address')
          .where({ id: lastAddress.id })
          .update({ active: false });
      }

      const address = await db
        .table('address')
        .insert({
          person: person.id,
          street: input.street,
          street_number: input.streetNumber,
          complement: input.complement,
          district: input.district,
          city: input.city,
          state: input.state,
          zip_code: input.zipCode,
          country: input.country,
        })
        .returning('*')
        .then(rows => rows[0]);

      return { address: { ...address, person } };
    } catch (err) {
      return err;
    }
  },
};
export default AddressController;
