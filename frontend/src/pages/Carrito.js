import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaCreditCard, FaEuroSign } from 'react-icons/fa';
import { contractService } from '../services/contractService';
import { ipfsService } from '../services/ipfsService';
import Loading from '../components/Loading';

const Carrito = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState('0');

    useEffect(() => {
        loadCartFromStorage();
        loadBalance();
    }, []);

    const loadCartFromStorage = () => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    };

    const saveCartToStorage = (items) => {
        localStorage.setItem('cart', JSON.stringify(items));
    };

    const loadBalance = async () => {
        try {
            if (contractService.euroToken) {
                const account = await contractService.provider.getSigner().getAddress();
                const tokenBalance = await contractService.getTokenBalance(account);
                setBalance(tokenBalance);
            }
        } catch (error) {
            console.error('Error cargando balance:', error);
        }
    };

    const updateQuantity = (index, newQuantity) => {
        if (newQuantity < 1) return;

        const updatedItems = [...cartItems];
        updatedItems[index].cantidad = newQuantity;
        setCartItems(updatedItems);
        saveCartToStorage(updatedItems);
    };

    const removeItem = (index) => {
        const updatedItems = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedItems);
        saveCartToStorage(updatedItems);
        toast.success('Producto eliminado del carrito');
    };

    const clearCart = () => {
        setCartItems([]);
        saveCartToStorage([]);
        toast.success('Carrito vaciado');
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (parseFloat(item.precio) * item.cantidad);
        }, 0);
    };

    const processPurchase = async () => {
        if (cartItems.length === 0) {
            toast.error('Tu carrito está vacío');
            return;
        }

        const total = calculateTotal();
        const currentBalance = parseFloat(balance);

        if (total > currentBalance) {
            toast.error('No tienes suficientes tokens para completar la compra');
            return;
        }

        try {
            setLoading(true);

            // Agrupar productos por empresa
            const itemsByCompany = {};
            cartItems.forEach(item => {
                if (!itemsByCompany[item.empresaAddress]) {
                    itemsByCompany[item.empresaAddress] = [];
                }
                itemsByCompany[item.empresaAddress].push(item);
            });

            // Procesar compra para cada empresa
            for (const [empresaAddress, items] of Object.entries(itemsByCompany)) {
                const companyTotal = items.reduce((sum, item) => sum + (parseFloat(item.precio) * item.cantidad), 0);
                
                await contractService.processPurchase(
                    empresaAddress,
                    items,
                    companyTotal.toString()
                );
            }

            toast.success('¡Compra realizada exitosamente!');
            setCartItems([]);
            saveCartToStorage([]);
            loadBalance();

        } catch (error) {
            console.error('Error procesando compra:', error);
            toast.error('Error al procesar la compra');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return (parseFloat(price) / 1e18).toFixed(4);
    };

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
                <FaShoppingCart/> Carrito de Compras
            </h1>

            {/* Balance actual */}
            <div 
                className="card mb-4"
                style={{textAlign: 'center'}}
            >
                <h3>Balance Disponible</h3>
                <div style={{
                    fontSize: '2rem', 
                    fontWeight: 'bold', 
                    color: '#2ecc71', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.5rem'
                }}>
                    <FaEuroSign/> {parseFloat(balance).toFixed(4)} EURO
                </div>
            </div>

            {cartItems.length === 0 ? (
                <div className="card text-center">
                    <div style={{fontSize: '4rem', marginBottom: '1rem', opacity: 0.5}}>
                        <FaShoppingCart/>
                    </div>
                    <h3>Tu carrito está vacío</h3>
                    <p style={{color: '#666', marginBottom: '2rem'}}>
                        Agrega algunos productos para comenzar tu compra
                    </p>
                    <a 
                        href="/productos" 
                        className="btn btn-primary"
                        style={{textDecoration: 'none'}}
                    >
                        Ir a Productos
                    </a>
                </div>
            ) : (
                <>
                    {/* Lista de productos en el carrito */}
                    <div className="card mb-4">
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem'
                        }}>
                            <h3>Productos en el Carrito</h3>
                            <button 
                                className="btn btn-outline-danger"
                                onClick={clearCart}
                                style={{fontSize: '0.9rem'}}
                            >
                                <FaTrash/> Vaciar Carrito
                            </button>
                        </div>

                        <div className="grid grid-1 gap-3">
                            {cartItems.map((item, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    border: '1px solid #e9ecef',
                                    borderRadius: '8px',
                                    gap: '1rem'
                                }}>
                                    <div style={{flex: '0 0 80px'}}>
                                        {item.imagenIPFS ? (
                                            <img
                                                src={`https://ipfs.io/ipfs/${item.imagenIPFS}`}
                                                alt={item.nombre}
                                                style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px'
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '80px',
                                                height: '80px',
                                                background: '#f8f9fa',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '8px',
                                                color: '#6c757d'
                                            }}>
                                                <FaShoppingCart/>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{flex: 1}}>
                                        <h4 style={{marginBottom: '0.5rem', color: '#2c3e50'}}>
                                            {item.nombre}
                                        </h4>
                                        <p style={{
                                            color: '#7f8c8d',
                                            fontSize: '0.9rem',
                                            margin: 0
                                        }}>
                                            Empresa: {item.empresaAddress.slice(0, 6)}...{item.empresaAddress.slice(-4)}
                                        </p>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => updateQuantity(index, item.cantidad - 1)}
                                            style={{padding: '0.25rem 0.5rem'}}
                                        >
                                            <FaMinus/>
                                        </button>
                                        <span style={{
                                            minWidth: '2rem',
                                            textAlign: 'center',
                                            fontWeight: 'bold'
                                        }}>
                                            {item.cantidad}
                                        </span>
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => updateQuantity(index, item.cantidad + 1)}
                                            style={{padding: '0.25rem 0.5rem'}}
                                        >
                                            <FaPlus/>
                                        </button>
                                    </div>

                                    <div style={{
                                        textAlign: 'right',
                                        minWidth: '120px'
                                    }}>
                                        <div style={{
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold',
                                            color: '#27ae60',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                            gap: '0.25rem'
                                        }}>
                                            <FaEuroSign/>
                                            {formatPrice(item.precio * item.cantidad)}
                                        </div>
                                        <small style={{color: '#666'}}>
                                            €{formatPrice(item.precio)} c/u
                                        </small>
                                    </div>

                                    <button
                                        className="btn btn-outline-danger"
                                        onClick={() => removeItem(index)}
                                        style={{padding: '0.5rem'}}
                                    >
                                        <FaTrash/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Resumen de compra */}
                    <div className="card">
                        <h3 style={{marginBottom: '1rem'}}>Resumen de Compra</h3>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem',
                            padding: '1rem',
                            background: '#f8f9fa',
                            borderRadius: '8px'
                        }}>
                            <div>
                                <div style={{fontSize: '1.2rem', fontWeight: 'bold'}}>
                                    Total ({cartItems.length} productos):
                                </div>
                                <div style={{color: '#666', fontSize: '0.9rem'}}>
                                    {cartItems.reduce((sum, item) => sum + item.cantidad, 0)} unidades
                                </div>
                            </div>
                            <div style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#27ae60',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <FaEuroSign/>
                                {formatPrice(calculateTotal())}
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1rem'
                        }}>
                            <div>
                                <strong>Balance disponible:</strong>
                            </div>
                            <div style={{
                                color: parseFloat(balance) >= calculateTotal() ? '#27ae60' : '#e74c3c',
                                fontWeight: 'bold'
                            }}>
                                <FaEuroSign/> {formatPrice(balance)}
                            </div>
                        </div>

                        {parseFloat(balance) < calculateTotal() && (
                            <div style={{
                                background: '#f8d7da',
                                color: '#721c24',
                                padding: '1rem',
                                borderRadius: '8px',
                                marginBottom: '1rem'
                            }}>
                                <strong>⚠️ Balance insuficiente:</strong> 
                                Necesitas más tokens para completar esta compra.
                                <a 
                                    href="/tokens" 
                                    className="btn btn-warning"
                                    style={{
                                        marginLeft: '1rem',
                                        textDecoration: 'none',
                                        padding: '0.25rem 0.5rem',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    Comprar Tokens
                                </a>
                            </div>
                        )}

                        <button
                            className="btn btn-success btn-lg"
                            onClick={processPurchase}
                            disabled={loading || parseFloat(balance) < calculateTotal()}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                width: '100%',
                                justifyContent: 'center'
                            }}
                        >
                            {loading ? (
                                <>
                                    <div style={{
                                        width: '16px',
                                        height: '16px',
                                        border: '2px solid #ffffff',
                                        borderTop: '2px solid transparent',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }}/>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <FaCreditCard/>
                                    Completar Compra
                                </>
                            )}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Carrito;