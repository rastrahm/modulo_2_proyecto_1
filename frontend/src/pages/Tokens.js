import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCoins, FaArrowUp, FaArrowDown, FaCreditCard, FaWallet } from 'react-icons/fa';
import { contractService } from '../services/contractService';
import { stripeService } from '../services/stripeService';
import Loading from '../components/Loading';

const Tokens = () => {
    const [balance, setBalance] = useState('0');
    const [loading, setLoading] = useState(true);
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [purchaseAmount, setPurchaseAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        loadBalance();
    }, []);

    const loadBalance = async () => {
        try {
            setLoading(true);
            if (contractService.euroToken) {
                const account = await contractService.provider.getSigner().getAddress();
                const tokenBalance = await contractService.getTokenBalance(account);
                setBalance(tokenBalance);
            }
        } catch (error) {
            console.error('Error cargando balance:', error);
            toast.error('Error al cargar el balance de tokens');
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (e) => {
        e.preventDefault();
        if (!purchaseAmount || !email) {
            toast.error('Por favor completa todos los campos');
            return;
        }

        try {
            setPurchaseLoading(true);

            // Crear PaymentIntent con Stripe
            const paymentIntent = await stripeService.createPaymentIntent(
                parseFloat(purchaseAmount),
                email
            );

            // Confirmar pago con Stripe
            const result = await stripeService.confirmPayment(paymentIntent.client_secret);

            if (result.error) {
                toast.error(`Error en el pago: ${result.error.message}`);
                return;
            }

            // Si el pago es exitoso, mintear tokens
            if (result.paymentIntent.status === 'succeeded') {
                const amountWei = (parseFloat(purchaseAmount) * 1e18).toString();
                await contractService.mintTokens(amountWei);
                
                toast.success(`¡Pago exitoso! ${purchaseAmount} EURO tokens minteados`);
                setPurchaseAmount('');
                setEmail('');
                await loadBalance();
            }
        } catch (error) {
            console.error('Error en la compra:', error);
            toast.error('Error al procesar la compra');
        } finally {
            setPurchaseLoading(false);
        }
    };

    const handleWithdraw = async (e) => {
        e.preventDefault();
        if (!withdrawAmount) {
            toast.error('Por favor ingresa la cantidad a retirar');
            return;
        }

        const withdrawAmountFloat = parseFloat(withdrawAmount);
        const currentBalance = parseFloat(balance);

        if (withdrawAmountFloat > currentBalance) {
            toast.error('No tienes suficientes tokens para retirar');
            return;
        }

        try {
            setWithdrawLoading(true);

            // Quemar tokens
            const amountWei = (withdrawAmountFloat * 1e18).toString();
            await contractService.burnTokens(amountWei);

            // Procesar retiro con Stripe
            await stripeService.processWithdrawal(withdrawAmountFloat);

            toast.success(`¡Retiro exitoso! ${withdrawAmount} EURO retirados`);
            setWithdrawAmount('');
            await loadBalance();
        } catch (error) {
            console.error('Error en el retiro:', error);
            toast.error('Error al procesar el retiro');
        } finally {
            setWithdrawLoading(false);
        }
    };

    const calculateFees = (amount) => {
        if (!amount) return { entryFee: 0, exitFee: 0, netAmount: 0 };

        const entryFee = amount * 0.025; // 2.5%
        const exitFee = amount * 0.025; // 2.5%
        const netAmount = amount - exitFee;

        return { entryFee, exitFee, netAmount };
    };

    if (loading) {
        return <Loading message="Cargando información de tokens..." />;
    }

    return (
        <div 
            className="container"
            style={{padding: '2rem 0'}}
        >
            <h1 style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                marginBottom: '2rem'
            }}>
                <FaCoins/> Gestión de Tokens EURO
            </h1>

            {/* Balance actual */}
            <div 
                className="card mb-4"
                style={{textAlign: 'center'}}
            >
                <div style={{
                    fontSize: '3rem', 
                    marginBottom: '1rem', 
                    color: '#2ecc71'
                }}>
                    <FaWallet/>
                </div>
                <h2>Balance Actual</h2>
                <div style={{
                    fontSize: '2.5rem', 
                    fontWeight: 'bold', 
                    color: '#2ecc71', 
                    marginBottom: '1rem'
                }}>
                    {parseFloat(balance).toFixed(4)} EURO
                </div>
                <p style={{color: '#666', margin: 0}}>
                    Tokens EURO disponibles en tu wallet
                </p>
            </div>

            <div className="grid grid-2 gap-4">
                {/* Compra de tokens */}
                <div className="card">
                    <div style={{
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem', 
                        marginBottom: '1.5rem'
                    }}>
                        <FaArrowUp style={{color: '#27ae60', fontSize: '1.5rem'}}/>
                        <h3>Comprar Tokens EURO</h3>
                    </div>
                    
                    <form onSubmit={handlePurchase}>
                        <div className="form-group">
                            <label className="form-label">Cantidad en Euros</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-input"
                                value={purchaseAmount}
                                onChange={(e) => setPurchaseAmount(e.target.value)}
                                placeholder="10.00"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email para Stripe</label>
                            <input
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com"
                                required
                            />
                        </div>

                        {purchaseAmount && (
                            <div style={{
                                background: '#f8f9fa',
                                padding: '1rem',
                                borderRadius: '8px',
                                marginBottom: '1rem'
                            }}>
                                <h4 style={{marginBottom: '0.5rem', color: '#2c3e50'}}>
                                    Resumen de la Compra
                                </h4>
                                <div style={{fontSize: '0.9rem', color: '#666'}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <span>Cantidad:</span>
                                        <span>€{purchaseAmount}</span>
                                    </div>
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <span>Comisión Stripe (2.5%):</span>
                                        <span>€{calculateFees(parseFloat(purchaseAmount)).entryFee.toFixed(2)}</span>
                                    </div>
                                    <hr style={{margin: '0.5rem 0'}}/>
                                    <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
                                        <span>Total a Pagar:</span>
                                        <span>€{(parseFloat(purchaseAmount) + calculateFees(parseFloat(purchaseAmount)).entryFee).toFixed(2)}</span>
                                    </div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', color: '#27ae60', fontWeight: 'bold'}}>
                                        <span>Tokens a Recibir:</span>
                                        <span>{purchaseAmount} EURO</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-success"
                            disabled={purchaseLoading}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                width: '100%',
                                justifyContent: 'center'
                            }}
                        >
                            <FaCreditCard/>
                            {purchaseLoading ? 'Procesando...' : 'Comprar con Tarjeta'}
                        </button>
                    </form>
                </div>

                {/* Retiro de tokens */}
                <div className="card">
                    <div style={{
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1rem', 
                        marginBottom: '1.5rem'
                    }}>
                        <FaArrowDown style={{color: '#e74c3c', fontSize: '1.5rem'}}/>
                        <h3>Retirar Tokens EURO</h3>
                    </div>
                    
                    <form onSubmit={handleWithdraw}>
                        <div className="form-group">
                            <label className="form-label">Cantidad a Retirar</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-input"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                placeholder="10.00"
                                max={balance}
                                required
                            />
                            <small style={{color: '#666'}}>
                                Balance disponible: {parseFloat(balance).toFixed(4)} EURO
                            </small>
                        </div>

                        {withdrawAmount && (
                            <div style={{
                                background: '#f8f9fa',
                                padding: '1rem',
                                borderRadius: '8px',
                                marginBottom: '1rem'
                            }}>
                                <h4 style={{marginBottom: '0.5rem', color: '#2c3e50'}}>
                                    Resumen del Retiro
                                </h4>
                                <div style={{fontSize: '0.9rem', color: '#666'}}>
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <span>Cantidad a Retirar:</span>
                                        <span>{withdrawAmount} EURO</span>
                                    </div>
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <span>Comisión de Salida (2.5%):</span>
                                        <span>{calculateFees(parseFloat(withdrawAmount)).exitFee.toFixed(4)} EURO</span>
                                    </div>
                                    <hr style={{margin: '0.5rem 0'}}/>
                                    <div style={{display: 'flex', justifyContent: 'space-between', color: '#e74c3c', fontWeight: 'bold'}}>
                                        <span>Tokens a Quemar:</span>
                                        <span>{withdrawAmount} EURO</span>
                                    </div>
                                    <div style={{display: 'flex', justifyContent: 'space-between', color: '#27ae60', fontWeight: 'bold'}}>
                                        <span>Euros a Recibir:</span>
                                        <span>€{calculateFees(parseFloat(withdrawAmount)).netAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-danger"
                            disabled={withdrawLoading || parseFloat(withdrawAmount) > parseFloat(balance)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                width: '100%',
                                justifyContent: 'center'
                            }}
                        >
                            <FaWallet/>
                            {withdrawLoading ? 'Procesando...' : 'Retirar a Euros'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Información sobre comisiones */}
            <div className="card mt-4">
                <h3 style={{marginBottom: '1rem', color: '#2c3e50'}}>
                    📊 Información sobre Comisiones
                </h3>
                <div className="grid grid-3 gap-3">
                    <div style={{
                        background: '#e8f5e8',
                        padding: '1rem',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>💳</div>
                        <h4 style={{color: '#27ae60', marginBottom: '0.5rem'}}>Comisión de Entrada</h4>
                        <p style={{color: '#666', fontSize: '0.9rem', margin: 0}}>
                            2.5% por compra de tokens con tarjeta de crédito
                        </p>
                    </div>
                    <div style={{
                        background: '#fef9e7',
                        padding: '1rem',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>🔄</div>
                        <h4 style={{color: '#f39c12', marginBottom: '0.5rem'}}>Gas de Red</h4>
                        <p style={{color: '#666', fontSize: '0.9rem', margin: 0}}>
                            Costos de transacción en la blockchain Ethereum
                        </p>
                    </div>
                    <div style={{
                        background: '#fdeaea',
                        padding: '1rem',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>💸</div>
                        <h4 style={{color: '#e74c3c', marginBottom: '0.5rem'}}>Comisión de Salida</h4>
                        <p style={{color: '#666', fontSize: '0.9rem', margin: 0}}>
                            2.5% por retiro de tokens a euros
                        </p>
                    </div>
                </div>
            </div>

            {/* Instrucciones */}
            <div className="card mt-4">
                <h3 style={{marginBottom: '1rem', color: '#2c3e50'}}>
                    📋 Instrucciones
                </h3>
                <div style={{color: '#666', lineHeight: '1.6'}}>
                    <p><strong>Para Comprar Tokens:</strong></p>
                    <ol style={{paddingLeft: '1.5rem', marginBottom: '1rem'}}>
                        <li>Ingresa la cantidad en euros que deseas convertir a tokens</li>
                        <li>Proporciona tu email para el procesamiento de Stripe</li>
                        <li>Completa el pago con tu tarjeta de crédito</li>
                        <li>Los tokens se mintearán automáticamente en tu wallet</li>
                    </ol>
                    
                    <p><strong>Para Retirar Tokens:</strong></p>
                    <ol style={{paddingLeft: '1.5rem'}}>
                        <li>Ingresa la cantidad de tokens que deseas retirar</li>
                        <li>Confirma la transacción en tu wallet</li>
                        <li>Los euros se transferirán a tu cuenta bancaria</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default Tokens;