import config
import amazon
import time
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait

driver = webdriver.Chrome(config.chromedriver)
wait = WebDriverWait(driver, 30)
amazon.login(config.username, config.password, driver, wait)
    
for card in config.cards:
    last_four = card.card_number[-4:]
    while card.reload_times > 0:
        print("Reloading card ending in {} with ${}.".format(last_four, card.reload_amount))
        amazon.reload(card.card_number, last_four, card.reload_amount, driver, wait)
        card.reload_times -= 1

driver.quit()
quit()