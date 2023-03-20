# Voting smart contract documentation

This is a smart contract for conducting a voting process using blockchain technology. It allows voters to register, submit proposals, and vote on proposals. The voting process has multiple stages that are controlled by the contract owner. Voters can only vote once and can only vote on proposals that have been registered. The winning proposal is the one with the highest number of votes.

# Contract Information

* SPDX-License-Identifier: MIT
* pragma solidity ^0.8.17
* Import: "../node_modules/@openzeppelin/contracts/access/Ownable.sol"

# Contract Variables

## Structs

* Voter: contains information about a voter, including registration status, vote status, and voted proposal ID.
* isRegistered: bool, indicating whether the voter is registered.
* hasVoted: bool, indicating whether the voter has voted.
* votedProposalId: uint, indicating the ID of the proposal that the voter has voted for.
* Proposal: contains information about a proposal, including its description and vote count.
* description: string, representing the proposal's description.
* voteCount: uint, indicating the number of votes the proposal has received.

## Enums

* WorkflowStatus: indicates the current stage of the voting process.
* RegisteringVoters: the contract is currently registering voters.
* ProposalsRegistrationStarted: the contract is currently accepting proposal submissions.
* ProposalsRegistrationEnded: the contract has stopped accepting proposal submissions.
* VotingSessionStarted: the contract is currently accepting votes.
* VotingSessionEnded: the contract has stopped accepting votes.

## Public Variables

* winningProposalID: uint, indicating the ID of the proposal with the highest number of votes.
* proposalID: uint, indicating the current number of proposals.

## Mappings

* proposalsMapping: maps proposal IDs to Proposal structs.
* voters: maps voter addresses to Voter structs.

## Contract Events

* VoterRegistered: emitted when a new voter is registered.
* WorkflowStatusChange: emitted when the workflow status changes.
* ProposalRegistered: emitted when a new proposal is added.
* Voted: emitted when a voter casts a vote.

## Contract Functions

### Getters

* getVoter(address _addr): returns the voter information for a given address.
* getOneProposal(uint _id): returns a single proposal from the proposalsMapping based on its ID.

### Registration

* addVoter(address _addr): registers a new voter by adding their address to the list of voters.
* addProposal(string calldata _desc): adds a new proposal to the proposalsMapping.

### Vote

setVote(uint _id): allows a registered voter to vote for a proposal with a given ID.

### State

* startProposalsRegistering(): allows the owner to start the proposals registration process.
* endProposalsRegistering(): ends the proposals registration period.
* startVotingSession(): starts the voting session.
* endVotingSession(): ends the voting session and updates the workflow status to VotingSessionEnded.

