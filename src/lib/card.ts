import { number, validate } from "@hapi/joi";
import { DateTime } from "luxon";

export type Issuer = "Bank of America" | "BarclaycardUS";

export class Card
{
	public set closingDate(newClosingDate: DateTime | undefined)
	{
		this._closingDate = newClosingDate;

		if (newClosingDate === undefined)
		{
			// There's no point in doing anything further
			return;
		}

		if (this.useBeforeCloseMaxDays)
		{
			const today: DateTime = DateTime.local();

			if (today < this.dontUseUntil)
			{
				// logger.info(
				// 	`${this.friendlyReference}: Before cutoff ${this.dontUseUntil.toISODate()} (${this.useBeforeCloseMaxDays} before ${this.closingDate.toISODate()} close). Skipping card.`);
				this.skip = true;
			}
			// else
			// {
			// 	logger.info(`${this.friendlyReference}: Now (${today.toISODate()}) is after cutoff ${this.dontUseUntil.toISODate()}`);
			// }
		}

	}

	public get closingDate(): DateTime | undefined
	{
		return this._closingDate;
	}

	public get closingDateAsString(): string
	{
		if (!this.closingDate)
		{
			return "Unknown";
		}

		return this.closingDate.toISODate();
	}

	private get dontUseUntil(): DateTime
	{
		let dontUseCardUntil: DateTime = DateTime.fromSeconds(0);

		if (this.closingDate !== undefined)
		{
			if (this.useBeforeCloseMaxDays)
			{
				dontUseCardUntil = this.closingDate.minus({ days: this.useBeforeCloseMaxDays });
			}
		}
		else
		{
			throw new Error(("Next statement date undefined"));
		}

		return dontUseCardUntil;
	}

	public get dontUseUntilAsString(): string
	{
		if (this.useBeforeCloseMaxDays === undefined)
		{
			return "N/A";
		}

		if (!this.closingDate)
		{
			return `${this.useBeforeCloseMaxDays} days before close`;
		}

		return this.dontUseUntil.toISODate();

	}

	public get friendlyReference(): string
	{
		return `${this.description} ending in ${this.lastFour}`;
	}

	public get lastFour(): string
	{
		return this.cardNumber.slice(-4);
	}

	public set reloadTimes(newReloadTimes: number)
	{
		validate(newReloadTimes, number().integer()
			.min(0));
		this._reloadTimes = newReloadTimes;
	}

	public get reloadTimes(): number
	{
		return this._reloadTimes;
	}

	public get shortDescription(): string
	{
		if (this.description.length > 10)
		{
			return `${this.description.substring(0, 4)}..${this.description.slice(-4)}${this.cardNumber.slice(-3)}`;
		}

		return `${this.description}${this.lastFour}`;
	}

	public get transactionsFoundAsString(): string
	{
		if (this.transactionsFound !== undefined)
		{
			return this.transactionsFound.toString();
		}

		return "Unknown";
	}
	public readonly cardholderName?: string;

	public readonly cardNumber: string;
	public readonly creditLimit?: number;
	public readonly description: string;

	public readonly enabled: boolean;

	public readonly expirationMonth?: number;

	public readonly expirationYear?: number;

	public readonly issuer?: Issuer;

	public readonly reloadAmount: number;

	public skip: boolean;

	public transactionsFound?: boolean;

	public readonly useBeforeCloseMaxDays?: number;

	private _closingDate?: DateTime;

	private _reloadTimes: number = 1;

	public constructor(card: Card)
	{
		this.cardholderName = card.cardholderName;
		this.cardNumber = card.cardNumber;
		this.description = card.description;
		this.enabled = card.enabled;
		this.expirationMonth = card.expirationMonth;
		this.expirationYear = card.expirationYear;
		this.reloadAmount = card.reloadAmount;
		this.reloadTimes = card.reloadTimes;
		this.useBeforeCloseMaxDays = card.useBeforeCloseMaxDays;
		this.issuer = card.issuer;
		this.closingDate = card.closingDate;
		this.creditLimit = card.creditLimit;

		this.skip = !card.enabled;
	}

	public status(): string
	{
		if (!this.enabled)
		{
			return "Disabled";
		}
		if (this.skip)
		{
			return "Skipped";
		}

		return "Enabled";
	}

}
