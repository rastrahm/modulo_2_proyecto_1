import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loading from './components/Loading';

// Pages
import Home from './pages/Home';
import Empresas from './pages/Empresas';
import Productos from './pages/Productos';
import Carrito from './pages/Carrito';
import Tokens from './pages/Tokens';
import Facturas from './pages/Facturas';
import Admin from './pages/Admin';

// Services
import { contractService } from './services/contractService';
import { walletService } from './services/walletService';

function App() {
    const [isConnected, setIsConnected] = useState(false);
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState('0');

    useEffect(() => {
        initializeApp();
    }, []);

    const initializeApp = async() => {
        try {
            setLoading(true);

            // Verificar si hay una wallet conectada
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    await connectWallet();
                }
            }

            // Inicializar servicios
            await contractService.initialize();
            await walletService.initialize();

        } catch (error) {
            console.error('Error inicializando la aplicación:', error);
            toast.error('Error al inicializar la aplicación');
        } finally {
            setLoading(false);
        }
    };

    const connectWallet = async() => {
        try {
            if (!window.ethereum) {
                toast.error('MetaMask no está instalado');
                return;
            }

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            if (accounts.length > 0) {
                const account = accounts[0];
                setAccount(account);
                setIsConnected(true);

                // Actualizar balance
                await updateBalance(account);

                toast.success('Wallet conectada exitosamente');
            }
        } catch (error) {
            console.error('Error conectando wallet:', error);
            toast.error('Error al conectar la wallet');
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setIsConnected(false);
        setBalance('0');
        toast.info('Wallet desconectada');
    };

    const updateBalance = async(accountAddress) => {
        try {
            if (contractService.euroToken) {
                const balance = await contractService.euroToken.balanceOf(accountAddress);
                setBalance(ethers.formatEther(balance));
            }
        } catch (error) {
            console.error('Error actualizando balance:', error);
        }
    };

    // Escuchar cambios de cuenta
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    updateBalance(accounts[0]);
                } else {
                    disconnectWallet();
                }
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeAllListeners('accountsChanged');
                window.ethereum.removeAllListeners('chainChanged');
            }
        };
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="App">
            <Navbar 
                isConnected={isConnected} 
                account={account} 
                balance={balance} 
                onConnect={connectWallet} 
                onDisconnect={disconnectWallet}
            />
            <main style={{minHeight: 'calc(100vh - 200px)'}}>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/empresas" element={<Empresas/>} />
                    <Route path="/productos" element={<Productos/>} />
                    <Route path="/carrito" element={<Carrito/>} />
                    <Route path="/tokens" element={<Tokens/>} />
                    <Route path="/facturas" element={<Facturas/>} />
                    <Route path="/admin" element={<Admin/>} />
                    <Route path="*" element={<Navigate to="/" replace/>} />
                </Routes>
            </main>
            <Footer/>
        </div>
    );
}

export default App;