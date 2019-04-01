module.exports = class Card {
    constructor(options = {}) {
        options.lastFour = options.cardNumber.slice(-4)
        Object.assign(this, options)
    }
}