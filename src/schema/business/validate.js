import * as yup from 'yup';

const schema = yup.object().shape({
  network: yup.string().nullable(),
  slug: yup.string().required(),
  name: yup.string().required(),
});

const isValid = obj => schema.validate(obj);

export default isValid;
