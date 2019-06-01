import accounting from "accounting";
import chalk from "chalk";
import { readFileSync } from "fs";
import { Answers, prompt } from "inquirer";
import { parse } from "json5";
import { table } from "table";

import { Card } from "./lib/card";
import { Cards } from "./lib/cards";
// import { logger } from "./lib/logger";
import { Amazon } from "./sites/amazon";
// import { BankOfAmerica } from "./sites/bankOfAmerica";
// import { BarclaycardUS } from "./sites/barclaycardUS";
// import { CapitalOne } from "./sites/capitalOne";
// import { Discover } from "./sites/discover";
// import { Mango } from "./sites/mango";
// import { Mint } from "./sites/mint";
// import { Optimum } from "./sites/optimum";
// import { PenFed } from "./sites/penFed";
// import { USBank } from "./sites/usBank";

// let bankOfAmerica: BankOfAmerica;
// let barclaycardUS: BarclaycardUS;
// let discoverPersonal: Discover;
// let discoverBusiness: Discover;
// let usBank: USBank;
// let penFed: PenFed;
// let capitalOne: CapitalOne;

async function start(): Promise<void>
{
	const configFilepath: string = "./config/default.json5";
	const config = parse(readFileSync(configFilepath)
		.toString());

	const cards: Cards = new Cards(config.cards);

	const completeTransactions: boolean =
		(config.completeTransactions == undefined) ? true : config.completeTransactions;
	const confirmBeforePurchases: boolean =
		(config.confirmBeforePurchases == undefined) ? false : config.confirmBeforePurchases;

	// outputCardTable(cards.enabledCards(), "Before checking for card updates, cards that could be run");

	// const mango: Mango = new Mango(config.mango);
	// await mango.transferFundsToSecondAccount();

	// for (const card of cards.enabledCards())
	// {
	// 	await checkForCreditCardTransactions(card, config);
	// }

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

	// const mangoBalanceToTransferOut =
	// await mango.howMuchToTransferFromSecondAccount();

	// outputCardTable(cards.skippedCards(), "After checking for card updates, cards that will not be run");

	outputCardTable(cards.cardsToRun(), "Cards that will be run");
	// const loadSitePromises: Array<Promise<void>> = [];
	// const mint: Mint = new Mint(config.mint);
	// loadSitePromises.push(mint.login());

	if (confirmBeforePurchases)
	{
		const answers: Answers = await prompt({
			type: "confirm",
			name: "makePurchases",
			message: "Make purchases using the still-enabled cards?",
		});

		if (!answers.makePurchases)
		{
			// closeBrowsers();
			return;
		}
	}

	// const optimum: Optimum = new Optimum(config.optimum, completeTransactions);
	// await optimum.makePurchases(cards);

	// outputCardTable(cards.cardsToRun(), "After running Optimum, cards that remain to be run");

	const amazon: Amazon = new Amazon(config.amazon, completeTransactions);
	await amazon.reloadCards(new Cards(cards.cardsToRun()));

	// closeBrowsers();
}

// async function closeBrowsers(): Promise<void>
// {
	// if (bankOfAmerica)
	// {
	// 	bankOfAmerica.browser.driver.close();
	// }
	// if (barclaycardUS)
	// {
	// 	barclaycardUS.browser.driver.close();
	// }
	// if (discoverPersonal)
	// {
	// 	discoverPersonal.browser.driver.close();
	// }
	// if (discoverBusiness)
	// {
	// 	discoverBusiness.browser.driver.close();
	// }
	// if (usBank)
	// {
	// 	usBank.browser.driver.close();
	// }
	// if (penFed)
	// {
	// 	penFed.browser.driver.close();
	// }
	// if (capitalOne)
	// {
	// 	capitalOne.browser.driver.close();
	// }
// }

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
			chalk.bold("Status"),
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
			color(card.status()),
			color(card.closingDateAsString),
			color(card.dontUseUntilAsString),
			color(card.transactionsFoundAsString),
			color(`${accounting.formatMoney(card.reloadAmount)}, ${card.reloadTimes.toString()} times`),
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
// 	}
// 	else if (card.issuer === "BarclaycardUS")
// 	{
// 		if (!barclaycardUS)
// 		{
// 			barclaycardUS = new BarclaycardUS(config.barclaycardUS);
// 		}
// 		await barclaycardUS.checkForCreditCardTransactions(card);
// 	}
// 	else if (card.issuer === "Discover Personal")
// 	{
// 		if (!discoverPersonal)
// 		{
// 			discoverPersonal = new Discover(config.discoverPersonal);
// 		}
// 		await discoverPersonal.checkForCreditCardTransactions(card);
// 	}
// 	else if (card.issuer === "Discover Business")
// 	{
// 		if (!discoverBusiness)
// 		{
// 			discoverBusiness = new Discover(config.discoverBusiness);
// 		}
// 		await discoverBusiness.checkForCreditCardTransactions(card);
// 	}
// 	else if (card.issuer === "US Bank")
// 	{
// 		if (!usBank)
// 		{
// 			usBank = new USBank(config.discoverBusiness);
// 		}
// 		await usBank.checkForCreditCardTransactions(card);
// 	}
// 	else if (card.issuer === "PenFed")
// 	{
// 		if (!penFed)
// 		{
// 			penFed = new PenFed(config.penFed);
// 		}
// 		await penFed.checkForCreditCardTransactions(card);
// 	}
// 	else if (card.issuer === "Capital One")
// 	{
// 		if (!capitalOne)
// 		{
// 			capitalOne = new CapitalOne(config.capitalOne);
// 		}
// 		await capitalOne.checkForCreditCardTransactions(card);
// 	}
// 	else if (card.issuer)
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

start();
