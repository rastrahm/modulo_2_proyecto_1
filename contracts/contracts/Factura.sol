// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Empresa.sol";

/**
 * @title Factura
 * @dev Contrato para gestionar facturas del sistema
 */
contract Factura is Ownable {
    constructor(address _empresaContract) Ownable(msg.sender) {
        empresaContract = Empresa(_empresaContract);
    }
    struct FacturaData {
        address empresaAddress;
        uint256 numero;
        uint256 fecha;
        address clienteAddress;
        uint256 importeTotal; // Importe en tokens EURO
        bool pagada;
        uint256 fechaCreacion;
    }
    
    // Mapeo de empresa => número => datos de la factura
    mapping(address => mapping(uint256 => FacturaData)) public facturas;
    
    // Mapeo de empresa => array de números de factura
    mapping(address => uint256[]) public facturasPorEmpresa;
    
    // Contador de facturas por empresa
    mapping(address => uint256) public contadorFacturas;
    
    // Referencia al contrato de empresas
    Empresa public empresaContract;
    
    // Eventos
    event FacturaCreada(address indexed empresaAddress, uint256 indexed numero, address indexed clienteAddress, uint256 importeTotal);
    event FacturaPagada(address indexed empresaAddress, uint256 indexed numero, uint256 importeTotal);
    
    
    modifier soloEmpresaActiva(address _empresaAddress) {
        require(empresaContract.esEmpresaActiva(_empresaAddress), "La empresa no existe o no esta activa");
        _;
    }
    
    /**
     * @dev Crea una nueva factura
     */
    function crearFactura(
        address _empresaAddress,
        address _clienteAddress,
        uint256 _importeTotal
    ) external onlyOwner soloEmpresaActiva(_empresaAddress) returns (uint256) {
        require(_clienteAddress != address(0), "Direccion de cliente no puede ser cero");
        require(_importeTotal > 0, "El importe debe ser mayor a cero");
        
        uint256 nuevoNumero = contadorFacturas[_empresaAddress] + 1;
        contadorFacturas[_empresaAddress] = nuevoNumero;
        
        facturas[_empresaAddress][nuevoNumero] = FacturaData({
            empresaAddress: _empresaAddress,
            numero: nuevoNumero,
            fecha: block.timestamp,
            clienteAddress: _clienteAddress,
            importeTotal: _importeTotal,
            pagada: false,
            fechaCreacion: block.timestamp
        });
        
        facturasPorEmpresa[_empresaAddress].push(nuevoNumero);
        
        emit FacturaCreada(_empresaAddress, nuevoNumero, _clienteAddress, _importeTotal);
        
        return nuevoNumero;
    }
    
    /**
     * @dev Marca una factura como pagada
     */
    function marcarFacturaComoPagada(address _empresaAddress, uint256 _numero) external onlyOwner {
        require(facturas[_empresaAddress][_numero].empresaAddress != address(0), "La factura no existe");
        require(!facturas[_empresaAddress][_numero].pagada, "La factura ya esta pagada");
        
        facturas[_empresaAddress][_numero].pagada = true;
        
        emit FacturaPagada(_empresaAddress, _numero, facturas[_empresaAddress][_numero].importeTotal);
    }
    
    /**
     * @dev Obtiene los datos de una factura
     */
    function obtenerFactura(address _empresaAddress, uint256 _numero) external view returns (FacturaData memory) {
        require(facturas[_empresaAddress][_numero].empresaAddress != address(0), "La factura no existe");
        return facturas[_empresaAddress][_numero];
    }
    
    /**
     * @dev Obtiene todas las facturas de una empresa
     */
    function obtenerFacturasPorEmpresa(address _empresaAddress) external view returns (FacturaData[] memory) {
        uint256[] memory numeros = facturasPorEmpresa[_empresaAddress];
        FacturaData[] memory resultado = new FacturaData[](numeros.length);
        
        for (uint256 i = 0; i < numeros.length; i++) {
            resultado[i] = facturas[_empresaAddress][numeros[i]];
        }
        
        return resultado;
    }
    
    /**
     * @dev Obtiene las facturas de un cliente específico
     */
    function obtenerFacturasPorCliente(address _empresaAddress, address _clienteAddress) external view returns (FacturaData[] memory) {
        uint256[] memory numeros = facturasPorEmpresa[_empresaAddress];
        uint256 contador = 0;
        
        // Contar facturas del cliente
        for (uint256 i = 0; i < numeros.length; i++) {
            if (facturas[_empresaAddress][numeros[i]].clienteAddress == _clienteAddress) {
                contador++;
            }
        }
        
        // Crear array con el tamaño correcto
        FacturaData[] memory resultado = new FacturaData[](contador);
        uint256 indice = 0;
        
        for (uint256 i = 0; i < numeros.length; i++) {
            if (facturas[_empresaAddress][numeros[i]].clienteAddress == _clienteAddress) {
                resultado[indice] = facturas[_empresaAddress][numeros[i]];
                indice++;
            }
        }
        
        return resultado;
    }
    
    /**
     * @dev Obtiene el número total de facturas de una empresa
     */
    function obtenerTotalFacturasPorEmpresa(address _empresaAddress) external view returns (uint256) {
        return contadorFacturas[_empresaAddress];
    }
    
    /**
     * @dev Verifica si una factura está pagada
     */
    function esFacturaPagada(address _empresaAddress, uint256 _numero) external view returns (bool) {
        require(facturas[_empresaAddress][_numero].empresaAddress != address(0), "La factura no existe");
        return facturas[_empresaAddress][_numero].pagada;
    }
    
    /**
     * @dev Obtiene el total de facturas pagadas de una empresa
     */
    function obtenerTotalFacturasPagadas(address _empresaAddress) external view returns (uint256) {
        uint256[] memory numeros = facturasPorEmpresa[_empresaAddress];
        uint256 contador = 0;
        
        for (uint256 i = 0; i < numeros.length; i++) {
            if (facturas[_empresaAddress][numeros[i]].pagada) {
                contador++;
            }
        }
        
        return contador;
    }
}
