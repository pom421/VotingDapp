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

## Déploiement total sur Sepolia

```shell
npm run run:sepolia
```

Ceci va lancer le déploiement du contrat sur la chain Sepolia, copier le stub dans client/contrats, puis lancer le client React.
Il est nécessaire d'avoir un fichier `.env` qui comporte une mnémonic dont le 1er compte est pourvu en ETH sur Sepolia, afin que le dépoiement soit possible (paiement en gas).

## FAQ

### Comment récupérer des eth sur Sepolia ? 

Aller sur https://sepolia-faucet.pk910.de/.