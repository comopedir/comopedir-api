import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required(),
  password: yup.string().min(6),
  birthdate: yup.date().required(),
  cpfCnpj: yup.string().required(),
  email: yup
    .string()
    .required()
    .email(),
});

const isValid = obj => schema.validate(obj);

export default isValid;
