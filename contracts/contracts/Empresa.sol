// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Empresa
 * @dev Contrato para gestionar empresas en el sistema
 */
contract Empresa is Ownable {
    constructor() Ownable(msg.sender) {}
    struct EmpresaData {
        address empresaAddress;
        string nombre;
        bool activa;
        uint256 fechaCreacion;
    }
    
    // Mapeo de direcciones a datos de empresa
    mapping(address => EmpresaData) public empresas;
    
    // Array de direcciones de empresas
    address[] public direccionesEmpresas;
    
    // Eventos
    event EmpresaRegistrada(address indexed empresaAddress, string nombre);
    event EmpresaActualizada(address indexed empresaAddress, string nuevoNombre);
    event EmpresaDesactivada(address indexed empresaAddress);
    
    /**
     * @dev Registra una nueva empresa
     */
    function registrarEmpresa(address _empresaAddress, string memory _nombre) external onlyOwner {
        require(_empresaAddress != address(0), "Direccion de empresa no puede ser cero");
        require(bytes(_nombre).length > 0, "El nombre no puede estar vacio");
        require(!empresas[_empresaAddress].activa, "La empresa ya esta registrada");
        
        empresas[_empresaAddress] = EmpresaData({
            empresaAddress: _empresaAddress,
            nombre: _nombre,
            activa: true,
            fechaCreacion: block.timestamp
        });
        
        direccionesEmpresas.push(_empresaAddress);
        
        emit EmpresaRegistrada(_empresaAddress, _nombre);
    }
    
    /**
     * @dev Actualiza el nombre de una empresa
     */
    function actualizarEmpresa(address _empresaAddress, string memory _nuevoNombre) external onlyOwner {
        require(empresas[_empresaAddress].activa, "La empresa no existe o no esta activa");
        require(bytes(_nuevoNombre).length > 0, "El nombre no puede estar vacio");
        
        empresas[_empresaAddress].nombre = _nuevoNombre;
        
        emit EmpresaActualizada(_empresaAddress, _nuevoNombre);
    }
    
    /**
     * @dev Desactiva una empresa
     */
    function desactivarEmpresa(address _empresaAddress) external onlyOwner {
        require(empresas[_empresaAddress].activa, "La empresa no existe o no esta activa");
        
        empresas[_empresaAddress].activa = false;
        
        emit EmpresaDesactivada(_empresaAddress);
    }
    
    /**
     * @dev Obtiene los datos de una empresa
     */
    function obtenerEmpresa(address _empresaAddress) external view returns (EmpresaData memory) {
        require(empresas[_empresaAddress].activa, "La empresa no existe o no esta activa");
        return empresas[_empresaAddress];
    }
    
    /**
     * @dev Verifica si una empresa está registrada y activa
     */
    function esEmpresaActiva(address _empresaAddress) external view returns (bool) {
        return empresas[_empresaAddress].activa;
    }
    
    /**
     * @dev Obtiene el número total de empresas
     */
    function obtenerTotalEmpresas() external view returns (uint256) {
        return direccionesEmpresas.length;
    }
    
    /**
     * @dev Obtiene todas las direcciones de empresas
     */
    function obtenerTodasLasEmpresas() external view returns (address[] memory) {
        return direccionesEmpresas;
    }
}
