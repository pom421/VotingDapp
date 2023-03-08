// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Voting
 * @dev Smart contract for conducting a voting process using blockchain technology
 * @author Alyra. Updated by Guilhain Averlant & Pierre Olivier Mauget
 * @notice This contract allows voters to register, submit proposals, and vote on proposals
 * @notice The voting process has multiple stages that are controlled by the contract owner
 * @notice Voters can only vote once and can only vote on proposals that have been registered
 * @notice The winning proposal is the one with the highest number of votes
 * @notice Only the contract owner can tally the votes and determine the winning proposal
 */

contract Voting is Ownable {

    uint public winningProposalID;
    
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum  WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping (address => Voter) voters;


    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);
    
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }
    
    // on peut faire un modifier pour les états

    // ::::::::::::: GETTERS ::::::::::::: //

    /**
    @dev Returns the voter information for a given address.
    @param _addr The address of the voter.
    @return The voter's information including registration status, vote status, and voted proposal ID.
    */
    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }
    
    /**
    @dev Returns a single proposal from the proposalsArray based on its ID.
    @param _id uint ID of the proposal to retrieve.
    @return Proposal memory The proposal object containing all of its details.
    */
    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }

 
    // ::::::::::::: REGISTRATION ::::::::::::: // 

    /**
    @dev Registers a new voter by adding their address to the list of voters.
    @param _addr The address of the voter to register.
    @notice Requirements:
    @notice     - The workflow status must be "RegisteringVoters".
    @notice     - The voter must not already be registered.
    @notice Emit a VoterRegistered event.
    */
    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Voters registration is not open yet');
        require(voters[_addr].isRegistered != true, 'Already registered');
    
        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }
 

    // ::::::::::::: PROPOSAL ::::::::::::: // 

    /**
    @dev Adds a new proposal to the proposals array.
    @param _desc A string representing the proposal's description.
    @notice  Requirements:
    @notice     - The workflow status must be set to ProposalsRegistrationStarted.
    @notice     - The proposal description cannot be an empty string.
    @notice     - Only registered voters can add a proposal.
    @notice Emit a ProposalRegistered event.
    */
    function addProposal(string calldata _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Proposals are not allowed yet');
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), 'Vous ne pouvez pas ne rien proposer'); // facultatif
        // voir que desc est different des autres

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length-1);
    }

    // ::::::::::::: VOTE ::::::::::::: //

    /**

    @dev Allows a registered voter to vote for a proposal with a given ID.
    @param _id The ID of the proposal to vote for.
    @notice Requirements:
    @notice     - Voting session must have started.
    @notice     - The voter must not have voted before.
    @notice     - The proposal ID must exist.
    @notice Emit a Voted event.
    */
    function setVote( uint _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        require(voters[msg.sender].hasVoted != true, 'You have already voted');
        require(_id < proposalsArray.length, 'Proposal not found'); // pas obligé, et pas besoin du >0 car uint

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //
    
    /**
    @dev Allows the owner to start the proposals registration process
    @notice This function can only be called when the workflow status is set to RegisteringVoters
    @notice The function initializes the workflow status to ProposalsRegistrationStarted
    @notice The function also creates a GENESIS proposal with id 0
    @notice Emits a WorkflowStatusChange event with the old and new workflow status
    */
    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Registering proposals cant be started now');
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        
        Proposal memory proposal;
        proposal.description = "GENESIS";
        proposalsArray.push(proposal);
        
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    /**
    @dev End the proposals registration period
    @notice Only the owner can call this function
    @notice The workflow status must be "ProposalsRegistrationStarted"
    @notice Once the function is called, the workflow status will be changed to "ProposalsRegistrationEnded"
    @notice Emits a "WorkflowStatusChange" event with the previous status "ProposalsRegistrationStarted" and the new status "ProposalsRegistrationEnded"
    */
    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Registering proposals havent started yet');
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /**
     * @dev Start the voting session, only the contract owner can call this function
     * @notice The workflow status must be `ProposalsRegistrationEnded` to start the voting session
     * @notice Emit a `WorkflowStatusChange` event with `ProposalsRegistrationEnded` and `VotingSessionStarted` as parameters
     */
    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, 'Registering proposals phase is not finished');
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /**
     * @dev End the voting session and update the workflow status to `VotingSessionEnded`.
     * @notice This function can only be called by the contract owner.
     * @notice Requires that the workflow status is currently `VotingSessionStarted`.
     * @notice Emits a `WorkflowStatusChange` event with the previous and current workflow status.
     */
    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    /**
     * @dev Tally the votes and determine the winning proposal.
     * @notice Can only be called by the owner of the contract.
     * @notice The current status of the contract must be VotingSessionEnded.
     * @notice Emits a WorkflowStatusChange event with the old and new statuses.
     */
   function tallyVotes() external onlyOwner {
       require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
       uint _winningProposalId;
      for (uint256 p = 0; p < proposalsArray.length; p++) {
           if (proposalsArray[p].voteCount > proposalsArray[_winningProposalId].voteCount) {
               _winningProposalId = p;
          }
       }
       winningProposalID = _winningProposalId;
       
       workflowStatus = WorkflowStatus.VotesTallied;
       emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
}
