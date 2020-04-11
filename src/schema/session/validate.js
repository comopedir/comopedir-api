import * as yup from 'yup';

const schema = yup.object().shape({
  username: yup.string(),
  phoneNumber: yup.number(),
  phoneAreaCode: yup.number(),
  phoneCountryCode: yup.number(),
  email: yup.string().email(),
  password: yup
    .string()
    .min(6)
    .required(),
});

const isValid = obj => schema.validate(obj);

export default isValid;
