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
	private readonly completePurchases: boolean;

	public constructor(amazonConfig: IAmazonConfig, completePurchases: boolean)
	{
		super(amazonConfig);

		this.completePurchases = completePurchases;
		logger.info(`Complete purchases is set to ${this.completePurchases}.`);

		this.reloadDelayInSeconds =
			typeof amazonConfig.reloadDelayInSeconds === "undefined" ? 300 : amazonConfig.reloadDelayInSeconds;
	}

	public async reloadCards(cards: Card[]): Promise<void>
	{
		const loginURL: URL = new URL("https://smile.amazon.com/asv/reload/");
		logger.debug(`About to load ${loginURL}`);
		await this.browser.driver.get(loginURL.href);
		logger.debug(`Made call to load ${loginURL}`);

		await this.browser.driver.findElement(By.id("form-submit-button"))
			.click();
		await this.browser.driver.wait(until.titleIs("Amazon Sign In"));
		await this.browser.driver.findElement(By.id("ap_email"))
			.sendKeys(this.username);
		await this.browser.driver.findElement(By.id("ap_password"))
			.sendKeys(this.password);
		await this.browser.driver.findElement(By.id("signInSubmit"))
			.click();
		await this.browser.driver.wait(until.titleIs("Reload Your Balance"));

		for (const card of cards)
		{
			if (card.enabled)
			{
				while (card.reloadTimes-- > 0)
				{
					await this.reloadCard(card);
				}
			}
		}
	}

	public async reloadCard(card: Card): Promise<void>
	{
		const reloadURL: URL = new URL("https://smile.amazon.com/asv/reload/");
		await this.browser.driver.get(reloadURL.href);

		// Enter the reload amount for this card.
		await this.browser.driver.findElement(By.xpath(`//*[contains(text(), 'ending in ${card.lastFour}')]`))
			.click();
		const reloadAmount: WebElement = await this.browser.driver.findElement(By.id("asv-manual-reload-amount"));
		await reloadAmount.clear();
		await reloadAmount.sendKeys(`${card.reloadAmount}`);
		await this.browser.driver.executeScript('document.querySelector("#asv-manual-reload-amount").blur();');

		const submitButton: WebElement = await this.browser.driver.findElement(By.id("form-submit-button"));

		if (this.completePurchases)
		{
			// Try to submit the reload.
			try
			{
				await this.browser.driver.wait(until.elementTextIs(submitButton, `Reload $${card.reloadAmount.toFixed(2)}`), 10000);
				await submitButton.click();
				await this.browser.driver.wait(until.titleIs("Thank you for reloading your balance"), 10000);

				return;
			}
			catch (error)
			{}

			// If the reload fails, we must confirm the card number.
			const confirmation: WebElement =
				await this.browser.driver.findElement(By.xpath(`//input[@placeholder='ending in ${card.lastFour}']`));
			await this.browser.driver.wait(until.elementIsVisible(confirmation));
			await confirmation.sendKeys(card.cardNumber);

			const confirmationButtons: WebElement[] =
				await this.browser.driver.findElements(By.xpath("//button[contains(.,'Confirm Card')]"));
			for (const confirmationButton of confirmationButtons)
			{
				if (await confirmationButton.isDisplayed())
				{
					await confirmationButton.click();
				}
			}

			try
			{
				await this.browser.driver.wait(until.elementTextIs(submitButton, `Reload $${card.reloadAmount.toFixed(2)}`), 10000);
				await submitButton.click();
				await this.browser.driver.wait(until.titleIs("Thank you for reloading your balance"), 10000);
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

		await sleep(this.reloadDelayInSeconds);
	}
}

async function sleep(ms: number)
{
	return new Promise((resolve) => setTimeout(resolve, ms));
}
