const { Builder } = require('selenium-webdriver')
const selenium = require('selenium-webdriver')
const config = require('./config.json')
const Amazon = require('./app/amazon')

async function start() {
    let capabilities = selenium.Capabilities.chrome()
    var options = {
      'args': ['--disable-notifications']
    }
    capabilities.set('chromeOptions', options)
    const driver = new Builder().forBrowser('chrome').withCapabilities(capabilities).build()
    let amazon = new Amazon(config)

    await amazon.login(driver)
    await amazon.reload(driver)

    driver.quit()
}

start()
