# amazon-auto-reload

This script automates the process of reloading Amazon gift cards with configurable amounts and transactions per execution. This is useful to maximize credit and/or debit card rewards or to prevent the closure of a credit account due to inactivity.

## Rewrite

This app has been rewritten using Node. To find the original python version, see the branch `deprecated-python`. This branch will not receive further updates or support.

## Dependencies

- Node v10.15.3 or newer
- Selenium
- [geckodriver](https://www.npmjs.com/package/geckodriver)

## Instructions

1. Download the required packages by typing `npm install` into your command line in the root directory
2. Create and/or modify `config.json` in the root directory with your Amazon credentials and the cards you wish to reload
```json
{
    "amazon": {
        "username": "example@example.com",
        "password": "myPassword",
        "reloadDelay": 300
        },
    "cards": [
        {
            "description": "Acme Bank Gold Card",
            "cardNumber": "4111111111111111",
            "reloadAmount": 10.00,
            "expirationMonth": 0,
            "expirationYear": 0,
            "reloadTimes": 1,
            "enabled": true
        },
        {
            "description": "Acme Bank Platinum Card",
            "cardNumber": "5500000000000004",
            "reloadAmount": 10.00,
            "expirationMonth": 12,
            "expirationYear": 2024,
            "reloadTimes": 1,
            "enabled": true
        }
    ]
}
```
3. Execute `index.js`

## TODO

- Create a scheduler of some kind 