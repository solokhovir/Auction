// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Auction {
    string public item;
    address payable public immutable seller;
    bool public ended;
    uint public highestBid;
    address public highestBidder;
    mapping(address => uint) public bids;

    event Start(string _item, uint _currentPrice);
    event Bid(address _bidder, uint _bid);
    event End(address _highestBidder, uint _highestBid);
    event Withdraw(address _sender, uint _refundAmount);

    constructor(string memory _item, uint _startingBid) {
        item = _item;
        highestBid = _startingBid;
        seller = payable(msg.sender);
    }

    modifier onlySeller {
        require(msg.sender == seller, "Not a seller");
        _;
    }

    function getBalance() public view returns (uint256 balance) {
        return bids[msg.sender];
    }

    function bid() external payable {
        if(address(seller) != msg.sender) {
            require(msg.value > highestBid, "Too low");
            highestBid = msg.value;
            highestBidder = msg.sender;
            bids[highestBidder] += highestBid;
            emit Bid(msg.sender, msg.value);
        } else {
            revert("You can not make a bid");
        }
    }

    function end() external onlySeller {        
        ended = true;
        if(highestBidder != address(0)) {
            seller.transfer(highestBid);
        }
        emit End(highestBidder, highestBid);
    }

    function withdraw() external {
        if (ended != true) {
            uint refundAmount = bids[msg.sender];
            require(refundAmount > 0, "Incorrect refund amount");
            bids[msg.sender] = 0;
            payable(msg.sender).transfer(refundAmount);
            emit Withdraw(msg.sender, refundAmount);
        } else {
            revert("Auction ended");
        }
    }
}