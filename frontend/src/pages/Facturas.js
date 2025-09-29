import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaFileInvoice, FaDownload, FaEye, FaEuroSign, FaCalendarAlt } from 'react-icons/fa';
import { contractService } from '../services/contractService';
import Loading from '../components/Loading';

const Facturas = () => {
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEmpresa, setSelectedEmpresa] = useState('');
    const [empresas, setEmpresas] = useState([]);

    useEffect(() => {
        loadEmpresas();
    }, []);

    useEffect(() => {
        if (selectedEmpresa) {
            loadFacturas();
        }
    }, [selectedEmpresa]);

    const loadEmpresas = async () => {
        try {
            const empresasData = await contractService.getAllEmpresas();
            setEmpresas(empresasData);
            if (empresasData.length > 0) {
                setSelectedEmpresa(empresasData[0].empresaAddress);
            }
        } catch (error) {
            console.error('Error cargando empresas:', error);
            toast.error('Error al cargar las empresas');
        }
    };

    const loadFacturas = async () => {
        try {
            setLoading(true);
            const account = await contractService.provider.getSigner().getAddress();
            const facturasData = await contractService.getPurchaseHistory(selectedEmpresa, account);
            setFacturas(facturasData);
        } catch (error) {
            console.error('Error cargando facturas:', error);
            toast.error('Error al cargar las facturas');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return (parseFloat(price) / 1e18).toFixed(4);
    };

    const downloadInvoice = (factura) => {
        // Aquí se implementaría la descarga de la factura en PDF
        toast.info('Función de descarga próximamente disponible');
    };

    const viewInvoice = (factura) => {
        // Aquí se implementaría la visualización detallada de la factura
        toast.info('Función de visualización próximamente disponible');
    };

    if (loading) {
        return <Loading message="Cargando facturas..." />;
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
                <FaFileInvoice/> Historial de Facturas
            </h1>

            {/* Selector de empresa */}
            <div className="card mb-4">
                <h3>Seleccionar Empresa</h3>
                <div className="form-group">
                    <label className="form-label">Empresa</label>
                    <select 
                        className="form-input"
                        value={selectedEmpresa}
                        onChange={(e) => setSelectedEmpresa(e.target.value)}
                    >
                        <option value="">Selecciona una empresa</option>
                        {empresas.map((empresa, index) => (
                            <option key={index} value={empresa.empresaAddress}>
                                {empresa.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {!selectedEmpresa ? (
                <div className="card text-center" style={{padding: '3rem'}}>
                    <FaFileInvoice style={{fontSize: '3rem', color: '#ccc', marginBottom: '1rem'}}/>
                    <h3 style={{color: '#666'}}>Selecciona una empresa</h3>
                    <p style={{color: '#999'}}>
                        Elige una empresa para ver su historial de facturas.
                    </p>
                </div>
            ) : facturas.length === 0 ? (
                <div className="card text-center" style={{padding: '3rem'}}>
                    <FaFileInvoice style={{fontSize: '3rem', color: '#ccc', marginBottom: '1rem'}}/>
                    <h3 style={{color: '#666'}}>No hay facturas disponibles</h3>
                    <p style={{color: '#999'}}>
                        No se encontraron facturas para esta empresa.
                    </p>
                </div>
            ) : (
                <>
                    {/* Lista de facturas */}
                    <div className="card mb-4">
                        <h3 style={{marginBottom: '1rem'}}>
                            Facturas de {empresas.find(e => e.empresaAddress === selectedEmpresa)?.nombre}
                        </h3>
                        
                        <div className="grid grid-1 gap-3">
                            {facturas.map((factura, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '1.5rem',
                                    border: '1px solid #e9ecef',
                                    borderRadius: '8px',
                                    background: '#f8f9fa'
                                }}>
                                    <div style={{flex: 1}}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <div style={{
                                                padding: '0.5rem',
                                                borderRadius: '6px',
                                                background: '#e3f2fd',
                                                color: '#1976d2'
                                            }}>
                                                <FaFileInvoice/>
                                            </div>
                                            <div>
                                                <h4 style={{
                                                    margin: 0,
                                                    color: '#2c3e50',
                                                    fontSize: '1.1rem'
                                                }}>
                                                    Factura #{factura.numero}
                                                </h4>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    color: '#7f8c8d',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    <FaCalendarAlt/>
                                                    {formatDate(factura.fecha)}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div style={{
                                            color: '#666',
                                            fontSize: '0.9rem',
                                            marginLeft: '3.5rem'
                                        }}>
                                            <div>
                                                <strong>Cliente:</strong> {factura.clienteAddress.slice(0, 6)}...{factura.clienteAddress.slice(-4)}
                                            </div>
                                            <div>
                                                <strong>Empresa:</strong> {factura.empresaAddress.slice(0, 6)}...{factura.empresaAddress.slice(-4)}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem'
                                    }}>
                                        <div style={{
                                            textAlign: 'right',
                                            marginRight: '1rem'
                                        }}>
                                            <div style={{
                                                fontSize: '1.5rem',
                                                fontWeight: 'bold',
                                                color: '#27ae60',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}>
                                                <FaEuroSign/>
                                                {formatPrice(factura.importeTotal)}
                                            </div>
                                            <small style={{color: '#666'}}>
                                                Total
                                            </small>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            gap: '0.5rem'
                                        }}>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => viewInvoice(factura)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    padding: '0.5rem'
                                                }}
                                            >
                                                <FaEye/>
                                                Ver
                                            </button>
                                            <button
                                                className="btn btn-success"
                                                onClick={() => downloadInvoice(factura)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    padding: '0.5rem'
                                                }}
                                            >
                                                <FaDownload/>
                                                PDF
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="card">
                        <h3 style={{marginBottom: '1rem'}}>Estadísticas de Facturas</h3>
                        <div className="grid grid-3 gap-3">
                            <div style={{textAlign: 'center'}}>
                                <div style={{fontSize: '2rem', color: '#3498db', fontWeight: 'bold'}}>
                                    {facturas.length}
                                </div>
                                <div style={{color: '#7f8c8d'}}>Facturas Totales</div>
                            </div>
                            <div style={{textAlign: 'center'}}>
                                <div style={{
                                    fontSize: '2rem', 
                                    color: '#27ae60', 
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.25rem'
                                }}>
                                    <FaEuroSign/>
                                    {formatPrice(facturas.reduce((sum, f) => sum + parseFloat(f.importeTotal), 0))}
                                </div>
                                <div style={{color: '#7f8c8d'}}>Total Facturado</div>
                            </div>
                            <div style={{textAlign: 'center'}}>
                                <div style={{
                                    fontSize: '2rem', 
                                    color: '#f39c12', 
                                    fontWeight: 'bold'
                                }}>
                                    {facturas.length > 0 ? 
                                        formatPrice(facturas.reduce((sum, f) => sum + parseFloat(f.importeTotal), 0) / facturas.length) : 
                                        '0.0000'
                                    }
                                </div>
                                <div style={{color: '#7f8c8d'}}>Promedio por Factura</div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Información adicional */}
            <div className="card mt-4">
                <h3 style={{marginBottom: '1rem'}}>
                    📋 Información sobre Facturas
                </h3>
                <div style={{color: '#666', lineHeight: '1.6'}}>
                    <ul style={{paddingLeft: '1.5rem'}}>
                        <li>
                            <strong>Número de Factura:</strong> Identificador único para cada transacción.
                        </li>
                        <li>
                            <strong>Fecha:</strong> Momento exacto en que se procesó la compra.
                        </li>
                        <li>
                            <strong>Importe:</strong> Cantidad total pagada en tokens EURO.
                        </li>
                        <li>
                            <strong>Cliente:</strong> Dirección de wallet del comprador.
                        </li>
                        <li>
                            <strong>Empresa:</strong> Dirección de wallet de la empresa vendedora.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Facturas;