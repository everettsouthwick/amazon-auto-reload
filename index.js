'use strict';

const config = require('./config.json');
const Card = require('./app/models/card');
const logger = require('./utils/logger');

async function start() {
	logger.debug('We just started!');

	const cards = loadCards(config.cards);

	for (const card of cards) {
		if (!card.skip) {
			logger.debug(`I'm planning/working to make a purchase using ${card.description} ending in ${card.lastFour}.`);
		}
	}

	await amazonReload(cards);
}

function loadCards(cardConfig) {
	const cardArray = [];

	cardConfig.forEach(card => {
		cardArray.push(new Card(card));
	});

	return cardArray;
}

async function amazonReload(cards) {
	if (arguments.length !== 1) {
		throw new Error('incorrect number of parameters to amazonReload');
	}

	const Amazon = require('./app/amazon');

	const amazon = new Amazon(config.amazon);

	await amazon.reloadCards(cards);
}

start();
