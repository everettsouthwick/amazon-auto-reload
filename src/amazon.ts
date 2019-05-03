import { By, until, WebElement } from "selenium-webdriver";
import { URL } from "url";

import { Card } from "./card";
import { logger } from "./logger";
import { ISiteConfig, Site } from "./site";

export interface IAmazonConfig extends ISiteConfig
{
  readonly reloadDelayInSeconds?: number;
}

export class Amazon extends Site implements IAmazonConfig
{
	public readonly reloadDelayInSeconds: number;
	private readonly completeTransactions: boolean;

	public constructor(amazonConfig: IAmazonConfig, completeTransactions: boolean)
	{
		super(amazonConfig);

		this.completeTransactions = completeTransactions;
		logger.info(`completeTransactions is set to ${this.completeTransactions}.`);

		this.reloadDelayInSeconds =
			typeof amazonConfig.reloadDelayInSeconds === "undefined" ? 300 : amazonConfig.reloadDelayInSeconds;
	}

	public async reloadCards(cards: Card[]): Promise<void>
	{

		const loginURL: URL = new URL("https://smile.amazon.com/asv/reload/");
		logger.debug(`About to load ${loginURL}`);
		const driver = this.browser.driver;
		await driver.get(loginURL.href);
		logger.debug(`Made call to load ${loginURL}`);

		driver.findElement(By.id("form-submit-button"))
			.click();
		driver.wait(until.titleIs("Amazon Sign In"));
		driver.findElement(By.id("ap_email"))
			.sendKeys(this.username);
		driver.findElement(By.id("ap_password"))
			.sendKeys(this.password);
		driver.findElement(By.id("signInSubmit"))
			.click();
		driver.wait(until.titleIs("Reload Your Balance"));

		for (const card of cards)
		{
			if (card.enabled)
			{
				while (card.reloadTimes-- > 0)
				{
					this.reloadCard(card);
				}
			}
		}
	}

	public async reloadCard(card: Card): Promise<void>
	{
		const driver = this.browser.driver;

		const reloadURL: URL = new URL("https://smile.amazon.com/asv/reload/");
		driver.get(reloadURL.href);

		// Enter the reload amount for this card.
		driver.findElement(By.xpath(`//*[contains(text(), 'ending in ${card.lastFour}')]`))
			.click();
		const reloadAmount: WebElement = driver.findElement(By.id("asv-manual-reload-amount"));
		reloadAmount.clear();
		reloadAmount.sendKeys(`${card.reloadAmount}`);
		driver.executeScript('document.querySelector("#asv-manual-reload-amount").blur();');

		const submitButton: WebElement = driver.findElement(By.id("form-submit-button"));

		if (this.completeTransactions)
		{
			// Try to submit the reload.
			try
			{
				driver.wait(until.elementTextIs(submitButton, `Reload $${card.reloadAmount.toFixed(2)}`), 10000);
				submitButton.click();
				driver.wait(until.titleIs("Thank you for reloading your balance"), 10000);

				return;
			}
			catch (error)
			{}

			// If the reload fails, we must confirm the card number.
			const confirmation: WebElement =
				driver.findElement(By.xpath(`//input[@placeholder='ending in ${card.lastFour}']`));
			driver.wait(until.elementIsVisible(confirmation));
			confirmation.sendKeys(card.cardNumber);

			const confirmationButtons: WebElement[] =
				await driver.findElements(By.xpath("//button[contains(.,'Confirm Card')]"));
			for (const confirmationButton of confirmationButtons)
			{
				if (confirmationButton.isDisplayed())
				{
					confirmationButton.click();
				}
			}

			try
			{
				driver.wait(until.elementTextIs(submitButton, `Reload $${card.reloadAmount.toFixed(2)}`), 10000);
				submitButton.click();
				driver.wait(until.titleIs("Thank you for reloading your balance"), 10000);
			}
			catch (error)
			{
				logger.error("ERR: Submission button text mismatch.");

				return;
			}
		}
		else
		{
			logger.debug("Skipping purchase completion");
		}

		sleep(this.reloadDelayInSeconds);
	}
}

async function sleep(ms: number)
{
	return new Promise((resolve) => setTimeout(resolve, ms));
}
