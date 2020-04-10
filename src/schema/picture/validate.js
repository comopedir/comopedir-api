import * as yup from 'yup';

const schema = yup.object().shape({
  business: yup.string().required(),
  url: yup.string().required(),
});

const isValid = obj => schema.validate(obj);

export default isValid;
