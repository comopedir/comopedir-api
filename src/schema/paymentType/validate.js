import * as yup from 'yup';

const createSchema = yup.object().shape({
  slug: yup.string().required(),
  priority: yup.number().required(),
});

const isCreateValid = obj => createSchema.validate(obj);

const associateSchema = yup.object().shape({
  business: yup.string().required(),
  paymentTypes: yup.array().nullable(),
});

const isAssociateValid = obj => associateSchema.validate(obj);

const updateSchema = yup.object().shape({
  paymentType: yup.string().required(),
  field: yup.string().required(),
  value: yup.string().nullable(),
});

const isUpdateValid = obj => updateSchema.validate(obj);

const deleteSchema = yup.object().shape({
  category: yup.string().required(),
});

const isDeleteValid = obj => deleteSchema.validate(obj);


export {
  isCreateValid,
  isAssociateValid,
  isUpdateValid,
  isDeleteValid,
}