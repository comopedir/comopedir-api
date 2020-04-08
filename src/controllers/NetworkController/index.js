import db from '../../services/db';

const NetworkController = {
  getByParam: async (key, value) =>
    db
      .table('network')
      .where(key, '=', value)
      .returning('*')
      .then(rows => rows[0]),
};
export default NetworkController;
