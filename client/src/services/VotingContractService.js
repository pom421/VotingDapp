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
    console.log("INSTANCE", this.INSTANCE)
    return this.INSTANCE
  }

  async getOwner() {
    return await this.contract.methods.owner().call({ from: this.connectedUser })
  }

  async getStep() {
    return await this.contract.methods.workflowStatus().call({ from: this.connectedUser })
  }

  async getOneProposal(id) {
    return await this.contract.methods.getOneProposal(id).call({ from: this.connectedUser })
  }

  async getVoter(address) {
    await this.contract.methods.getVoter(address).call({ from: this.connectedUser })
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

  async startProposalRegistering() {
    await this.contract.methods.startProposalRegistering().send({ from: this.connectedUser })
  }

  async endProposalRegistering() {
    await this.contract.methods.endProposalRegistering().send({ from: this.connectedUser })
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
    const test = await this.contract.getPastEvents(eventName, { fromBlock: 0, toBlock: "latest" })
    console.log("PAST EVENT RESULT FOR " + eventName, test)
    return test
  }
}
