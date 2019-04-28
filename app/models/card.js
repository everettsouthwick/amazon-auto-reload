'use strict';

class Card {
	constructor(card) {
		this.description = card.description;
		this.cardNumber = card.cardNumber;
		this.reloadAmount = card.reloadAmount;
		this.cardholderName = card.cardholderName;
		this.expirationMonth = card.expirationMonth;
		this.expirationYear = card.expirationYear;
		this.reloadTimes = card.reloadTimes;
		this.enabled = card.enabled;
		this.skip = !this.enabled;

		if (isNaN(this.cardNumber) || isNaN(this.reloadAmount)) {
			throw new TypeError('Invalid input card data');
		}
	}

	get lastFour() {
		return this.cardNumber.slice(-4);
	}
}

module.exports = Card;
