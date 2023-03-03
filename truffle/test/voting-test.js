const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const constants = require("@openzeppelin/test-helpers/src/constants");

const Voting = artifacts.require("../Voting.sol");

contract("Voting", (accounts) => {
  let votingInstance;
  const owner = accounts[0];
  const firstVoter = accounts[1];
  const secondVoter = accounts[2];
  const notVoter = accounts[3];

  beforeEach(async () => {
    // We create a new instance of Voting for each tests.
    votingInstance = await Voting.new();
  });

  describe("Check getters", () => {
    beforeEach(async () => {
      // In this context, we add 2 voters, starts the proposal phase and add a proposal.
      await votingInstance.addVoter(firstVoter);
      await votingInstance.addVoter(secondVoter);
      await votingInstance.startProposalsRegistering({ from: owner });
      await votingInstance.addProposal("Proposal 1", { from: firstVoter });
    });

    it("should get voter if user in whitelist", async () => {
      const voter = await votingInstance.getVoter(firstVoter, {
        from: firstVoter,
      });

      expect(voter.isRegistered).to.be.true;
      expect(voter.hasVoted).to.be.false;
    });

    it("should throw an error on get voter if user not in whitelist", async () => {
      await expectRevert(
        votingInstance.getVoter(firstVoter, {
          from: notVoter, // Unauthorized user.
        }),
        "You're not a voter"
      );
    });

    it("should get proposal for user in whitelist", async () => {
      const proposal = await votingInstance.getOneProposal(1, {
        from: secondVoter,
      });

      expect(proposal.description).to.be.equal("Proposal 1");
      expect(proposal.voteCount).to.be.bignumber.equal(new BN(0));
    });

    it("should throw an error on get proposal for user not in whitelist", async () => {
      await expectRevert(
        votingInstance.getOneProposal(1, {
          from: notVoter,
        }),
        "You're not a voter"
      );
    });
  });

  describe("Check owner features (except workflow status)", () => {
    it("should be able to add voter and emit VoterRegistered", async () => {
      const result = await votingInstance.addVoter(firstVoter, {
        from: owner,
      });

      expectEvent(result, "VoterRegistered", {
        voterAddress: firstVoter,
      });

      const voter = await votingInstance.getVoter(firstVoter, {
        from: firstVoter,
      });

      expect(voter.isRegistered).to.be.true;
    });

    it("should not be able to add voter if not owner", async () => {
      await expectRevert(
        votingInstance.addVoter(firstVoter, {
          from: firstVoter, // Unauthorized user.
        }),
        "Ownable: caller is not the owner."
      );
    });

    it("should not be able to add voter if not workflow status not in registering phase", async () => {
      await votingInstance.startProposalsRegistering({ from: owner });

      await expectRevert(
        votingInstance.addVoter(firstVoter, {
          from: owner,
        }),
        "Voters registration is not open yet"
      );
    });

    it("should not be able to add voter if voter already in whitelist", async () => {
      await votingInstance.addVoter(firstVoter, {
        from: owner,
      });

      await expectRevert(
        votingInstance.addVoter(firstVoter, {
          from: owner,
        }),
        "Already registered"
      );
    });

    it("should be able to tally vote & emit WorkflowStatusChange event", async () => {
      await votingInstance.addVoter(firstVoter);
      await votingInstance.addVoter(secondVoter);
      await votingInstance.startProposalsRegistering({ from: owner });
      await votingInstance.addProposal("Proposal 1", { from: firstVoter });
      await votingInstance.addProposal("Proposal 2", { from: firstVoter });
      await votingInstance.endProposalsRegistering({ from: owner });
      await votingInstance.startVotingSession({ from: owner });
      await votingInstance.setVote(1, { from: firstVoter });
      await votingInstance.setVote(1, { from: secondVoter });
      await votingInstance.endVotingSession({ from: owner });

      const result = await votingInstance.tallyVotes({ from: owner });

      expectEvent(result, "WorkflowStatusChange", {
        previousStatus: new BN(Voting.WorkflowStatus.VotingSessionEnded),
        newStatus: new BN(Voting.WorkflowStatus.VotesTallied),
      });

      expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal(
        new BN(Voting.WorkflowStatus.VotesTallied)
      );

      expect(
        await votingInstance.winningProposalID.call()
      ).to.be.bignumber.equal(new BN(1));

      const proposal1 = await votingInstance.getOneProposal(1, {
        from: firstVoter,
      });

      const proposal2 = await votingInstance.getOneProposal(2, {
        from: firstVoter,
      });

      expect(proposal1.voteCount).to.be.bignumber.equal(new BN(2));
      expect(proposal2.voteCount).to.be.bignumber.equal(new BN(0));
    });

    it("should not be able to tally vote if not owner", async () => {
      await votingInstance.startProposalsRegistering({ from: owner });
      await votingInstance.endProposalsRegistering({ from: owner });
      await votingInstance.startVotingSession({ from: owner });
      await votingInstance.endVotingSession({ from: owner });

      await expectRevert(
        votingInstance.tallyVotes({
          from: firstVoter, // Unauthorized user.
        }),
        "Ownable: caller is not the owner."
      );
    });

    it("should not be able to tally vote if not in end voting phase", async () => {
      await votingInstance.startProposalsRegistering({ from: owner });
      await votingInstance.endProposalsRegistering({ from: owner });
      await votingInstance.startVotingSession({ from: owner });

      await expectRevert(
        votingInstance.tallyVotes({
          from: owner,
        }),
        "Current status is not voting session ended"
      );
    });
  });

  describe("Check voters features", () => {
    it("should be able to add proposal if user in whitelist & emit ProposalRegistered event", async () => {
      await votingInstance.addVoter(firstVoter);
      await votingInstance.startProposalsRegistering({ from: owner });

      const result = await votingInstance.addProposal("Proposal 1", {
        from: firstVoter,
      });

      expectEvent(result, "ProposalRegistered", {
        proposalId: new BN(1),
      });
    });

    it("should not be able to add proposal if user not in whitelist", async () => {
      await votingInstance.startProposalsRegistering({ from: owner });

      await expectRevert(
        votingInstance.addProposal("Proposal 1", {
          from: notVoter,
        }),
        "You're not a voter"
      );
    });

    it("should not be able to add proposal if workflow status not in proposal registration phase", async () => {
      await votingInstance.addVoter(firstVoter);

      await expectRevert(
        votingInstance.addProposal("Proposal 1", {
          from: firstVoter,
        }),
        "Proposals are not allowed yet"
      );
    });

    it("should not be able to add proposal if proposal is empty", async () => {
      await votingInstance.addVoter(firstVoter);
      await votingInstance.startProposalsRegistering({ from: owner });

      await expectRevert(
        votingInstance.addProposal("", {
          from: firstVoter,
        }),
        "Vous ne pouvez pas ne rien proposer"
      );
    });

    it("should be able to vote & emit Voted event", async () => {
      await votingInstance.addVoter(firstVoter);
      await votingInstance.startProposalsRegistering({ from: owner });
      await votingInstance.addProposal("Proposal 1", { from: firstVoter });
      await votingInstance.endProposalsRegistering({ from: owner });
      await votingInstance.startVotingSession({ from: owner });

      const result = await votingInstance.setVote(1, { from: firstVoter });

      expectEvent(result, "Voted", {
        voter: firstVoter,
        proposalId: new BN(1),
      });
    });

    it("should not be able to vote if user not in whitelist", async () => {
      await votingInstance.startProposalsRegistering({ from: owner });
      await votingInstance.endProposalsRegistering({ from: owner });
      await votingInstance.startVotingSession({ from: owner });

      await expectRevert(
        votingInstance.setVote(1, {
          from: notVoter,
        }),
        "You're not a voter"
      );
    });

    it("should not be able to vote if not in start voting phase", async () => {
      await votingInstance.addVoter(firstVoter);

      await expectRevert(
        votingInstance.setVote(1, {
          from: firstVoter,
        }),
        "Voting session havent started yet"
      );
    });

    it("should not be able to vote if voter has already voted", async () => {
      await votingInstance.addVoter(firstVoter);
      await votingInstance.startProposalsRegistering({ from: owner });
      await votingInstance.addProposal("Proposal 1", { from: firstVoter });
      await votingInstance.endProposalsRegistering({ from: owner });
      await votingInstance.startVotingSession({ from: owner });
      await votingInstance.setVote(1, { from: firstVoter });

      await expectRevert(
        votingInstance.setVote(1, {
          from: firstVoter,
        }),
        "You have already voted"
      );
    });

    it("should not be able to vote if for an unfound proposal", async () => {
      await votingInstance.addVoter(firstVoter);
      await votingInstance.startProposalsRegistering({ from: owner });
      await votingInstance.addProposal("Proposal 1", { from: firstVoter });
      await votingInstance.endProposalsRegistering({ from: owner });
      await votingInstance.startVotingSession({ from: owner });

      await expectRevert(
        votingInstance.setVote(2, {
          from: firstVoter,
        }),
        "Proposal not found"
      );
    });
  });

  describe("Check workflow status", () => {
    it("should be able to start registering proposal phase & emit WorkflowStatusChange", async () => {
      const result = await votingInstance.startProposalsRegistering({
        from: owner,
      });

      expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal(
        new BN(Voting.WorkflowStatus.ProposalsRegistrationStarted)
      );

      expectEvent(result, "WorkflowStatusChange", {
        previousStatus: new BN(Voting.WorkflowStatus.RegisteringVoters),
        newStatus: new BN(Voting.WorkflowStatus.ProposalsRegistrationStarted),
      });
    });

    it("should not be able to start registering proposal phase if not owner", async () => {
      await expectRevert(
        votingInstance.startProposalsRegistering({
          from: firstVoter,
        }),
        "Ownable: caller is not the owner"
      );
    });

    it("should not be able to start registering proposal phase if not in registering voters phase", async () => {
      await votingInstance.startProposalsRegistering({ from: owner });

      await expectRevert(
        votingInstance.startProposalsRegistering({
          from: owner,
        }),
        "Registering proposals cant be started now"
      );
    });

    it("should be able to end registering proposal phase & emit WorkflowStatusChange", async () => {
      await votingInstance.startProposalsRegistering({ from: owner });

      const result = await votingInstance.endProposalsRegistering({
        from: owner,
      });

      expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal(
        new BN(Voting.WorkflowStatus.ProposalsRegistrationEnded)
      );

      expectEvent(result, "WorkflowStatusChange", {
        previousStatus: new BN(
          Voting.WorkflowStatus.ProposalsRegistrationStarted
        ),
        newStatus: new BN(Voting.WorkflowStatus.ProposalsRegistrationEnded),
      });
    });

    it("should not be able to end registering proposal phase if not owner", async () => {
      await votingInstance.startProposalsRegistering({ from: owner });

      await expectRevert(
        votingInstance.endProposalsRegistering({
          from: firstVoter,
        }),
        "Ownable: caller is not the owner"
      );
    });

    it("should not be able to end registering proposal phase if not in start registering proposal phase", async () => {
      await expectRevert(
        votingInstance.endProposalsRegistering({
          from: owner,
        }),
        "Registering proposals havent started yet"
      );
    });

    it("should be able to start voting session & emit WorkflowStatusChange", async () => {
      await votingInstance.startProposalsRegistering({ from: owner });
      await votingInstance.endProposalsRegistering({ from: owner });

      const result = await votingInstance.startVotingSession({ from: owner });

      expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal(
        new BN(Voting.WorkflowStatus.VotingSessionStarted)
      );

      expectEvent(result, "WorkflowStatusChange", {
        previousStatus: new BN(
          Voting.WorkflowStatus.ProposalsRegistrationEnded
        ),
        newStatus: new BN(Voting.WorkflowStatus.VotingSessionStarted),
      });
    });

    it("should not be able to start voting phase if not owner", async () => {
      await votingInstance.startProposalsRegistering({ from: owner });
      await votingInstance.endProposalsRegistering({ from: owner });

      await expectRevert(
        votingInstance.startVotingSession({
          from: firstVoter,
        }),
        "Ownable: caller is not the owner"
      );
    });

    it("should not be able to start voting phase if not in end registering proposal phase", async () => {
      await expectRevert(
        votingInstance.startVotingSession({
          from: owner,
        }),
        "Registering proposals phase is not finished"
      );
    });

    it("should be able to end voting phase & emit WorkflowStatusChange event", async () => {
      await votingInstance.startProposalsRegistering({ from: owner });
      await votingInstance.endProposalsRegistering({ from: owner });
      await votingInstance.startVotingSession({ from: owner });

      const result = await votingInstance.endVotingSession({ from: owner });

      expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal(
        new BN(Voting.WorkflowStatus.VotingSessionEnded)
      );

      expectEvent(result, "WorkflowStatusChange", {
        previousStatus: new BN(Voting.WorkflowStatus.VotingSessionStarted),
        newStatus: new BN(Voting.WorkflowStatus.VotingSessionEnded),
      });
    });

    it("should not be able to end voting phase if not owner", async () => {
      await votingInstance.startProposalsRegistering({ from: owner });
      await votingInstance.endProposalsRegistering({ from: owner });
      await votingInstance.startVotingSession({ from: owner });

      await expectRevert(
        votingInstance.endVotingSession({
          from: firstVoter,
        }),
        "Ownable: caller is not the owner"
      );
    });

    it("should not be able to end voting phase if not in start voting phase", async () => {
      await expectRevert(
        votingInstance.endVotingSession({
          from: owner,
        }),
        "Voting session havent started yet"
      );
    });
  });
});
