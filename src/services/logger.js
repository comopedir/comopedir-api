import pino from 'pino';
import prettifier from 'pino-pretty';

const logger = pino({
  prettyPrint: {
    levelFirst: true,
    colorize: true,
  },
  prettifier,
});

export default logger;