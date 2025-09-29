import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

class StripeService {
    constructor() {
        this.stripe = null;
        this.publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
        this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    }

    async initialize() {
        try {
            if (!this.publishableKey) {
                throw new Error('Stripe publishable key no configurada');
            }

            this.stripe = await loadStripe(this.publishableKey);
            console.log('Stripe inicializado correctamente');

        } catch (error) {
            console.error('Error inicializando Stripe:', error);
            throw error;
        }
    }

    /**
     * Crea un PaymentIntent para comprar tokens EURO
     * @param {number} amount - Cantidad en euros (ej: 10.50)
     * @param {string} customerEmail - Email del cliente
     * @returns {Promise<Object>} - PaymentIntent creado
     */
    async createPaymentIntent(amount, customerEmail) {
        try {
            const response = await axios.post(`${this.apiUrl}/api/stripe/create-payment-intent`, {
                amount: Math.round(amount * 100), // Convertir a centavos
                currency: 'eur',
                customer_email: customerEmail,
                metadata: {
                    type: 'token_purchase',
                    timestamp: Date.now()
                }
            });

            return response.data;

        } catch (error) {
            console.error('Error creando PaymentIntent:', error);
            throw new Error('Error al crear el pago');
        }
    }

    /**
     * Procesa el pago con Stripe
     * @param {string} clientSecret - Client secret del PaymentIntent
     * @param {Object} paymentMethod - Método de pago
     * @returns {Promise<Object>} - Resultado del pago
     */
    async processPayment(clientSecret, paymentMethod) {
        try {
            if (!this.stripe) {
                await this.initialize();
            }

            const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod
            });

            if (error) {
                throw new Error(error.message);
            }

            return paymentIntent;

        } catch (error) {
            console.error('Error procesando pago:', error);
            throw error;
        }
    }

    /**
     * Crea un SetupIntent para guardar métodos de pago
     * @param {string} customerEmail - Email del cliente
     * @returns {Promise<Object>} - SetupIntent creado
     */
    async createSetupIntent(customerEmail) {
        try {
            const response = await axios.post(`${this.apiUrl}/api/stripe/create-setup-intent`, {
                customer_email: customerEmail
            });

            return response.data;

        } catch (error) {
            console.error('Error creando SetupIntent:', error);
            throw new Error('Error al configurar el método de pago');
        }
    }

    /**
     * Confirma un SetupIntent
     * @param {string} clientSecret - Client secret del SetupIntent
     * @param {Object} paymentMethod - Método de pago
     * @returns {Promise<Object>} - Resultado del setup
     */
    async confirmSetupIntent(clientSecret, paymentMethod) {
        try {
            if (!this.stripe) {
                await this.initialize();
            }

            const { error, setupIntent } = await this.stripe.confirmCardSetup(clientSecret, {
                payment_method: paymentMethod
            });

            if (error) {
                throw new Error(error.message);
            }

            return setupIntent;

        } catch (error) {
            console.error('Error confirmando SetupIntent:', error);
            throw error;
        }
    }

    /**
     * Crea un PaymentIntent para retirar tokens
     * @param {number} amount - Cantidad en euros a retirar
     * @param {string} customerEmail - Email del cliente
     * @param {string} accountId - ID de la cuenta de destino
     * @returns {Promise<Object>} - PaymentIntent creado
     */
    async createWithdrawalPayment(amount, customerEmail, accountId) {
        try {
            const response = await axios.post(`${this.apiUrl}/api/stripe/create-withdrawal-payment`, {
                amount: Math.round(amount * 100), // Convertir a centavos
                currency: 'eur',
                customer_email: customerEmail,
                destination_account: accountId,
                metadata: {
                    type: 'token_withdrawal',
                    timestamp: Date.now()
                }
            });

            return response.data;

        } catch (error) {
            console.error('Error creando pago de retiro:', error);
            throw new Error('Error al crear el pago de retiro');
        }
    }

    /**
     * Obtiene el historial de pagos de un cliente
     * @param {string} customerEmail - Email del cliente
     * @returns {Promise<Array>} - Historial de pagos
     */
    async getPaymentHistory(customerEmail) {
        try {
            const response = await axios.get(`${this.apiUrl}/api/stripe/payment-history`, {
                params: { customer_email: customerEmail }
            });

            return response.data;

        } catch (error) {
            console.error('Error obteniendo historial de pagos:', error);
            throw new Error('Error al obtener el historial de pagos');
        }
    }

    /**
     * Obtiene información de un pago específico
     * @param {string} paymentIntentId - ID del PaymentIntent
     * @returns {Promise<Object>} - Información del pago
     */
    async getPaymentInfo(paymentIntentId) {
        try {
            const response = await axios.get(`${this.apiUrl}/api/stripe/payment-info`, {
                params: { payment_intent_id: paymentIntentId }
            });

            return response.data;

        } catch (error) {
            console.error('Error obteniendo información del pago:', error);
            throw new Error('Error al obtener información del pago');
        }
    }

    /**
     * Calcula las comisiones de Stripe
     * @param {number} amount - Cantidad en euros
     * @returns {Object} - Desglose de comisiones
     */
    calculateFees(amount) {
        const amountInCents = Math.round(amount * 100);

        // Comisiones de Stripe para EUR
        const stripeFee = Math.round(amountInCents * 0.014 + 25); // 1.4% + 0.25€
        const netAmount = amountInCents - stripeFee;

        return {
            grossAmount: amountInCents,
            stripeFee: stripeFee,
            netAmount: netAmount,
            grossAmountEUR: amount,
            stripeFeeEUR: stripeFee / 100,
            netAmountEUR: netAmount / 100
        };
    }

    /**
     * Valida una tarjeta de crédito usando Stripe Elements
     * @param {Object} cardElement - Elemento de tarjeta de Stripe
     * @returns {Promise<Object>} - Resultado de la validación
     */
    async validateCard(cardElement) {
        try {
            if (!this.stripe) {
                await this.initialize();
            }

            const { error, paymentMethod } = await this.stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (error) {
                throw new Error(error.message);
            }

            return paymentMethod;

        } catch (error) {
            console.error('Error validando tarjeta:', error);
            throw error;
        }
    }

    /**
     * Obtiene métodos de pago guardados de un cliente
     * @param {string} customerEmail - Email del cliente
     * @returns {Promise<Array>} - Métodos de pago guardados
     */
    async getSavedPaymentMethods(customerEmail) {
        try {
            const response = await axios.get(`${this.apiUrl}/api/stripe/saved-payment-methods`, {
                params: { customer_email: customerEmail }
            });

            return response.data;

        } catch (error) {
            console.error('Error obteniendo métodos de pago guardados:', error);
            throw new Error('Error al obtener métodos de pago guardados');
        }
    }

    /**
     * Elimina un método de pago guardado
     * @param {string} paymentMethodId - ID del método de pago
     * @returns {Promise<Object>} - Resultado de la eliminación
     */
    async deletePaymentMethod(paymentMethodId) {
        try {
            const response = await axios.delete(`${this.apiUrl}/api/stripe/payment-method`, {
                params: { payment_method_id: paymentMethodId }
            });

            return response.data;

        } catch (error) {
            console.error('Error eliminando método de pago:', error);
            throw new Error('Error al eliminar método de pago');
        }
    }

    /**
     * Obtiene el estado de un webhook de Stripe
     * @param {string} webhookId - ID del webhook
     * @returns {Promise<Object>} - Estado del webhook
     */
    async getWebhookStatus(webhookId) {
        try {
            const response = await axios.get(`${this.apiUrl}/api/stripe/webhook-status`, {
                params: { webhook_id: webhookId }
            });

            return response.data;

        } catch (error) {
            console.error('Error obteniendo estado del webhook:', error);
            throw new Error('Error al obtener estado del webhook');
        }
    }
}

export const stripeService = new StripeService();