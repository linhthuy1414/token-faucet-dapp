// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TestTokenFaucet {
    uint256 public claimAmount = 10 ether;
    uint256 public cooldown = 30 seconds;

    mapping(address => uint256) public lastClaimedAt;

    event Claimed(address indexed user, uint256 amount, uint256 timestamp);
    event FaucetFunded(address indexed sender, uint256 amount);

    receive() external payable {
        emit FaucetFunded(msg.sender, msg.value);
    }

    function claim() external {
        require(
            block.timestamp >= lastClaimedAt[msg.sender] + cooldown,
            "Hay cho den khi het thoi gian cho"
        );
        require(address(this).balance >= claimAmount, "Faucet khong du so du");

        lastClaimedAt[msg.sender] = block.timestamp;
        payable(msg.sender).transfer(claimAmount);

        emit Claimed(msg.sender, claimAmount, block.timestamp);
    }

    function setClaimAmount(uint256 _claimAmount) external {
        claimAmount = _claimAmount;
    }

    function setCooldown(uint256 _cooldown) external {
        cooldown = _cooldown;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
