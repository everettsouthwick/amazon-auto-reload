// Consider merging this into the Site class?
export class BankAccount {
	public readonly accountName: string;
	public readonly accountNumber: string;

	public constructor(bankAccount: BankAccount)
	{
		this.accountName = bankAccount.accountName;
		this.accountNumber = bankAccount.accountNumber;
	}

	public get lastFour(): string
	{
        return this.accountNumber.slice(-4);
    }
}
