import * as yup from 'yup';

const schema = yup.object().shape({
  slug: yup.string().required(),
  priority: yup.number().required(),
});

const isValid = obj => schema.validate(obj);

export default isValid;
