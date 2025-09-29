import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaWallet, FaCoins, FaShoppingCart, FaStore, FaBox, FaFileInvoice, FaCog } from 'react-icons/fa';

const Navbar = ({ isConnected, account, balance, onConnect, onDisconnect }) => {
    const location = useLocation();

    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '1rem 0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div className="container">
                <div className="d-flex justify-between align-center">
                    {/* Logo */}
                    <Link 
                        to="/"
                        style={{
                            textDecoration: 'none',
                            color: 'white',
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                        }}
                    >
                        🛒 E-commerce Blockchain
                    </Link>

                    {/* Navigation Links */}
                    <div 
                        className="d-flex gap-2"
                        style={{flexWrap: 'wrap'}}
                    >
                        <Link 
                            to="/empresas"
                            className={`btn ${isActive('/empresas') ? 'btn-primary' : 'btn-secondary'}`}
                            style={{
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '14px',
                                padding: '8px 16px'
                            }}
                        >
                            <FaStore/> Empresas
                        </Link>

                        <Link 
                            to="/productos"
                            className={`btn ${isActive('/productos') ? 'btn-primary' : 'btn-secondary'}`}
                            style={{
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '14px',
                                padding: '8px 16px'
                            }}
                        >
                            <FaBox/> Productos
                        </Link>

                        <Link 
                            to="/carrito"
                            className={`btn ${isActive('/carrito') ? 'btn-primary' : 'btn-secondary'}`}
                            style={{
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '14px',
                                padding: '8px 16px'
                            }}
                        >
                            <FaShoppingCart/> Carrito
                        </Link>

                        <Link 
                            to="/tokens"
                            className={`btn ${isActive('/tokens') ? 'btn-primary' : 'btn-secondary'}`}
                            style={{
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '14px',
                                padding: '8px 16px'
                            }}
                        >
                            <FaCoins/> Tokens
                        </Link>

                        <Link 
                            to="/facturas"
                            className={`btn ${isActive('/facturas') ? 'btn-primary' : 'btn-secondary'}`}
                            style={{
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '14px',
                                padding: '8px 16px'
                            }}
                        >
                            <FaFileInvoice/> Facturas
                        </Link>

                        <Link 
                            to="/admin"
                            className={`btn ${isActive('/admin') ? 'btn-primary' : 'btn-secondary'}`}
                            style={{
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '14px',
                                padding: '8px 16px'
                            }}
                        >
                            <FaCog/> Admin
                        </Link>
                    </div>

                    {/* Wallet Connection */}
                    <div className="d-flex align-center gap-2">
                        {isConnected ? (
                            <div 
                                className="d-flex align-center gap-2"
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    color: 'white'
                                }}
                            >
                                <FaWallet/>
                                <div>
                                    <div style={{fontSize: '12px', opacity: 0.8}}>
                                        {formatAddress(account)}
                                    </div>
                                    <div style={{fontSize: '14px', fontWeight: 'bold'}}>
                                        {parseFloat(balance).toFixed(4)} EURO
                                    </div>
                                </div>
                                <button 
                                    onClick={onDisconnect}
                                    className="btn btn-danger"
                                    style={{
                                        padding: '4px 8px',
                                        fontSize: '12px',
                                        marginLeft: '8px'
                                    }}
                                >
                                    Desconectar
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={onConnect}
                                className="btn btn-success"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px'
                                }}
                            >
                                <FaWallet/> Conectar Wallet
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;