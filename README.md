# Voting dApp

dApp for DAO voting.

## Installation

```shell
git clone https://github.com/pom421/VotingDapp.git
cd VotingDapp
npm install
```

## Lancement du smart contract via truffle

1. *En local, il faut auparavant lancer un client Ethereum comme Ganache (ex: `ganache`)*
1. npm run truffle:migrate

*TODO: add a script to migrate on Goerli.*

## Lancement du client React

```shell
npm run client:start
```

*TODO: add a .env to have MNEMONIC and INFURA_ID for the React app.*

### MetaMask

- importer a private key of Ganache in MetaMask 
- aller sur localhost:8080
- connect the account in MetaMask
- check with write and read in homepage

## Déploiement sur Goerli

Add a `.env` file in truffle directory and fill it like `.env.dist`.

```shell
truffle migrate --network goerli
```




