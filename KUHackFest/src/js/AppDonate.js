App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,
  n: 0,
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
     instance.Donate({}, {
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
 
var dn = $("#dn");

    
    dn.hide();
  

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;


        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.Donation.deployed().then(function(instance) {
      donationInstance = instance;

      return donationInstance.appeals();
    }).then(function(appeals) {
     
 
     
      for (var i = 1; i <= appeals; i++) {
      
     
        donationInstance.getAddress(i).then (function(adr) {
          return donationInstance.appealers(adr);
          }).then (function(value)
          {
            if(!value[5] )
            {
           if(value[0]!=0)
           {
          var id=value[0];
          var name = value[1];
          var occupation = value[2];
          var home = value[3];
         
          // Render candidate Result
          var Template = "   " +id + "   " + name + "   " + occupation +"   " + home + "   ";
          appealers.append(Template);
        
          // Render candidate ballot option
        }
        }
          });
          //});
          
        
        }
        dn.show();
      });

  
  },

   
      
     

































donate: function() {
  $("#warn").html("" );
    var name = $('#name').val();
    App.contracts.Donation.deployed().then(function(instance) {
      donationInstance=instance;
      return donationInstance.getAddress(name )
    }).then(function(result) {
     donationInstance.appealers(result).then(function(val){

console.log(val);
    
     if(val[5] )
     {
   $("#warn").html("Please enter valid id!! " );
 }
 if(!val[6])
 {
   $("#warn").html("Please enter valid id here!! " );
}
    }).catch(function(err) {
      console.error(err);
    });
     });
  }
  
 
};
















    App.init();
 






















   
      
     
