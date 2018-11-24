import globals
import os
import time
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException

AMAZON_USERNAME = os.getenv('AMAZON_USERNAME')
AMAZON_PASSWORD = os.getenv('AMAZON_PASSWORD')
CARD_NUMBER = os.getenv('CARD_NUMBER')
DRIVER = webdriver.Chrome(os.getenv('CHROME_DRIVER'))
WAIT = WebDriverWait(DRIVER, 30)

def login():
    print('Logging in...')
    DRIVER.get('https://smile.amazon.com/asv/reload/')
    DRIVER.find_element_by_id('form-submit-button').click()
    WAIT.until(EC.title_is('Amazon Sign In'))
    DRIVER.find_element_by_id('ap_email').send_keys(AMAZON_USERNAME)
    try:
        DRIVER.find_element_by_id('continue').click()
    except NoSuchElementException:
        pass      
    DRIVER.find_element_by_id('ap_password').send_keys(AMAZON_PASSWORD)
    DRIVER.find_element_by_id('signInSubmit').click()
    reload()

def reload():
    print('Reloading balance...')
    try:
        DRIVER.find_elements_by_class_name('pmts-credit-card-row')[2].click()
        time.sleep(2)
        DRIVER.find_element_by_xpath("//input[@placeholder='ending in 6625']").send_keys(CARD_NUMBER)
        time.sleep(2)
        DRIVER.find_elements_by_xpath("//button[contains(.,'Confirm Card')]")[2].click()
    except:
        quit()
    DRIVER.find_element_by_id('asv-manual-reload-amount').clear()
    time.sleep(2)
    DRIVER.find_element_by_id('asv-manual-reload-amount').send_keys('0.50')
    DRIVER.execute_script('document.querySelector("#asv-manual-reload-amount").blur();')
    time.sleep(2)
    DRIVER.find_element_by_xpath("//button[contains(.,'Reload $0.50')]").click()
    WAIT.until(EC.title_is('Thank you for reloading your balance'))
    DRIVER.close()
    quit()

login()