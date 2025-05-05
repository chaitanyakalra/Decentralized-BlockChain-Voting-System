// const Web3 = require('web3');
// const contract = require('@truffle/contract');
// const votingArtifacts = require('../../build/contracts/Voting.json');
// var VotingContract = contract(votingArtifacts)

// window.App = {
//   eventStart: function() { 
//     window.ethereum.request({ method: 'eth_requestAccounts' });
//     VotingContract.setProvider(window.ethereum)
//     VotingContract.defaults({from: window.ethereum.selectedAddress,gas:6654755})

//     // Load account data
//     App.account = window.ethereum.selectedAddress;
//     $("#accountAddress").html("Your Account: " + window.ethereum.selectedAddress);
//     VotingContract.deployed().then(function(instance){
//      instance.getCountCandidates().then(function(countCandidates){

//             $(document).ready(function(){
//               $('#addCandidate').click(function() {
//                   var nameCandidate = $('#name').val();
//                   var partyCandidate = $('#party').val();
//                  instance.addCandidate(nameCandidate,partyCandidate).then(function(result){ })

//             });   
//               $('#addDate').click(function(){             
//                   var startDate = Date.parse(document.getElementById("startDate").value)/1000;

//                   var endDate =  Date.parse(document.getElementById("endDate").value)/1000;
           
//                   instance.setDates(startDate,endDate).then(function(rslt){ 
//                     console.log("tarihler verildi");
//                   });

//               });     

//                instance.getDates().then(function(result){
//                 var startDate = new Date(result[0]*1000);
//                 var endDate = new Date(result[1]*1000);

//                 $("#dates").text( startDate.toDateString(("#DD#/#MM#/#YYYY#")) + " - " + endDate.toDateString("#DD#/#MM#/#YYYY#"));
//               }).catch(function(err){ 
//                 console.error("ERROR! " + err.message)
//               });           
//           });
             
//           for (var i = 0; i < countCandidates; i++ ){
//             instance.getCandidate(i+1).then(function(data){
//               var id = data[0];
//               var name = data[1];
//               var party = data[2];
//               var voteCount = data[3];
//               var viewCandidates = `<tr><td> <input class="form-check-input" type="radio" name="candidate" value="${id}" id=${id}>` + name + "</td><td>" + party + "</td><td>" + voteCount + "</td></tr>"
//               $("#boxCandidate").append(viewCandidates)
//             })
//         }
        
//         window.countCandidates = countCandidates 
//       });

//       instance.checkVote().then(function (voted) {
//           console.log(voted);
//           if(!voted)  {
//             $("#voteButton").attr("disabled", false);

//           }
//       });

//     }).catch(function(err){ 
//       console.error("ERROR! " + err.message)
//     })
//   },

//   vote: function () {
//     var candidateID = $("input[name='candidate']:checked").val();
//     if (!candidateID) {
//       $("#msg").html("<p>Please vote for a candidate.</p>")
//       return
//     }
//     VotingContract.deployed().then(function(instance){
//       instance.vote(parseInt(candidateID)).then(function(result){
//         $("#voteButton").attr("disabled", true);
//         $("#msg").html("<p>Voted</p>");
//         window.location.reload(1);
//       }).catch(function(err){
//         // Enhanced error handling for debugging
//         let msg = err.message || err;
//         if (msg.includes("Voting has not started yet")) {
//           console.error("[Voting Error] Voting has not started yet! Check votingStart and current time.");
//         } else if (msg.includes("Voting has ended")) {
//           console.error("[Voting Error] Voting has ended! Check votingEnd and current time.");
//         } else if (msg.includes("Invalid candidate ID")) {
//           console.error("[Voting Error] Invalid candidate ID! Check candidate selection and countCandidates.");
//         } else if (msg.includes("You have already voted")) {
//           console.error("[Voting Error] You have already voted with this account.");
//         } else {
//           console.error("[Voting Error] Unknown error:", msg);
//         }
//         $("#msg").html("<p>Vote failed: " + msg + "</p>");
//       });
//     });
//   }
// }

// window.addEventListener("load", function() {
//   if (typeof web3 !== "undefined") {
//     console.warn("Using web3 detected from external source like Metamask")
//     window.eth = new Web3(window.ethereum)
//   } else {
//     console.warn("No web3 detected. Falling back to http://localhost:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for deployment. More info here: http://truffleframework.com/tutorials/truffle-and-metamask")
//     window.eth = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"))
//   }
//   window.App.eventStart()
// })

const Web3 = require('web3');
const contract = require('@truffle/contract');
const votingArtifacts = require('../../build/contracts/Voting.json');
var VotingContract = contract(votingArtifacts)

window.App = {
  eventStart: function() { 
    console.log("[App.eventStart] Starting initialization...");

    // Request accounts from the browser wallet
    window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(() => {
        console.log("[App.eventStart] Ethereum accounts requested.");
      })
      .catch(err => {
        console.error("[App.eventStart] Error requesting accounts:", err);
      });

    VotingContract.setProvider(window.ethereum)
    VotingContract.defaults({from: window.ethereum.selectedAddress, gas: 6654755})
    
    // Load account data
    App.account = window.ethereum.selectedAddress;
    $("#accountAddress").html("Your Account: " + window.ethereum.selectedAddress);
    console.log("[App.eventStart] Using account:", window.ethereum.selectedAddress);

    VotingContract.deployed().then(function(instance){
      console.log("[App.eventStart] Contract deployed:", instance.address);
      instance.getCountCandidates().then(function(countCandidates){
        console.log("[App.eventStart] Number of candidates:", countCandidates);

        $(document).ready(function(){
          // Log add candidate button click
          $('#addCandidate').click(function() {
            var nameCandidate = $('#name').val();
            var partyCandidate = $('#party').val();
            console.log("[App.eventStart] Add candidate clicked with name:", nameCandidate, "and party:", partyCandidate);
            instance.addCandidate(nameCandidate, partyCandidate).then(function(result){
              console.log("[App.eventStart] Candidate added successfully. Transaction details:", result);
            }).catch(function(err){
              console.error("[App.eventStart] Error adding candidate:", err);
            });
          });   

          // Log add date button click
          $('#addDate').click(function(){             
            var startDate = Date.parse(document.getElementById("startDate").value)/1000;
            var endDate =  Date.parse(document.getElementById("endDate").value)/1000;
            console.log("[App.eventStart] Set Dates clicked. Start date (unix):", startDate, "End date (unix):", endDate);
            instance.setDates(startDate, endDate).then(function(rslt){ 
              console.log("[App.eventStart] Dates set successfully.");
            }).catch(function(err){
              console.error("[App.eventStart] Error setting dates:", err);
            });
          });     

          // Retrieve and show dates on the UI
          instance.getDates().then(function(result){
            var startDateObj = new Date(result[0]*1000);
            var endDateObj = new Date(result[1]*1000);
            console.log("[App.eventStart] Retrieved voting dates:", startDateObj, endDateObj);

            $("#dates").text( startDateObj.toDateString() + " - " + endDateObj.toDateString());
          }).catch(function(err){ 
            console.error("[App.eventStart] Error retrieving dates:", err.message);
          });           
        });
        
        // Load and display each candidate
        for (var i = 0; i < countCandidates; i++ ){
          instance.getCandidate(i+1).then(function(data){
            var id = data[0];
            var name = data[1];
            var party = data[2];
            var voteCount = data[3];
            console.log("[App.eventStart] Loaded candidate:", { id, name, party, voteCount });
            var viewCandidates = `<tr>
                                      <td>
                                        <input class="form-check-input" type="radio" name="candidate" value="${id}" id=${id}>
                                        ${name}
                                      </td>
                                      <td>${party}</td>
                                      <td>${voteCount}</td>
                                    </tr>`;
            $("#boxCandidate").append(viewCandidates)
          }).catch(function(err){
            console.error("[App.eventStart] Error loading candidate at index", i, ":", err.message);
          });
        }
        
        window.countCandidates = countCandidates; 
      });

      // Check if the account has already voted
      instance.checkVote().then(function (voted) {
          console.log("[App.eventStart] Vote status for account:", voted);
          if(!voted) {
            $("#voteButton").attr("disabled", false);
            console.log("[App.eventStart] Vote button enabled.");
          } else {
            console.log("[App.eventStart] Account already voted; vote button remains disabled.");
          }
      }).catch(function(err){
        console.error("[App.eventStart] Error checking vote status:", err);
      });

    }).catch(function(err){ 
      console.error("[App.eventStart] Error during contract deployment:", err.message);
    })
  },

  vote: function () {
    console.log("[App.vote] Vote function triggered.");
    var candidateID = $("input[name='candidate']:checked").val();
    if (!candidateID) {
      $("#msg").html("<p>Please vote for a candidate.</p>");
      console.error("[App.vote] No candidate selected.");
      return;
    }
    console.log("[App.vote] Candidate selected with ID:", candidateID);
    
    VotingContract.deployed().then(function(instance){
      instance.vote(parseInt(candidateID)).then(function(result){
        console.log("[App.vote] Vote cast successfully. Transaction details:", result);
        $("#voteButton").attr("disabled", true);
        $("#msg").html("<p>Voted</p>");
        window.location.reload(1);
      }).catch(function(err){
        let msg = err.message || err;
        if (msg.includes("Voting has not started yet")) {
          console.error("[Voting Error] Voting has not started yet! Check votingStart and current time.");
        } else if (msg.includes("Voting has ended")) {
          console.error("[Voting Error] Voting has ended! Check votingEnd and current time.");
        } else if (msg.includes("Invalid candidate ID")) {
          console.error("[Voting Error] Invalid candidate ID! Check candidate selection and countCandidates.");
        } else if (msg.includes("You have already voted")) {
          console.error("[Voting Error] You have already voted with this account.");
        } else {
          console.error("[Voting Error] Unknown error:", msg);
        }
        $("#msg").html("<p>Vote failed: " + msg + "</p>");
      });
    }).catch(function(err){
      console.error("[App.vote] Error retrieving deployed contract instance:", err);
    });
  }
}

window.addEventListener("load", function() {
  if (typeof web3 !== "undefined") {
    console.warn("Using web3 detected from external source like Metamask");
    window.eth = new Web3(window.ethereum);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for deployment. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    window.eth = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }
  console.log("[Window.load] Web3 initialized. Starting App.eventStart");
  window.App.eventStart();  
});
