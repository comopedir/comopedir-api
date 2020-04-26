import * as yup from 'yup';

const createSchema = yup.object().shape({
  name: yup.string().required(),
});

const isCreateValid = obj => createSchema.validate(obj);

const associateSchema = yup.object().shape({
  business: yup.string().required(),
  channels: yup.array().nullable(),
});

const isAssociateValid = obj => associateSchema.validate(obj);


export {
  isCreateValid,
  isAssociateValid
}
