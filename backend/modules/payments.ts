/**
 * The payment class
 * @class
 * @memberof backend 
 * @description The payment class
 * @property {number} paymentNumber - The payment number
 * @property {string} cardType - The card type
 * @property {string} cardNumber - The card number
 * @property {number} amount - The amount
 * @property {Date} expiryDate - The expiry date
 * @property {string} securityNumber - The security number
 */
export default class Payment {

    /**
     * The payment number
     * @type {number}
     * @memberof Payment
     * @description The payment number
    */
    paymentNumber: number;

    /**
     * The card type
     * @type {string}
     * @private
     * @memberof Payment
     * @description The card type
     */
    private cardType: string;

    /**
     * The card number
     * @type {string}
     * @private
     * @memberof Payment
     * @description The card number
     */
    private cardNumber: string;

    /**
     * The amount
     * @type {number}
     * @private
     * @memberof Payment
     * @description The amount
     */
    private amount: number;

    /**
     * The expiry date
     * @type {Date}
     * @private
     * @memberof Payment
     * @description The expiry date
     */
    private expiryDate: Date;

    /**
     * The security number
     * @type {string}
     * @private
     * @memberof Payment
     * @description The security number
     */
    private securityNumber: string;

    /**
     * the constructor for the payment class
     * @param {number} paymentNumber - The payment number
     * @param {string} cardType - The card type
     * @param {string} cardNumber - The card number
     * @param {number} amount - The amount
     * @param {Date} expiryDate - The expiry date
     * @param {string} securityNumber - The security number
     * @memberof Payment
     * @description The constructor for the payment class
     */
    constructor(paymentNumber: number, cardType: string, cardNumber: string, amount: number, expiryDate: Date, securityNumber: string) {
        this.paymentNumber = paymentNumber;
        this.cardType = cardType;
        this.cardNumber = cardNumber;
        this.amount = amount;
        this.expiryDate = expiryDate;
        this.securityNumber = securityNumber;
    }

}