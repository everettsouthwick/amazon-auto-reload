// Import {Discover, DiscoverConfig} from './sites/discover';
import { Amazon, IAmazonConfig } from "./amazon";
import { Card } from "./card";
import { logger } from "./logger";
// import { Optimum } from "./optimum";

async function start(): Promise<void>
{
	logger.debug("App started");

	const configFileName: string = process.argv.length > 2 ? process.argv[2] : "../config.json";
	const config = require(configFileName);

	const cards: Card[] = loadCards(config.cards);

	const completePurchases: boolean =
		typeof config.completePurchases === "undefined" ? true : config.completePurchases;

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

	await amazonReload(config.amazon, cards, completePurchases);

	logger.debug("App finished");
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

async function amazonReload(amazonConfig: IAmazonConfig, cards: Card[], completePurchases: boolean): Promise<void>
{
	const amazon: Amazon = new Amazon(amazonConfig, completePurchases);

	await amazon.reloadCards(cards);
}

start();
