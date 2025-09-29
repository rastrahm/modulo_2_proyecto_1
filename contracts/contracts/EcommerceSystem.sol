// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./EuroToken.sol";
import "./Empresa.sol";
import "./Producto.sol";
import "./Cliente.sol";
import "./Factura.sol";

/**
 * @title EcommerceSystem
 * @dev Contrato principal que integra todo el sistema de e-commerce
 */
contract EcommerceSystem is Ownable, ReentrancyGuard {
    constructor() Ownable(msg.sender) {}
    // Referencias a los contratos
    EuroToken public euroToken;
    Empresa public empresaContract;
    Producto public productoContract;
    Cliente public clienteContract;
    Factura public facturaContract;
    
    // Estructura para items del carrito
    struct CartItem {
        address empresaAddress;
        uint256 productoId;
        uint256 cantidad;
        uint256 precio;
    }
    
    // Eventos
    event CompraRealizada(address indexed cliente, address indexed empresa, uint256 numeroFactura, uint256 total);
    event TokensTransferidos(address indexed from, address indexed to, uint256 amount);
    
    
    /**
     * @dev Configura las direcciones de los contratos
     */
    function configurarContratos(
        address _euroToken,
        address _empresaContract,
        address _productoContract,
        address _clienteContract,
        address _facturaContract
    ) external onlyOwner {
        euroToken = EuroToken(_euroToken);
        empresaContract = Empresa(_empresaContract);
        productoContract = Producto(_productoContract);
        clienteContract = Cliente(_clienteContract);
        facturaContract = Factura(_facturaContract);
    }
    
    /**
     * @dev Procesa una compra completa
     */
    function procesarCompra(
        address _empresaAddress,
        CartItem[] memory _items
    ) external nonReentrant {
        require(empresaContract.esEmpresaActiva(_empresaAddress), "La empresa no existe o no esta activa");
        require(_items.length > 0, "El carrito no puede estar vacio");
        
        uint256 totalCompra = 0;
        
        // Validar productos y calcular total
        for (uint256 i = 0; i < _items.length; i++) {
            CartItem memory item = _items[i];
            
            require(item.empresaAddress == _empresaAddress, "Todos los items deben ser de la misma empresa");
            require(productoContract.esProductoActivo(_empresaAddress, item.productoId), "Producto no existe o no esta activo");
            require(item.cantidad > 0, "La cantidad debe ser mayor a cero");
            
            // Obtener precio del producto
            (,,,uint256 precio,,,) = productoContract.productos(_empresaAddress, item.productoId);
            require(item.precio == precio, "El precio del item no coincide con el precio del producto");
            
            totalCompra += item.precio * item.cantidad;
        }
        
        // Verificar que el cliente tenga suficientes tokens
        require(euroToken.balanceOf(msg.sender) >= totalCompra, "Saldo insuficiente de tokens EURO");
        
        // Transferir tokens del cliente al contrato
        euroToken.transferFrom(msg.sender, address(this), totalCompra);
        
        // Crear factura
        uint256 numeroFactura = facturaContract.crearFactura(_empresaAddress, msg.sender, totalCompra);
        
        // Marcar factura como pagada
        facturaContract.marcarFacturaComoPagada(_empresaAddress, numeroFactura);
        
        // Registrar compra en el cliente
        clienteContract.registrarCompra(_empresaAddress, msg.sender, totalCompra);
        
        emit CompraRealizada(msg.sender, _empresaAddress, numeroFactura, totalCompra);
    }
    
    /**
     * @dev Obtiene el balance de tokens EURO de un usuario
     */
    function obtenerBalanceTokens(address _usuario) external view returns (uint256) {
        return euroToken.balanceOf(_usuario);
    }
    
    /**
     * @dev Obtiene información completa de un producto
     */
    function obtenerInfoProducto(address _empresaAddress, uint256 _productoId) external view returns (
        address empresaAddress,
        uint256 id,
        string memory nombre,
        uint256 precio,
        string memory imagenIPFS,
        bool activo,
        uint256 fechaCreacion
    ) {
        require(productoContract.esProductoActivo(_empresaAddress, _productoId), "Producto no existe o no esta activo");
        
        return productoContract.productos(_empresaAddress, _productoId);
    }
    
    /**
     * @dev Obtiene todos los productos de una empresa
     */
    function obtenerProductosEmpresa(address _empresaAddress) external view returns (Producto.ProductoData[] memory) {
        require(empresaContract.esEmpresaActiva(_empresaAddress), "La empresa no existe o no esta activa");
        return productoContract.obtenerProductosPorEmpresa(_empresaAddress);
    }
    
    /**
     * @dev Obtiene información de una empresa
     */
    function obtenerInfoEmpresa(address _empresaAddress) external view returns (Empresa.EmpresaData memory) {
        return empresaContract.obtenerEmpresa(_empresaAddress);
    }
    
    /**
     * @dev Obtiene el historial de compras de un cliente
     */
    function obtenerHistorialCompras(address _empresaAddress, address _clienteAddress) external view returns (Factura.FacturaData[] memory) {
        return facturaContract.obtenerFacturasPorCliente(_empresaAddress, _clienteAddress);
    }
    
    /**
     * @dev Obtiene el total de compras de un cliente
     */
    function obtenerTotalComprasCliente(address _empresaAddress, address _clienteAddress) external view returns (uint256) {
        return clienteContract.obtenerComprasTotales(_empresaAddress, _clienteAddress);
    }
    
    /**
     * @dev Función de emergencia para retirar tokens del contrato
     */
    function retirarTokens(uint256 _amount) external onlyOwner {
        require(euroToken.balanceOf(address(this)) >= _amount, "Saldo insuficiente en el contrato");
        euroToken.transfer(owner(), _amount);
    }
    
    /**
     * @dev Función para aprobar tokens (necesaria para las compras)
     */
    function aprobarTokens(uint256 _amount) external {
        euroToken.approve(address(this), _amount);
    }
}
