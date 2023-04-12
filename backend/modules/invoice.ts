export default class Invoice {

    /**
     * The invoice number
     * @type {number}
     * @memberof Invoice
     * @description The invoice number
     */
    invoiceNumber: number;

    /**
     * The booking number
     * @type {number}
     * @memberof Invoice
     * @description The booking number
     */
    bookingNumber: number;

    /**
     * The payment number
     * @type {number}
     * @memberof Invoice
     * @description The payment number
     */
    paymentNumber: number;

    /**
     * The date issued
     * @type {Date}
     * @memberof Invoice
     * @description The date issued
     */
    dateIssued: Date;

    /**
     * The date due
     * @type {Date}
     * @memberof Invoice
     * @description The date due
     * @default 30 days after the date issued
     */
    dateDue: Date;

    /**
     * The date paid
     * @type {Date}
     * @memberof Invoice
     * @description The date paid
     * @nmullable
     */
    datePaid: Date;

    /**
     * The amount
     * @type {number}
     * @memberof Invoice
     * @description The amount
     */
    amount: number;

    /**
     * The constructor for the invoice class
     * @description The constructor for the invoice class
     * @param {number} invoiceNumber - The invoice number
     * @param {number} bookingNumber - The booking number
     * @param {number} paymentNumber - The payment number
     * @param {Date} dateIssued - The date issued
     * @param {Date} dateDue - The date due
     * @param {Date} datePaid - The date paid
     * @param {number} amount - The amount
     * @memberof Invoice
     * @constructor
     */
    constructor(invoiceNumber: number, bookingNumber: number, paymentNumber: number, dateIssued: Date, dateDue: Date, datePaid: Date, amount: number) {
        this.invoiceNumber = invoiceNumber;
        this.bookingNumber = bookingNumber;
        this.paymentNumber = paymentNumber;
        this.dateIssued = dateIssued;
        this.dateDue = dateDue;
        this.datePaid = datePaid;
        this.amount = amount;
    }

}