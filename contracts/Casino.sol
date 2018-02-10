pragma solidity ^0.4.17;

contract Casino{
	uint public currentGamePot;
	address[] players;
	mapping(address => uint) hand;
    uint _seed = 0;
    address public winner;
    event DeclareWinner (address winner, uint winnings);
	function getPlayersCount() public 
	constant returns (uint playersCount){
		return players.length;
	}


	function placeBet() public payable{
		currentGamePot += msg.value;
		players.push(msg.sender);
		hand[msg.sender] = random(100);

		if(players.length == 2)
		{
			findWinner();
		}

	}

	function findWinner() private{
		uint winnerMoney = (currentGamePot * 8)/10;
		uint firstPlayerHand = hand[players[0]];
		uint secondPlayerHand = hand[players[1]];

		if(firstPlayerHand > secondPlayerHand)
		{
			players[0].transfer(winnerMoney);
			winner = players[0];
		}
		else
		{
			players[1].transfer(winnerMoney);
			winner = players[1];
		}

		DeclareWinner(winner, winnerMoney);
	}

	function random(uint256 upper) public returns (uint256) {
		_seed = uint256(sha3(sha3(block.blockhash(block.number), _seed), now));
		return _seed % upper;
	
	}

	
}