import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Myki } from '../../models/myki';

@Component({
  selector: 'transaction',
  templateUrl: 'transaction.html'
})
export class TransactionComponent {

  @Input() transaction: Myki.Transaction

  constructor(
    public currencyPipe: CurrencyPipe
  ) {
  }

  isTouchOn(): boolean {
    switch (this.transaction.type) {
      case Myki.TransactionType.TouchOn:
        return true;
      default:
        return false;
    }
  }

  isTouchOff(): boolean {
    switch (this.transaction.type) {
      case Myki.TransactionType.TouchOff:
      case Myki.TransactionType.TouchOffDefaultFare:
        return true;
      default:
        return false;
    }
  }

  isTopup(): boolean {
    switch (this.transaction.type) {
      case Myki.TransactionType.TopUpPass:
      case Myki.TransactionType.TopUpMoney:
        return true;
      default:
        return false;
    }
  }

  isTransport(): boolean {
    return this.isTouchOn() || this.isTouchOff()
  }

  isServiceTrain(): boolean {
    return this.transaction.service === Myki.TransactionService.Train;
  }

  isServiceBus(): boolean {
    return this.transaction.service === Myki.TransactionService.Bus;
  }

  isServiceTram(): boolean {
    return this.transaction.service === Myki.TransactionService.Tram;
  }

  isServiceVLine(): boolean {
    return this.transaction.service === Myki.TransactionService.VLine;
  }

  isPassTransaction(): boolean {
    return isNaN(this.transaction.moneyBalance) && this.isTouchOff()
  }

  isMoneyTransaction(): boolean {
    return this.transaction.debit && this.isTouchOff()
  }

  isTopupMoney(): boolean {
    return this.transaction.type === Myki.TransactionType.TopUpMoney
  }

  isTopupPass(): boolean {
    return this.transaction.type === Myki.TransactionType.TopUpPass
  }

  transactionDescription(): string {
    // different text for myki money top isTopup
    if (this.isTopupMoney()){
      let credit = this.currencyPipe.transform(this.transaction.credit, "USD", true)
      let balance = this.currencyPipe.transform(this.transaction.moneyBalance, "USD", true)
      return `${credit} (Balance ${balance})`
    }

    return this.transaction.description
  }

}
