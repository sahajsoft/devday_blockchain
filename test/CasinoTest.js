var casino = artifacts.require("./casino.sol");

contract('casino', function(accounts) {
  it("should start game with zero money in pot", function() {
    return casino.deployed().then(function(instance) {
      return instance.currentGamePot.call();
    }).then(function(potMoney) {
      assert.equal(potMoney.valueOf(), 0, "Pot not zero");
    });
  });

    
  it("should allow player 1 to add bet money to pot", function() {
    var ins;
    return casino.deployed().then(function(instance) {
      ins = instance
      instance.placeBet({from: accounts[0], value: web3.toWei(5, "ether")});
      return instance.currentGamePot.call();
    }).then(function(currentGamePot) {      
      assert.equal(currentGamePot.valueOf(), 5000000000000000000, "Pot money not added");
      return ins.getPlayersCount.call();
    }).then(function(playersCount) {
      assert.equal(playersCount.valueOf(), 1, "Player 1 didnt get added");
    });
  });

  it("should allow player 2 to add bet money to pot and declare winner", function() {
    var ins;
    
    return casino.deployed().then(function(instance) {
      ins = instance;
      return instance.placeBet({from: accounts[1], value: web3.toWei(3, "ether")});
    }).then(function(result) {
      assert.equal(result.logs[0].event,"DeclareWinner","Expected Winner event");
      assert.equal(result.logs[0].args.winnings.valueOf(),6400000000000000000,"Winning amount not given");
      return ins.getPlayersCount.call();
    }).then(function(playersCount) {
      assert.equal(playersCount.valueOf(), 2, "Player 2 didnt get added");
      return ins.winner.call();
    })
  });
      
});
