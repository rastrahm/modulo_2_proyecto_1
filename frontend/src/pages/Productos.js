import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaBox, FaPlus, FaShoppingCart, FaImage, FaEuroSign } from 'react-icons/fa';
import { contractService } from '../services/contractService';
import { ipfsService } from '../services/ipfsService';
import Loading from '../components/Loading';

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedEmpresa, setSelectedEmpresa] = useState('');
    const [formData, setFormData] = useState({
        nombre: '',
        precio: '',
        imagen: null
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const empresasData = await contractService.getAllEmpresas();
            setEmpresas(empresasData);

            // Cargar productos de todas las empresas
            const allProductos = [];
            for (const empresa of empresasData) {
                try {
                    const productosEmpresa = await contractService.getProductosByEmpresa(empresa.empresaAddress);
                    allProductos.push(...productosEmpresa);
                } catch (error) {
                    console.error(`Error cargando productos de ${empresa.nombre}:`, error);
                }
            }
            setProductos(allProductos);
        } catch (error) {
            console.error('Error cargando datos:', error);
            toast.error('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (file) => {
        try {
            setLoading(true);
            const ipfsHash = await ipfsService.uploadFile(file);
            setFormData(prev => ({ ...prev, imagen: ipfsHash }));
            toast.success('Imagen subida exitosamente');
        } catch (error) {
            console.error('Error subiendo imagen:', error);
            toast.error('Error al subir la imagen');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedEmpresa) {
            toast.error('Por favor selecciona una empresa');
            return;
        }

        if (!formData.imagen) {
            toast.error('Por favor sube una imagen del producto');
            return;
        }

        try {
            setLoading(true);
            const precioWei = (parseFloat(formData.precio) * 1e18).toString();
            
            await contractService.crearProducto(
                selectedEmpresa,
                formData.nombre,
                precioWei,
                formData.imagen
            );

            toast.success('Producto creado exitosamente');
            setFormData({ nombre: '', precio: '', imagen: null });
            setSelectedEmpresa('');
            setShowForm(false);
            await loadData();
        } catch (error) {
            console.error('Error creando producto:', error);
            toast.error('Error al crear el producto');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (producto) => {
        // Aquí se implementaría la lógica para agregar al carrito
        toast.success(`${producto.nombre} agregado al carrito`);
    };

    const formatPrice = (price) => {
        return (parseFloat(price) / 1e18).toFixed(4);
    };

    if (loading) {
        return <Loading message="Cargando productos..." />;
    }

    return (
        <div 
            className="container"
            style={{padding: '2rem 0'}}
        >
            <div className="d-flex justify-between align-center mb-4">
                <h1 style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <FaBox/> Catálogo de Productos
                </h1>
                <button 
                    className="btn btn-success"
                    onClick={() => setShowForm(!showForm)}
                    style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                >
                    <FaPlus/> Nuevo Producto
                </button>
            </div>

            {/* Formulario de nuevo producto */}
            {showForm && (
                <div className="card mb-4">
                    <h3>Crear Nuevo Producto</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Empresa</label>
                            <select 
                                className="form-input"
                                value={selectedEmpresa}
                                onChange={(e) => setSelectedEmpresa(e.target.value)}
                                required
                            >
                                <option value="">Selecciona una empresa</option>
                                {empresas.map((empresa, index) => (
                                    <option key={index} value={empresa.empresaAddress}>
                                        {empresa.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Nombre del Producto</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.nombre}
                                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                                placeholder="Ingresa el nombre del producto"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Precio (EURO)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-input"
                                value={formData.precio}
                                onChange={(e) => setFormData(prev => ({ ...prev, precio: e.target.value }))}
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Imagen del Producto</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="form-input"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) handleImageUpload(file);
                                }}
                                required
                            />
                            {formData.imagen && (
                                <div style={{marginTop: '0.5rem'}}>
                                    <small style={{color: 'green'}}>
                                        ✅ Imagen subida: {formData.imagen}
                                    </small>
                                </div>
                            )}
                        </div>

                        <div className="d-flex gap-2">
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                Crear Producto
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

            {/* Lista de productos */}
            {productos.length === 0 ? (
                <div className="card" style={{textAlign: 'center', padding: '3rem'}}>
                    <FaBox style={{fontSize: '3rem', color: '#ccc', marginBottom: '1rem'}}/>
                    <h3 style={{color: '#666'}}>No hay productos disponibles</h3>
                    <p style={{color: '#999'}}>
                        Crea tu primer producto o espera a que las empresas agreguen productos al catálogo.
                    </p>
                </div>
            ) : (
                <div className="grid grid-3 gap-3">
                    {productos.map((producto, index) => (
                        <div key={index} className="card" style={{padding: '1.5rem'}}>
                            <div style={{marginBottom: '1rem'}}>
                                {producto.imagenIPFS ? (
                                    <img
                                        src={`https://ipfs.io/ipfs/${producto.imagenIPFS}`}
                                        alt={producto.nombre}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            marginBottom: '1rem'
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div 
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            background: '#f8f9fa',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '8px',
                                            marginBottom: '1rem',
                                            color: '#6c757d'
                                        }}
                                    >
                                        <FaImage style={{fontSize: '2rem'}}/>
                                    </div>
                                )}
                            </div>

                            <h3 style={{
                                marginBottom: '0.5rem',
                                fontSize: '1.2rem',
                                color: '#2c3e50'
                            }}>
                                {producto.nombre}
                            </h3>

                            <p style={{
                                color: '#7f8c8d',
                                fontSize: '0.9rem',
                                marginBottom: '1rem'
                            }}>
                                Empresa: {producto.empresaAddress.slice(0, 6)}...{producto.empresaAddress.slice(-4)}
                            </p>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1rem'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    color: '#27ae60'
                                }}>
                                    <FaEuroSign/>
                                    {formatPrice(producto.precio)} EURO
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => addToCart(producto)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        flex: 1
                                    }}
                                >
                                    <FaShoppingCart/>
                                    Agregar al Carrito
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
                            {productos.length}
                        </div>
                        <div style={{color: '#7f8c8d'}}>Productos Totales</div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <div style={{fontSize: '2rem', color: '#e74c3c', fontWeight: 'bold'}}>
                            {empresas.length}
                        </div>
                        <div style={{color: '#7f8c8d'}}>Empresas Activas</div>
                    </div>
                    <div style={{textAlign: 'center'}}>
                        <div style={{fontSize: '2rem', color: '#f39c12', fontWeight: 'bold'}}>
                            {productos.filter(p => p.imagenIPFS).length}
                        </div>
                        <div style={{color: '#7f8c8d'}}>Con Imágenes</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Productos;