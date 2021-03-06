import * as yup from 'yup';

const schema = yup.object().shape({
  slug: yup.string().required(),
  name: yup.string().required(),
});

const isValid = obj => schema.validate(obj);

export default isValid;
