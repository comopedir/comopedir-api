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
  value: yup.string().required(),
});

const isUpdateValid = obj => updateSchema.validate(obj);

export {
  isCreateValid,
  isUpdateValid,
};