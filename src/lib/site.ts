import { ThenableWebDriver } from "selenium-webdriver";

import { Browser, BrowserType } from "./browser";

export interface ISiteConfig
{
	readonly password: string;
	readonly username: string;
}

export abstract class Site implements ISiteConfig {

	public readonly browser: Browser;
	public readonly password: string;
	public readonly username: string;
	protected readonly startingURL: URL;

	public constructor(siteConfig: ISiteConfig, startingURL: string, browserType?: BrowserType)
	{
		this.startingURL = new URL(startingURL);
		this.username = siteConfig.username;
		this.password = siteConfig.password;
		this.browser = new Browser(this.startingURL, browserType);
	}

	protected async loadLoginPage(): Promise<void>
	{
		// A driver alias so the code isn't *as* unwieldy
		const driver: ThenableWebDriver = this.browser.driver;

		const currentURL: string = await driver.getCurrentUrl();

		if (
			currentURL === "https://www.google.com/_/chrome/newtab?ie=UTF-8"
			|| currentURL === "about:blank"
			)
		{
			// Chrome was supposed to start with a starting URL.
			// It works on my Windows machine, but fails in my Docker Linux image.
			// As such, handle that case as well.
			await driver.get(this.startingURL.href);
		}
	}
}
