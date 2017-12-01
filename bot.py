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

def resolve_payment_method():
    print('Resolving payment method...')
    try:
        DRIVER.find_element_by_xpath('//*[@id="asv-payment-error-inline"]/div/div/div')
        time.sleep(2)
        DRIVER.find_element_by_id('asv-payment-edit-link').click()
        WAIT.until(EC.title_is('Change payment method'))
        time.sleep(2)
        try:
            DRIVER.find_elements_by_class_name('pmts-instrument-box')[2].click()
            time.sleep(2)
            DRIVER.find_element_by_name('addCardNumber').send_keys(CARD_NUMBER)
            time.sleep(2)
            DRIVER.find_element_by_xpath("//button[contains(.,'Confirm Card')]").click()
            time.sleep(2)
            DRIVER.find_element_by_xpath("//*[@id='asv-form-submit']").click()
            time.sleep(2)
            reload()
        except NoSuchElementException:
            print('ERR: Failed to verify payment method.')
    except NoSuchElementException:
        print('ERR: No in-line error found.')

def reload():
    print('Reloading balance...')
    DRIVER.get('https://smile.amazon.com/asv/reload/')
    WAIT.until(EC.title_is('Reload Your Balance'))
    time.sleep(2)
    DRIVER.find_element_by_id('asv-manual-reload-amount').clear()
    time.sleep(2)
    DRIVER.find_element_by_id('asv-manual-reload-amount').send_keys('0.50')
    DRIVER.execute_script('document.querySelector("#asv-manual-reload-amount").blur();')
    time.sleep(2)
    DRIVER.find_element_by_xpath("//button[contains(.,'Reload $0.50')]").click()
    time.sleep(2)

    # If the payment did not go through, attempt to resolve the payment method.
    if DRIVER.title != 'Thank you for reloading your balance':
        try:
            resolve_payment_method()
        except NoSuchElementException:
            print('Something went wrong...')
            quit()

    WAIT.until(EC.title_is('Thank you for reloading your balance'))
    DRIVER.close()
    quit()

login()
