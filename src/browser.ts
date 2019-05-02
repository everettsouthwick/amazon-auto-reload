/*
	Import the instance(s) of the webdriver for selenium-webdriver for the
	desired side-effect of them automatically providing their npm-installed
	path when instantiating a new browser
*/
import "chromedriver";
import "geckodriver";
import { Builder, ThenableWebDriver } from "selenium-webdriver";

import { logger } from "./logger";

export type BrowserTypes = "firefox" | "chrome";

export class Browser
{
	public readonly driver: ThenableWebDriver;

	public constructor(browserName: BrowserTypes)
	{
		logger.debug(`Building a new ${browserName} browser.`);
		this.driver = new Builder().forBrowser(browserName).build();
		logger.debug("Browser built.");
		}

	public async close(): Promise<void>
	{
		await this.driver.quit();
	}
}
