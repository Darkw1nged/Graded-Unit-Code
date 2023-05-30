import { Navigate } from "react-router-dom";
import { paymentIntent } from "../utils/payment-intent-utils";

const checkout = async (total: number) => {
    try {
        const client_secret: unknown = await paymentIntent(
            'http://localhost:5000/api/v1/secret', total
        )
    } catch (error) {
        alert('An error has occurred; try again later!')
    }
};