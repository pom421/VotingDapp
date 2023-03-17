# Voting Smart Contract Documentation

## Introduction

This smart contract is designed to facilitate voting using blockchain technology. It allows voters to register, submit proposals, and vote on proposals in a secure and transparent manner. The contract is controlled by the contract owner, who can initiate and manage the various stages of the voting process.

## Contract Details
Name: Voting
License: MIT License
Solidity version: ^0.8.17
Author: Alyra. Updated by Guilhain Averlant & Pierre Olivier Mauget
Dependencies: OpenZeppelin Ownable library

## Workflow Status

The contract has a WorkflowStatus enum that specifies the various stages of the voting process:

RegisteringVoters: This is the initial stage where voters are registered
ProposalsRegistrationStarted: This stage allows registered voters to submit proposals
ProposalsRegistrationEnded: This stage ends the proposal submission period
VotingSessionStarted: This stage allows registered voters to vote on proposals
VotingSessionEnded: This stage ends the voting period and determines the winning proposal
The contract owner can move the contract between these stages using various functions.

## Data Structures
The contract has two main data structures: Voter and Proposal.

### Voter:

isRegistered: Boolean value indicating whether the voter is registered
hasVoted: Boolean value indicating whether the voter has voted
votedProposalId: ID of the proposal that the voter has voted for

### Proposal:

description: String containing the proposal description
voteCount: Number of votes that the proposal has received

## Functions

The following functions are available in this contract:

### Getter - getVoter

```solidity
function getVoter(address _addr) external onlyVoters view returns (Voter memory)
```

Returns the voter information for a given address.


#### Parameters:

_addr: Address of the voter to retrieve information for.

#### Returns:

Voter information including registration status, vote status, and voted proposal ID.

### Getter - getOneProposal

```solidity
function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory)
```

Returns a single proposal from the proposalsArray based on its ID.

#### Parameters:

_id: ID of the proposal to retrieve.

#### Returns:

Proposal object containing all of its details.

### Registration - addVoter


``` solidity
function addVoter(address _addr) external onlyOwner
```
Registers a new voter by adding their address to the list of voters.

#### Requirements:

The workflow status must be "RegisteringVoters".
The voter must not already be registered.

#### Parameters:

_addr: Address of the voter to register.

#### Events:

VoterRegistered: emitted when a new voter is registered.


### Registration - addProposal

```solidity
function addProposal(string calldata _desc) external onlyVoters
```

Adds a new proposal to the proposals array.

#### Requirements:

The workflow status must be set to ProposalsRegistrationStarted.
The proposal description cannot be an empty string.
Only registered voters can add a proposal.

#### Parameters:

_desc: String representing the proposal's description.

#### Events:

ProposalRegistered: emitted when a new proposal is added to the proposals array.

### Voting - setVote

```solidity
function setVote(uint _id) external onlyVoters
```
Allows a registered voter to vote for a proposal with a given ID.

#### Requirements:

Voting session must have started.
The voter must not have voted before.
The proposal



