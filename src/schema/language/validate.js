import * as yup from 'yup';

const createSchema = yup.object().shape({
  name: yup.string().required(),
  isoCode: yup.string().required(),
});

const isCreateValid = obj => createSchema.validate(obj);

const updateSchema = yup.object().shape({
  language: yup.string().required(),
  field: yup.string().required(),
  value: yup.string().nullable(),
});

const isUpdateValid = obj => updateSchema.validate(obj);

const deleteSchema = yup.object().shape({
  language: yup.string().required(),
});

const isDeleteValid = obj => deleteSchema.validate(obj);

export {
  isCreateValid,
  isUpdateValid,
  isDeleteValid,
}
