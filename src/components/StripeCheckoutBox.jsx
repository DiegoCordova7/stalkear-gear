import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { confirmOrderPayment } from '../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function PaymentForm({ order, onPaid, onCancel }) {
    const stripe = useStripe();
    const elements = useElements();
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setSubmitting(true);
        setErrorMsg(null);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
            });

            if (error) {
                setErrorMsg(error.message || 'Error al procesar el pago con tarjeta.');
                setSubmitting(false);
                return;
            }

            if (paymentIntent && paymentIntent.status === 'succeeded') {
                const confirmedOrder = await confirmOrderPayment(order.id);
                onPaid(confirmedOrder);
            } else {
                setErrorMsg(`Estado del pago: ${paymentIntent?.status || 'desconocido'}`);
                setSubmitting(false);
            }
        } catch (err) {
            setErrorMsg(err.message || 'No se pudo confirmar el pago en el servidor.');
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handlePaymentSubmit} className="tactical-stripe-form">
            <div style={{ marginBottom: '0.75rem', fontFamily: 'monospace' }}>
                <strong>ORDEN:</strong> {order.id} — <strong>TOTAL:</strong> ${Number(order.totalAmount).toLocaleString()} MXN
            </div>

            <PaymentElement />

            {errorMsg && <div className="tactical-alert error" style={{ marginTop: '0.75rem' }}>{errorMsg}</div>}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="tactical-clear-btn"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={!stripe || submitting}
                    className="tactical-btn tactical-checkout-btn"
                >
                    {submitting ? 'VERIFICANDO PAGO...' : `PAGAR $${Number(order.totalAmount).toLocaleString()} MXN`}
                </button>
            </div>
        </form>
    );
}

export const StripeCheckoutBox = ({ order, clientSecret, onPaid, onCancel }) => {
    if (!order || !clientSecret) return null;

    return (
        <div className="tactical-stripe-panel" style={{ marginTop: '1.5rem', padding: '1.25rem', border: '1px solid #374151', borderRadius: '8px' }}>
            <h2 className="tactical-cart-title" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                PAGO SEGURO CON STRIPE
            </h2>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm order={order} onPaid={onPaid} onCancel={onCancel} />
            </Elements>
        </div>
    );
};