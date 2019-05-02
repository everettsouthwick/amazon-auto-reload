import { createLogger, format, Logger, transports } from "winston";

const {simple, colorize, timestamp, ms} = format;

export const logger: Logger = createLogger(
{
	level: "debug",
	format: format.combine
	(
		colorize(),
		ms(),
		simple(),
		timestamp(),
	),
	transports: [new transports.Console()],
});

export default logger;
