"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Sender = __importStar(require("../utils/email.connector"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * A service class for handling contact-related operations.
 */
class ContactService {
    /**
     * Sends an email with the contact information.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static sendEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, message } = req.body;
            try {
                // Send email to support
                yield Sender.sendEmail('atchison2014@gmail.com', 'Support Request', `Name: ${name}\nEmail: ${email}\nMessage: ${message}`);
                // Send acknowledgment email to the sender
                yield Sender.sendEmail(email, 'Support Request', `Thank you for contacting us. We will get back to you as soon as possible.`);
                res.status(200).json({ message: 'Email sent' });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    /**
     * Sends a password reset email.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    static sendResetPasswordEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                // Generate a reset password token
                const payload = { email };
                const secret = process.env.JWT_SECRET || 'secret';
                const options = { expiresIn: '1h' };
                const token = jsonwebtoken_1.default.sign(payload, secret, options);
                // Send the reset password email
                yield Sender.sendEmail(email, 'Reset Password', `Click here to reset your password: http://localhost:3000/account/reset-password?token=${token}&email=${email}`);
                res.status(200).json({
                    message: 'Email sent',
                    token: token
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.default = ContactService;
