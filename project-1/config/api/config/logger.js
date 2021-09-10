/**
 * winston@3
 * - Reference: https://github.com/winstonjs/winston
 * - daily rotate: https://github.com/winstonjs/winston-daily-rotate-file
 */

const { format, createLogger, transports } = require('winston');
require('winston-daily-rotate-file');
const { combine, timestamp, align, printf, colorize, json } = format;
const config = require('./config.js');

const fileFormat = combine(
  timestamp(),
  align(),
  printf((info) => {
    const {
      level, message, label, timestamp
    } = info;

    const ts = timestamp.slice(0, 19).replace('T', ' ');

    return `${ts} [${level}]: ${message}`;
  }),
);

const consoleFormat = combine(
  colorize(),
  timestamp(),
  align(),
  printf((info) => {
    const {
      level, message, label, timestamp
    } = info;

    const ts = timestamp.slice(0, 19).replace('T', ' ');

    return `${ts} [${level}]: ${message}`;
  }),
);

const logger = createLogger({
  transports: [
    new transports.DailyRotateFile({
      name: 'node-api-logs',
      filename: config.winston.fileName,
      datePattern: 'YYYY-MM-DD',
      format: fileFormat,
      level: config.winston.logLevelConsole,
      maxSize: config.winston.maxSize,
      maxFiles: config.winston.maxFiles,
      handleExceptions: true,
    }),
    new transports.Console({
      format: consoleFormat,
      level: config.winston.logLevelFile,
      handleExceptions: true,
      json: false
    })
  ],
  exitOnError: false
})

logger.stream = {
  write: function (message) {
    logger.info(message);
  }
};

module.exports = logger;
