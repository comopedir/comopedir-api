import * as yup from 'yup';

const createCategorySchema = yup.object().shape({
  language: yup.string().required(),
  category: yup.string().required(),
  name: yup.string().required(),
  description: yup.string().nullable(),
});

const isCreateCategoryValid = obj => createCategorySchema.validate(obj);

const updateSchema = yup.object().shape({
  translation: yup.string().required(),
  name: yup.string().required(),
  description: yup.string().nullable(),
});

const isUpdateValid = obj => updateSchema.validate(obj);

const deleteSchema = yup.object().shape({
  language: yup.string().required(),
});

const isDeleteValid = obj => deleteSchema.validate(obj);

export {
  isCreateCategoryValid,
  isUpdateValid,
  isDeleteValid,
}