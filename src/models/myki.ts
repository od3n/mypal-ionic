import * as moment from 'moment';

export namespace Myki {
    export class Account {
        holder: string;
        cards: Array<Card>;

        constructor() {
            this.cards = []
        }
    }

    export class Card {
        loaded: boolean = false;
        transactionLoaded: boolean = false;
        holder: string;
        id: string;
        type: CardType;
        expiry: Date;
        status: CardStatus;
        moneyBalance: number;
        moneyTopupInProgress: number;
        moneyTotalBalance: number;
        passActive: string;
        passActiveEnabled: boolean;
        passActiveExpiry: Date;
        passInactive: string;
        lastTransactionDate: Date;
        autoTopup: boolean;
        transactions: Array<Transaction>;

        constructor() {
            this.transactions = []
        }

        idFormatted(): string {
            // production: use real card ID
            let cardId = this.id

            // development: override card ID to be random number
            //let cardId = this.id.substr(0, 5) + "1234567890"

            return `${cardId.substr(0, 1)} ${cardId.substr(1, 5)} ${cardId.substr(6, 4)} ${cardId.substr(10, 4)} ${cardId.substr(14, 1)}`
        }

        setType(type: string) {
            switch (type) {
                case 'Full Fare':
                    this.type = CardType.FullFare;
                    break;
                case 'Concession':
                    this.type = CardType.Concession;
                    break;
                case 'Children':
                    this.type = CardType.Children;
                    break;
                case 'Seniors':
                    this.type = CardType.Seniors;
                    break;
                default:
                    throw new Error('Invalid card type')
            }
        }

        typeToString(): string {
            switch (this.type) {
                case CardType.FullFare:
                    return "Full fare";
                case CardType.Concession:
                    return "Concession";
                case CardType.Children:
                    return "Children";
                case CardType.Seniors:
                    return "Seniors";
                default:
                    return '';
            }
        }

        passActiveFriendlyText(): string {
            if (!this.passActiveExpiry)
                return 'No pass'

            let daysLeft = moment(this.passActiveExpiry).startOf('day').diff(moment(), 'days') + 1;
            return `${daysLeft} days left`
        }
    }

    export class Transaction {
        dateTime: Date;
        type: TransactionType;
        service: TransactionService;
        zone: string;
        description: string;
        credit: number;
        debit: number;
        moneyBalance: number;

        setType(type: string) {
            switch (type) {
                case 'Touch on':
                    this.type = TransactionType.TouchOn;
                    break;
                case 'Touch off':
                    this.type = TransactionType.TouchOff;
                    break;
                case 'Touch off (Default Fare)':
                    this.type = TransactionType.TouchOffDefaultFare;
                    break;
                case 'Top up myki pass':
                    this.type = TransactionType.TopUpPass;
                    break;
                case 'Top up myki money':
                    this.type = TransactionType.TopUpMoney;
                    break;
                default:
                    throw new Error('Invalid transaction type')
            }
        }

        typeToString(): string {
            switch (this.type) {
                case TransactionType.TouchOn:
                    return "Touch on";
                case TransactionType.TouchOff:
                    return "Touch off";
                case TransactionType.TouchOffDefaultFare:
                    return "Touch off (default fare)";
                case TransactionType.TopUpPass:
                    return "Top up myki pass"
                case TransactionType.TopUpMoney:
                    return "Top up myki money";
                default:
                    return '';
            }
        }

        setService(service: string) {
            switch (service) {
                case 'Bus':
                    this.service = TransactionService.Bus;
                    break;
                case 'Train':
                    this.service = TransactionService.Train;
                    break;
                case 'Tram':
                    this.service = TransactionService.Tram;
                    break;
                case 'V/Line':
                    this.service = TransactionService.VLine;
                    break;
                case 'Auto top up':
                    this.service = TransactionService.AutoTopUp;
                    break;
                case 'Website':
                    this.service = TransactionService.Website;
                    break;
                default:
                    throw new Error('Invalid transaction service')
            }
        }

        serviceToString(): string {
            switch (this.service) {
                case TransactionService.Bus:
                    return 'Bus';
                case TransactionService.Train:
                    return 'Train';
                case TransactionService.Tram:
                    return 'Tram';
                case TransactionService.VLine:
                    return 'V/Line';
                case TransactionService.AutoTopUp:
                    return 'Auto top up';
                case TransactionService.Website:
                    return 'Website';
                default:
                    return '';
            }
        }
    }

    export enum CardType {
        FullFare,
        Concession,
        Children,
        Seniors
    }

    export enum CardStatus {
        Active,
        Replaced
    }

    export enum TransactionType {
        TouchOn,
        TouchOff,
        TouchOffDefaultFare,
        TopUpPass,
        TopUpMoney
    }

    export enum TransactionService {
        Bus,
        Train,
        Tram,
        VLine,

        AutoTopUp,
        Website,
    }
}