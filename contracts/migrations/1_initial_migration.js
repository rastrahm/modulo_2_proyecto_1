const EuroToken = artifacts.require("EuroToken");
const Empresa = artifacts.require("Empresa");
const Producto = artifacts.require("Producto");
const Cliente = artifacts.require("Cliente");
const Factura = artifacts.require("Factura");
const EcommerceSystem = artifacts.require("EcommerceSystem");

module.exports = async function(deployer, network, accounts) {
    console.log("🚀 Iniciando deployment de contratos...");
    console.log("📝 Desplegando con la cuenta:", accounts[0]);

    // 1. Desplegar EuroToken
    console.log("\n1️⃣ Desplegando EuroToken...");
    await deployer.deploy(EuroToken);
    const euroToken = await EuroToken.deployed();
    console.log("✅ EuroToken desplegado en:", euroToken.address);

    // 2. Desplegar Empresa
    console.log("\n2️⃣ Desplegando Empresa...");
    await deployer.deploy(Empresa);
    const empresa = await Empresa.deployed();
    console.log("✅ Empresa desplegado en:", empresa.address);

    // 3. Desplegar Producto
    console.log("\n3️⃣ Desplegando Producto...");
    await deployer.deploy(Producto, empresa.address);
    const producto = await Producto.deployed();
    console.log("✅ Producto desplegado en:", producto.address);

    // 4. Desplegar Cliente
    console.log("\n4️⃣ Desplegando Cliente...");
    await deployer.deploy(Cliente, empresa.address);
    const cliente = await Cliente.deployed();
    console.log("✅ Cliente desplegado en:", cliente.address);

    // 5. Desplegar Factura
    console.log("\n5️⃣ Desplegando Factura...");
    await deployer.deploy(Factura, empresa.address);
    const factura = await Factura.deployed();
    console.log("✅ Factura desplegado en:", factura.address);

    // 6. Desplegar EcommerceSystem
    console.log("\n6️⃣ Desplegando EcommerceSystem...");
    await deployer.deploy(EcommerceSystem);
    const ecommerceSystem = await EcommerceSystem.deployed();
    console.log("✅ EcommerceSystem desplegado en:", ecommerceSystem.address);

    // 7. Configurar EcommerceSystem
    console.log("\n7️⃣ Configurando EcommerceSystem...");
    await ecommerceSystem.configurarContratos(
        euroToken.address,
        empresa.address,
        producto.address,
        cliente.address,
        factura.address
    );
    console.log("✅ EcommerceSystem configurado");

    // 8. Configurar EuroToken
    console.log("\n8️⃣ Configurando EuroToken...");
    await euroToken.setPaymentContract(ecommerceSystem.address);
    console.log("✅ EuroToken configurado");

    // 9. Transferir ownership de contratos al EcommerceSystem
    console.log("\n9️⃣ Configurando ownership...");
    await empresa.transferOwnership(ecommerceSystem.address);
    await producto.transferOwnership(ecommerceSystem.address);
    await cliente.transferOwnership(ecommerceSystem.address);
    await factura.transferOwnership(ecommerceSystem.address);
    console.log("✅ Ownership configurado");

    // Guardar direcciones en un archivo
    const addresses = {
        EuroToken: euroToken.address,
        Empresa: empresa.address,
        Producto: producto.address,
        Cliente: cliente.address,
        Factura: factura.address,
        EcommerceSystem: ecommerceSystem.address,
        Deployer: accounts[0],
        Network: network
    };

    const fs = require('fs');
    const path = require('path');

    // Crear directorio de deployments si no existe
    const deploymentsDir = path.join(__dirname, '..', 'deployments');
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir);
    }

    // Guardar direcciones
    const filename = `deployment-${network}-${Date.now()}.json`;
    const filepath = path.join(deploymentsDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(addresses, null, 2));

    console.log("\n📋 Resumen del deployment:");
    console.log("=".repeat(50));
    console.log("🌐 Red:", network);
    console.log("👤 Deployer:", accounts[0]);
    console.log("💰 EuroToken:", euroToken.address);
    console.log("🏢 Empresa:", empresa.address);
    console.log("📦 Producto:", producto.address);
    console.log("👥 Cliente:", cliente.address);
    console.log("🧾 Factura:", factura.address);
    console.log("🛒 EcommerceSystem:", ecommerceSystem.address);
    console.log("📁 Archivo guardado:", filepath);
    console.log("=".repeat(50));

    console.log("\n🎉 ¡Deployment completado exitosamente!");
};