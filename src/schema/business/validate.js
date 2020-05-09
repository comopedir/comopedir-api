import * as yup from 'yup';

const schema = yup.object().shape({
  network: yup.string().nullable(),
  slug: yup.string().required(),
  name: yup.string().required(),
});

const isCreateValid = obj => schema.validate(obj);

const updateSchema = yup.object().shape({
  business: yup.string().required(),
  field: yup.string().required(),
  value: yup.string().nullable(),
});

const isUpdateValid = obj => updateSchema.validate(obj);

const deleteSchema = yup.object().shape({
  business: yup.string().required(),
});

const isDeleteValid = obj => deleteSchema.validate(obj);

export {
  isCreateValid,
  isUpdateValid,
  isDeleteValid,
};