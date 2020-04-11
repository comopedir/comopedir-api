import TwilioService from 'twilio';
import logger from '../services/logger';

const sms = {
  accountSid: process.env.TWILIO_ID,
  authToken: process.env.TWILIO_TOKEN,
}

const Twilio = async notification => {
  logger.info('Account - TWILIO - Sending SMS');

  const client = new TwilioService(sms.accountSid, sms.authToken);

  const response = await client.messages.create({
    body: notification.body,
    from: '+12015849106',
    to: notification.to,
  });

  return response;
};

const providerSMS = {
  send: async notification => {
    logger.info('Account - Sending SMS Code...');

    let response;

    switch (process.env.SMS_SERVICE) {
      case 'TWILIO':
        response = await Twilio(notification);
        break;

      default:
        response = await Twilio(notification);
        break;
    }

    logger.info('Account - Sending SMS Code - Success', {
      phoneComplete: notification.to,
      response,
    });
  },
};

export default providerSMS;
