import * as yup from 'yup';

const createSchema = yup.object().shape({
  slug: yup.string().required(),
  priority: yup.number().required(),
});

const isCreateValid = obj => createSchema.validate(obj);

const associateSchema = yup.object().shape({
  business: yup.string().required(),
  services: yup.array().nullable(),
});

const isAssociateValid = obj => associateSchema.validate(obj);

export {
  isCreateValid,
  isAssociateValid
}
