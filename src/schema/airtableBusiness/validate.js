import * as yup from 'yup';

const schema = yup.object().shape({
  airtableId: yup.string().required(),
  name: yup.string().required(),
  services: yup.array(),
  channels: yup.array(),
  categories: yup.array(),
  pictures: yup.array(),
  website: yup.string().nullable(),
  whatsapp: yup.string().nullable(),
  phone: yup.string().nullable(),
  state: yup.string().nullable(),
  city: yup.string().nullable(),
  instagram: yup.string().nullable(),
  email: yup.string().nullable(),
  approved: yup.string().nullable(),
});

const isValid = obj => schema.validate(obj);

export default isValid;
