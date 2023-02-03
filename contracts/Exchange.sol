// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;


    constructor(address _feeAccount, uint256 _feePercent) payable {
        feeAccount = _feeAccount;
        feePercent = _feePercent;

    }
}