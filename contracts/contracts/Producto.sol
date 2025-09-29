// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Empresa.sol";

/**
 * @title Producto
 * @dev Contrato para gestionar productos de las empresas
 */
contract Producto is Ownable {
    constructor(address _empresaContract) Ownable(msg.sender) {
        empresaContract = Empresa(_empresaContract);
    }
    struct ProductoData {
        address empresaAddress;
        uint256 id;
        string nombre;
        uint256 precio; // Precio en tokens EURO
        string imagenIPFS; // Hash IPFS de la imagen
        bool activo;
        uint256 fechaCreacion;
    }
    
    // Mapeo de empresa => id => datos del producto
    mapping(address => mapping(uint256 => ProductoData)) public productos;
    
    // Mapeo de empresa => array de IDs de productos
    mapping(address => uint256[]) public productosPorEmpresa;
    
    // Contador de productos por empresa
    mapping(address => uint256) public contadorProductos;
    
    // Referencia al contrato de empresas
    Empresa public empresaContract;
    
    // Eventos
    event ProductoCreado(address indexed empresaAddress, uint256 indexed id, string nombre, uint256 precio, string imagenIPFS);
    event ProductoActualizado(address indexed empresaAddress, uint256 indexed id, string nombre, uint256 precio, string imagenIPFS);
    event ProductoDesactivado(address indexed empresaAddress, uint256 indexed id);
    
    
    modifier soloEmpresaActiva(address _empresaAddress) {
        require(empresaContract.esEmpresaActiva(_empresaAddress), "La empresa no existe o no esta activa");
        _;
    }
    
    /**
     * @dev Crea un nuevo producto
     */
    function crearProducto(
        address _empresaAddress,
        string memory _nombre,
        uint256 _precio,
        string memory _imagenIPFS
    ) external onlyOwner soloEmpresaActiva(_empresaAddress) {
        require(bytes(_nombre).length > 0, "El nombre no puede estar vacio");
        require(_precio > 0, "El precio debe ser mayor a cero");
        require(bytes(_imagenIPFS).length > 0, "La imagen IPFS es requerida");
        
        uint256 nuevoId = contadorProductos[_empresaAddress] + 1;
        contadorProductos[_empresaAddress] = nuevoId;
        
        productos[_empresaAddress][nuevoId] = ProductoData({
            empresaAddress: _empresaAddress,
            id: nuevoId,
            nombre: _nombre,
            precio: _precio,
            imagenIPFS: _imagenIPFS,
            activo: true,
            fechaCreacion: block.timestamp
        });
        
        productosPorEmpresa[_empresaAddress].push(nuevoId);
        
        emit ProductoCreado(_empresaAddress, nuevoId, _nombre, _precio, _imagenIPFS);
    }
    
    /**
     * @dev Actualiza un producto existente
     */
    function actualizarProducto(
        address _empresaAddress,
        uint256 _id,
        string memory _nombre,
        uint256 _precio,
        string memory _imagenIPFS
    ) external onlyOwner soloEmpresaActiva(_empresaAddress) {
        require(productos[_empresaAddress][_id].activo, "El producto no existe o no esta activo");
        require(bytes(_nombre).length > 0, "El nombre no puede estar vacio");
        require(_precio > 0, "El precio debe ser mayor a cero");
        require(bytes(_imagenIPFS).length > 0, "La imagen IPFS es requerida");
        
        productos[_empresaAddress][_id].nombre = _nombre;
        productos[_empresaAddress][_id].precio = _precio;
        productos[_empresaAddress][_id].imagenIPFS = _imagenIPFS;
        
        emit ProductoActualizado(_empresaAddress, _id, _nombre, _precio, _imagenIPFS);
    }
    
    /**
     * @dev Desactiva un producto
     */
    function desactivarProducto(address _empresaAddress, uint256 _id) external onlyOwner {
        require(productos[_empresaAddress][_id].activo, "El producto no existe o no esta activo");
        
        productos[_empresaAddress][_id].activo = false;
        
        emit ProductoDesactivado(_empresaAddress, _id);
    }
    
    /**
     * @dev Obtiene los datos de un producto
     */
    function obtenerProducto(address _empresaAddress, uint256 _id) external view returns (ProductoData memory) {
        require(productos[_empresaAddress][_id].activo, "El producto no existe o no esta activo");
        return productos[_empresaAddress][_id];
    }
    
    /**
     * @dev Obtiene todos los productos de una empresa
     */
    function obtenerProductosPorEmpresa(address _empresaAddress) external view returns (ProductoData[] memory) {
        uint256[] memory ids = productosPorEmpresa[_empresaAddress];
        ProductoData[] memory productosActivos = new ProductoData[](ids.length);
        
        uint256 contadorActivos = 0;
        for (uint256 i = 0; i < ids.length; i++) {
            if (productos[_empresaAddress][ids[i]].activo) {
                productosActivos[contadorActivos] = productos[_empresaAddress][ids[i]];
                contadorActivos++;
            }
        }
        
        // Crear array del tamaño correcto
        ProductoData[] memory resultado = new ProductoData[](contadorActivos);
        for (uint256 i = 0; i < contadorActivos; i++) {
            resultado[i] = productosActivos[i];
        }
        
        return resultado;
    }
    
    /**
     * @dev Obtiene el número total de productos de una empresa
     */
    function obtenerTotalProductosPorEmpresa(address _empresaAddress) external view returns (uint256) {
        return contadorProductos[_empresaAddress];
    }
    
    /**
     * @dev Verifica si un producto está activo
     */
    function esProductoActivo(address _empresaAddress, uint256 _id) external view returns (bool) {
        return productos[_empresaAddress][_id].activo;
    }
}
