import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaStore, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { contractService } from '../services/contractService';
import Loading from '../components/Loading';

const Empresas = () => {
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        direccion: ''
    });

    useEffect(() => {
        loadEmpresas();
    }, []);

    const loadEmpresas = async () => {
        try {
            setLoading(true);
            const empresasData = await contractService.getAllEmpresas();
            setEmpresas(empresasData);
        } catch (error) {
            console.error('Error cargando empresas:', error);
            toast.error('Error al cargar las empresas');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await contractService.registerEmpresa(formData.direccion, formData.nombre);
            toast.success('Empresa registrada exitosamente');
            setFormData({ nombre: '', direccion: '' });
            setShowForm(false);
            loadEmpresas();
        } catch (error) {
            console.error('Error registrando empresa:', error);
            toast.error('Error al registrar la empresa');
        }
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleDateString('es-ES');
    };

    if (loading) {
        return <Loading message="Cargando empresas..." />;
    }

    return (
        <div 
            className="container"
            style={{padding: '2rem 0'}}
        >
            <div className="d-flex justify-between align-center mb-4">
                <h1 style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <FaStore/> Gestión de Empresas
                </h1>
                <button 
                    className="btn btn-success"
                    onClick={() => setShowForm(!showForm)}
                    style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                >
                    <FaPlus/> Nueva Empresa
                </button>
            </div>

            {/* Formulario de nueva empresa */}
            {showForm && (
                <div className="card mb-4">
                    <h3>Registrar Nueva Empresa</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Nombre de la Empresa</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.nombre}
                                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                placeholder="Ej: Mi Empresa S.L."
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Dirección de la Empresa</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.direccion}
                                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                                placeholder="Ej: 0x1234567890abcdef1234567890abcdef12345678"
                                required
                            />
                            <small style={{color: '#666'}}>
                                Dirección de wallet de la empresa (debe ser diferente a la tuya)
                            </small>
                        </div>
                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary">
                                Registrar Empresa
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={() => setShowForm(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lista de empresas */}
            {empresas.length === 0 ? (
                <div className="card" style={{textAlign: 'center', padding: '3rem'}}>
                    <FaStore style={{fontSize: '3rem', color: '#ccc', marginBottom: '1rem'}}/>
                    <h3 style={{color: '#666'}}>No hay empresas registradas</h3>
                    <p style={{color: '#999'}}>
                        Registra la primera empresa para comenzar a usar el sistema.
                    </p>
                </div>
            ) : (
                <div className="grid grid-2 gap-3">
                    {empresas.map((empresa, index) => (
                        <div key={index} className="card" style={{padding: '1.5rem'}}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '1rem'
                            }}>
                                <div>
                                    <h3 style={{
                                        marginBottom: '0.5rem',
                                        color: '#2c3e50',
                                        fontSize: '1.3rem'
                                    }}>
                                        {empresa.nombre}
                                    </h3>
                                    <p style={{
                                        color: '#7f8c8d',
                                        fontSize: '0.9rem',
                                        fontFamily: 'monospace',
                                        wordBreak: 'break-all'
                                    }}>
                                        {empresa.empresaAddress}
                                    </p>
                                </div>
                                <div style={{
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    backgroundColor: empresa.activa ? '#d4edda' : '#f8d7da',
                                    color: empresa.activa ? '#155724' : '#721c24'
                                }}>
                                    {empresa.activa ? 'Activa' : 'Inactiva'}
                                </div>
                            </div>

                            <div style={{
                                background: '#f8f9fa',
                                padding: '1rem',
                                borderRadius: '8px',
                                marginBottom: '1rem'
                            }}>
                                <div style={{fontSize: '0.9rem', color: '#666'}}>
                                    <div style={{marginBottom: '0.5rem'}}>
                                        <strong>Fecha de Registro:</strong> {formatDate(empresa.fechaCreacion)}
                                    </div>
                                    <div>
                                        <strong>Estado:</strong> {empresa.activa ? 'Operativa' : 'Suspendida'}
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-primary"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        flex: 1
                                    }}
                                >
                                    <FaEye/>
                                    Ver Detalles
                                </button>
                                <button
                                    className="btn btn-warning"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <FaEdit/>
                                    Editar
                                </button>
                                <button
                                    className="btn btn-danger"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <FaTrash/>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Estadísticas */}
            <div className="card mt-4" style={{padding: '1.5rem'}}>
                <h3 style={{marginBottom: '1rem', color: '#2c3e50'}}>Estadísticas</h3>
                <div className="grid grid-3 gap-3">
                    <div style={{textAlign: 'center'}}>
                        <div style={{fontSize: '2rem', color: '#3498db', fontWeight: 'bold'}}>
                            {empresas.length}
                        </div>
                        <div style={{color: '#7f8c8d'}}>Empresas Totales</div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <div style={{fontSize: '2rem', color: '#27ae60', fontWeight: 'bold'}}>
                            {empresas.filter(e => e.activa).length}
                        </div>
                        <div style={{color: '#7f8c8d'}}>Empresas Activas</div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <div style={{fontSize: '2rem', color: '#e74c3c', fontWeight: 'bold'}}>
                            {empresas.filter(e => !e.activa).length}
                        </div>
                        <div style={{color: '#7f8c8d'}}>Empresas Inactivas</div>
                    </div>
                </div>
            </div>

            {/* Información adicional */}
            <div className="card mt-4">
                <h3 style={{marginBottom: '1rem', color: '#2c3e50'}}>
                    ℹ️ Información Importante
                </h3>
                <div style={{color: '#666', lineHeight: '1.6'}}>
                    <ul style={{paddingLeft: '1.5rem'}}>
                        <li>
                            <strong>Dirección de Empresa:</strong> Debe ser una dirección de wallet diferente a la tuya.
                        </li>
                        <li>
                            <strong>Estado Activo:</strong> Solo las empresas activas pueden vender productos.
                        </li>
                        <li>
                            <strong>Seguridad:</strong> Cada empresa tiene su propia dirección de wallet para transacciones.
                        </li>
                        <li>
                            <strong>Productos:</strong> Las empresas pueden agregar productos una vez registradas.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Empresas;