# amazon-auto-reload

This script automates the process of reloading Amazon gift cards with configurable amounts and transactions per execution. This is useful to maximize credit and/or debit card rewards or to prevent the closure of a credit account due to inactivity.

## Dependencies

- Node v10.15.3 or newer
- Chrome or Firefox

## Instructions

In the application's directory:
1. Copy `config/default-example.json` to `config/default.json` and modify it with your Amazon credentials and the cards you wish to reload
```json
{
    "amazon": {
        "username": "example@example.com",
        "password": "myPassword",
        "reloadDelayInSeconds": 30
        },
    "cards": [
        {
            "description": "Acme Bank Gold Card",
            "cardNumber": "4111111111111111",
            "reloadAmount": 10.00,
            "enabled": false,
            "reloadTimes": 1
        },
        {
            "description": "Acme Bank Platinum Card",
            "cardNumber": "5500000000000004",
            "reloadAmount": 10.00,
            "enabled": true,
            "reloadTimes": 1
        }
    ]
}
```
2. From the command line, execute `npm run install-and-build`
3. From the command line, execute `npm start`

## Features

* Allows you to use Chrome and Firefox
* Browser is visible to provide peace of mind as to what is happening
* Configurable/extensible

## TODO

- Implement software testing
- Create a scheduler of some kind 
- Try for a more attractive code approach to the code's many webdriver action calls

## Rewrite history

A rewritten version of this app using Typescript was released in 2019-05. A rewritten version of this app using Node.js was released on 2019-04-01. To find the original python version, see the branch [`deprecated-python`](../../tree/deprecated-python). The Python version will not receive further updates or support.

## Acknowledgements

Browser / Site class model inspired by https://github.com/goenning/typescript-selenium-example

## Similar

https://github.com/rhobot/amazon-reload-balance