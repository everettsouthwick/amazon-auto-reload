'use strict';

// We need to require the instance of the webdriver for selenium-webdriver to load the npm-installed instance of the webdriver
require('chromedriver');
require('geckodriver'); // eslint-disable-line import/no-unassigned-import
const webdriver = require ('selenium-webdriver');
const {By, until} = require('selenium-webdriver');

class Amazon {
	constructor(amazon) {
		this.username = amazon.username;
		this.password = amazon.password;
		this.reloadDelay = amazon.reloadDelay;
		this.browser = amazon.browser;
	}

	async reloadCards(cards) {
		if (arguments.length !== 1) {
			throw new Error('Incorrect number of parameters');
		}

		const driver = new webdriver.Builder().forBrowser(this.browser).build();

		await driver.get('https://smile.amazon.com/asv/reload/');
		await driver.findElement(By.id('form-submit-button')).click();
		await driver.wait(until.titleIs('Amazon Sign In'));
		await driver.findElement(By.id('ap_email')).sendKeys(this.username);
		await driver.findElement(By.id('ap_password')).sendKeys(this.password);
		await driver.findElement(By.id('signInSubmit')).click();
		await driver.wait(until.titleIs('Reload Your Balance'));

		for (const card of cards) {
			if (card.enabled) {
				while (card.reloadTimes-- > 0) {
					// eslint-disable-next-line no-await-in-loop
					await this.reloadCard(driver, card);
				}
			}
		}
	}

	async reloadCard(driver, card) {
		await driver.get('https://smile.amazon.com/asv/reload/');

		// Enter the reload amount for this card.
		await driver.findElement(By.xpath(`//*[contains(text(), 'ending in ${card.lastFour}')]`)).click();
		const reloadAmount = await driver.findElement(By.id('asv-manual-reload-amount'));
		await reloadAmount.clear();
		await reloadAmount.sendKeys(`${card.reloadAmount}`);
		await driver.executeScript('document.querySelector("#asv-manual-reload-amount").blur();');

		// Try to submit the reload.
		const submitButton = await driver.findElement(By.id('form-submit-button'));

		try {
			await driver.wait(until.elementTextIs(submitButton, `Reload $${card.reloadAmount.toFixed(2)}`), 10000);
			await submitButton.click();
			await driver.wait(until.titleIs('Thank you for reloading your balance'), 10000);
			return;
		} catch (error) {}

		// If the reload fails, we must confirm the card number.
		const confirmation = await driver.findElement(By.xpath(`//input[@placeholder='ending in ${card.lastFour}']`));
		await driver.wait(until.elementIsVisible(confirmation));
		await confirmation.sendKeys(card.cardNumber);

		const confirmationButtons = await driver.findElements(By.xpath('//button[contains(.,\'Confirm Card\')]'));
		for (let i = 0; i < confirmationButtons.length; i++) {
			if (await confirmationButtons[i].isDisplayed()) {
				await confirmationButtons[i].click();
			}
		}

		// Manual wait time to allow for the confirmation to finish.
		await sleep(5000);

		try {
			await driver.wait(until.elementTextIs(submitButton, `Reload $${card.reloadAmount.toFixed(2)}`), 10000);
			await submitButton.click();
			await driver.wait(until.titleIs('Thank you for reloading your balance'), 10000);
		} catch (error) {
			return console.error('ERR: Submission button text mismatch.');
		}

		await sleep(this.reloadDelay);
	}
}

async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = Amazon;
