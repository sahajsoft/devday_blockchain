// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import hello_artifacts from '../../build/contracts/HelloEther.json'
import casino_artifacts from '../../build/contracts/Casino.json'

// hello is our usable abstraction, which we'll use through the code below.
var HelloEther = contract(hello_artifacts);
var Casino = contract(casino_artifacts);
// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;
    HelloEther.setProvider(web3.currentProvider);
    Casino.setProvider(web3.currentProvider);
    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;

      account = accounts[0];
      console.log("Current Account "+account);
      self.listenEvents();
    });
  },

  listenEvents: function(){
    var self = this;
    Casino.deployed().then(function(instance) {
      instance.DeclareWinner({},{fromBlock: 0, toBlock: 'latest'}).watch(function(err,result){
        console.log("Inside events")
        if(result.args.winner == account)
          self.setStatus("You are the winner!");
        else
          self.setStatus("You lost! haha");
      });
    });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  setHand: function(message) {
    var status = document.getElementById("hand");
    status.innerHTML = message;
  },

  sayHello: function() {
    var self = this;

    this.setStatus("Initiating transaction... (please wait)");

    var hello;
    HelloEther.deployed().then(function(instance) {
      hello = instance;
      return hello.getHello.call();
    }).then(function(res) {
      self.setStatus(res);
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error saying hello; see log.");
    });
  },

placeBet: function() {
  var self = this;
   var betValue = document.getElementById("betValue").value;
    this.setStatus("Initiating bet transaction... (please wait)");

    var casino;
    Casino.deployed().then(function(instance) {
      casino = instance;
      return casino.placeBet({from: account, value: web3.toWei(betValue, "ether")});
    }).then(function(res) {
      self.setStatus("Your bet of "+betValue+" ether  been placed");
      if(res.logs.length != 0 ){
        // self.listenEvents();
        // debugger
        if(res.logs[0].args.winner == account)
          self.setStatus("You are the winner!");
        else
          self.setStatus("You lost! haha");
      }
      return "";
    }).then(function(res) {

      //self.setHand("Your hand is "+res.toNumber());
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error placing bet; see log.");
    });
  }
};



window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 HelloEther, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  }

  App.start();
});
