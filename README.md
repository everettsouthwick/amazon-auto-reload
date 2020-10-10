![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightscreen.svg)

This script automates the process of reloading Amazon gift card balances with configurable amounts and transactions per execution. This is useful to maximize credit and/or debit card rewards or to prevent the closure of a credit card account due to inactivity.

## Dependencies

- [Node.js](https://nodejs.org/)
- Chrome or Firefox desktop browser installed

## Getting Started
1. Clone or download the project
2. Copy [`config/default-example.json5`](config/default-example.json5) to `config/default.json5` and modify it with your details
3. Execute `npm install && npm run build && npm start`

## Features

* Allows you to use Chrome and Firefox
* Browser is visible to provide peace of mind as to what is happening
* Configurable/extensible

## Docker

Includes a Docker configuration. To utilize:

1. Execute `npm run docker:build && npm run docker:run`
2. You then need to VNC into port 5900, open a shell, and execute `npm start`

Ideally we would start our app as soon as we run our Docker image, removing the need for step 2, but haven't yet been able to make it work - the desktop browsers error out when instantiated. Perhaps they're being instantiated before the desktop interface within the Docker container is ready?

## TODO

- Add tests
- Try for a more attractive code approach to the code's many webdriver action calls
- Create a scheduler 

## Acknowledgements

Browser / Site class model inspired by [typescript-selenium-example](/goenning/typescript-selenium-example)

## Similar

- [debbit](https://github.com/jakehilborn/debbit)
- [amazon-reload-balance](https://github.com/rhobot/amazon-reload-balance)

## Rewrite history

A rewritten version of this app using Typescript was released in 2019-05. A rewritten version of this app using Node.js was released on 2019-04-01. To find the original python version, see the branch [`deprecated-python`](../../tree/deprecated-python). The Python version won't receive further updates/support.
