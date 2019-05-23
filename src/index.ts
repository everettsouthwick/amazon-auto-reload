import chalk from "chalk";
import { readFileSync } from "fs";
import { parse } from "json5";
import { table } from "table";

import { Card } from "./lib/card";
import { Cards } from "./lib/cards";
import { logger } from "./lib/logger";
import { Amazon } from "./sites/amazon";
// import { BankOfAmerica } from "./sites/bankOfAmerica";
// import { BarclaycardUS } from "./sites/barclaycardUS";
// import { Optimum } from "./sites/optimum";

// let bankOfAmerica: BankOfAmerica;
// let barclaycardUS: BarclaycardUS;

async function start(): Promise<void>
{
	logger.debug("App started");

	const configFilepath: string = "./config/default.json5";
	const config = parse(readFileSync(configFilepath)
		.toString());

	const cards: Cards = new Cards(config.cards);

	const completeTransactions: boolean = (config.completeTransactions == undefined) ? true : config.completeTransactions;

	// outputCardTable(cards.enabledCards(), "Before checking for card updates, cards that could be run");

	// for (const card of cards.enabledCards())
	// {
	// 	await checkForCreditCardTransactions(card, config);
	// }

	// bankOfAmerica.browser.driver.close();
	// barclaycardUS.browser.driver.close();

	// Await discoverCheckCards(cards, config.discoverPersonal);
	//
	// await discoverCheckCards(cards, config.discoverBusiness);

	// const premierMembersCreditUnion: PremierMembersCreditUnion =
	// new PremierMembersCreditUnion(config.premierMembersCreditUnion, completeTransactions);
	// await premierMembersCreditUnion.login();
	// // premierMembersCreditUnion.transferFundsToSecondAccount();
	// // const premierMembersCreditUnionBalanceToTransferOut =
	// await premierMembersCreditUnion.howMuchToTransferOutOfBank();

	// if (!isSiteCompletedInLastDay(config.merrill.lastCompletedRun))
	// {
	// 	const merrill: Merrill = new Merrill(config.merrill);
	// 	await merrill.transferOutAvailableBalance();
	// 	config.merrill.lastCompletedRun = now();
	// 	updateConfigFile(configFilepath, config);
	// }

	// const mango: Mango = new Mango(config.mango, completeTransactions);
	// mango.transferFundsToSecondAccount();
	// const mangoBalanceToTransferOut =
	// await mango.howMuchToTransferFromSecondAccount();

	outputCardTable(cards.skippedCards(), "Cards that will not be run");

	outputCardTable(cards.cardsToRun(), "Ccards that will be run");

	// const optimum: Optimum = new Optimum(config.optimum, completeTransactions);
	// await optimum.makePurchases(cards);

	const amazon: Amazon = new Amazon(config.amazon, completeTransactions);
	await amazon.reloadCards(new Cards(cards.cardsToRun()));
}

function outputCardTable(cards: Card[], tableIntroduction?: string): void
{
	if (tableIntroduction)
	{
		console.log(chalk.inverse(tableIntroduction));
	}

	const data: string[][] = [
		[
			chalk.bold("Card"),
			chalk.bold("Last four"),
			chalk.bold("Closing date"),
			chalk.bold("Don't use until"),
			chalk.bold("Transactions found"),
			chalk.bold("Reload"),
		],
	];

	for (const card of cards)
	{
		const color = card.skip ? chalk.gray : chalk;

		data.push([
			color(card.description),
			color(card.lastFour),
			color(`${card.closingDateAsString}`),
			color(card.dontUseUntilAsString),
			color(card.transactionsFoundAsString),
			color(`${card.reloadAmount.toString()}, ${card.reloadTimes.toString()} times`),
		]);
	}

	console.log(table(data));
}

// async function checkForCreditCardTransactions(card: Card, config: any): Promise<void>
// {
// 	if (card.issuer === "Bank of America")
// 	{
// 		if (!bankOfAmerica)
// 		{
// 			bankOfAmerica = new BankOfAmerica(config.bankOfAmerica);
// 		}
// 		await bankOfAmerica.checkForCreditCardTransactions(card);
// 	} else if (card.issuer === "BarclaycardUS")
// 	{
// 		if (!barclaycardUS)
// 		{
// 			barclaycardUS = new BarclaycardUS(config.barclaycardUS);
// 		}
// 		await barclaycardUS.checkForCreditCardTransactions(card);
// 	} else if (card.issuer)
// 	{
// 		logger.warning(`Issuer ${card.issuer} not recognized for ${card.friendlyReference}`);
// 	}
// }

// function isSiteCompletedInLastDay(lastCompletedRunString: string): boolean
// {
// 	// logger.debug(`lastCompletedRun ${lastCompletedRun}`);

// 	const lastCompletedRun = DateTime.fromISO(lastCompletedRunString);

// 	// let lastCompletedRunDate: DateTime = DateTime.fromISO(lastCompletedRun);
// 	if (!lastCompletedRun)
// 	{
// 		return false;
// 	}
// 	logger.debug(`lastCompletedRunDate: ${lastCompletedRun}`);

// 	const today: DateTime = DateTime.local();

// 	const timeSinceLastRun: Duration = today.diff(lastCompletedRun);
// 	const completedInLastDay: boolean = (timeSinceLastRun.as("days") < 1);

// 	// if (completedInLastDay)
// 	// {
// 	// 	logger.info(`Skipping current site as it was last run at ${lastCompletedRunDate}`);
// 	// }

// 	return completedInLastDay;
// }

// function updateConfigFile(configFilepath: string, config: any)
// {
// 	const spacesInOutput: number = 4;
// 	const json5string: string = stringify(config, undefined, spacesInOutput);
// 	writeFileSync(configFilepath, json5string);
// }

// function now(): string
// {
// 	return DateTime.local().toISO();
// }

// Async function discoverCheckCards(cards: Card[], login: DiscoverConfig)
// {
// 	const discover = new Discover(login);
//
// 	await discover.checkCards(cards);
// }

start();
