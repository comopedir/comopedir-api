import db from '../../services/db';
import logger from '../../services/logger';
import AccountController from '../AccountController';

const PersonController = {
  getByParam: async (key, value) =>
    db
      .table('person')
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),

  show: async (key, value) =>
    db
      .table('person')
      .where(key, '=', value)
      .leftJoin('account', 'account.id', 'person.account')
      .leftJoin('address', 'address.person', 'person.id')
      .returning('*'),

  create: async ({ input, TransactionDB }) => {
    const trx = TransactionDB || (await db.transaction());

    try {
      logger.info('Person - Creating...');

      let person = await PersonController.getByParam('cpf_cnpj', input.cpfCnpj);
      if (person) throw Error('CPF or CNPJ already exists.');

      let account = await AccountController.getByParam('email', input.email);
      if (account) throw Error('Email already exists.');

      account = await AccountController.createFromPerson({input});

      // create new person
      person = await db
        .table('person')
        .transacting(trx)
        .insert({
          name: input.name,
          cpf_cnpj: input.cpfCnpj,
          birthdate: input.birthdate,
          account: account.id,
        })
        .returning('*')
        .then(rows => rows[0]);

      if (!TransactionDB) await trx.commit();
      logger.info('Person - Success!');
      return person;
    } catch (err) {
      trx.rollback();
      logger.error(err);
      return err;
    }
  },
};
export default PersonController;
