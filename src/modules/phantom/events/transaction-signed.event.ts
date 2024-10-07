export class TransactionSignedEvent {
  constructor(
    public readonly signature: string,
    public readonly chatId: number,
  ) {}
}
