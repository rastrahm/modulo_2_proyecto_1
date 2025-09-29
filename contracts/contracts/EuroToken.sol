// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title EuroToken
 * @dev Token ERC20 que representa euros en el sistema
 * Este token no es negociable en mercados externos
 */
contract EuroToken is ERC20, Ownable, Pausable {
    // Comisión de entrada (en basis points, 100 = 1%)
    uint256 public entryFee = 250; // 2.5%
    
    // Comisión de salida (en basis points, 100 = 1%)
    uint256 public exitFee = 250; // 2.5%
    
    // Dirección del contrato de pagos
    address public paymentContract;
    
    // Eventos
    event TokensPurchased(address indexed buyer, uint256 euroAmount, uint256 tokenAmount, uint256 fee);
    event TokensWithdrawn(address indexed seller, uint256 tokenAmount, uint256 euroAmount, uint256 fee);
    event FeesUpdated(uint256 newEntryFee, uint256 newExitFee);
    
    constructor() ERC20("Euro Token", "EURO") Ownable(msg.sender) {
        // No se mintean tokens iniciales
    }
    
    modifier onlyPaymentContract() {
        require(msg.sender == paymentContract, "Solo el contrato de pagos puede llamar esta funcion");
        _;
    }
    
    /**
     * @dev Establece la dirección del contrato de pagos
     */
    function setPaymentContract(address _paymentContract) external onlyOwner {
        paymentContract = _paymentContract;
    }
    
    /**
     * @dev Actualiza las comisiones
     */
    function updateFees(uint256 _entryFee, uint256 _exitFee) external onlyOwner {
        require(_entryFee <= 1000, "Comision de entrada no puede ser mayor al 10%");
        require(_exitFee <= 1000, "Comision de salida no puede ser mayor al 10%");
        
        entryFee = _entryFee;
        exitFee = _exitFee;
        
        emit FeesUpdated(_entryFee, _exitFee);
    }
    
    /**
     * @dev Compra tokens con euros (llamado por el contrato de pagos)
     */
    function purchaseTokens(address buyer, uint256 euroAmount) external onlyPaymentContract whenNotPaused {
        uint256 fee = (euroAmount * entryFee) / 10000;
        uint256 tokenAmount = euroAmount - fee;
        
        _mint(buyer, tokenAmount);
        
        emit TokensPurchased(buyer, euroAmount, tokenAmount, fee);
    }
    
    /**
     * @dev Retira tokens por euros (llamado por el contrato de pagos)
     */
    function withdrawTokens(address seller, uint256 tokenAmount) external onlyPaymentContract whenNotPaused {
        require(balanceOf(seller) >= tokenAmount, "Saldo insuficiente");
        
        uint256 fee = (tokenAmount * exitFee) / 10000;
        uint256 euroAmount = tokenAmount - fee;
        
        _burn(seller, tokenAmount);
        
        emit TokensWithdrawn(seller, tokenAmount, euroAmount, fee);
    }
    
    /**
     * @dev Pausa el contrato
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Despausa el contrato
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Función para pausar transferencias (requerida por Pausable)
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._update(from, to, amount);
    }
}
