import { Browser, BrowserTypes } from "./browser";

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

	public constructor(
		siteConfig: ISiteConfig,
	)
	{
		Object.assign(this, siteConfig);
		this.browserType = siteConfig.browserType || "chrome";
		this.browser = new Browser(this.browserType);
	}
}
