import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer style={{
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            color: 'white',
            padding: '2rem 0',
            marginTop: 'auto'
        }}>
            <div className="container">
                <div className="grid grid-3" style={{marginBottom: '2rem'}}>
                    {/* Información del proyecto */}
                    <div>
                        <h3 style={{marginBottom: '1rem', color: '#ecf0f1'}}>
                            🛒 E-commerce Blockchain
                        </h3>
                        <p style={{lineHeight: '1.6', opacity: 0.9}}>
                            Sistema de comercio electrónico descentralizado que integra blockchain,
                            pagos con Stripe e IPFS para un ecosistema completo y seguro.
                        </p>
                    </div>

                    {/* Tecnologías */}
                    <div>
                        <h4 style={{marginBottom: '1rem', color: '#ecf0f1'}}>
                            Tecnologías
                        </h4>
                        <ul style={{listStyle: 'none', padding: 0, lineHeight: '2'}}>
                            <li>🔗 Solidity & Smart Contracts</li>
                            <li>⚛️ React & JavaScript</li>
                            <li>💳 Stripe Payment Gateway</li>
                            <li>📁 IPFS Storage</li>
                            <li>🔐 MetaMask Integration</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 style={{marginBottom: '1rem', color: '#ecf0f1'}}>
                            Enlaces Útiles
                        </h4>
                        <ul style={{listStyle: 'none', padding: 0, lineHeight: '2'}}>
                            <li>
                                <a 
                                    href="https://hardhat.org" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    style={{color: '#3498db', textDecoration: 'none'}}
                                >
                                    Hardhat Documentation
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="https://stripe.com/docs" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    style={{color: '#3498db', textDecoration: 'none'}}
                                >
                                    Stripe API Docs
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="https://ipfs.io" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    style={{color: '#3498db', textDecoration: 'none'}}
                                >
                                    IPFS Documentation
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="https://metamask.io" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    style={{color: '#3498db', textDecoration: 'none'}}
                                >
                                    MetaMask
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Redes sociales y contacto */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div style={{display: 'flex', gap: '1rem'}}>
                        <a 
                            href="https://github.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{color: 'white', fontSize: '1.5rem'}}
                        >
                            <FaGithub/>
                        </a>
                        <a 
                            href="https://twitter.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{color: 'white', fontSize: '1.5rem'}}
                        >
                            <FaTwitter/>
                        </a>
                        <a 
                            href="https://linkedin.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{color: 'white', fontSize: '1.5rem'}}
                        >
                            <FaLinkedin/>
                        </a>
                        <a 
                            href="mailto:contacto@ecommerce-blockchain.com" 
                            style={{color: 'white', fontSize: '1.5rem'}}
                        >
                            <FaEnvelope/>
                        </a>
                    </div>
                    <div style={{textAlign: 'right', opacity: 0.8}}>
                        <p style={{margin: 0, fontSize: '0.9rem'}}>
                            ©2024 E-commerce Blockchain. Proyecto educativo.
                        </p>
                        <p style={{margin: '0.5rem 0 0 0', fontSize: '0.8rem'}}>
                            Desarrollado con ❤️ para CodeCrypto
                        </p>
                    </div>
                </div>

                {/* Información técnica */}
                <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    opacity: 0.7
                }}>
                    <div className="grid grid-2">
                        <div>
                            <strong>Red:</strong> Hardhat Local (Chain ID: 1337)
                        </div>
                        <div>
                            <strong>Token:</strong> EURO (ERC-20)
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;