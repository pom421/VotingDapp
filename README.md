# Voting dapp

dapp for DAO voting.

## Installation

```shell
git clone https://github.com/pom421/VotingDapp.git
cd VotingDapp
npm install
```

## Lancement du smart contract via truffle

1. *En local, lancer un client Ethereum sur le port 8545 (ex: `ganache`)*
1. npm run truffle:migrate

## Lancement du client React

```shell
npm run client:start
```
### MetaMask

- importer a private key of Ganache in MetaMask 
- aller sur localhost:8080
- connect the account in MetaMask
- check with write and read in homepage

## Déploiement sur Sepolia

Cloner le fichier `.env.dist` en `.env` dans le répertoire truffle et remplir les variables d'environnement.

```shell
npm run truffle:migrate:sepolia
```

PS: pour d'autres réseaux, ajouter la configuration dans truffle-config.js et le script dans package.json.

## FAQ

### Comment récupérer des eth sur Sepolia ? 

Aller sur https://sepolia-faucet.pk910.de/.