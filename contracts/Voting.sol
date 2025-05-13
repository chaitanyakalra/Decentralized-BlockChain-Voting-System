// pragma solidity ^0.5.15;
pragma solidity ^0.8.0;
//NEW CODE
contract Voting {
    address public owner; // Owner address to manage voting dates
    struct Candidate {
        uint id;
        string name;
        string party;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates; // Tracks candidates by ID
    mapping(address => bool) public voters; // Tracks if an address has voted

    // 🔧 ADDED: Mapping to store hash of each vote by voter's address
    mapping(address => bytes32) public voteHashes;

    uint public countCandidates; // Total number of candidates
    uint256 public votingStart;
    uint256 public votingEnd;

    event CandidateAdded(uint candidateID, string name, string party);
    event Voted(address voter, uint candidateID);

    // 🔧 ADDED: Event to emit vote hash
    event VoteHashStored(address voter, bytes32 voteHash);

    // Modifier to restrict access to the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the contract owner.");
        _;
    }

    constructor() {
        owner = msg.sender; // Set the contract deployer as the owner
    }

    // Add a candidate before voting starts
    function addCandidate(
        string memory name,
        string memory party
    ) public onlyOwner returns (uint) {
        require(bytes(name).length > 0, "Candidate name cannot be empty.");
        require(bytes(party).length > 0, "Party name cannot be empty.");
        require(
            votingStart == 0 || block.timestamp < votingStart,
            "Cannot add candidates after voting starts."
        );

        countCandidates++;
        candidates[countCandidates] = Candidate(
            countCandidates,
            name,
            party,
            0
        );

        emit CandidateAdded(countCandidates, name, party);
        return countCandidates;
    }

    // Vote for a candidate during the voting period
    event Debug(string message);

    function vote(uint candidateID, bytes32 voteHash) public {
        emit Debug("Checking voting start time");
        require(block.timestamp >= votingStart, "Voting has not started yet!");

        emit Debug("Checking voting end time");
        require(block.timestamp <= votingEnd, "Voting has ended!");

        emit Debug("Checking candidate ID");
        require(
            candidateID > 0 && candidateID <= countCandidates,
            "Invalid candidate ID."
        );

        emit Debug("Checking voter status");
        require(!voters[msg.sender], "You have already voted.");

        //IMPLEMENTATION OF NOT LETTING DOUBLE VOTING HAPPEN.

        voters[msg.sender] = true;
        candidates[candidateID].voteCount++;

        // 🔧 STORE vote hash
        voteHashes[msg.sender] = voteHash;

        emit Debug("Vote counted");
        emit Voted(msg.sender, candidateID);
        emit VoteHashStored(msg.sender, voteHash); // 🔧 Emit vote hash event
    }

    // Check if the caller has voted
    function checkVote() public view returns (bool) {
        return voters[msg.sender];
    }

    // 🔧 GET the vote hash for the caller
    function getMyVoteHash() public view returns (bytes32) {
        require(voters[msg.sender], "You have not voted yet.");
        return voteHashes[msg.sender];
    }

    // Get the total number of candidates
    function getCountCandidates() public view returns (uint) {
        return countCandidates;
    }

    // Get details of a specific candidate
    function getCandidate(
        uint256 candidateID
    ) public view returns (uint256, string memory, string memory, uint256) {
        Candidate memory candidate = candidates[candidateID];
        return (
            candidate.id,
            candidate.name,
            candidate.party,
            candidate.voteCount
        );
    }

    // Set voting start and end dates (only by the contract owner)
    function setDates(uint256 _startDate, uint256 _endDate) public {
        require(votingEnd == 0, "Voting already ended!");
        require(votingStart == 0, "Voting already started!");
        require(_startDate + 1000000 > block.timestamp, "Start date too soon!");
        require(_endDate > _startDate, "End date must be after start date!");

        votingEnd = _endDate;
        votingStart = _startDate;
    }

    // Get the voting start and end dates
    function getDates() public view returns (uint256, uint256) {
        return (votingStart, votingEnd);
    }
}
