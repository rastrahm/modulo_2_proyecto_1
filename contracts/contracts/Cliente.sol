// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Empresa.sol";

/**
 * @title Cliente
 * @dev Contrato para gestionar clientes de las empresas
 */
contract Cliente is Ownable {
    constructor(address _empresaContract) Ownable(msg.sender) {
        empresaContract = Empresa(_empresaContract);
    }
    struct ClienteData {
        address empresaAddress;
        address clienteAddress;
        uint256 comprasTotales; // Total de compras en tokens EURO
        uint256 fechaRegistro;
        bool activo;
    }
    
    // Mapeo de empresa => cliente => datos del cliente
    mapping(address => mapping(address => ClienteData)) public clientes;
    
    // Mapeo de empresa => array de direcciones de clientes
    mapping(address => address[]) public clientesPorEmpresa;
    
    // Referencia al contrato de empresas
    Empresa public empresaContract;
    
    // Eventos
    event ClienteRegistrado(address indexed empresaAddress, address indexed clienteAddress);
    event CompraRealizada(address indexed empresaAddress, address indexed clienteAddress, uint256 monto, uint256 nuevoTotal);
    event ClienteDesactivado(address indexed empresaAddress, address indexed clienteAddress);
    
    
    modifier soloEmpresaActiva(address _empresaAddress) {
        require(empresaContract.esEmpresaActiva(_empresaAddress), "La empresa no existe o no esta activa");
        _;
    }
    
    /**
     * @dev Registra un nuevo cliente para una empresa
     */
    function registrarCliente(address _empresaAddress, address _clienteAddress) external onlyOwner soloEmpresaActiva(_empresaAddress) {
        require(_clienteAddress != address(0), "Direccion de cliente no puede ser cero");
        require(!clientes[_empresaAddress][_clienteAddress].activo, "El cliente ya esta registrado para esta empresa");
        
        clientes[_empresaAddress][_clienteAddress] = ClienteData({
            empresaAddress: _empresaAddress,
            clienteAddress: _clienteAddress,
            comprasTotales: 0,
            fechaRegistro: block.timestamp,
            activo: true
        });
        
        clientesPorEmpresa[_empresaAddress].push(_clienteAddress);
        
        emit ClienteRegistrado(_empresaAddress, _clienteAddress);
    }
    
    /**
     * @dev Registra una compra y actualiza el total del cliente
     */
    function registrarCompra(
        address _empresaAddress,
        address _clienteAddress,
        uint256 _monto
    ) external onlyOwner soloEmpresaActiva(_empresaAddress) {
        require(_monto > 0, "El monto debe ser mayor a cero");
        
        // Si el cliente no existe, lo registramos automáticamente
        if (!clientes[_empresaAddress][_clienteAddress].activo) {
            clientes[_empresaAddress][_clienteAddress] = ClienteData({
                empresaAddress: _empresaAddress,
                clienteAddress: _clienteAddress,
                comprasTotales: 0,
                fechaRegistro: block.timestamp,
                activo: true
            });
            
            clientesPorEmpresa[_empresaAddress].push(_clienteAddress);
            emit ClienteRegistrado(_empresaAddress, _clienteAddress);
        }
        
        clientes[_empresaAddress][_clienteAddress].comprasTotales += _monto;
        
        emit CompraRealizada(_empresaAddress, _clienteAddress, _monto, clientes[_empresaAddress][_clienteAddress].comprasTotales);
    }
    
    /**
     * @dev Desactiva un cliente
     */
    function desactivarCliente(address _empresaAddress, address _clienteAddress) external onlyOwner {
        require(clientes[_empresaAddress][_clienteAddress].activo, "El cliente no existe o no esta activo");
        
        clientes[_empresaAddress][_clienteAddress].activo = false;
        
        emit ClienteDesactivado(_empresaAddress, _clienteAddress);
    }
    
    /**
     * @dev Obtiene los datos de un cliente
     */
    function obtenerCliente(address _empresaAddress, address _clienteAddress) external view returns (ClienteData memory) {
        require(clientes[_empresaAddress][_clienteAddress].activo, "El cliente no existe o no esta activo");
        return clientes[_empresaAddress][_clienteAddress];
    }
    
    /**
     * @dev Obtiene todos los clientes de una empresa
     */
    function obtenerClientesPorEmpresa(address _empresaAddress) external view returns (ClienteData[] memory) {
        address[] memory direcciones = clientesPorEmpresa[_empresaAddress];
        ClienteData[] memory clientesActivos = new ClienteData[](direcciones.length);
        
        uint256 contadorActivos = 0;
        for (uint256 i = 0; i < direcciones.length; i++) {
            if (clientes[_empresaAddress][direcciones[i]].activo) {
                clientesActivos[contadorActivos] = clientes[_empresaAddress][direcciones[i]];
                contadorActivos++;
            }
        }
        
        // Crear array del tamaño correcto
        ClienteData[] memory resultado = new ClienteData[](contadorActivos);
        for (uint256 i = 0; i < contadorActivos; i++) {
            resultado[i] = clientesActivos[i];
        }
        
        return resultado;
    }
    
    /**
     * @dev Obtiene el número total de clientes de una empresa
     */
    function obtenerTotalClientesPorEmpresa(address _empresaAddress) external view returns (uint256) {
        return clientesPorEmpresa[_empresaAddress].length;
    }
    
    /**
     * @dev Verifica si un cliente está registrado y activo
     */
    function esClienteActivo(address _empresaAddress, address _clienteAddress) external view returns (bool) {
        return clientes[_empresaAddress][_clienteAddress].activo;
    }
    
    /**
     * @dev Obtiene el total de compras de un cliente
     */
    function obtenerComprasTotales(address _empresaAddress, address _clienteAddress) external view returns (uint256) {
        if (!clientes[_empresaAddress][_clienteAddress].activo) {
            return 0;
        }
        return clientes[_empresaAddress][_clienteAddress].comprasTotales;
    }
}
