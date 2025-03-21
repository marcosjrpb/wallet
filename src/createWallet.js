"use strict"; // Ativa o modo estrito para capturar erros comuns

// Importando as dependências
const bip32 = require('bip32');
const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');

// Função para gerar uma carteira
function generateWallet() {
    // Sempre escolhe a rede para a testnet
    const network = bitcoin.networks.testnet;

    // Caminho de derivação para a testnet
    const path = `m/49'/1'/0'/0`;

    // Gera a mnemônica (12 palavras)
    let mnemonic = bip39.generateMnemonic();

    // Valida a mnemônica
    if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error("Mnemônica inválida!");
    }

    // Converte a mnemônica para seed
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    // Gera a raiz da carteira HD
    let root = bip32.fromSeed(seed, network);

    // Cria a conta e deriva a chave
    let account = root.derivePath(path);
    let node = account.derive(0).derive(0);

    // Gera o endereço Bitcoin (testnet)
    let btcAddress = bitcoin.payments.p2pkh({
        pubkey: node.publicKey,
        network: network,
    }).address;

    // Verifica se o endereço começa com "m" ou "n" (Testnet)
    if (!btcAddress.startsWith('m') && !btcAddress.startsWith('n')) {
        throw new Error("Endereço gerado não é válido para a Testnet!");
    }

    // Retorna os dados gerados
    return {
        network: "Testnet", // Sempre Testnet
        address: btcAddress,
        privateKey: node.toWIF(),
        mnemonic: mnemonic
    };
}

// Criar carteira (sempre usará a testnet)
const wallet = generateWallet();

// Exibir os dados gerados
console.log("🔹 Carteira Gerada!");
console.log("📌 Rede:", wallet.network);
console.log("🏦 Endereço BTC:", wallet.address);
console.log("🔑 Chave Privada:", wallet.privateKey);
console.log("📝 Mnemônica:", wallet.mnemonic);
