import time
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException

def login(username, password, driver, wait):
    driver.get("https://smile.amazon.com/asv/reload/")
    driver.find_element_by_id("form-submit-button").click()
    wait.until(EC.title_is("Amazon Sign In"))
    driver.find_element_by_id("ap_email").send_keys(username)
    try:
        driver.find_element_by_id("continue").click()
    except NoSuchElementException:
        pass      
    driver.find_element_by_id("ap_password").send_keys(password)
    driver.find_element_by_id("signInSubmit").click()
    wait.until(EC.title_is("Reload Your Balance"))

def reload(card_number, last_four, reload_amount, driver, wait):
    # Check to see if we need to change the page.
    if EC.title_is("Amazon Sign In"):
        print("User is not signed in. Reloading failed!")
        quit()
    if EC.title_is("Thank you for reloading your balance"):
        driver.get("https://smile.amazon.com/asv/reload/")
    
    # Select the correct credit card and verify it.
    driver.find_element_by_xpath("//*[contains(text(), 'ending in {}')]".format(last_four)).click()
    time.sleep(1)
    try:
        driver.find_element_by_xpath("//input[@placeholder='ending in {}']".format(last_four)).send_keys(card_number)
        time.sleep(1)
        confirmation_buttons = driver.find_elements_by_xpath("//button[contains(.,'Confirm Card')]")
        for button in confirmation_buttons:
            try:
                button.click()
                break
            except NoSuchElementException:
                pass
    except NoSuchElementException:
        pass

    # Reload for the specified amount.
    driver.find_element_by_id('asv-manual-reload-amount').clear()
    driver.find_element_by_id('asv-manual-reload-amount').send_keys('%.2f' % reload_amount)
    time.sleep(1)
    driver.execute_script('document.querySelector("#asv-manual-reload-amount").blur();') # Blur the reload amount input to ensure the correct value will be reloaded.
    driver.find_element_by_xpath("//button[contains(.,'Reload ${}')]".format('%.2f' % reload_amount)).click()
    wait.until(EC.title_is("Thank you for reloading your balance"))