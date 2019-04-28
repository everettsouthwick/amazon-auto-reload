'use strict';

const winston = require('winston');

const logger = winston.createLogger({
	level: 'debug',
	format: winston.format.combine(
		winston.format.simple(),
		winston.format.colorize(),
		winston.format.timestamp(),
		winston.format.ms()
	),
	transports: [new winston.transports.Console()]
});

module.exports = logger;
