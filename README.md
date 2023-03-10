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

## Déploiement du contrat sur Sepolia

Cloner le fichier `.env.dist` en `.env` dans le répertoire truffle et remplir les variables d'environnement.

```shell
npm run truffle:migrate:sepolia
```

PS: le fichier `.env` doit être bien configuré (i. e. avoir la mnémonique d'un wallet fourni en ETH sepolia).
PS: pour d'autres réseaux, ajouter la configuration dans truffle-config.js et le script dans package.json.

## Déploiement du client vers le contrat sur Sepolia

1. `npm run truffle:migrate:sepolia`.
1. Faire un commit du client car les fichiers .json dans contracts ont changé avec le networkd et l'adresse du contrat Voting; puis un git push.
1. Vercel va déployer automatiquement le client React vers le contrat sur Sepolia.

## FAQ

### Comment récupérer des eth sur Sepolia ? 

Aller sur https://sepolia-faucet.pk910.de/.