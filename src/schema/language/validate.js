import * as yup from 'yup';

const createSchema = yup.object().shape({
  isoCode: yup.string().required(),
  priority: yup.number().required(),
});

const isCreateValid = obj => createSchema.validate(obj);

const updateSchema = yup.object().shape({
  language: yup.string().required(),
  field: yup.string().required(),
  value: yup.string().nullable(),
});

const isUpdateValid = obj => updateSchema.validate(obj);

export {
  isCreateValid,
  isUpdateValid,
}
