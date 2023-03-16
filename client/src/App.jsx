import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";

class App extends Component {
  state = { web3: null, accounts: null, contract: null, workflowStatus: null, winningProposalID: null, proposals: [], voters: [] };

  componentDidMount = async () => {
    try {
      // Récupérer l'instance de web3
      const web3 = await getWeb3();

      // Récupérer les comptes utilisateurs
      const accounts = await web3.eth.getAccounts();

      // Récupérer l'instance du contrat Voting
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];
      const contract = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Récupérer le workflowStatus initial
      const workflowStatus = await contract.methods.workflowStatus().call();

      // Récupérer le winningProposalID initial
      const winningProposalID = await contract.methods.winningProposalID().call();

      // Récupérer la liste des propositions et des votants
      const proposals = await this.getProposals(contract);
      const voters = await this.getVoters(contract);

      this.setState({ web3, accounts, contract, workflowStatus, winningProposalID, proposals, voters });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  // Récupérer la liste des propositions depuis le smart contract
  getProposals = async (contract) => {
    const proposalCount = await contract.methods.getProposalCount().call();
    const proposals = [];
    for (let i = 1; i <= proposalCount; i++) {
      const proposal = await contract.methods.getOneProposal(i).call();
      proposals.push(proposal);
    }
    return proposals;
  };

  // Récupérer la liste des votants depuis le smart contract
  getVoters = async (contract) => {
    const voterCount = await contract.methods.getVoterCount().call();
    const voters = [];
    for (let i = 0; i < voterCount; i++) {
      const voter = await contract.methods.getVoter(contract.methods.getVoterAddress(i).call()).call();
      voters.push(voter);
    }
    return voters;
  };

  // Inscrire un nouveau votant
  addVoter = async () => {
    const { accounts, contract } = this.state;
    await contract.methods.addVoter(accounts[0]).send({ from: accounts[0] });
    const voters = await this.getVoters(contract);
    this.setState({ voters });
  };

  // Ajouter une nouvelle proposition
  addProposal = async (proposalDescription) => {
    const { accounts, contract } = this.state;
    await contract.methods.addProposal(proposalDescription).send({ from: accounts[0] });
    const proposals = await this.getProposals(contract);
    this.setState({ proposals });
  };

  // Enregistrer un vote
  setVote = async (proposalId) => {
    const { accounts, contract } = this.state;
    await contract.methods.setVote(proposalId).send({ from: accounts[0] });
    const proposals = await this.getProposals(contract);
    this.setState({ proposals });
  };

