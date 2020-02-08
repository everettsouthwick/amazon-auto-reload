import { formatMoney } from "accounting";
import { strict as assert } from "assert";
import { By, Locator, ThenableWebDriver, until, WebElement } from "selenium-webdriver";

import { Card } from "../lib/card";
import { Cards } from "../lib/cards";
import { logger } from "../lib/logger";
import { ISiteConfig, Site } from "../lib/site";

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
		super(amazonConfig, "https://smile.amazon.com/asv/reload/");

		this.completeTransactions = completeTransactions;

		this.reloadDelayInSeconds =
			typeof amazonConfig.reloadDelayInSeconds === "undefined" ? 300 : amazonConfig.reloadDelayInSeconds;
	}

	public async reloadCards(cards: Cards): Promise<void>
	{

		// A driver alias so the code isn't *as* unwieldy
		const driver: ThenableWebDriver = this.browser.driver;

		if (cards.cardArray.length === 0)
		{
			logger.info("Skipping Amazon as all cards are marked to be skipped.");
			this.browser.driver.close();

			return;
		}

		await this.login();

		await driver.wait(until.titleIs("Reload Your Balance"));

		for (const card of cards.cardsToRun())
		{
			while (card.reloadTimes-- > 0)
			{
				await this.reloadCard(card);
			}

		}
	}

	private async addCard(card: Card): Promise<void>
	{
		// A driver alias so the code isn't *as* unwieldy
		const driver: ThenableWebDriver = this.browser.driver;

		await driver.findElement(By.css(".a-size-base"))
			.click();

		if (card.cardholderName !== undefined && card.expirationMonth !== undefined && card.expirationYear !== undefined)
		{
			await driver.findElement(By.name("ppw-accountHolderName"))
				.sendKeys(card.cardholderName);
			await driver.findElement(By.name("addCreditCardNumber"))
				.sendKeys(card.cardNumber);
			await driver.findElement(By.xpath(`//select[@name='ppw-expirationDate_month']/option[${card.expirationMonth}]`))
				.click();
			await driver.findElement(By.xpath(`//select[@name='ppw-expirationDate_year']/option[.=${card.expirationYear}]`))
				.click();
			await driver.findElement(By.name("ppw-widgetEvent:AddCreditCardEvent"))
				.click();

			await driver.wait(until.elementLocated(By.name("ppw-widgetEvent:SelectAddressEvent")))
				.click();
		} else
		{
			throw new Error(`${card.friendlyReference}: ${card.cardholderName}/${card.expirationMonth}/${card.expirationYear}`);
		}
	}

	private async login(): Promise<void>
	{
		// A driver alias so the code isn't *as* unwieldy
		const driver: ThenableWebDriver = this.browser.driver;

		await this.loadLoginPage();

		const signInToContinueLocator: Locator = By.xpath("//button[contains(.,'Sign In to Continue')]");

		let signInToContinueElement: WebElement;

		try
		{
			// If finding the login button fails...
			signInToContinueElement = await driver.findElement(signInToContinueLocator);
		} catch
		{
			// Then we should already be logged in and can return from login()
			return;
		}

		await signInToContinueElement.click();

		await driver.wait(until.titleIs("Amazon Sign-In"));
		try
		{
			await driver.findElement(By.id("ap_email"))
				.sendKeys(this.username);
		} catch
		{
			assert(await driver.findElement(By.css(".a-size-base"))
				.getText() === this.username);
		}
		const continueElement: WebElement = await driver.findElement(By.id("continue"));
		continueElement.click();
		await driver.wait(until.elementIsVisible(driver.findElement(By.id("ap_password"))));
		await driver.findElement(By.id("ap_password"))
			.sendKeys(this.password);

		const rememberMeElement: WebElement = await driver.findElement(By.name("rememberMe"));

		if (!await rememberMeElement.isSelected())
		{
			await rememberMeElement.click();
		}

		await driver.findElement(By.id("signInSubmit"))
			.click();
	}

	private async reloadCard(card: Card): Promise<void>
	{
		// A driver alias so the code isn't *as* unwieldy
		const driver: ThenableWebDriver = this.browser.driver;

		const formattedMoney: string = formatMoney(card.reloadAmount, "");
		const reloadURL: string = `https://smile.amazon.com/asv/reload/order?manualReload.amount=${formattedMoney}`;
		await driver.get(reloadURL);

		// Enter the reload amount for this card.
		const reloadAmount: WebElement = await driver.findElement(By.id("asv-manual-reload-amount"));
		const reloadAmountElementValue: string = await reloadAmount.getAttribute("value");
		if (formattedMoney !== reloadAmountElementValue)
		{
			await reloadAmount.clear();
			await reloadAmount.sendKeys(`${card.reloadAmount}`);
		}

		try
		{
			await driver.findElement(By.xpath(`//*[contains(text(), 'ending in ${card.lastFour}')]`))
				.click();
		} catch
		{
			// If the above failed, let's add a card
			await this.addCard(card);
		}

		if (this.reloadDelayInSeconds > 0)
		{
			logger.info(`Sleeping for ${this.reloadDelayInSeconds} before proceeding to submit step.`);
			await sleep(this.reloadDelayInSeconds);
		}

		const submitButton: WebElement = driver.findElement(By.id("form-submit-button"));

		if (this.completeTransactions)
		{
			// Try to submit the reload.
			try
			{
				await driver.wait(until.elementTextIs(submitButton, `Reload $${card.reloadAmount.toFixed(2)}`), 10000);
				await submitButton.click();
				await driver.wait(until.titleIs("Thank you for reloading your balance"), 10000);

				return;
			} catch { }

			// If the initial Reload $ click failed, try seeing if the address needs confirming
			try
			{
				// Submit address if prompted.
				// If it doesn't throw error failed to find the elemtent, our order should be successful.
				await driver.findElement(By.name("ppw-widgetEvent:SelectAddressEvent"))
					.click();

				return;
			} catch
			{
				// If finding the 'Use this address' element failed, that's OK, it means we don't need to confirm the address
			}

			// If the reload fails, we must confirm the card number.
			const confirmation: WebElement =
				await driver.findElement(By.xpath(`//input[@placeholder='ending in ${card.lastFour}']`));
			await driver.wait(until.elementIsVisible(confirmation));
			await confirmation.sendKeys(card.cardNumber);

			const confirmationButtons: WebElement[] =
				await driver.findElements(By.xpath("//button[contains(.,'Verify card')]"));
			for (const confirmationButton of confirmationButtons)
			{
				if (await confirmationButton.isDisplayed())
				{
					await confirmationButton.click();
				}
			}

			try
			{
				await driver.wait(until.elementTextIs(submitButton, `Reload $${card.reloadAmount.toFixed(2)}`), 10000);
				await submitButton.click();
				await driver.wait(until.titleIs("Thank you for reloading your balance"), 10000);
			} catch (error)
			{
				logger.error("ERR: Submission button text mismatch.");

				return;
			}
		} else
		{
			logger.debug("Skipping purchase completion");
		}
	}
}

async function sleep(reloadDelayInSeconds: number)
{
	return new Promise((resolve) => setTimeout(resolve, reloadDelayInSeconds * 1000));
}
