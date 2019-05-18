import { createLogger, format, Logger, transports } from "winston";

const {colorize, combine, ms, simple, timestamp} = format;

export const logger: Logger = createLogger(
{
	level: "debug",
	format: combine (colorize(), ms(), simple(), timestamp()),
	transports: [new transports.Console()],
});
