// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;
    mapping(address => mapping(address => uint256)) public tokens;
    mapping(uint256 => _Order) public orders;
    uint256 public orderCount;
    mapping(uint256 => bool) public orderCancelled;
    mapping(uint256 => bool) public orderFilled;

    // Orders Mapping

    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balanceOf
    );
    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    event Cancel(
        uint id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );
    event  Trade(
        uint id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        address creator,
        uint256 timestamp
    );

    // Order to model the order
    struct _Order {
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
        require(
            Token(_token).transferFrom(msg.sender, address(this), _amount),
            "no Token transfer"
        );

        // Update user balance
        tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount;
        // Emit an event
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // Withdraw Token
    function withdrawToken(address _token, uint256 _amount) public {
        require(tokens[_token][msg.sender] >= _amount);
        // Transfer tokens to user
        Token(_token).transfer(msg.sender, _amount);
        // Update user balance

        tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount;

        // Emit event
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // Check Balance
    function balanceOf(
        address _token,
        address _user
    ) public view returns (uint256) {
        return tokens[_token][_user];
    }

    // Make order

    function makeOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
        // Token Give (the token they want to spend) - which token, and how much?
        // token Get (the token they want to receive) -

        require(balanceOf(_tokenGive, msg.sender) >= _amountGive);
        orderCount = orderCount + 1;

        orders[orderCount] = _Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );

        // Emit event
        emit Order(
            orderCount,
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
        require(address(_order.user) == msg.sender, "unautherazied !");

        require(_order.id == _id, "order not exist!");
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

    // EXECUTING ORDERS
    function fillOrder(uint256 _id) public {
        // 1. Must be valid orderId
        require(_id > 0 && _id <= orderCount);
        // 2.Order can't be filled
        require(!orderFilled[_id]);
        // 3 Order can't be cancelled
        require(!orderCancelled[_id]);
        

        // Fetch Tokens (Trading)
        _Order storage _order = orders[_id];

        // Swapping Tokens (Trading)
        _trade(
            _order.id,
            _order.user,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive
        );

        // Mark order as filled
        orderFilled[_order.id] = true;
    }

    function _trade(
        uint256 _orderId,
        address _user,
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) internal {

        // Fee is paid by the user who filled the order(msg.sender)
        // fee is deducted from _amountGet
        uint256 _feeAccount = (_amountGet * feePercent)/100;

        // Do trade here ...
        // Execute the trade
        // msg.sender is the user who filled  the order while _user is who created the order
        tokens[_tokenGet][msg.sender] =
            tokens[_tokenGet][msg.sender] -
            (_amountGet + _feeAccount);

        tokens[_tokenGet][_user] =
            tokens[_tokenGet][_user] +
            _amountGet;
        
        // Charge fees
        tokens[_tokenGet][feeAccount] = 
            tokens[_tokenGet][feeAccount] + 
            _feeAccount;

        tokens[_tokenGive][_user] =
            tokens[_tokenGive][_user] -
            _amountGive;

        tokens[_tokenGive][msg.sender] =
            tokens[_tokenGive][msg.sender] +
            _amountGive;        
        // Emit trade event
        emit Trade(
            _orderId,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            _user,
            block.timestamp
        );
    }
}
