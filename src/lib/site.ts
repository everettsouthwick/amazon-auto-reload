import { ThenableWebDriver } from "selenium-webdriver";

import { Browser, BrowserType } from "./browser";
import { logger } from "./logger";

export interface ISiteConfig {
	readonly browserType?: BrowserType;
	readonly password: string;
	readonly username: string;
}

export abstract class Site implements ISiteConfig {

	public readonly browser: Browser;
	public readonly browserType?: BrowserType;
	public readonly password: string;
	public readonly username: string;
	protected readonly startingURL: URL;

	public constructor(siteConfig: ISiteConfig, startingURL: URL) {
		logger.debug(`Constructing new Site class object (${startingURL.hostname})`);
		this.username = siteConfig.username;
		this.password = siteConfig.password;
		this.browserType = siteConfig.browserType || "chrome";
		this.startingURL = startingURL;
		this.browser = new Browser(this.browserType, startingURL);
	}

	protected async loadLoginPage(): Promise<void>
	{
		// A driver alias so the code isn't *as* unwieldy
		const driver: ThenableWebDriver = this.browser.driver;

		if (await driver.getCurrentUrl() === "https://www.google.com/_/chrome/newtab?ie=UTF-8")
		{
			// Browser was supposed to start with a starting URL.
			// It works on my Windows machine, but fails in my docker linux image.
			// As such, handle that case as well
			logger.debug(`About to load ${this.startingURL}`);
			await driver.get(this.startingURL.href);
			logger.debug(`Made call to load ${this.startingURL}`);
		}
	}
}
