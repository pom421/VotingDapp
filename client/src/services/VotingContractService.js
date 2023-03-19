// MEMO data solidity
// ------------------
// struct Voter {
//   bool isRegistered;
//   bool hasVoted;
//   uint votedProposalId;
// }

// struct Proposal {
//   string description;
//   uint voteCount;
// }

// event VoterRegistered(address voterAddress);
// event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
// event ProposalRegistered(uint proposalId);
// event Voted (address voter, uint proposalId);

const EventName = {
  VoterRegistered: "VoterRegistered",
  WorkflowStatusChange: "WorkflowStatusChange",
  ProposalRegistered: "ProposalRegistered",
  Voted: "Voted",
}

export class VotingContractService {
  static INSTANCE = null

  owner
  contract
  connectedUser = []

  constructor({ contract, connectedUser }) {
    this.contract = contract
    this.connectedUser = connectedUser
  }

  static getInstance({ contract, connectedUser }) {
    if (connectedUser === null && contract === null) return null
    if (this.INSTANCE === null) {
      this.INSTANCE = new VotingContractService({ contract, connectedUser })
    } else if (this.INSTANCE.connectedUser !== connectedUser) {
      this.INSTANCE = new VotingContractService({ contract, connectedUser })
    }
    return this.INSTANCE
  }

  async getOwner() {
    return await this.contract.methods.owner().call({ from: this.connectedUser })
  }

  async getWorkflowStatus() {
    return await this.contract.methods.workflowStatus().call({ from: this.connectedUser })
  }

  async getWinningProposalId() {
    return await this.contract.methods.winningProposalID().call({ from: this.connectedUser })
  }

  async getOneProposal(id) {
    return await this.contract.methods.getOneProposal(id).call({ from: this.connectedUser })
  }

  async getVoter(address) {
    return await this.contract.methods.getVoter(address).call({ from: this.connectedUser })
  }

  async addVoter(voter) {
    await this.contract.methods.addVoter(voter).send({ from: this.connectedUser })
  }

  async addProposal(description) {
    await this.contract.methods.addProposal(description).send({ from: this.connectedUser })
  }

  async setVote(id) {
    await this.contract.methods.setVote(id).send({ from: this.connectedUser })
  }

  async startProposalsRegistering() {
    await this.contract.methods.startProposalsRegistering().send({ from: this.connectedUser })
  }

  async endProposalsRegistering() {
    await this.contract.methods.endProposalsRegistering().send({ from: this.connectedUser })
  }

  async startVotingSession() {
    await this.contract.methods.startVotingSession().send({ from: this.connectedUser })
  }

  async endVotingSession() {
    await this.contract.methods.endVotingSession().send({ from: this.connectedUser })
  }

  async tallyVotes() {
    await this.contract.methods.tallyVotes().send({ from: this.connectedUser })
  }

  async getPastEvents(eventName) {
    const events = await this.contract.getPastEvents(eventName, { fromBlock: 0, toBlock: "latest" })
    return events
  }

  async getWorkflowStatusFromPastEvents() {
    const events = await this.getPastEvents(EventName.WorkflowStatusChange)

    return events.map((event) => ({
      previousStatus: event.returnValues.previousStatus,
      newStatus: event.returnValues.newStatus,
    }))
  }

  async getLastWorkflowStatusFromPastEvents() {
    const events = await this.getWorkflowStatusFromPastEvents()

    if (!events.length) return 0

    return events[events.length - 1].newStatus
  }

  async getVotersFromPastEvents() {
    const events = await this.getPastEvents(EventName.VoterRegistered)

    return events.map((event) => ({
      voterAddress: event.returnValues.voterAddress,
    }))
  }

  async getProposalsFromPastEvents() {
    const events = await this.getPastEvents(EventName.ProposalRegistered)

    return await Promise.all(
      events
        .map((event) => event.returnValues.proposalId)
        .map(async (proposalId) => {
          const proposalData = await this.getOneProposal(proposalId)
          return { proposalId, description: proposalData.description, voteCount: proposalData.voteCount }
        }),
    )
  }

  async isVoter(address) {
    if (address === this.owner) return false // owner is not a voter.

    try {
      const voter = await this.getVoter(address)
      return voter && voter.isRegistered
    } catch (error) {
      // Catch error if a non voter try this, return false
      return false
    }
  }
}
