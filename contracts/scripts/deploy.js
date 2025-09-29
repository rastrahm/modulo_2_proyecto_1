const hre = require("hardhat");

async function main() {
    console.log("🚀 Iniciando deployment de contratos...");

    // Obtener el deployer
    const [deployer] = await hre.ethers.getSigners();
    console.log("📝 Desplegando contratos con la cuenta:", deployer.address);
    const deployerBalanceWei = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Balance de la cuenta:", hre.ethers.formatEther(deployerBalanceWei), "ETH");

    // 1. Desplegar EuroToken
    console.log("\n1️⃣ Desplegando EuroToken...");
    const EuroToken = await hre.ethers.getContractFactory("EuroToken");
    const euroToken = await EuroToken.deploy();
    await euroToken.waitForDeployment();
    const euroTokenAddress = await euroToken.getAddress();
    console.log("✅ EuroToken desplegado en:", euroTokenAddress);

    // 2. Desplegar Empresa
    console.log("\n2️⃣ Desplegando Empresa...");
    const Empresa = await hre.ethers.getContractFactory("Empresa");
    const empresa = await Empresa.deploy();
    await empresa.waitForDeployment();
    const empresaAddress = await empresa.getAddress();
    console.log("✅ Empresa desplegado en:", empresaAddress);

    // 3. Desplegar Producto
    console.log("\n3️⃣ Desplegando Producto...");
    const Producto = await hre.ethers.getContractFactory("Producto");
    const producto = await Producto.deploy(empresaAddress);
    await producto.waitForDeployment();
    const productoAddress = await producto.getAddress();
    console.log("✅ Producto desplegado en:", productoAddress);

    // 4. Desplegar Cliente
    console.log("\n4️⃣ Desplegando Cliente...");
    const Cliente = await hre.ethers.getContractFactory("Cliente");
    const cliente = await Cliente.deploy(empresaAddress);
    await cliente.waitForDeployment();
    const clienteAddress = await cliente.getAddress();
    console.log("✅ Cliente desplegado en:", clienteAddress);

    // 5. Desplegar Factura
    console.log("\n5️⃣ Desplegando Factura...");
    const Factura = await hre.ethers.getContractFactory("Factura");
    const factura = await Factura.deploy(empresaAddress);
    await factura.waitForDeployment();
    const facturaAddress = await factura.getAddress();
    console.log("✅ Factura desplegado en:", facturaAddress);

    // 6. Desplegar EcommerceSystem
    console.log("\n6️⃣ Desplegando EcommerceSystem...");
    const EcommerceSystem = await hre.ethers.getContractFactory("EcommerceSystem");
    const ecommerceSystem = await EcommerceSystem.deploy();
    await ecommerceSystem.waitForDeployment();
    const ecommerceSystemAddress = await ecommerceSystem.getAddress();
    console.log("✅ EcommerceSystem desplegado en:", ecommerceSystemAddress);

    // 7. Configurar EcommerceSystem
    console.log("\n7️⃣ Configurando EcommerceSystem...");
    await ecommerceSystem.configurarContratos(
        euroTokenAddress,
        empresaAddress,
        productoAddress,
        clienteAddress,
        facturaAddress
    );
    console.log("✅ EcommerceSystem configurado");

    // 8. Configurar EuroToken
    console.log("\n8️⃣ Configurando EuroToken...");
    await euroToken.setPaymentContract(ecommerceSystemAddress);
    console.log("✅ EuroToken configurado");

    // 9. Transferir ownership de contratos al EcommerceSystem
    console.log("\n9️⃣ Configurando ownership...");
    await empresa.transferOwnership(ecommerceSystemAddress);
    await producto.transferOwnership(ecommerceSystemAddress);
    await cliente.transferOwnership(ecommerceSystemAddress);
    await factura.transferOwnership(ecommerceSystemAddress);
    console.log("✅ Ownership configurado");

    // Guardar direcciones en un archivo
    const addresses = {
        EuroToken: euroTokenAddress,
        Empresa: empresaAddress,
        Producto: productoAddress,
        Cliente: clienteAddress,
        Factura: facturaAddress,
        EcommerceSystem: ecommerceSystemAddress,
        Deployer: deployer.address,
        Network: hre.network.name
    };

    const fs = require('fs');
    const path = require('path');

    // Crear directorio de deployments si no existe
    const deploymentsDir = path.join(__dirname, '..', 'deployments');
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir);
    }

    // Guardar direcciones
    const filename = `deployment-${hre.network.name}-${Date.now()}.json`;
    const filepath = path.join(deploymentsDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(addresses, null, 2));

    console.log("\n📋 Resumen del deployment:");
    console.log("=".repeat(50));
    console.log("🌐 Red:", hre.network.name);
    console.log("👤 Deployer:", deployer.address);
    console.log("💰 EuroToken:", euroToken.address);
    console.log("🏢 Empresa:", empresa.address);
    console.log("📦 Producto:", producto.address);
    console.log("👥 Cliente:", cliente.address);
    console.log("🧾 Factura:", factura.address);
    console.log("🛒 EcommerceSystem:", ecommerceSystem.address);
    console.log("📁 Archivo guardado:", filepath);
    console.log("=".repeat(50));

    console.log("\n🎉 ¡Deployment completado exitosamente!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Error durante el deployment:", error);
        process.exit(1);
    });