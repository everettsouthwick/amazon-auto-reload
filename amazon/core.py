import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException

def reload_card(card_number, last_four, reload_amount, driver):
    wait = WebDriverWait(driver, 30)
    driver.get("https://smile.amazon.com/asv/reload/")
    
    # Select the correct credit card and verify it.
    driver.find_element_by_xpath("//*[contains(text(), 'ending in {}')]".format(last_four)).click()

    # Reload for the specified amount.
    driver.find_element_by_id('asv-manual-reload-amount').clear()
    driver.find_element_by_id('asv-manual-reload-amount').send_keys('%.2f' % reload_amount)
    driver.execute_script('document.querySelector("#asv-manual-reload-amount").blur();') # Blur the reload amount input to ensure the correct value will be reloaded.
    time.sleep(1)
    driver.find_element_by_xpath("//button[contains(.,'Reload ${}')]".format('%.2f' % reload_amount)).click()
    
    # Try again to verify the credit card.
    try:
        conf_input = WebDriverWait(driver, 20).until(
            EC.visibility_of_element_located((By.XPATH, "//input[@placeholder='ending in {}']".format(last_four)))
        )
        conf_input.send_keys(card_number)
        conf_buttons = driver.find_elements_by_xpath("//button[contains(.,'Confirm Card')]")
        for button in conf_buttons:
            try:
                button.click()
                break
            except:
                pass
        time.sleep(1)
        driver.find_element_by_xpath("//button[contains(.,'Reload ${}')]".format('%.2f' % reload_amount)).click()
    except TimeoutException:
        pass
    except NoSuchElementException:
        pass

    wait.until(EC.title_is("Thank you for reloading your balance"))