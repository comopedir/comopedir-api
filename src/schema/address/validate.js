import * as yup from 'yup';

const schema = yup.object().shape({
  business: yup.string().required(),
  latitude: yup.number().nullable(),
  longitude: yup.number().nullable(),
  city: yup.string().required(),
  complement: yup.string(),
  district: yup.string().required(),
  street: yup.string().required(),
  streetNumber: yup.string().required(),
  zipCode: yup.string().required(),
  state: yup.string().required(),
  country: yup
    .string()
    .min(3, 'Country format ISO-alpha 3, ex: BRA')
    .max(3, 'Country format ISO-alpha 3, ex: BRA')
    .matches(/[a-zA-Z]{1,3}/)
    .required(),
});

const isValid = obj => schema.validate(obj);

export default isValid;
