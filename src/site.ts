import { Browser, BrowserTypes } from "./browser";
import { logger } from "./logger";

export interface ISiteConfig
{
	readonly browserType?: BrowserTypes;
	readonly password: string;
	readonly username: string;
}

export abstract class Site implements ISiteConfig
{
	public readonly browserType?: BrowserTypes;
	public readonly password: string;
	public readonly username: string;

	protected readonly browser: Browser;

	public constructor(siteConfig: ISiteConfig, startingURL?: URL)
	{
		logger.debug("Constructing new Site clss object.");
		Object.assign(this, siteConfig);
		this.browserType = siteConfig.browserType || "chrome";
		this.browser = new Browser(this.browserType, startingURL);
	}
}
