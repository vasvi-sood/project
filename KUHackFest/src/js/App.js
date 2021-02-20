App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

 initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      const ethEnabled = () => {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          window.ethereum.enable();
          return true;
        }
        return false;
      }
      if (!ethEnabled()) {
        alert("Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!");
      }
      web3 = window.web3;
      App.web3Provider = web3.currentProvider;
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },




 
  initContract: function() {
    $.getJSON("Donation.json", function(donation) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Donation = TruffleContract(donation);
      // Connect provider to interact with contract
      App.contracts.Donation.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Donation.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
     instance.Appeal({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var donationInstance;
   // var loader = $("#loader");
    

    //loader.hide();
   


    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);

      }
    });

},

   
      
     

































appeal: function() {
    var name = $('#name').val();
    var occupation = $('#occupation').val();
    var home = $('#adress').val();
    App.contracts.Donation.deployed().then(function(instance) {
      return instance.appeal(name,occupation,home ,{ from: App.account });
    }).then(function(result) {
      // Wait for votes to update
     // $("#content").hide();
      //$("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
  
 
};
















    App.init();
 






















   
      
     
