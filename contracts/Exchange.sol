// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;
    mapping (address => mapping(address=>uint256)) public tokens;
    mapping (uint256 => _Order) public orders;
    uint256 public orderCount;
    mapping (uint256 => bool) public orderCancelled;

    // Orders Mapping

    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(address token,address user, uint256 amount, uint256 balanceOf);  
    event Order(
        uint256 id,
        address user,
        address tokenGet,    
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    )  ;
    event Cancel(
        uint id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    // Order to model the order
    struct  _Order {
        // Attribute of an order
        uint256 id;
        address user;
        address tokenGet;       
        uint256 amountGet;
        address tokenGive;
        uint256 amountGive;
        uint256 timestamp;
    }

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
    // Withdraw Toke
    function withdrawToken(address _token, uint256 _amount)
        public {
        require(tokens[_token][msg.sender] >= _amount);
        // Transfer tokens to user
        Token(_token).transfer(msg.sender, _amount);
        // Update user balance
        
        tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount;


        // Emit event
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // Check Balance
    function balanceOf(address _token, address _user) 
        view
        public
        returns(uint256) {

        return tokens[_token][_user] ;
    }
    // Make order
   
    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public{
        // Token Give (the token they want to spend) - which token, and how much?
        // token Get (the token they want to receive) -
        // uint256 id;
        // address user;
        // address tokenGet;       
        // uint256 amountGet;
        // address tokenGive;
        // uint256 amountGive;
        // uint256 timestamp;
        
        require(balanceOf(_tokenGive, msg.sender) >= _amountGive);
        orderCount = orderCount + 1;

        orders[orderCount] = _Order(
            1,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );

        // Emit event
        emit Order(
              1,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
    }

    function cancelOrder(uint256 _id) public {
        
        // Fethc order
        _Order storage _order = orders[_id];
        // Ensure the caller of the fun is the msg.sendr
        require(address(_order.user) == msg.sender, 'unautherazied !');

        require(_order.id == _id, 'order not exist!');
        // Cancel the order
        orderCancelled[_id] = true;
        //emit event
        emit Cancel(
            _order.id,
            msg.sender,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive,
            block.timestamp
        );
    }
}