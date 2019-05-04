/*
	Import the instance(s) of the webdriver for selenium-webdriver for the
	desired side-effect of them automatically providing their npm-installed
	path when instantiating a new browser
*/
import "chromedriver";
import "geckodriver";
import { Builder, Capabilities, ThenableWebDriver } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";

import { logger } from "./logger";

export type BrowserTypes = "firefox" | "chrome";

export class Browser
{
	public readonly driver: ThenableWebDriver;

	public constructor(browserType: BrowserTypes, startingURL?: URL)
	{
		logger.debug(`Building a new ${browserType} browser.`);

		if (browserType === "chrome")
		{
			const chromeCapabilities = Capabilities.chrome();

			const chromeOptions: Options = new Options();

			// Disable "Restore pages?" popup
			chromeOptions.addArguments("disable-features=InfiniteSessionRestore");

			// If using Chrome, use a browser profile to allow for cache (and for the user to install extensionss if they
			// like
			// if (vpn)
			// {
			// 	chromeOptions.addArguments("user-data-dir=.\\webdriver-browser-profiles\\chrome-with-vpn\\");
			// }
			// else
			// {
			// 	chromeOptions.addArguments("user-data-dir=.\\webdriver-browser-profiles\\chrome\\");
			// }

			if (startingURL)
			{
				chromeOptions.addArguments(`homepage ${startingURL.href}`);
				logger.debug("Added browser argument: " + `homepage ${startingURL.href}`);
			}

			chromeCapabilities.set("chromeOptions", chromeOptions);

			this.driver = new Builder()
				.forBrowser(browserType)
				.setChromeOptions(chromeOptions)
				.build();
		}
		else
		{
			this.driver = new Builder().forBrowser(browserType).build();
		}
		logger.debug("Browser built.");
		}

	public async close(): Promise<void>
	{
		await this.driver.quit();
	}
}
