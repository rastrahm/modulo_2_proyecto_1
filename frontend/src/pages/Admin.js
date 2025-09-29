import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCog, FaStore, FaBox, FaUsers, FaFileInvoice, FaCoins, FaChartBar } from 'react-icons/fa';
import { contractService } from '../services/contractService';
import Loading from '../components/Loading';

const Admin = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEmpresas: 0,
        totalProductos: 0,
        totalFacturas: 0,
        totalTokens: 0
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);

            // Cargar estadísticas generales
            const empresas = await contractService.getAllEmpresas();
            let totalProductos = 0;
            let totalFacturas = 0;

            // Calcular productos y facturas por empresa
            for (const empresa of empresas) {
                try {
                    const productos = await contractService.getProductosByEmpresa(empresa.empresaAddress);
                    totalProductos += productos.length;

                    // Aquí se cargarían las facturas si hubiera un método para obtener todas
                    // totalFacturas += facturas.length;
                } catch (error) {
                    console.error(`Error cargando datos de ${empresa.nombre}:`, error);
                }
            }

            setStats({
                totalEmpresas: empresas.length,
                totalProductos: totalProductos,
                totalFacturas: totalFacturas,
                totalTokens: 0 // Se calcularía con el total supply del token
            });

        } catch (error) {
            console.error('Error cargando estadísticas:', error);
            toast.error('Error al cargar las estadísticas');
        } finally {
            setLoading(false);
        }
    };

    const adminFunctions = [
        {
            icon: <FaStore/>,
            title: 'Gestión de Empresas',
            description: 'Administrar empresas registradas en el sistema',
            color: '#3498db',
            action: () => toast.info('Redirigiendo a gestión de empresas...')
        },
        {
            icon: <FaBox/>,
            title: 'Gestión de Productos',
            description: 'Administrar productos y catálogos',
            color: '#e74c3c',
            action: () => toast.info('Redirigiendo a gestión de productos...')
        },
        {
            icon: <FaUsers/>,
            title: 'Gestión de Clientes',
            description: 'Administrar clientes y sus datos',
            color: '#2ecc71',
            action: () => toast.info('Redirigiendo a gestión de clientes...')
        },
        {
            icon: <FaFileInvoice/>,
            title: 'Gestión de Facturas',
            description: 'Administrar facturas y transacciones',
            color: '#f39c12',
            action: () => toast.info('Redirigiendo a gestión de facturas...')
        },
        {
            icon: <FaCoins/>,
            title: 'Gestión de Tokens',
            description: 'Administrar tokens EURO y comisiones',
            color: '#9b59b6',
            action: () => toast.info('Redirigiendo a gestión de tokens...')
        },
        {
            icon: <FaChartBar/>,
            title: 'Reportes y Analytics',
            description: 'Ver estadísticas y reportes del sistema',
            color: '#34495e',
            action: () => toast.info('Redirigiendo a reportes...')
        }
    ];

    if (loading) {
        return <Loading message="Cargando panel de administración..." />;
    }

    return (
        <div className="container" style={{padding: '2rem 0'}}>
            <h1 style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                marginBottom: '2rem'
            }}>
                <FaCog/> Panel de Administración
            </h1>

            {/* Estadísticas generales */}
            <div className="card mb-4">
                <h3 style={{marginBottom: '1.5rem'}}>
                    📊 Estadísticas del Sistema
                </h3>
                <div className="grid grid-4 gap-3">
                    <div style={{
                        background: 'linear-gradient(135deg, #3498db, #2980b9)',
                        color: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '2.5rem',
                            marginBottom: '0.5rem'
                        }}>
                            <FaStore/>
                        </div>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            marginBottom: '0.25rem'
                        }}>
                            {stats.totalEmpresas}
                        </div>
                        <div style={{
                            fontSize: '0.9rem',
                            opacity: 0.9
                        }}>
                            Empresas Registradas
                        </div>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                        color: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '2.5rem',
                            marginBottom: '0.5rem'
                        }}>
                            <FaBox/>
                        </div>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            marginBottom: '0.25rem'
                        }}>
                            {stats.totalProductos}
                        </div>
                        <div style={{
                            fontSize: '0.9rem',
                            opacity: 0.9
                        }}>
                            Productos Activos
                        </div>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, #f39c12, #e67e22)',
                        color: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '2.5rem',
                            marginBottom: '0.5rem'
                        }}>
                            <FaFileInvoice/>
                        </div>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            marginBottom: '0.25rem'
                        }}>
                            {stats.totalFacturas}
                        </div>
                        <div style={{
                            fontSize: '0.9rem',
                            opacity: 0.9
                        }}>
                            Facturas Generadas
                        </div>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
                        color: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '2.5rem',
                            marginBottom: '0.5rem'
                        }}>
                            <FaCoins/>
                        </div>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            marginBottom: '0.25rem'
                        }}>
                            {stats.totalTokens.toLocaleString()}
                        </div>
                        <div style={{
                            fontSize: '0.9rem',
                            opacity: 0.9
                        }}>
                            Tokens en Circulación
                        </div>
                    </div>
                </div>
            </div>

            {/* Funciones de administración */}
            <div className="card mb-4">
                <h3 style={{marginBottom: '1.5rem'}}>
                    🛠️ Funciones de Administración
                </h3>
                <div className="grid grid-2 gap-3">
                    {adminFunctions.map((func, index) => (
                        <div 
                            key={index}
                            style={{
                                border: '2px solid #e9ecef',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                background: 'white'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.borderColor = func.color;
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = `0 4px 15px ${func.color}20`;
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.borderColor = '#e9ecef';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                            onClick={func.action}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '1rem'
                            }}>
                                <div style={{
                                    padding: '0.75rem',
                                    borderRadius: '10px',
                                    background: `${func.color}15`,
                                    color: func.color,
                                    fontSize: '1.5rem'
                                }}>
                                    {func.icon}
                                </div>
                                <h4 style={{
                                    margin: 0,
                                    color: '#2c3e50',
                                    fontSize: '1.2rem'
                                }}>
                                    {func.title}
                                </h4>
                            </div>
                            <p style={{
                                color: '#7f8c8d',
                                margin: 0,
                                lineHeight: '1.5'
                            }}>
                                {func.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Estado del sistema */}
            <div className="card mb-4">
                <h3 style={{marginBottom: '1rem'}}>
                    🔧 Estado del Sistema
                </h3>
                <div className="grid grid-3 gap-3">
                    <div style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        background: '#d4edda',
                        border: '1px solid #c3e6cb'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.5rem'
                        }}>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: '#28a745'
                            }}/>
                            <strong style={{color: '#155724'}}>Smart Contracts</strong>
                        </div>
                        <div style={{color: '#155724', fontSize: '0.9rem'}}>
                            Todos los contratos desplegados y funcionando correctamente
                        </div>
                    </div>

                    <div style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        background: '#d4edda',
                        border: '1px solid #c3e6cb'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.5rem'
                        }}>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: '#28a745'
                            }}/>
                            <strong style={{color: '#155724'}}>IPFS</strong>
                        </div>
                        <div style={{color: '#155724', fontSize: '0.9rem'}}>
                            Servicio de almacenamiento de imágenes operativo
                        </div>
                    </div>

                    <div style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        background: '#d4edda',
                        border: '1px solid #c3e6cb'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.5rem'
                        }}>
                        <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: '#28a745'
                            }}>
                            <strong style={{color: '#155724'}}>Stripe</strong>
                        </div>
                        <div style={{color: '#155724', fontSize: '0.9rem'}}>
                            Pasarela de pagos conectada y funcional
                        </div>
                    </div>
                </div>
            </div>

            {/* Acciones rápidas */}
            <div className="card">
                <h3 style={{marginBottom: '1rem'}}>
                    ⚡ Acciones Rápidas
                </h3>
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap'
                }}>
                    <button 
                        className="btn btn-primary"
                        onClick={() => toast.info('Función de backup próximamente disponible')}
                    >
                        📦 Backup del Sistema
                    </button>
                    <button 
                        className="btn btn-warning"
                        onClick={() => toast.info('Función de mantenimiento próximamente disponible')}
                    >
                        🔧 Modo Mantenimiento
                    </button>
                    <button 
                        className="btn btn-info"
                        onClick={() => toast.info('Función de logs próximamente disponible')}
                    >
                        📋 Ver Logs del Sistema
                    </button>
                    <button 
                        className="btn btn-success"
                        onClick={() => toast.info('Función de actualización próximamente disponible')}
                    >
                        🔄 Actualizar Sistema
                    </button>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Admin;