import { ethers } from 'ethers';

// ABI de los contratos (simplificado para el ejemplo)
const EURO_TOKEN_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function purchaseTokens(address buyer, uint256 euroAmount)",
    "function withdrawTokens(address seller, uint256 tokenAmount)",
    "event TokensPurchased(address indexed buyer, uint256 euroAmount, uint256 tokenAmount, uint256 fee)",
    "event TokensWithdrawn(address indexed seller, uint256 tokenAmount, uint256 euroAmount, uint256 fee)"
];

const EMPRESA_ABI = [
    "function registrarEmpresa(address _empresaAddress, string memory _nombre)",
    "function obtenerEmpresa(address _empresaAddress) view returns (tuple(address empresaAddress, string nombre, bool activa, uint256 fechaCreacion))",
    "function esEmpresaActiva(address _empresaAddress) view returns (bool)",
    "function obtenerTodasLasEmpresas() view returns (address[])",
    "event EmpresaRegistrada(address indexed empresaAddress, string nombre)"
];

const PRODUCTO_ABI = [
    "function crearProducto(address _empresaAddress, string memory _nombre, uint256 _precio, string memory _imagenIPFS)",
    "function obtenerProducto(address _empresaAddress, uint256 _id) view returns (tuple(address empresaAddress, uint256 id, string nombre, uint256 precio, string imagenIPFS, bool activo, uint256 fechaCreacion))",
    "function obtenerProductosPorEmpresa(address _empresaAddress) view returns (tuple(address empresaAddress, uint256 id, string nombre, uint256 precio, string imagenIPFS, bool activo, uint256 fechaCreacion)[])",
    "function esProductoActivo(address _empresaAddress, uint256 _id) view returns (bool)",
    "event ProductoCreado(address indexed empresaAddress, uint256 indexed id, string nombre, uint256 precio, string imagenIPFS)"
];

const CLIENTE_ABI = [
    "function registrarCliente(address _empresaAddress, address _clienteAddress)",
    "function registrarCompra(address _empresaAddress, address _clienteAddress, uint256 _monto)",
    "function obtenerCliente(address _empresaAddress, address _clienteAddress) view returns (tuple(address empresaAddress, address clienteAddress, uint256 comprasTotales, uint256 fechaRegistro, bool activo))",
    "function obtenerComprasTotales(address _empresaAddress, address _clienteAddress) view returns (uint256)",
    "event ClienteRegistrado(address indexed empresaAddress, address indexed clienteAddress)",
    "event CompraRealizada(address indexed empresaAddress, address indexed clienteAddress, uint256 monto, uint256 nuevoTotal)"
];

const FACTURA_ABI = [
    "function crearFactura(address _empresaAddress, address _clienteAddress, uint256 _importeTotal) returns (uint256)",
    "function marcarFacturaComoPagada(address _empresaAddress, uint256 _numero)",
    "function obtenerFactura(address _empresaAddress, uint256 _numero) view returns (tuple(address empresaAddress, uint256 numero, uint256 fecha, address clienteAddress, uint256 importeTotal, bool pagada, uint256 fechaCreacion))",
    "function obtenerFacturasPorEmpresa(address _empresaAddress) view returns (tuple(address empresaAddress, uint256 numero, uint256 fecha, address clienteAddress, uint256 importeTotal, bool pagada, uint256 fechaCreacion)[])",
    "function obtenerFacturasPorCliente(address _empresaAddress, address _clienteAddress) view returns (tuple(address empresaAddress, uint256 numero, uint256 fecha, address clienteAddress, uint256 importeTotal, bool pagada, uint256 fechaCreacion)[])",
    "event FacturaCreada(address indexed empresaAddress, uint256 indexed numero, address indexed clienteAddress, uint256 importeTotal)",
    "event FacturaPagada(address indexed empresaAddress, uint256 indexed numero, uint256 importeTotal)"
];

const ECOMMERCE_SYSTEM_ABI = [
    "function procesarCompra(address _empresaAddress, tuple(address empresaAddress, uint256 productoId, uint256 cantidad, uint256 precio)[] _items)",
    "function obtenerBalanceTokens(address _usuario) view returns (uint256)",
    "function obtenerInfoProducto(address _empresaAddress, uint256 _productoId) view returns (address, uint256, string, uint256, string, bool, uint256)",
    "function obtenerProductosEmpresa(address _empresaAddress) view returns (tuple(address empresaAddress, uint256 id, string nombre, uint256 precio, string imagenIPFS, bool activo, uint256 fechaCreacion)[])",
    "function obtenerInfoEmpresa(address _empresaAddress) view returns (tuple(address empresaAddress, string nombre, bool activa, uint256 fechaCreacion))",
    "function obtenerHistorialCompras(address _empresaAddress, address _clienteAddress) view returns (tuple(address empresaAddress, uint256 numero, uint256 fecha, address clienteAddress, uint256 importeTotal, bool pagada, uint256 fechaCreacion)[])",
    "function obtenerTotalComprasCliente(address _empresaAddress, address _clienteAddress) view returns (uint256)",
    "event CompraRealizada(address indexed cliente, address indexed empresa, uint256 numeroFactura, uint256 total)"
];

class ContractService {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.euroToken = null;
        this.empresaContract = null;
        this.productoContract = null;
        this.clienteContract = null;
        this.facturaContract = null;
        this.ecommerceSystem = null;
        this.contractAddresses = {};
    }

    async initialize() {
        try {
            // Configurar provider
            if (window.ethereum) {
                this.provider = new ethers.BrowserProvider(window.ethereum);
                this.signer = await this.provider.getSigner();
            } else {
                // Fallback para desarrollo local
                this.provider = new ethers.JsonRpcProvider(process.env.REACT_APP_RPC_URL || 'http://127.0.0.1:8545');
            }

            // Cargar direcciones de contratos (en producción, estas vendrían de un archivo de configuración)
            await this.loadContractAddresses();

            // Inicializar contratos
            await this.initializeContracts();

        } catch (error) {
            console.error('Error inicializando ContractService:', error);
            throw error;
        }
    }

    async loadContractAddresses() {
        // En un entorno real, estas direcciones vendrían de un archivo de configuración
        // o de una API que devuelva las direcciones desplegadas
        this.contractAddresses = {
            euroToken: process.env.REACT_APP_EURO_TOKEN_ADDRESS || '0x...',
            empresa: process.env.REACT_APP_EMPRESA_ADDRESS || '0x...',
            producto: process.env.REACT_APP_PRODUCTO_ADDRESS || '0x...',
            cliente: process.env.REACT_APP_CLIENTE_ADDRESS || '0x...',
            factura: process.env.REACT_APP_FACTURA_ADDRESS || '0x...',
            ecommerceSystem: process.env.REACT_APP_ECOMMERCE_SYSTEM_ADDRESS || '0x...'
        };
    }

    async initializeContracts() {
        try {
            // Inicializar EuroToken
            if (this.contractAddresses.euroToken && this.contractAddresses.euroToken !== '0x...') {
                this.euroToken = new ethers.Contract(
                    this.contractAddresses.euroToken,
                    EURO_TOKEN_ABI,
                    this.signer || this.provider
                );
            }

            // Inicializar Empresa
            if (this.contractAddresses.empresa && this.contractAddresses.empresa !== '0x...') {
                this.empresaContract = new ethers.Contract(
                    this.contractAddresses.empresa,
                    EMPRESA_ABI,
                    this.signer || this.provider
                );
            }

            // Inicializar Producto
            if (this.contractAddresses.producto && this.contractAddresses.producto !== '0x...') {
                this.productoContract = new ethers.Contract(
                    this.contractAddresses.producto,
                    PRODUCTO_ABI,
                    this.signer || this.provider
                );
            }

            // Inicializar Cliente
            if (this.contractAddresses.cliente && this.contractAddresses.cliente !== '0x...') {
                this.clienteContract = new ethers.Contract(
                    this.contractAddresses.cliente,
                    CLIENTE_ABI,
                    this.signer || this.provider
                );
            }

            // Inicializar Factura
            if (this.contractAddresses.factura && this.contractAddresses.factura !== '0x...') {
                this.facturaContract = new ethers.Contract(
                    this.contractAddresses.factura,
                    FACTURA_ABI,
                    this.signer || this.provider
                );
            }

            // Inicializar EcommerceSystem
            if (this.contractAddresses.ecommerceSystem && this.contractAddresses.ecommerceSystem !== '0x...') {
                this.ecommerceSystem = new ethers.Contract(
                    this.contractAddresses.ecommerceSystem,
                    ECOMMERCE_SYSTEM_ABI,
                    this.signer || this.provider
                );
            }

        } catch (error) {
            console.error('Error inicializando contratos:', error);
            throw error;
        }
    }

    // Métodos para interactuar con EuroToken
    async getTokenBalance(address) {
        if (!this.euroToken) throw new Error('EuroToken no inicializado');
        const balance = await this.euroToken.balanceOf(address);
        return ethers.formatEther(balance);
    }

    async purchaseTokens(buyerAddress, euroAmount) {
        if (!this.euroToken) throw new Error('EuroToken no inicializado');
        const tx = await this.euroToken.purchaseTokens(buyerAddress, ethers.parseEther(euroAmount.toString()));
        return await tx.wait();
    }

    async withdrawTokens(sellerAddress, tokenAmount) {
        if (!this.euroToken) throw new Error('EuroToken no inicializado');
        const tx = await this.euroToken.withdrawTokens(sellerAddress, ethers.parseEther(tokenAmount.toString()));
        return await tx.wait();
    }

    // Métodos para interactuar con Empresa
    async registerEmpresa(empresaAddress, nombre) {
        if (!this.empresaContract) throw new Error('Empresa contract no inicializado');
        const tx = await this.empresaContract.registrarEmpresa(empresaAddress, nombre);
        return await tx.wait();
    }

    async getEmpresa(empresaAddress) {
        if (!this.empresaContract) throw new Error('Empresa contract no inicializado');
        return await this.empresaContract.obtenerEmpresa(empresaAddress);
    }

    async getAllEmpresas() {
        if (!this.empresaContract) throw new Error('Empresa contract no inicializado');
        const addresses = await this.empresaContract.obtenerTodasLasEmpresas();
        const empresas = [];

        for (const address of addresses) {
            try {
                const empresa = await this.getEmpresa(address);
                empresas.push(empresa);
            } catch (error) {
                console.error(`Error obteniendo empresa ${address}:`, error);
            }
        }

        return empresas;
    }

    // Métodos para interactuar con Producto
    async createProducto(empresaAddress, nombre, precio, imagenIPFS) {
        if (!this.productoContract) throw new Error('Producto contract no inicializado');
        const tx = await this.productoContract.crearProducto(
            empresaAddress,
            nombre,
            ethers.parseEther(precio.toString()),
            imagenIPFS
        );
        return await tx.wait();
    }

    async getProducto(empresaAddress, productoId) {
        if (!this.productoContract) throw new Error('Producto contract no inicializado');
        return await this.productoContract.obtenerProducto(empresaAddress, productoId);
    }

    async getProductosByEmpresa(empresaAddress) {
        if (!this.productoContract) throw new Error('Producto contract no inicializado');
        return await this.productoContract.obtenerProductosPorEmpresa(empresaAddress);
    }

    // Métodos para interactuar con EcommerceSystem
    async processPurchase(empresaAddress, items) {
        if (!this.ecommerceSystem) throw new Error('EcommerceSystem no inicializado');

        // Preparar items para el contrato
        const contractItems = items.map(item => ({
            empresaAddress: item.empresaAddress,
            productoId: item.productoId,
            cantidad: item.cantidad,
            precio: ethers.parseEther(item.precio.toString())
        }));

        const tx = await this.ecommerceSystem.procesarCompra(empresaAddress, contractItems);
        return await tx.wait();
    }

    async getPurchaseHistory(empresaAddress, clienteAddress) {
        if (!this.ecommerceSystem) throw new Error('EcommerceSystem no inicializado');
        return await this.ecommerceSystem.obtenerHistorialCompras(empresaAddress, clienteAddress);
    }

    // Método para actualizar el signer cuando cambia la cuenta
    async updateSigner() {
        if (this.provider && window.ethereum) {
            this.signer = await this.provider.getSigner();
            await this.initializeContracts();
        }
    }
}

export const contractService = new ContractService();