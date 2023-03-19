const Voting = artifacts.require("Voting");
const {BN, expectRevert, expectEvent} = require('@openzeppelin/test-helpers');
const {expect} = require('chai');

contract("Voting", accounts => {

    let VotingInstance;

    const owner = accounts[0];
    const voterA = accounts[1];
    const voterB = accounts[3];
    const voterC = accounts[4];
    const other = accounts[5];

    describe ("3th Step - endProposalsRegistering", () => {
        before(async() => {
            VotingInstance = await Voting.new({from: owner});
            await VotingInstance.addVoter(voterA, {from: owner})
            await VotingInstance.addVoter(voterB, {from: owner})
            await VotingInstance.addVoter(voterC, {from: owner})
            await VotingInstance.startProposalsRegistering({from: owner})
            await VotingInstance.addProposal("Proposition 1", {from: voterA})
            await VotingInstance.addProposal("Proposition 2", {from: voterB})
            await VotingInstance.addProposal("Proposition 3", {from: voterC})
            await VotingInstance.endProposalsRegistering({from: owner})
        })

        context ("Regular Usage", () => {

            describe("Check WorkflowStatus", () => {
                it("Check WorkflowStatus", async() => {
                    result = await VotingInstance.workflowStatus()
                    expect(result).to.be.bignumber.equal(new BN(2));
                });
            });

            describe("Check initialized Getter", () => {
                it("VoterA get voterB", async() => {
                    result = await VotingInstance.getVoter(voterB, {from: voterA})
                    expect(result.isRegistered).to.equal(true);
                    expect(result.hasVoted).to.equal(false);
                    expect(result.votedProposalId).to.be.bignumber.equal(BN(0));
                });

                it("VoterB get other", async() => {
                    result = await VotingInstance.getVoter(other, {from: voterB})
                    expect(result.isRegistered).to.equal(false);
                    expect(result.hasVoted).to.equal(false);
                    expect(result.votedProposalId).to.be.bignumber.equal(new BN(0));

                });

                it("VoterB get voterA", async() => {
                    result = await VotingInstance.getVoter(voterA, {from: voterB})
                    expect(result.isRegistered).to.equal(true);
                    expect(result.hasVoted).to.equal(false);
                    expect(result.votedProposalId).to.be.bignumber.equal(BN(0));
                });            

                it("VoterC get voterC", async() => {
                    result = await VotingInstance.getVoter(voterC, {from: voterC})
                    expect(result.isRegistered).to.equal(true);
                    expect(result.hasVoted).to.equal(false);
                    expect(result.votedProposalId).to.be.bignumber.equal(BN(0));
                });

                it("Voter A GetProposal 1", async() => {
                    result = await VotingInstance.getOneProposal(1, {from: voterA})
                    expect(result.description).to.equal("Proposition 1");
                    expect(result.voteCount).to.be.bignumber.equal(BN(0));
                });

                it("Voter A GetProposal 2", async() => {
                    result = await VotingInstance.getOneProposal(2, {from: voterA})
                    expect(result.description).to.equal("Proposition 2");
                    expect(result.voteCount).to.be.bignumber.equal(BN(0));
                });

                it("Voter A GetProposal 3", async() => {
                    result = await VotingInstance.getOneProposal(3, {from: voterA})
                    expect(result.description).to.equal("Proposition 3");
                    expect(result.voteCount).to.be.bignumber.equal(BN(0));
                });

                it("Check GENSIS Proposal", async() => {
                    result = await VotingInstance.getOneProposal(0, {from: voterA})
                    expect(result.description).to.equal("GENESIS");
                    expect(result.voteCount).to.be.bignumber.equal(BN(0));
                });

                it("Check ProposalID", async() => {
                    result = await VotingInstance.winningProposalID();
                    expect(result).to.be.bignumber.equal(new BN(0));
                });
            });
        });

        context ("Deviant Usage", () => {
            describe("deviant for other steps", () => {
                it("Owner cannot add voter", async() => {
                    result = VotingInstance.addVoter(voterB, {from: owner})
                    await expectRevert(result, "Voters registration is not open yet.");
                });

                it("Voter cannot add voter", async() => {
                    result = VotingInstance.addVoter(voterB, {from: voterA})
                    await expectRevert(result, "Ownable: caller is not the owner");
                });

                it("Other cannot add voter", async() => {
                    result = VotingInstance.addVoter(voterB, {from: other})
                    await expectRevert(result, "Ownable: caller is not the owner");
                });

                it("Owner get Proposal", async() => {
                    result = VotingInstance.getOneProposal(0, {from: owner})
                    await expectRevert(result, "You're not a voter");
                });

                it("Other get Proposal", async() => {
                    result = VotingInstance.getOneProposal(0, {from: other})
                    await expectRevert(result, "You're not a voter");
                });

                it("Owner AddProposal", async() => {
                    result = VotingInstance.addProposal("Proposition 1", {from: owner})
                    await expectRevert(result, "You're not a voter");
                });

                it("Other AddProposal", async() => {
                    result = VotingInstance.addProposal("Proposition 1", {from: other})
                    await expectRevert(result, "You're not a voter");
                });

                it("Voter AddProposal", async() => {
                    result = VotingInstance.addProposal("Proposition 1", {from: voterA})
                    await expectRevert(result, "Proposals are not allowed yet");
                });

                it("Owner vote for proposition 0", async() => {
                    result = VotingInstance.setVote(0, {from: owner})
                    await expectRevert(result, "You're not a voter.")
                });

                it("Other vote for proposition 0", async() => {
                    result = VotingInstance.setVote(0, {from: other})
                    await expectRevert(result, "You're not a voter.")
                });

                it("Voter vote for proposition 0", async() => {
                    result = VotingInstance.setVote(0, {from: voterA})
                    await expectRevert(result, "Voting session havent started yet.")
                });

                it("Owner launch endProposalsRegistering", async() => {
                    result = VotingInstance.endProposalsRegistering({from: owner})
                    await expectRevert(result, "Registering proposals havent started yet");
                });

                it("Other launch endProposalsRegistering", async() => {
                    result = VotingInstance.endProposalsRegistering({from: other})
                    await expectRevert(result, "Ownable: caller is not the owner");
                });

                it("Voter launch endProposalsRegistering", async() => {
                    result = VotingInstance.endProposalsRegistering({from: voterA})
                    await expectRevert(result, "Ownable: caller is not the owner");
                });

                it("Owner launch endVotingSession", async() => {
                    result = VotingInstance.endVotingSession({from: owner})
                    await expectRevert(result, "Voting session havent started yet");
                });

                it("Other launch endVotingSession", async() => {
                    result = VotingInstance.endVotingSession({from: other})
                    await expectRevert(result, "Ownable: caller is not the owner");
                });

                it("Voter launch endVotingSession", async() => {
                    result = VotingInstance.endVotingSession({from: voterA})
                    await expectRevert(result, "Ownable: caller is not the owner");
                });

                it("Other launch startVotingSession", async() => {
                    result = VotingInstance.startVotingSession({from: other})
                    await expectRevert(result, "Ownable: caller is not the owner");
                });

                it("Voter launch startVotingSession", async() => {
                    result = VotingInstance.startVotingSession({from: voterA})
                    await expectRevert(result, "Ownable: caller is not the owner");
                });

                it("Owner launch GetVoter", async() => {
                    result = VotingInstance.getVoter( voterA, {from: owner})
                    await expectRevert(result, "You're not a voter");
                });

                it("Other launch GetVoter", async() => {
                    result = VotingInstance.getVoter(voterA, {from: other})
                    await expectRevert(result, "You're not a voter");
                });

                it("Owner from RegisteringVoters to ProposalsRegistrationStarted", async() => {
                    result = VotingInstance.startProposalsRegistering({from: owner})
                    await expectRevert(result, "Registering proposals cant be started now");
                });

                it("Other from RegisteringVoters to ProposalsRegistrationStarted", async() => {
                    result = VotingInstance.startProposalsRegistering({from: other})
                    await expectRevert(result, "Ownable: caller is not the owner");
                });

                it("Voterfrom RegisteringVoters to ProposalsRegistrationStarted", async() => {
                    result =  VotingInstance.startProposalsRegistering({from: voterA})
                    await expectRevert(result, "Ownable: caller is not the owner");
                });
            });
        });

        context ("Check next level passing", () => {
            it("from endProposalsRegistering to startVotingSession", async() => {
                result = await VotingInstance.startVotingSession({from: owner})
                expectEvent(result, 'WorkflowStatusChange', {previousStatus: BN(2) , newStatus: BN(3)})
            });

            it("test workflowStatus getter", async() => {
                result = await VotingInstance.workflowStatus();
                expect(result).to.be.bignumber.equal(new BN(3));
            });
        });
    });

});
