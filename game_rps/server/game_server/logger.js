const winston = require('winston')

const { combine, timestamp, printf } = winston.format

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] [${level}] ${message}`
})

const options = {
  console: {
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true
  }
}

const logger = winston.createLogger({
  levels: winston.config.npm.levels,
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(options.console)
  ],
  exceptionHandlers: [
    new winston.transports.Console(options.console)
  ],
  exitOnError: false
})

module.exports = logger
