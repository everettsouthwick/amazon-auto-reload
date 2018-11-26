import os
from card import Card

# Define the cards you wish to reload.
card1 = Card("XXXXXXXXXXXX5555", 0.50, 1) # This card will be reloaded for $0.50, one time.
card2 = Card("XXXXXXXXXXXX1234", 1.25, 3) # This card will be reloaded for $1.25, three times.

# Other variables
username = "amazon_user" # Your Amazon username.
password = "amazon_pass" # Your Amazon password.
cards = [card1, card2] # The Card objects in this array will be reloaded as defined above.
chromedriver = "{}\\chromedriver.exe".format(os.getcwd()) # The file path to your chromedriver. By default, it will look in your current working directory for a file named chromedriver.exe.