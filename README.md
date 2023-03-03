# Voting dApp

dApp for DAO voting.

## Installation

```shell
git clone https://github.com/pom421/VotingDapp.git
cd VotingDapp
cd truffle
npm install
cd ../client
npm install
```

```shell
cd ../truffle
truffle migrate
truffle test # pour checker les tests
```

```shell
cd ../client
npm start
```

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




