pragma solidity ^0.5.0;

import "./Token.sol"; //importing a smart contract from another file, used for the transfer of DApp tokens
contract EthSwap {
    string public name = "eth Swap"; //test variable name
    Token public token; //instantiating a Token variable
    uint public rate = 100; // used for convertion

    //event to log activity carried out on the smart contract
    event TokensPurchased(
        address account, 
        address token,
        uint amount,
        uint rate
    );

        event TokensSold(
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(Token _token) public {
        token = _token; //declaring it in the blockchain
    }

//transfer of tokens from smartcontract to buyer
    function buyTokens() public payable {
        uint tokenAmount = msg.value * rate; // calculating the conversion rate

        //require that ethSwap has enough tokens
        require(token.balanceOf(address(this)) >= tokenAmount);

        //transferring tokens from smart contarct to buyer
        token.transfer(msg.sender, tokenAmount);

        //emitting event to read activity
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    //function to sell tokens
    function sellTokens(uint _amount) public { 
    //User cant sell more tokens than what they own
    require(token.balanceOf(msg.sender) >= _amount);

    //calculate amount of tokens to sell
    uint etherAmount = _amount / rate;

    //require that ethSwap has enough tokens
    require(token.balanceOf(address(this)) >= etherAmount);

    //perform sale
    //sending the tokens back to the smart contract
    token.transferFrom(msg.sender, address(this), _amount); 
    //sending the ether equivalent to the client
    msg.sender.transfer(etherAmount); 

    //emitting event to read activity
    emit TokensSold(msg.sender, address(token), _amount, rate);
    }
}