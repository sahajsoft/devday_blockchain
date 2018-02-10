# Devday Blockchain
Start up repo for hands on workshop for Ethereum.

# Environment

OS - Mac OSX/Linux ideal

# Software to install

* Install Nodejs - [NodeJS - Version 8](https://nodejs.org/en/)
* Install Truffle - ```npm install -g truffle```
* Install Ganache [Ganache](http://truffleframework.com/ganache/)

# Running the application
* Clone this repository
* Goto repo location
* ```npm install```
* ```truffle migrate```
* ```npm run dev```
* Goto localhost:8081 and click on __"Say Hello"__ button.

If you see, __"Show me the Ether"__, you are good to go! 


  	function random(uint256 upper) public returns (uint256) {
    	_seed = uint256(sha3(sha3(block.blockhash(block.number), _seed), now));
    	return _seed % upper;
  	}