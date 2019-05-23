import { Card } from "./card";

export class Cards
{
	public readonly cardArray: Card[];

	public constructor(cards?: Card[])
	{
		this.cardArray = new Array();

		if (cards !== undefined)
		{
			cards.forEach((card: Card) =>
			{
				this.cardArray.push(new Card(card));
			});
		}
	}

	public cardsToRun(): Card[]
	{
		const nonSkippedCards: Card[] = new Array();

		for (const card of this.cardArray)
		{
			if (!card.skip)
			{
				nonSkippedCards.push(card);
			}
		}

		return nonSkippedCards;
    }

	public enabledCards(): Card[]
	{
		const enabledCards: Card[] = new Array();

		for (const card of this.cardArray)
		{
			if (card.enabled)
			{
				enabledCards.push(card);
			}
		}

		return enabledCards;
    }

	public skippedCards(): Card[]
		{
			const skippedCards: Card[] = new Array();

			for (const card of this.cardArray)
			{
				if (card.skip)
				{
					skippedCards.push(card);
				}
			}

			return skippedCards;
			}

}
