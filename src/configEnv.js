import path from 'path';
import dotenv from 'dotenv';

switch (process.env.NODE_ENV) {
  case 'local':
    dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
    break;
  case 'development':
    dotenv.config({ path: path.resolve(process.cwd(), '.env.development') });
    break;
  case 'staging':
    dotenv.config({ path: path.resolve(process.cwd(), '.env.staging') });
    break;
  case 'production':
    dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });
    break;
  default:
    dotenv.config({ path: path.resolve(process.cwd(), '.env') });
    break;
}
