# amazon-auto-reload

This script automates the process of reloading Amazon gift cards with configurable amounts and transactions per execution. This is useful to maximize credit and/or debit card rewards or to prevent the closure of a credit account due to inactivity.

## Dependencies

- Node
- Selenium
- Chromedriver

## Instructions

1. Download the required packages by typing `npm install` into your command line in the root directory
2. Download [Chromedriver](https://sites.google.com/a/chromium.org/chromedriver/) and place into the root directory
3. Create and/or modify `config.json` in the root directory with your Amazon credentials and the cards you wish to reload
```json
{
    "username": "amazon_username",
    "password": "amazon_password",
    "cards": [
        { 
            "cardNumber": "XXXXXXXXXXXX5555", 
            "reloadAmount": 0.50,
            "reloadTimes": 1,
            "enabled": false
        },
        {
            "cardNumber": "XXXXXXXXXXXX1234", 
            "reloadAmount": 1.25,
            "reloadTimes": 3,
            "enabled": true
        }
    ],
    "reloadDelay": 300
}
```
4. Execute `index.js`

## TODO

- Create a scheduler of some kind