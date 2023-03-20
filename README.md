# Voting dapp

dapp for DAO voting par Guilhain Averlant & Pierre-Olivier Mauguet.

Déploiement sur [voting-dapp-sage.vercel.app](voting-dapp-sage.vercel.app).

[Vidéo](https://drive.google.com/file/d/16jsxUY2Mi0KpyO-EBEJebaXl4zRvlRVY/view?usp=share_link) de démonstration.

## Table des matières
* [Installation et déploiement](#installation-et-déploiement)
* [Sécurité et optimisation](#sécurité-et-optimisation)
* [Documentation technique](#documentation-technique)

## Installation et déploiement

### Installation

```shell
git clone https://github.com/pom421/VotingDapp.git
cd VotingDapp
npm install
```

### Lancement du smart contract via truffle

1. *En local, lancer un client Ethereum sur le port 8545 (ex: `ganache`)*
1. npm run truffle:migrate

### Lancement du client React

```shell
npm run client:start
```
#### MetaMask

- importer a private key of Ganache in MetaMask 
- aller sur localhost:8080
- connect the account in MetaMask
- check with write and read in homepage

### Déploiement du contrat sur Sepolia

Cloner le fichier `.env.dist` en `.env` dans le répertoire truffle et remplir les variables d'environnement.

```shell
npm run truffle:migrate:sepolia
```

PS: le fichier `.env` doit être bien configuré (i. e. avoir la mnémonique d'un wallet fourni en ETH sepolia).
PS: pour d'autres réseaux, ajouter la configuration dans truffle-config.js et le script dans package.json.

### Déploiement du client vers le contrat sur Sepolia

1. `npm run truffle:migrate:sepolia`.
1. Faire un commit du client car les fichiers .json dans contracts ont changé avec le networkd et l'adresse du contrat Voting puis un git push.
1. Vercel va déployer automatiquement le client React vers le contrat sur Sepolia.

### FAQ

#### Comment récupérer des eth sur Sepolia ? 

Aller sur https://sepolia-faucet.pk910.de/.


## Sécurité et optimisation

### Sécurité

#### La faille

Pour des raisons de sécurité, nous avons supprimé la function `tallyVotes` car elle présentait une faille de sécurité de 
type DOS GAS LIMIT. Puisque si un attaquant publie un nombre important de `proposals`, la boucle qui calcule les 
résultats du vote peut atteindre la limite de gas autorisée par le réseau.

#### La solution

Pour combler cette faille de sécurité, il a été décidé de déplacer le calcul de la `proposal` victorieuse dans la
fonction `setVote`. Ainsi à chaque fois qu'un votant vote, la variable `winningProposalID` est mise à jour en comparant
la valeur `voteCount` stockée dans la struct `Proposal`.

##### Les propsitions écartées et pourquoi 

* Nous avons écarté la méthode de la _pagination_ car trop coûteuse en gas et peu efficace dans la mesure où le décompte 
peut se faire dans une autre fonction (en l'occurence ici `setVote`).
* la méthode de la _limitation_ du nombre de `Proposal` ne nous parait pas pertinente, car rien ne justifie sur une 
application de vote de limiter le nombre de candidatures.

### Optimisation

La suppression de la fonction `tallyVotes` invite à faire certaines modifications.

* L'étape `VotesTallied` de l'enum `WorkflowStatus` n'a plus de sens, elle a donc été supprimée.
* Pour des raisons d'économie de gas, nous avons stocké les `Proposal`  dans un `mapping` plutôt que dans un `array`.
Du coup on est obligé en contre partie d'ajouter une variable de type uint `proposalID` pour stocker l'identifiant de 
chaque proposal (utile également dans les `require` utilisés dans les fonction `setVote` et `getOneProposal`).

Quid : proposal GENESIS ?

On a gardé la notion de proposal GENESIS tel qu'implémenté dans la version initiale du code.

Vous trouverez ci-dessous les rapports de consomations de gas des sessions de tests de Voting.sol : 
- avant la correction de la faille de sécurité.
- aprés la correction de faille mais en gardant le stockage des proposals dans un array
- aprés la correction de la faille mais en stockant les proposals dans un mapping

#### Avant la correction de la faille


|  Contract     Method                     |  Min         |  Max        |  Avg        |  # calls     |
|------------------------------------------|--------------|-------------|-------------|--------------|
|  Voting       addProposal                |           -  |          -  |      59316  |          40  |
|  Voting       addVoter                   |           -  |          -  |      50220  |          38  |
|  Voting       endProposalsRegistering    |           -  |          -  |      30599  |          40  |
|  Voting       endVotingSession           |           -  |          -  |      30533  |          39  |
|  Voting       setVote                    |       60913  |      78013  |      61727  |          42  | 
|  Voting       startProposalsRegistering  |           -  |          -  |      95032  |           4  |
|  Voting       startVotingSession         |           -  |          -  |      30554  |           4  | 
|  Voting       tallyVotes                 |           -  |          -  |      66469  |          39  |
|  Voting                                  |           -  |          -  |  2 077 402  |      30.9 %  |


#### Après la correction de la faille et stockage des proposals dans un array


|  Contract    Method                     |  Min        |  Max         |  Avg        | # calls   |
|-----------------------------------------|--------------|-------------|-------------|-----------|
|  Voting      addProposal                |          -  |           -  |      59316  | 37        |
|  Voting      addVoter                   |          -  |           -  |      50220  | 35        |
|  Voting      endProposalsRegistering    |          -  |           -  |      30577  | 37        |
|  Voting      endVotingSession           |          -  |           -  |      30599  | 36        |
|  Voting      setVote                    |      63633  |      102747  |      65639  | 39        |
|  Voting      startProposalsRegistering  |          -  |           -  |      95010  | 4         |
|  Voting      startVotingSession         |          -  |           -  |      30554  | 4         |
|  Voting                                 |          -  |           -  |  1 983 006  | 29.5 %    |



#### Après la correction de la faille et stockage des proposals dans un mapping

|  Contract   Method                    |  Min        | Max    |  Avg        | # calls  | 
|---------------------------------------|-------------|--------|-------------|----------|
|  Voting     addProposal               |      59388  | 76488  |      60312  | 37       |
|  Voting     addVoter                  |          -  | -      |      50220  | 35       |
|  Voting     endProposalsRegistering   |          -  | -      |      30577  | 37       |
|  Voting     endVotingSession          |          -  | -      |      30599  | 36       |
|  Voting     setVote                   |      63289  | 102403 |      65295  | 39       |
|  Voting     startProposalsRegistering |          -  | -      |      72863  | 4        |
|  Voting     startVotingSession        |          -  | -      |      30554  | 4        |
|  Voting                               | -           |        | 1 967 236   | 29.3 %   |

On observe que le stockage dans un mapping consomme moins de gas dans sa globalité.

## Documentation technique (générée à partir des commentaires NatSpec du code Solidity)


This is a smart contract for conducting a voting process using blockchain technology. It allows voters to register, submit proposals, and vote on proposals. The voting process has multiple stages that are controlled by the contract owner. Voters can only vote once and can only vote on proposals that have been registered. The winning proposal is the one with the highest number of votes.

### Contract Information

* SPDX-License-Identifier: MIT
* pragma solidity ^0.8.17
* Import: "../node_modules/@openzeppelin/contracts/access/Ownable.sol"

### Contract Variables

#### Structs

* Voter: contains information about a voter, including registration status, vote status, and voted proposal ID.
* isRegistered: bool, indicating whether the voter is registered.
* hasVoted: bool, indicating whether the voter has voted.
* votedProposalId: uint, indicating the ID of the proposal that the voter has voted for.
* Proposal: contains information about a proposal, including its description and vote count.
* description: string, representing the proposal's description.
* voteCount: uint, indicating the number of votes the proposal has received.

#### Enums

* WorkflowStatus: indicates the current stage of the voting process.
* RegisteringVoters: the contract is currently registering voters.
* ProposalsRegistrationStarted: the contract is currently accepting proposal submissions.
* ProposalsRegistrationEnded: the contract has stopped accepting proposal submissions.
* VotingSessionStarted: the contract is currently accepting votes.
* VotingSessionEnded: the contract has stopped accepting votes.

#### Public Variables

* winningProposalID: uint, indicating the ID of the proposal with the highest number of votes.
* proposalID: uint, indicating the current number of proposals.

#### Mappings

* proposalsMapping: maps proposal IDs to Proposal structs.
* voters: maps voter addresses to Voter structs.

#### Contract Events

* VoterRegistered: emitted when a new voter is registered.
* WorkflowStatusChange: emitted when the workflow status changes.
* ProposalRegistered: emitted when a new proposal is added.
* Voted: emitted when a voter casts a vote.

#### Contract Functions

### Getters

* getVoter(address _addr): returns the voter information for a given address.
* getOneProposal(uint _id): returns a single proposal from the proposalsMapping based on its ID.

##### Registration

* addVoter(address _addr): registers a new voter by adding their address to the list of voters.
* addProposal(string calldata _desc): adds a new proposal to the proposalsMapping.

##### Vote

setVote(uint _id): allows a registered voter to vote for a proposal with a given ID.

##### State

* startProposalsRegistering(): allows the owner to start the proposals registration process.
* endProposalsRegistering(): ends the proposals registration period.
* startVotingSession(): starts the voting session.
* endVotingSession(): ends the voting session and updates the workflow status to VotingSessionEnded.

