// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;
    mapping (address => mapping(address=>uint256)) public tokens;

    event Deposit(address token, address user, uint256 amount, uint256 balance);

    constructor(address _feeAccount, uint256 _feePercent) payable {
        feeAccount = _feeAccount;
        feePercent = _feePercent;

    }

    // Deoposit Tokens 
    function depositToken(address _token, uint256 _amount) public {
        // Transfer token to exchange
        require(Token(_token).transferFrom(msg.sender, address(this), _amount), 'no Token transfer');

        // Update user balance
        tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount;
        // Emit an event
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // Check Balance
    function balanceOf(address _token, address _user) 
        view
        public
        returns(uint256) {

        return tokens[_token][_user] ;
    }
}