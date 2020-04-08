import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required(),
});

const isValid = obj => schema.validate(obj);

export default isValid;
