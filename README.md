# 🛒 E-commerce Blockchain

Sistema de comercio electrónico descentralizado que integra blockchain, pagos con Stripe e IPFS para un ecosistema completo y seguro.

## 🚀 Características Principales

### Backend (Solidity)
- **Contratos Inteligentes**: Sistema completo de e-commerce con ABM
- **Token EURO**: Token ERC-20 personalizado para pagos
- **Gestión de Empresas**: Registro y administración de empresas
- **Catálogo de Productos**: Productos con imágenes en IPFS
- **Sistema de Facturación**: Facturas automáticas en blockchain
- **Gestión de Clientes**: Seguimiento de compras y historial

### Frontend (React)
- **Interfaz Moderna**: UI responsiva y atractiva
- **Integración MetaMask**: Conexión directa con wallets
- **Gestión de Tokens**: Compra y retiro de tokens EURO
- **Carrito de Compras**: Sistema completo de compras
- **Panel de Administración**: Gestión completa del sistema

### Integraciones
- **Stripe**: Pasarela de pagos para compra/venta de tokens
- **IPFS**: Almacenamiento descentralizado de imágenes
- **MetaMask**: Integración con wallets Ethereum

## 📋 Funcionalidades Implementadas

### ✅ ABM Completo
1. **Empresas**: Registro, actualización y gestión
2. **Productos**: Creación con imágenes en IPFS
3. **Facturas**: Generación automática en compras
4. **Clientes**: Registro automático y seguimiento

### ✅ Sistema de Pagos
- Compra de tokens EURO con tarjeta (Stripe)
- Retiro de tokens a euros (Stripe)
- Comisiones de entrada y salida (2.5%)
- Gestión de gas de red

### ✅ E-commerce
- Catálogo de productos por empresa
- Carrito de compras funcional
- Procesamiento de compras con tokens
- Historial de facturas

### ✅ Almacenamiento
- Imágenes de productos en IPFS
- Optimización automática de imágenes
- Validación de tipos de archivo

## 🛠️ Tecnologías Utilizadas

### Blockchain
- **Solidity**: Contratos inteligentes
- **Hardhat**: Framework de desarrollo
- **OpenZeppelin**: Librerías de contratos seguros
- **Ethers.js**: Interacción con blockchain

### Frontend
- **React**: Framework de UI
- **React Router**: Navegación
- **Styled Components**: Estilos
- **React Icons**: Iconografía

### Servicios Externos
- **Stripe**: Procesamiento de pagos
- **IPFS**: Almacenamiento descentralizado
- **MetaMask**: Wallet integration

## 📦 Instalación

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn
- MetaMask instalado
- IPFS node (opcional, se puede usar servicio público)

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd proyecto01
```

### 2. Instalar Dependencias del Proyecto
```bash
npm install
```

### 3. Configurar Contratos
```bash
cd contracts
npm install
```

### 4. Configurar Frontend
```bash
cd ../frontend
npm install
```

### 5. Configurar Variables de Entorno
Copia el archivo de ejemplo y configura las variables:

```bash
# En contracts/
cp env.example .env

# En frontend/
cp .env.example .env
```

Configura las siguientes variables:

```env
# contracts/.env
PRIVATE_KEY=tu_clave_privada_aqui
RPC_URL=http://127.0.0.1:8545
IPFS_URL=http://127.0.0.1:5001
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_stripe

# frontend/.env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_stripe
REACT_APP_IPFS_URL=http://127.0.0.1:5001
REACT_APP_IPFS_GATEWAY=https://ipfs.io/ipfs/
REACT_APP_RPC_URL=http://127.0.0.1:8545
REACT_APP_NETWORK_ID=1337
```

## 🚀 Ejecución

### 1. Iniciar Red Local de Hardhat
```bash
cd contracts
npm run node
```

### 2. Desplegar Contratos
En una nueva terminal:
```bash
cd contracts
npm run deploy
```

### 3. Iniciar Frontend
En una nueva terminal:
```bash
cd frontend
npm start
```

### 4. Configurar MetaMask
- Red: Localhost 8545
- Chain ID: 1337
- RPC URL: http://127.0.0.1:8545

## 📱 Uso del Sistema

### 1. Conectar Wallet
- Instala MetaMask
- Conecta tu wallet a la red local
- Asegúrate de tener ETH para gas

### 2. Comprar Tokens EURO
- Ve a la sección "Tokens"
- Ingresa tu email y cantidad en euros
- Completa el pago con Stripe
- Recibe tokens EURO en tu wallet

### 3. Explorar Productos
- Ve a "Productos" para ver el catálogo
- Las imágenes se cargan desde IPFS
- Añade productos al carrito

### 4. Realizar Compras
- Ve a "Carrito" para revisar tu compra
- Confirma la compra con tokens EURO
- Recibe factura automática en blockchain

### 5. Administrar Sistema
- Ve a "Admin" para gestión completa
- Registra nuevas empresas
- Crea productos con imágenes
- Monitorea estadísticas

## 🏗️ Arquitectura del Sistema

### Contratos Inteligentes

#### EuroToken.sol
- Token ERC-20 personalizado
- Comisiones de entrada/salida
- Integración con Stripe

#### Empresa.sol
- Registro de empresas
- Gestión de estado activo/inactivo
- Validaciones de seguridad

#### Producto.sol
- Catálogo de productos
- Integración con IPFS
- Gestión por empresa

#### Cliente.sol
- Registro automático de clientes
- Seguimiento de compras
- Historial de transacciones

#### Factura.sol
- Generación automática
- Estado de pago
- Consultas por empresa/cliente

#### EcommerceSystem.sol
- Contrato principal
- Integración de todos los módulos
- Procesamiento de compras

### Frontend

#### Servicios
- **contractService**: Interacción con blockchain
- **stripeService**: Integración con Stripe
- **ipfsService**: Gestión de IPFS
- **walletService**: Gestión de wallets

#### Componentes
- **Navbar**: Navegación principal
- **Footer**: Información del sistema
- **Loading**: Estados de carga

#### Páginas
- **Home**: Página principal
- **Empresas**: Gestión de empresas
- **Productos**: Catálogo y creación
- **Carrito**: Sistema de compras
- **Tokens**: Compra/venta de tokens
- **Facturas**: Historial de compras
- **Admin**: Panel de administración

## 🔧 Configuración Avanzada

### IPFS
```bash
# Instalar IPFS
npm install -g ipfs

# Inicializar nodo
ipfs init

# Iniciar daemon
ipfs daemon
```

### Stripe
1. Crea una cuenta en [Stripe](https://stripe.com)
2. Obtén las claves de API
3. Configura webhooks para eventos
4. Actualiza las variables de entorno

### MetaMask
1. Instala la extensión
2. Crea una cuenta de prueba
3. Configura la red local
4. Importa cuentas de Hardhat

## 🧪 Testing

### Contratos
```bash
cd contracts
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 📊 Monitoreo

### Logs de Contratos
```bash
cd contracts
npm run node
```

### Logs de Frontend
```bash
cd frontend
npm start
```

### IPFS
```bash
ipfs stats bw
```

## 🚨 Solución de Problemas

### Error de Conexión a MetaMask
- Verifica que MetaMask esté instalado
- Confirma la red local (Chain ID: 1337)
- Asegúrate de tener ETH para gas

### Error de IPFS
- Verifica que el nodo IPFS esté ejecutándose
- Usa un gateway público como fallback
- Revisa la configuración de URL

### Error de Stripe
- Verifica las claves de API
- Confirma que estás en modo test
- Revisa la configuración de webhooks

## 📈 Próximas Mejoras

- [ ] Implementar tests unitarios completos
- [ ] Añadir sistema de reputación
- [ ] Implementar descuentos y cupones
- [ ] Añadir sistema de reviews
- [ ] Implementar notificaciones push
- [ ] Añadir analytics avanzados
- [ ] Implementar sistema de afiliados

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Rolando** - Desarrollo completo del sistema

## 🙏 Agradecimientos

- CodeCrypto por el curso
- OpenZeppelin por las librerías
- Stripe por la pasarela de pagos
- IPFS por el almacenamiento descentralizado

---

**Nota**: Este es un proyecto educativo. Para uso en producción, se requieren auditorías de seguridad adicionales y configuraciones específicas del entorno.
