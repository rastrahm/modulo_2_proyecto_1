#!/bin/bash

# Script de instalación para E-commerce Blockchain
# Autor: Rolando
# Fecha: 2024

echo "🛒 Instalando E-commerce Blockchain..."
echo "=================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar Node.js
print_status "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Por favor instala Node.js v16 o superior."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    print_error "Node.js versión $NODE_VERSION detectada. Se requiere v16 o superior."
    exit 1
fi

print_success "Node.js $(node --version) detectado"

# Verificar npm
print_status "Verificando npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado."
    exit 1
fi

print_success "npm $(npm --version) detectado"

# Instalar dependencias del proyecto principal
print_status "Instalando dependencias del proyecto principal..."
npm install
if [ $? -eq 0 ]; then
    print_success "Dependencias del proyecto instaladas"
else
    print_error "Error instalando dependencias del proyecto"
    exit 1
fi

# Instalar dependencias de contratos
print_status "Instalando dependencias de contratos..."
cd contracts
npm install
if [ $? -eq 0 ]; then
    print_success "Dependencias de contratos instaladas"
else
    print_error "Error instalando dependencias de contratos"
    exit 1
fi

# Compilar contratos
print_status "Compilando contratos..."
npm run compile
if [ $? -eq 0 ]; then
    print_success "Contratos compilados exitosamente"
else
    print_error "Error compilando contratos"
    exit 1
fi

cd ..

# Instalar dependencias del frontend
print_status "Instalando dependencias del frontend..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    print_success "Dependencias del frontend instaladas"
else
    print_error "Error instalando dependencias del frontend"
    exit 1
fi

cd ..

# Crear archivos de configuración si no existen
print_status "Configurando archivos de entorno..."

# Configurar contracts/.env
if [ ! -f "contracts/.env" ]; then
    print_status "Creando contracts/.env..."
    cat > contracts/.env << EOF
# Configuración de la red
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
RPC_URL=http://127.0.0.1:8545

# Configuración de IPFS
IPFS_URL=http://127.0.0.1:5001
IPFS_GATEWAY=https://ipfs.io/ipfs/

# Configuración de Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_stripe
STRIPE_SECRET_KEY=sk_test_tu_clave_secreta_stripe
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret
EOF
    print_success "Archivo contracts/.env creado"
else
    print_warning "El archivo contracts/.env ya existe"
fi

# Configurar frontend/.env
if [ ! -f "frontend/.env" ]; then
    print_status "Creando frontend/.env..."
    cat > frontend/.env << EOF
# Configuración de Stripe
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_stripe

# Configuración de IPFS
REACT_APP_IPFS_URL=http://127.0.0.1:5001
REACT_APP_IPFS_GATEWAY=https://ipfs.io/ipfs/

# Configuración de la red
REACT_APP_RPC_URL=http://127.0.0.1:8545
REACT_APP_NETWORK_ID=1337

# Direcciones de contratos (se actualizarán después del deployment)
REACT_APP_EURO_TOKEN_ADDRESS=
REACT_APP_EMPRESA_ADDRESS=
REACT_APP_PRODUCTO_ADDRESS=
REACT_APP_CLIENTE_ADDRESS=
REACT_APP_FACTURA_ADDRESS=
REACT_APP_ECOMMERCE_SYSTEM_ADDRESS=
EOF
    print_success "Archivo frontend/.env creado"
else
    print_warning "El archivo frontend/.env ya existe"
fi

# Crear directorio de deployments
print_status "Creando directorio de deployments..."
mkdir -p contracts/deployments
print_success "Directorio de deployments creado"

# Verificar MetaMask
print_status "Verificando MetaMask..."
if command -v google-chrome &> /dev/null; then
    print_warning "MetaMask debe estar instalado en Chrome para usar la aplicación"
elif command -v firefox &> /dev/null; then
    print_warning "MetaMask debe estar instalado en Firefox para usar la aplicación"
else
    print_warning "MetaMask debe estar instalado en tu navegador para usar la aplicación"
fi

# Verificar IPFS (opcional)
print_status "Verificando IPFS..."
if command -v ipfs &> /dev/null; then
    print_success "IPFS detectado: $(ipfs --version)"
    print_status "Para iniciar IPFS: ipfs daemon"
else
    print_warning "IPFS no detectado. Se usará un servicio público como fallback"
    print_status "Para instalar IPFS: npm install -g ipfs"
fi

echo ""
echo "🎉 ¡Instalación completada exitosamente!"
echo "=================================="
echo ""
echo "📋 Próximos pasos:"
echo "1. Configura las claves de Stripe en los archivos .env"
echo "2. Inicia la red local: cd contracts && npm run node"
echo "3. Despliega los contratos: cd contracts && npm run deploy"
echo "4. Inicia el frontend: cd frontend && npm start"
echo "5. Configura MetaMask con la red local (Chain ID: 1337)"
echo ""
echo "📚 Para más información, consulta el README.md"
echo ""
echo "🚀 ¡Disfruta tu sistema de E-commerce Blockchain!"
