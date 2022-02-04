pragma solidity ^0.4.17;

contract FundRaiserFactory {
    struct CustomerCare{
        string problem;
        address campaignAddress;
        string campaignName;
        uint voteCount;
        bool imp;
        mapping(address => bool) voters;
    }

    struct Report{
        address managerAddress;
        address campaignAddress;
        string campaignName;
        uint voteCount;
    }

    struct AdminCheck{
        uint adminMinimum;
        string adminName;
        string adminDescription;
        string adminIpfs;
        address adminManager;
        bool isChecked;
        bool isProject;
    }

    CustomerCare[] public cure;
    Report[] public report;
    AdminCheck[] public adminCheck;
    address[] public deployedProjectCampaigns;
    address[] public deployedNGOCampaigns;
    address[] public deployedNPOCampaigns;
    address public manager;
    bool public isStartedVoting;
    uint public voteNo;
    uint public voteNoCount;
    string public winnerName;
    address public winnerAddress;
    address public winnerManagerAddress;
    mapping(uint => mapping(address => bool)) public voterList;

    function FundRaiserFactory() public{
        manager = msg.sender;
    }

    function createP(uint minimum, string name, string description, string ipfs) public payable{
        require(msg.value == minimum);

        AdminCheck memory newAdminCheck = AdminCheck({
            adminMinimum: minimum,
            adminName: name,
            adminDescription: description,
            adminIpfs: ipfs,
            adminManager: msg.sender,
            isChecked: false,
            isProject: true
        });

        adminCheck.push(newAdminCheck);
    }

    function createNGO(uint minimum, string name, string description, string ipfs) public payable{
        require(msg.value == minimum);

        AdminCheck memory newAdminCheck = AdminCheck({
            adminMinimum: minimum,
            adminName: name,
            adminDescription: description,
            adminIpfs: ipfs,
            adminManager: msg.sender,
            isChecked: false,
            isProject: false
        });

        adminCheck.push(newAdminCheck);
    }

    function createProjectCampaign(uint index) public  {
        require(msg.sender == manager);
        require(!adminCheck[index].isChecked);
        require(adminCheck[index].isProject);

        address newCampaign = new FundRaiser(adminCheck[index].adminMinimum, adminCheck[index].adminName, adminCheck[index].adminDescription, adminCheck[index].adminIpfs, false, adminCheck[index].adminManager);
        deployedProjectCampaigns.push(newCampaign);

        Report memory newReport = Report({
            managerAddress: adminCheck[index].adminManager,
            campaignAddress: newCampaign,
            campaignName: adminCheck[index].adminName,
            voteCount: 0
        });

        report.push(newReport);
        adminCheck[index].isChecked = true;
    }

    function createNGOCampaign(uint index) public  {
        require(msg.sender == manager);
        require(!adminCheck[index].isChecked);
        require(!adminCheck[index].isProject);

        address newCampaign = new FundRaiser(adminCheck[index].adminMinimum, adminCheck[index].adminName, adminCheck[index].adminDescription, adminCheck[index].adminIpfs, false, adminCheck[index].adminManager);
        deployedNGOCampaigns.push(newCampaign);

        Report memory newReport = Report({
            managerAddress: adminCheck[index].adminManager,
            campaignAddress: newCampaign,
            campaignName: adminCheck[index].adminName,
            voteCount: 0
        });

        report.push(newReport);
        adminCheck[index].isChecked = true;
    }

    function createNPOCampaign(uint minimum, string name, string description, string ipfs) public {
        address newCampaign = new FundRaiser(minimum, name, description, ipfs, true, msg.sender);
        deployedNPOCampaigns.push(newCampaign);
    }

    function getDeployedProjectCampaigns() public view returns (address[]) {
        return deployedProjectCampaigns;
    }

    function getDeployedNGOCampaigns() public view returns (address[]) {
        return deployedNGOCampaigns;
    }

    function getDeployedNPOCampaigns() public view returns (address[]) {
        return deployedNPOCampaigns;
    }

    function addNewCustomerCare(string prob, address compAddr, string name) public{
        CustomerCare memory newCustomerCare = CustomerCare({
            problem: prob,
            campaignAddress: compAddr,
            campaignName: name,
            voteCount: 0,
            imp: false
        });

        cure.push(newCustomerCare);
    }

    function upvoteCustomerCare(uint index) public{
        require(!cure[index].voters[msg.sender]);

        cure[index].voters[msg.sender] = true;
        cure[index].voteCount++;
    }

    function setAlert(uint index) public{
        require(msg.sender == manager);
        require(!cure[index].imp);

        cure[index].imp = true;
    }

    function startVoting() public{
        require(msg.sender == manager);
        require(this.balance > 0);
        require(report.length > 0);
        require(!isStartedVoting);

        isStartedVoting = true;
        voteNo++;
        voteNoCount = 0;
    }

    function vote(uint index) public{
        require(isStartedVoting);
        require(!voterList[voteNo][msg.sender]);

        voterList[voteNo][msg.sender] = true;
        report[index].voteCount++;
        voteNoCount++;
    }

    function declareResult() public {
        require(msg.sender == manager);
        require(voteNoCount > 0);
        require(isStartedVoting);

        uint max = 0;
        uint maxIndex = 0;
        for(uint i=0;i<report.length;i++){
            if(report[i].voteCount > max){
                max = report[i].voteCount;
                maxIndex = i;
            }
            report[i].voteCount = 0;
        }
        address add = report[maxIndex].managerAddress;
        add.transfer(this.balance);
        winnerAddress = report[maxIndex].campaignAddress;
        winnerManagerAddress = report[maxIndex].managerAddress;
        winnerName = report[maxIndex].campaignName;
        isStartedVoting = false;
    }

    function getWinner() public view returns(string, address, address){
        return (winnerName, winnerManagerAddress, winnerAddress);
    }

    function getBalance() public view returns(uint){
        return this.balance;
    }

    function getCustomerCareCount() public view returns (uint) {
        return cure.length;
    }

    function getReportCount() public view returns (uint) {
        return report.length;
    }

    function getAdminCheckCount() public view returns (uint) {
        return adminCheck.length;
    }
}

contract FundRaiser {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    string public name;
    string public ipfsHash;
    string public description;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    bool public isNonProfit;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function FundRaiser(uint minimum, string Name, string Description, string ipfs, bool isNPO, address creator) public {
        manager = creator;
        minimumContribution = minimum;
        name = Name;
        ipfsHash = ipfs;
        description = Description;
        isNonProfit = isNPO;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);
        require(!approvers[msg.sender]);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string desc, uint value, address recipient) public restricted {
        require(this.balance > value);
        Request memory newRequest = Request({
           description: desc,
           value: value,
           recipient: recipient,
           complete: false,
           approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeNPORequest(uint index) public restricted {
        Request storage request = requests[index];

        require(isNonProfit);
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (
      uint, uint, uint, uint, string, string, string, address
      ) {
        return (
          minimumContribution,
          this.balance,
          requests.length,
          approversCount,
          name,
          description,
          ipfsHash,
          manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}
