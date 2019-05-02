export class Card
{

	public readonly cardholderName?: string;

	public readonly cardNumber: string;
	public readonly description: string;

	public readonly enabled: boolean;

	public readonly expirationMonth?: number;

	public readonly expirationYear?: number;

	// Ideally this should be a normal getter instead
	public readonly lastFour?: string;

	public readonly reloadAmount: number;

	public reloadTimes = 1;

	public skip?: boolean;

	public constructor(
		card: Card,
	)
	{
		Object.assign(this, card);
		this.lastFour = card.cardNumber.slice(-4);
		this.skip = !card.enabled;
	}
}

// export class CardWithExpiration extends Card
// {
// 	public readonly expirationMonth: number;

// 	public readonly expirationYear: number;

// 	public constructor(
// 		cardWithExpiration: CardWithExpiration,
// 	)
// 	{
// 		super(cardWithExpiration);
// 	}
// }
