import config from "config";

import { Amazon, IAmazonConfig } from "./amazon";
import { Card } from "./card";
import { logger } from "./logger";
// Import { Discover, DiscoverConfig } from './discover';
// import { Optimum } from "./optimum";

async function start(): Promise<void>
{
	logger.debug("App started");

	const cards: Card[] = loadCards(config.get("cards"));

	const completeTransactions: boolean =
		config.has("completeTransactions") ? config.get("completeTransactions") : true;

	// Await discoverCheckCards(cards, config.discoverPersonal);
	//
	// await discoverCheckCards(cards, config.discoverBusiness);

	for (const card of cards)
	{
		if (!card.skip)
		{
			logger.debug(`Planning/working to make a purchase using ${card.description} ending in ${card.lastFour}.`);
		}
	}

	// await optimumReload(cards);

	// const mango: Mango = new Mango(config.get("mango"), completeTransactions);
	// mango.transferFunds();

	await amazonReload(config.get("amazon"), cards, completeTransactions);

	logger.debug("All requests submitted");
}

function loadCards(cardConfig: Card[]): Card[]
{
	const cardArray: Card[] = [];

	cardConfig.forEach((card: Card) =>
	{
		cardArray.push(new Card(card));
	});

	return cardArray;
}

async function amazonReload(amazonConfig: IAmazonConfig, cards: Card[], completeTransactions: boolean): Promise<void>
{
	const amazon: Amazon = new Amazon(amazonConfig, completeTransactions);

	await amazon.reloadCards(cards);
}

// Async function discoverCheckCards(cards: Card[], login: DiscoverConfig)
// {
// 	const discover = new Discover(login);
//
// 	await discover.checkCards(cards);
// }

// async function optimumReload(cards: Card[]): Promise<void> {
// 	const optimum = new Optimum(config.optimum);

// 	await optimum.makePurchases(cards);
// }

start();
