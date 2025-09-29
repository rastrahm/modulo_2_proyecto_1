import React from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaBox, FaShoppingCart, FaCoins, FaFileInvoice, FaCog } from 'react-icons/fa';

const Home = () => {
    const features = [
        {
            icon: <FaStore/>,
            title: 'Gestión de Empresas',
            description: 'Registra y administra empresas en el sistema blockchain',
            link: '/empresas',
            color: '#3498db'
        },
        {
            icon: <FaBox/>,
            title: 'Catálogo de Productos',
            description: 'Explora productos con imágenes almacenadas en IPFS',
            link: '/productos',
            color: '#e74c3c'
        },
        {
            icon: <FaShoppingCart/>,
            title: 'Carrito de Compras',
            description: 'Compra productos usando tokens EURO',
            link: '/carrito',
            color: '#f39c12'
        },
        {
            icon: <FaCoins/>,
            title: 'Gestión de Tokens',
            description: 'Compra y retira tokens EURO con Stripe',
            link: '/tokens',
            color: '#2ecc71'
        },
        {
            icon: <FaFileInvoice/>,
            title: 'Historial de Facturas',
            description: 'Consulta todas tus compras y facturas',
            link: '/facturas',
            color: '#9b59b6'
        },
        {
            icon: <FaCog/>,
            title: 'Panel de Administración',
            description: 'Administra el sistema completo',
            link: '/admin',
            color: '#34495e'
        }
    ];

    return (
        <div>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '4rem 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h1 style={{
                        fontSize: '3rem',
                        marginBottom: '1rem',
                        fontWeight: 'bold'
                    }}>
                        🛒 E-commerce Blockchain
                    </h1>
                    <p style={{
                        fontSize: '1.3rem',
                        marginBottom: '2rem',
                        opacity: 0.9,
                        maxWidth: '600px',
                        margin: '0 auto 2rem auto'
                    }}>
                        Sistema de comercio electrónico descentralizado que integra blockchain,
                        pagos con Stripe e IPFS para un ecosistema completo y seguro.
                    </p>
                    <div className="d-flex gap-2 justify-center">
                        <Link 
                            to="/productos" 
                            className="btn btn-primary btn-lg"
                            style={{
                                textDecoration: 'none',
                                padding: '12px 24px',
                                fontSize: '1.1rem'
                            }}
                        >
                            <FaBox/> Explorar Productos
                        </Link>
                        <Link 
                            to="/tokens" 
                            className="btn btn-secondary btn-lg"
                            style={{
                                textDecoration: 'none',
                                padding: '12px 24px',
                                fontSize: '1.1rem'
                            }}
                        >
                            <FaCoins/> Gestionar Tokens
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section style={{padding: '4rem 0'}}>
                <div className="container">
                    <h2 style={{
                        textAlign: 'center',
                        marginBottom: '3rem',
                        fontSize: '2.5rem',
                        color: '#2c3e50'
                    }}>
                        Funcionalidades Principales
                    </h2>
                    <div className="grid grid-3 gap-3">
                        {features.map((feature, index) => (
                            <div 
                                key={index}
                                className="card"
                                style={{
                                    padding: '2rem',
                                    textAlign: 'center',
                                    border: 'none',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    borderRadius: '12px',
                                    transition: 'transform 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                <div 
                                    style={{
                                        fontSize: '3rem',
                                        color: feature.color,
                                        marginBottom: '1rem'
                                    }}
                                >
                                    {feature.icon}
                                </div>
                                <h3 style={{
                                    marginBottom: '1rem',
                                    color: '#2c3e50',
                                    fontSize: '1.3rem'
                                }}>
                                    {feature.title}
                                </h3>
                                <p style={{
                                    color: '#7f8c8d',
                                    lineHeight: '1.6',
                                    marginBottom: '1.5rem'
                                }}>
                                    {feature.description}
                                </p>
                                <Link 
                                    to={feature.link}
                                    className="btn"
                                    style={{
                                        backgroundColor: feature.color,
                                        color: 'white',
                                        textDecoration: 'none',
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        display: 'inline-block'
                                    }}
                                >
                                    Acceder
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technology Stack */}
            <section style={{
                background: '#f8f9fa',
                padding: '4rem 0'
            }}>
                <div className="container">
                    <h2 style={{
                        textAlign: 'center',
                        marginBottom: '3rem',
                        fontSize: '2.5rem',
                        color: '#2c3e50'
                    }}>
                        Stack Tecnológico
                    </h2>
                    <div className="grid grid-4 gap-3">
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem',
                            background: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🔗</div>
                            <h4 style={{color: '#2c3e50'}}>Solidity</h4>
                            <p style={{color: '#7f8c8d'}}>Smart Contracts</p>
                        </div>
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem',
                            background: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>⚛️</div>
                            <h4 style={{color: '#2c3e50'}}>React</h4>
                            <p style={{color: '#7f8c8d'}}>Frontend Framework</p>
                        </div>
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem',
                            background: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>💳</div>
                            <h4 style={{color: '#2c3e50'}}>Stripe</h4>
                            <p style={{color: '#7f8c8d'}}>Payment Gateway</p>
                        </div>
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem',
                            background: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📁</div>
                            <h4 style={{color: '#2c3e50'}}>IPFS</h4>
                            <p style={{color: '#7f8c8d'}}>Decentralized Storage</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                color: 'white',
                padding: '4rem 0',
                textAlign: 'center'
            }}>
                <div className="container">
                    <h2 style={{
                        fontSize: '2.5rem',
                        marginBottom: '1rem'
                    }}>
                        ¿Listo para comenzar?
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        marginBottom: '2rem',
                        opacity: 0.9
                    }}>
                        Conecta tu wallet y explora el futuro del e-commerce descentralizado
                    </p>
                    <div className="d-flex gap-2 justify-center">
                        <Link 
                            to="/empresas" 
                            className="btn btn-success btn-lg"
                            style={{
                                textDecoration: 'none',
                                padding: '12px 24px',
                                fontSize: '1.1rem'
                            }}
                        >
                            <FaStore/> Crear Empresa
                        </Link>
                        <Link 
                            to="/tokens" 
                            className="btn btn-warning btn-lg"
                            style={{
                                textDecoration: 'none',
                                padding: '12px 24px',
                                fontSize: '1.1rem'
                            }}
                        >
                            <FaCoins/> Comprar Tokens
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;