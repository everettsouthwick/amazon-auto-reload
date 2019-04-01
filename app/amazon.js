const {By, Key, until} = require('selenium-webdriver')
const Card = require('./models/card')

module.exports = class Amazon {
    constructor(options = {}) {
        let cards = []
        for (let i = 0; i < options.cards.length; i++) {
            let card = new Card(options.cards[i])
            cards.push(card)
        }
        options.cards = cards
        Object.assign(this, options)
    }

    async login(driver) {
        await driver.get('https://smile.amazon.com/asv/reload/')
        await driver.findElement(By.id('form-submit-button')).click()
        await driver.wait(until.titleIs('Amazon Sign In'))
        await driver.findElement(By.id('ap_email')).sendKeys(this.username)
        await driver.findElement(By.id('ap_password')).sendKeys(this.password)
        await driver.findElement(By.id('signInSubmit')).click()
        await driver.wait(until.titleIs('Reload Your Balance'))
    }

    async reload(driver) {
        for (let i = 0; i < this.cards.length; i++) {
            if (!this.cards[i].enabled) continue
            while (this.cards[i].reloadTimes > 0) {
                await reloadCard(driver, this.cards[i])
                this.cards[i].reloadTimes -= 1
                await sleep(this.reloadDelay)
            }
        }
    }
}

async function reloadCard(driver, card) {
    await driver.get('https://smile.amazon.com/asv/reload/')

    // Enter the reload amount for this card.
    await driver.findElement(By.xpath(`//*[contains(text(), 'ending in ${card.lastFour}')]`)).click()
    let reloadAmount = await driver.findElement(By.id('asv-manual-reload-amount'))
    await reloadAmount.clear()
    await reloadAmount.sendKeys(`${card.reloadAmount}`)
    await driver.executeScript('document.querySelector("#asv-manual-reload-amount").blur();')

    // Try to submit the reload.
    try {
        let submitButton = await driver.findElement(By.id('form-submit-button'))
        await driver.wait(until.elementTextIs(submitButton, `Reload $${card.reloadAmount.toFixed(2)}`), 10000)
        await submitButton.click()
        await driver.wait(until.titleIs('Thank you for reloading your balance'), 10000)
        return
    }
    catch (e) {}

    // If the reload fails, we must confirm the card number.
    let confirmation = await driver.findElement(By.xpath(`//input[@placeholder='ending in ${card.lastFour}']`))
    await driver.wait(until.elementIsVisible(confirmation))
    await confirmation.sendKeys(card.cardNumber)
    
    let confirmationButtons = await driver.findElements(By.xpath("//button[contains(.,'Confirm Card')]"))
    for (let i = 0; i < confirmationButtons.length; i++) {
        if (await confirmationButtons[i].isDisplayed()) {
            await confirmationButtons[i].click()
        }
    }

    try {
        await driver.wait(until.elementTextIs(submitButton, `Reload $${card.reloadAmount.toFixed(2)}`), 10000)
        await submitButton.click()
        await driver.wait(until.titleIs('Thank you for reloading your balance', 10000))
    }
    catch (e) {
        return console.error('ERR: Submission button text mismatch.')
    }    
}

async function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
