// //import "../css/style.css"

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

//   vote: function() {    
//     var candidateID = $("input[name='candidate']:checked").val();
//     if (!candidateID) {
//       $("#msg").html("<p>Please vote for a candidate.</p>")
//       return
//     }
//     VotingContract.deployed().then(function(instance){
//       instance.vote(parseInt(candidateID)).then(function(result){
//         $("#voteButton").attr("disabled", true);
//         $("#msg").html("<p>Voted</p>");
//          window.location.reload(1);
//       })
//     }).catch(function(err){ 
//       console.error("ERROR! " + err.message)
//     })
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
// Import Web3.js and contract artifacts


// const Web3 = require('web3');
// const contract = require('@truffle/contract');
// const votingArtifacts = require('../../build/contracts/Voting.json');
// var VotingContract = contract(votingArtifacts);

// window.App = {
//   eventStart: function () {
//     // Request Ethereum account access via MetaMask
//     window.ethereum.request({ method: 'eth_requestAccounts' })
//       .then(() => {
//         VotingContract.setProvider(window.ethereum);
//         VotingContract.defaults({ from: window.ethereum.selectedAddress, gas: 6654755 });

//         // Load account data
//         App.account = window.ethereum.selectedAddress;
//         $("#accountAddress").html("Your Account: " + window.ethereum.selectedAddress);

//         // Fetch contract instance
//         VotingContract.deployed().then(function (instance) {
//           // Fetch candidates count
//           instance.getCountCandidates().then(function (countCandidates) {
//             // Initialize candidates display
//             App.displayCandidates(instance, countCandidates);
//             window.countCandidates = countCandidates;

//             // Handle adding a new candidate
//             $('#addCandidate').click(function () {
//               var nameCandidate = $('#name').val();
//               var partyCandidate = $('#party').val();
//               instance.addCandidate(nameCandidate, partyCandidate).then(function (result) {
//                 console.log("Candidate added:", result);
//               }).catch(function (err) {
//                 console.error("Error adding candidate:", err.message);
//               });
//             });

//             // Handle setting dates for the election
//             $('#addDate').click(function () {
//               var startDate = Date.parse(document.getElementById("startDate").value) / 1000;
//               var endDate = Date.parse(document.getElementById("endDate").value) / 1000;

//               instance.setDates(startDate, endDate).then(function (rslt) {
//                 console.log("Election dates set:", rslt);
//               }).catch(function (err) {
//                 console.error("Error setting dates:", err.message);
//               });
//             });

//             // Get and display dates
//             instance.getDates().then(function (result) {
//               var startDate = new Date(result[0] * 1000);
//               var endDate = new Date(result[1] * 1000);
//               $("#dates").text(startDate.toDateString() + " - " + endDate.toDateString());
//             }).catch(function (err) {
//               console.error("ERROR! " + err.message);
//             });
//           });

//           // Check voting status
//           instance.checkVote().then(function (voted) {
//             if (!voted) {
//               $("#voteButton").attr("disabled", false);
//             }
//           }).catch(function (err) {
//             console.error("Error checking vote status:", err.message);
//           });
//         }).catch(function (err) {
//           console.error("ERROR! " + err.message);
//         });
//       }).catch(function (err) {
//         console.error("Error accessing Ethereum accounts:", err.message);
//       });
//   },

//   // Display candidates on the page
//   displayCandidates: function (instance, countCandidates) {
//     for (var i = 0; i < countCandidates; i++) {
//       instance.getCandidate(i + 1).then(function (data) {
//         var id = data[0];
//         var name = data[1];
//         var party = data[2];
//         var voteCount = data[3];
//         var viewCandidates = `<tr><td><input class="form-check-input" type="radio" name="candidate" value="${id}" id="${id}">` + name + "</td><td>" + party + "</td><td>" + voteCount + "</td></tr>";
//         $("#boxCandidate").append(viewCandidates);
//       }).catch(function (err) {
//         console.error("Error fetching candidate:", err.message);
//       });
//     }
//   },

//   // Handle voting
//   vote: function () {
//     var candidateID = $("input[name='candidate']:checked").val();
//     if (!candidateID) {
//       $("#msg").html("<p>Please vote for a candidate.</p>");
//       return;
//     }
//     VotingContract.deployed().then(function (instance) {
//       instance.vote(parseInt(candidateID)).then(function (result) {
//         $("#voteButton").attr("disabled", true);
//         $("#msg").html("<p>Voted successfully!</p>");
//         window.location.reload(1);
//       }).catch(function (err) {
//         console.error("Error casting vote:", err.message);
//       });
//     }).catch(function (err) {
//       console.error("ERROR! " + err.message);
//     });
//   }
// };

// window.addEventListener("load", function () {
//   if (typeof web3 !== "undefined") {
//     console.warn("Using web3 detected from external source like MetaMask");
//     window.eth = new Web3(window.ethereum);
//   } else {
//     console.warn("No web3 detected. Falling back to http://localhost:9545.");
//     window.eth = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
//   }
//   window.App.eventStart();
// });








// const Web3 = require('web3');
// const contract = require('@truffle/contract');
// const votingArtifacts = require('../../build/contracts/Voting.json');
// const VotingContract = contract(votingArtifacts);

// window.App = {
//   account: null,

//   async eventStart() {
//     try {
//       // Request account access via MetaMask
//       await window.ethereum.request({ method: 'eth_requestAccounts' });
//       VotingContract.setProvider(window.ethereum);
//       VotingContract.defaults({ from: window.ethereum.selectedAddress, gas: 6654755 });

//       // Load account data
//       this.account = window.ethereum.selectedAddress;
//       document.getElementById("accountAddress").textContent = `Your Account: ${this.account}`;

//       // Fetch contract instance
//       const instance = await VotingContract.deployed();

//       // Fetch and display candidates
//       const countCandidates = await instance.getCountCandidates();
//       this.displayCandidates(instance, countCandidates);
//       window.countCandidates = countCandidates;

//       // Handle adding a new candidate
//       document.getElementById("addCandidate").addEventListener("click", async () => {
//         const nameCandidate = document.getElementById("name").value.trim();
//         const partyCandidate = document.getElementById("party").value.trim();

//         if (!nameCandidate || !partyCandidate) {
//           console.error("Candidate name or party is missing.");
//           return;
//         }

//         try {
//           const result = await instance.addCandidate(nameCandidate, partyCandidate);
//           console.log("Candidate added:", result);
//           alert("Candidate added successfully!");
//         } catch (err) {
//           console.error("Error adding candidate:", err.message);
//         }
//       });

//       // Handle setting election dates
//       document.getElementById("addDate").addEventListener("click", async () => {
//         const startDate = Math.floor(new Date(document.getElementById("startDate").value).getTime() / 1000);
//         const endDate = Math.floor(new Date(document.getElementById("endDate").value).getTime() / 1000);

//         if (isNaN(startDate) || isNaN(endDate)) {
//           console.error("Invalid date input.");
//           return;
//         }

//         try {
//           const result = await instance.setDates(startDate, endDate);
//           console.log("Election dates set:", result);
//           alert("Election dates updated!");
//         } catch (err) {
//           console.error("Error setting dates:", err.message);
//         }
//       });

//       // Fetch and display election dates
//       try {
//         const dates = await instance.getDates();
//         const startDate = new Date(dates[0] * 1000).toDateString();
//         const endDate = new Date(dates[1] * 1000).toDateString();
//         document.getElementById("dates").textContent = `${startDate} - ${endDate}`;
//       } catch (err) {
//         console.error("Error fetching dates:", err.message);
//       }

//       // Check voting status
//       try {
//         const voted = await instance.checkVote();
//         if (!voted) {
//           document.getElementById("voteButton").disabled = false;
//         }
//       } catch (err) {
//         console.error("Error checking vote status:", err.message);
//       }

//       // Handle voting
//       document.getElementById("voteButton").addEventListener("click", this.vote.bind(this, instance));
//     } catch (err) {
//       console.error("Error initializing app:", err.message);
//     }
//   },

//   async displayCandidates(instance, countCandidates) {
//     try {
//       for (let i = 0; i < countCandidates; i++) {
//         const data = await instance.getCandidate(i + 1);
//         const [id, name, party, voteCount] = data;
//         const candidateRow = `
//           <tr>
//             <td><input class="form-check-input" type="radio" name="candidate" value="${id}" id="${id}"> ${name}</td>
//             <td>${party}</td>
//             <td>${voteCount}</td>
//           </tr>`;
//         document.getElementById("boxCandidate").insertAdjacentHTML("beforeend", candidateRow);
//         console.log("Candidate Data:", data);
//       }
//     } catch (err) {
//       console.error("Error displaying candidates:", err.message);
//     }
//   },

//   async vote(instance) {
//     const candidateID = document.querySelector("input[name='candidate']:checked")?.value;

//     if (!candidateID) {
//       document.getElementById("msg").innerHTML = "<p>Please vote for a candidate.</p>";
//       return;
//     }

//     try {
//       const result = await instance.vote(parseInt(candidateID), { gas: 300000 });
//       document.getElementById("voteButton").disabled = true;
//       document.getElementById("msg").innerHTML = "<p>Voted successfully!</p>";
//       console.log("Vote successful:", result);
//       window.location.reload();
//     } catch (err) {
//       console.error("Error casting vote:", err.message);
//     }
//   },
// };

// window.addEventListener("load", async () => {
//   if (typeof window.ethereum !== "undefined") {
//     console.warn("Using MetaMask detected.");
//     window.eth = new Web3(window.ethereum);
//   } else {
//     console.warn("No MetaMask detected. Falling back to local blockchain.");
//     window.eth = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
//   }
//   await window.App.eventStart();
// });







// Displaying not workingg

// const Web3 = require("web3");
// const contract = require("@truffle/contract");
// const votingArtifacts = require("../../build/contracts/Voting.json");
// const VotingContract = contract(votingArtifacts);

// window.App = {
//   account: null,

//   async eventStart() {
//     try {
//       // Request account access via MetaMask
//       await window.ethereum.request({ method: "eth_requestAccounts" });
//       VotingContract.setProvider(window.ethereum);
//       VotingContract.defaults({
//         from: window.ethereum.selectedAddress,
//         gas: 6654755,
//       });

//       // Load account data
//       this.account = window.ethereum.selectedAddress;
//       document.getElementById(
//         "accountAddress"
//       ).textContent = `Your Account: ${this.account}`;

//       // Fetch contract instance
//       const instance = await VotingContract.deployed();

//       // Fetch and display candidates
//       const countCandidates = await instance.getCountCandidates();
//       this.displayCandidates(instance, countCandidates);
//       window.countCandidates = countCandidates;

//       // Handle adding a new candidate
//       document
//         .getElementById("addCandidate")
//         .addEventListener("click", async () => {
//           const nameCandidate = document.getElementById("name").value.trim();
//           const partyCandidate = document.getElementById("party").value.trim();

//           if (!nameCandidate || !partyCandidate) {
//             alert("Both name and party are required!");
//             return;
//           }

//           try {
//             const result = await instance.addCandidate(
//               nameCandidate,
//               partyCandidate
//             );
//             console.log("Candidate added:", result);
//             alert("Candidate added successfully!");

//             // Reload candidates
//             const updatedCountCandidates = await instance.getCountCandidates();
//             document.getElementById("boxCandidate").innerHTML = ""; // Clear current candidates
//             await this.displayCandidates(instance, updatedCountCandidates);
//           } catch (err) {
//             console.error("Error adding candidate:", err.message);
//             alert(`Error: ${err.message}`);
//           }
//         });

//       // Handle setting election dates
//       document.getElementById("addDate").addEventListener("click", async () => {
//         const startDate = Math.floor(
//           new Date(document.getElementById("startDate").value).getTime() / 1000
//         );
//         const endDate = Math.floor(
//           new Date(document.getElementById("endDate").value).getTime() / 1000
//         );

//         if (isNaN(startDate) || isNaN(endDate) || startDate >= endDate) {
//           alert("Invalid date input. Ensure end date is later than start date.");
//           return;
//         }

//         try {
//           const result = await instance.setDates(startDate, endDate, { gas: 2000000 });
//           console.log("Election dates set:", result);
//           alert("Election dates updated!");

//           // Reload dates
//           const dates = await instance.getDates();
//           const start = new Date(dates[0] * 1000).toDateString();
//           const end = new Date(dates[1] * 1000).toDateString();
//           document.getElementById("dates").textContent = `${start} - ${end}`;
//         } catch (err) {
//           console.error("Error setting dates:", err.message);
//           alert(`Error: ${err.message}`);
//         }
//       });

//       // Fetch and display election dates
//       try {
//         const dates = await instance.getDates();
//         const startDate = new Date(dates[0] * 1000).toDateString();
//         const endDate = new Date(dates[1] * 1000).toDateString();
//         document.getElementById("dates").textContent = `${startDate} - ${endDate}`;
//       } catch (err) {
//         console.error("Error fetching dates:", err.message);
//       }

//       // Check voting status
//       try {
//         const voted = await instance.checkVote();
//         document.getElementById("voteButton").disabled = voted;
//       } catch (err) {
//         console.error("Error checking vote status:", err.message);
//       }

//       // Handle voting
//       document
//         .getElementById("voteButton")
//         .addEventListener("click", this.vote.bind(this, instance));
//     } catch (err) {
//       if (err.code === 4001) {
//         alert("MetaMask connection was rejected by the user.");
//       } else {
//         console.error("Error initializing app:", err.message);
//       }
//     }
//   },

//   async displayCandidates(instance, countCandidates) {
//     try {
//       const boxCandidate = document.getElementById("boxCandidate");
//       if (!boxCandidate) {
//         console.error("Element with id 'boxCandidate' not found");
//         return;
//       }
//       boxCandidate.innerHTML = ""; // Clear existing content
  
//       for (let i = 1; i <= countCandidates; i++) { // Candidate IDs start from 1
//         const data = await instance.getCandidate(i);
//         const [id, name, party, voteCount] = data;
  
//         // Generate candidate row dynamically
//         const candidateRow = `
//           <tr>
//             <td>${id}</td>
//             <td>${name}</td>
//             <td>${party}</td>
//             <td>${voteCount}</td>
//           </tr>`;
//         boxCandidate.insertAdjacentHTML("beforeend", candidateRow);
//       }
//     } catch (err) {
//       console.error("Error displaying candidates:", err.message);
//     }
//   },
  
  
  
//   async vote(instance) {
//     const candidateID = document.querySelector(
//       "input[name='candidate']:checked"
//     )?.value;

//     if (!candidateID) {
//       document.getElementById("msg").innerHTML =
//         "<p>Please vote for a candidate.</p>";
//       return;
//     }

//     try {
//       const result = await instance.vote(parseInt(candidateID), { gas: 1000000 });
//       document.getElementById("voteButton").disabled = true;
//       document.getElementById("msg").innerHTML = "<p>Voted successfully!</p>";
//       console.log("Vote successful:", result);
//       window.location.reload();
//     } catch (err) {
//       console.error("Error casting vote:", err.message);
//       document.getElementById(
//         "msg"
//       ).innerHTML = `<p>Error: ${err.message}</p>`;
//     }
//   },
// };

// window.addEventListener("load", async () => {
//   if (typeof window.ethereum !== "undefined") {
//     console.warn("Using MetaMask detected.");
//     window.eth = new Web3(window.ethereum);
//   } else {
//     console.warn("No MetaMask detected. Falling back to local blockchain.");
//     window.eth = new Web3(
//       new Web3.providers.HttpProvider("http://127.0.0.1:9545")
//     );
//   }

//   document.addEventListener("DOMContentLoaded", async () => {
//     await window.App.eventStart();
//   });
// });








// const Web3 = require("web3");
// const contract = require("@truffle/contract");
// const votingArtifacts = require("../../build/contracts/Voting.json");
// const VotingContract = contract(votingArtifacts);

// window.App = {
//   account: null,

//   async eventStart() {
//     try {
//       // Request account access via MetaMask
//       await window.ethereum.request({ method: "eth_requestAccounts" });
//       VotingContract.setProvider(window.ethereum);
//       VotingContract.defaults({
//         from: window.ethereum.selectedAddress,
//         gas: 6654755,
//       });

//       // Load account data
//       this.account = window.ethereum.selectedAddress;
//       document.getElementById(
//         "accountAddress"
//       ).textContent = `Your Account: ${this.account}`;

//       // Fetch contract instance
//       const instance = await VotingContract.deployed();

//       // Fetch and display candidates
//       const countCandidates = await instance.getCountCandidates();
//       this.displayCandidates(instance, countCandidates);

//       // Fetch and display election dates
//       this.displayDates(instance);

//       // Check if user has already voted
//       this.checkVoteStatus(instance);

//       // Handle adding a candidate
//       document
//         .getElementById("addCandidate")
//         .addEventListener("click", async () => {
//           const nameCandidate = document.getElementById("name").value.trim();
//           const partyCandidate = document.getElementById("party").value.trim();

//           if (!nameCandidate || !partyCandidate) {
//             alert("Both name and party are required!");
//             return;
//           }

//           try {
//             const result = await instance.addCandidate(
//               nameCandidate,
//               partyCandidate
//             );
//             console.log("Candidate added:", result);
//             alert("Candidate added successfully!");

//             // Reload candidates
//             const updatedCountCandidates = await instance.getCountCandidates();
//             this.displayCandidates(instance, updatedCountCandidates);
//           } catch (err) {
//             console.error("Error adding candidate:", err.message);
//             alert(`Error: ${err.message}`);
//           }
//         });

//       // Handle setting election dates
//       document.getElementById("addDate").addEventListener("click", async () => {
//         const startDate = Math.floor(
//           new Date(document.getElementById("startDate").value).getTime() / 1000
//         );
//         const endDate = Math.floor(
//           new Date(document.getElementById("endDate").value).getTime() / 1000
//         );

//         if (isNaN(startDate) || isNaN(endDate) || startDate >= endDate) {
//           alert("Invalid date input. Ensure end date is later than start date.");
//           return;
//         }

//         try {
//           const result = await instance.setDates(startDate, endDate, { gas: 2000000 });
//           console.log("Election dates set:", result);
//           alert("Election dates updated!");

//           // Reload dates
//           this.displayDates(instance);
//         } catch (err) {
//           console.error("Error setting dates:", err.message);
//           alert(`Error: ${err.message}`);
//         }
//       });

//       // Handle voting
//       document
//         .getElementById("voteButton")
//         .addEventListener("click", this.vote.bind(this, instance));
//     } catch (err) {
//       if (err.code === 4001) {
//         alert("MetaMask connection was rejected by the user.");
//       } else {
//         console.error("Error initializing app:", err.message);
//       }
//     }
//   },

//   async displayCandidates(instance, countCandidates) {
//     try {
//       const boxCandidate = document.getElementById("boxCandidate");
//       if (!boxCandidate) {
//         console.error("Element with id 'boxCandidate' not found");
//         return;
//       }
//       boxCandidate.innerHTML = ""; // Clear existing content

//       for (let i = 1; i <= countCandidates; i++) {
//         const data = await instance.getCandidate(i);
//         const [id, name, party, voteCount] = data;

//         // Generate candidate row dynamically
//         const candidateRow = `
//           <tr>
//             <td>${name}</td>
//             <td>${party}</td>
//             <td>${voteCount}</td>
//             <td><input type="radio" name="candidate" value="${id}"></td>
//           </tr>`;
//         boxCandidate.insertAdjacentHTML("beforeend", candidateRow);
//       }
//     } catch (err) {
//       console.error("Error displaying candidates:", err.message);
//     }
//   },

//   async displayDates(instance) {
//     try {
//       const dates = await instance.getDates();
//       const startDate = new Date(dates[0] * 1000).toDateString();
//       const endDate = new Date(dates[1] * 1000).toDateString();
//       document.getElementById("dates").textContent = `${startDate} - ${endDate}`;
//     } catch (err) {
//       console.error("Error fetching dates:", err.message);
//     }
//   },

//   async checkVoteStatus(instance) {
//     try {
//       const voted = await instance.checkVote();
//       document.getElementById("voteButton").disabled = voted;
//     } catch (err) {
//       console.error("Error checking vote status:", err.message);
//     }
//   },

//   async vote(instance) {
//     const candidateID = document.querySelector(
//       "input[name='candidate']:checked"
//     )?.value;

//     if (!candidateID) {
//       document.getElementById("msg").innerHTML =
//         "<p>Please vote for a candidate.</p>";
//       return;
//     }

//     try {
//       const result = await instance.vote(parseInt(candidateID), { gas: 1000000 });
//       document.getElementById("voteButton").disabled = true;
//       document.getElementById("msg").innerHTML = "<p>Voted successfully!</p>";
//       console.log("Vote successful:", result);
//       window.location.reload();
//     } catch (err) {
//       console.error("Error casting vote:", err.message);
//       document.getElementById(
//         "msg"
//       ).innerHTML = `<p>Error: ${err.message}</p>`;
//     }
//   },
// };

// window.addEventListener("load", async () => {
//   if (typeof window.ethereum !== "undefined") {
//     console.warn("Using MetaMask detected.");
//     window.eth = new Web3(window.ethereum);
//   } else {
//     console.warn("No MetaMask detected. Falling back to local blockchain.");
//     window.eth = new Web3(
//       new Web3.providers.HttpProvider("http://127.0.0.1:9545")
//     );
//   }
//   await window.App.eventStart();
// });














// const Web3 = require('web3');
// const votingArtifacts = require('../../build/contracts/Voting.json');
//  // Correct import path

// const contractAddress = '0x04977864530561034EF6705eCed4a01806681a1B'; // Replace with your actual contract address

// const App = {
//   web3: null,
//   account: null,
//   contract: null,

//   async initialize() {
//     try {
//       // Check if MetaMask is available
//       if (typeof window.ethereum !== "undefined") {
//         console.log("MetaMask detected. Initializing web3...");
//         this.web3 = new Web3(window.ethereum);

//         // Request account access
//         await window.ethereum.request({ method: "eth_requestAccounts" });

//         // Set the current account
//         this.account = window.ethereum.selectedAddress;
//         document.getElementById("accountAddress").textContent = `Your Account: ${this.account}`;

//         // Initialize the contract
//         this.contract = new this.web3.eth.Contract(votingArtifacts.abi, contractAddress);
//         console.log("Contract initialized:", this.contract);

//         // Start the application
//         await this.eventStart();
//       } else {
//         alert("MetaMask not found. Please install MetaMask to use this application.");
//         console.warn("MetaMask not detected. Falling back to local blockchain...");
//         this.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
//       }
//     } catch (err) {
//       console.error("Initialization error:", err.message);
//       alert("Failed to initialize the app. Please check the console for details.");
//     }
//   },

//   async eventStart() {
//     try {
//       // Display candidates and dates
//       const countCandidates = await this.contract.methods.getCountCandidates().call();
//       this.displayCandidates(countCandidates);

//       const dates = await this.contract.methods.getDates().call();
//       this.displayDates(dates);

//       // Check vote status
//       const voted = await this.contract.methods.checkVote().call({ from: this.account });
//       document.getElementById("voteButton").disabled = voted;

//       // Add event listeners
//       document.getElementById("addCandidate").addEventListener("click", this.addCandidate.bind(this));
//       document.getElementById("addDate").addEventListener("click", this.setElectionDates.bind(this));
//       document.getElementById("voteButton").addEventListener("click", this.vote.bind(this));
//     } catch (err) {
//       console.error("Error during event start:", err.message);
//     }
//   },

//   async displayCandidates(countCandidates) {
//     const boxCandidate = document.getElementById("boxCandidate");
//     boxCandidate.innerHTML = ""; // Clear existing candidates

//     for (let i = 1; i <= countCandidates; i++) {
//       try {
//         const candidate = await this.contract.methods.getCandidate(i).call();
//         const candidateRow = `
//           <tr>
//             <td>${candidate[1]}</td>
//             <td>${candidate[2]}</td>
//             <td>${candidate[3]}</td>
//             <td><input type="radio" name="candidate" value="${candidate[0]}"></td>
//           </tr>`;
//         boxCandidate.insertAdjacentHTML("beforeend", candidateRow);
//       } catch (err) {
//         console.error(`Error fetching candidate ${i}:`, err.message);
//       }
//     }
//   },

//   displayDates(dates) {
//     const startDate = new Date(dates[0] * 1000).toDateString();
//     const endDate = new Date(dates[1] * 1000).toDateString();
//     document.getElementById("dates").textContent = `${startDate} - ${endDate}`;
//   },

//   async addCandidate() {
//     const name = document.getElementById("name").value.trim();
//     const party = document.getElementById("party").value.trim();

//     if (!name || !party) {
//       alert("Both name and party are required!");
//       return;
//     }

//     try {
//       await this.contract.methods.addCandidate(name, party).send({ from: this.account });
//       alert("Candidate added successfully!");
//       const countCandidates = await this.contract.methods.getCountCandidates().call();
//       this.displayCandidates(countCandidates);
//     } catch (err) {
//       console.error("Error adding candidate:", err.message);
//       alert(`Error: ${err.message}`);
//     }
//   },

//   async setElectionDates() {
//     const startDate = Math.floor(new Date(document.getElementById("startDate").value).getTime() / 1000);
//     const endDate = Math.floor(new Date(document.getElementById("endDate").value).getTime() / 1000);

//     if (isNaN(startDate) || isNaN(endDate) || startDate >= endDate) {
//       alert("Invalid date input. Ensure the end date is later than the start date.");
//       return;
//     }

//     try {
//       await this.contract.methods.setDates(startDate, endDate).send({ from: this.account });
//       alert("Election dates updated!");
//       this.displayDates(await this.contract.methods.getDates().call());
//     } catch (err) {
//       console.error("Error setting dates:", err.message);
//       alert(`Error: ${err.message}`);
//     }
//   },

//   async vote() {
//     const candidateID = document.querySelector("input[name='candidate']:checked")?.value;

//     if (!candidateID) {
//       document.getElementById("msg").innerHTML = "<p>Please select a candidate before voting.</p>";
//       return;
//     }

//     try {
//       const gas = await this.contract.methods.vote(parseInt(candidateID)).estimateGas({ from: this.account });
//       await this.contract.methods.vote(parseInt(candidateID)).send({ from: this.account, gas });
//       document.getElementById("voteButton").disabled = true;
//       document.getElementById("msg").innerHTML = "<p>Voted successfully!</p>";
//       console.log("Vote successful!");
//       window.location.reload();
//     } catch (err) {
//       console.error("Error casting vote:", err.message);
//       document.getElementById("msg").innerHTML = `<p>Error: ${err.message}</p>`;
//     }
//   },
// };







// const Web3 = require("web3");
// const contract = require("@truffle/contract");
// const votingArtifacts = require("../../build/contracts/Voting.json");
// const VotingContract = contract(votingArtifacts);



// // import Web3 from 'web3';
// // import votingArtifacts from '../../build/contracts/Voting.json'; // Correct import path

// // const web3 = new Web3(window.ethereum); // Or use an HTTP provider if needed
// // const contractAddress = '0x04977864530561034EF6705eCed4a01806681a1B'; // Replace with your contract address

// // // Ensure web3 is initialized before interacting with the contract
// // async function initializeContract() {
// //     await window.ethereum.enable(); // Request access to accounts if using MetaMask
// //     const contract = new web3.eth.Contract(votingArtifacts.abi, contractAddress);
// //     return contract;
// // }

// window.App = {
//   account: null,

//   async eventStart() {
//     try {
//       // Request account access via MetaMask
//       await window.ethereum.request({ method: "eth_requestAccounts" });
//       // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//       // const userAddress = accounts[0]; // This will give you the first connected account
//       // console.log("User Address:", userAddress);

//       VotingContract.setProvider(window.ethereum);
//       VotingContract.defaults({
//         from: window.ethereum.selectedAddress,
//         gas: 6654755,
//       });

//       // Load account data
//       this.account = window.ethereum.selectedAddress;
//       document.getElementById("accountAddress").textContent = `Your Account: ${this.account}`;

//       // Fetch contract instance
//       const instance = await VotingContract.deployed();
//       console.log("Instance object:", instance);

//       // Fetch and display candidates
//       const countCandidates = await instance.getCountCandidates();
//       this.displayCandidates(instance, countCandidates);

//       // Fetch and display election dates
//       this.displayDates(instance);

//       // Check if user has already voted
//       this.checkVoteStatus(instance);

//       // Handle adding a candidate
//       document.getElementById("addCandidate")?.addEventListener("click", async () => {
//         const nameCandidate = document.getElementById("name")?.value.trim();
//         const partyCandidate = document.getElementById("party")?.value.trim();

//         if (!nameCandidate || !partyCandidate) {
//           alert("Both name and party are required!");
//           return;
//         }

//         try {
//           const result = await instance.addCandidate(nameCandidate, partyCandidate);
//           console.log("Candidate added:", result);
//           alert("Candidate added successfully!");

//           // Reload candidates
//           const updatedCountCandidates = await instance.getCountCandidates();
//           this.displayCandidates(instance, updatedCountCandidates);
//         } catch (err) {
//           console.error("Error adding candidate:", err.message);
//           alert(`Error: ${err.message}`);
//         }
//       });

//       // Handle setting election dates
//       document.getElementById("addDate")?.addEventListener("click", async () => {
//         const startDate = Math.floor(new Date(document.getElementById("startDate")?.value).getTime() / 1000);
//         const endDate = Math.floor(new Date(document.getElementById("endDate")?.value).getTime() / 1000);

//         if (isNaN(startDate) || isNaN(endDate) || startDate >= endDate) {
//           alert("Invalid date input. Ensure end date is later than start date.");
//           return;
//         }

//         try {
//           const result = await instance.setDates(startDate, endDate, { gas: 2000000 });
//           console.log("Election dates set:", result);
//           alert("Election dates updated!");

//           // Reload dates
//           this.displayDates(instance);
//         } catch (err) {
//           console.error("Error setting dates:", err.message);
//           alert(`Error: ${err.message}`);
//         }
//       });

//       // Handle voting
//       document.getElementById("voteButton").addEventListener("click", () => this.vote(instance, this.account));
//     } catch (err) {
//       if (err.code === 4001) {
//         alert("MetaMask connection was rejected by the user.");
//       } else {
//         console.error("Error initializing app:", err.message);
//       }
//     }
//   },

//   async displayCandidates(instance, countCandidates) {
//     try {
//       const boxCandidate = document.getElementById("boxCandidate");
//       if (!boxCandidate) {
//         console.error("Element with id 'boxCandidate' not found");
//         return;
//       }
//       boxCandidate.innerHTML = ""; // Clear existing content
  
//       for (let i = 1; i <= countCandidates; i++) {
//         const data = await instance.getCandidate(i);
//         console.log("Candidate data:", data);
//         const id = data[0];
//         const name = data[1];
//         const party = data[2];
//         const voteCount = data[3];
  
//         const candidateRow = `
//           <tr>
//             <td>${name}</td>
//             <td>${party}</td>
//             <td>${voteCount}</td>
//             <td><input type="radio" name="candidate" value="${id}"></td>
//           </tr>`;
//         boxCandidate.insertAdjacentHTML("beforeend", candidateRow);
//       }
//     } catch (err) {
//       console.error("Error displaying candidates:", err.message);
//     }
//   },

//   async displayDates(instance) {
//     try {
//       const dates = await instance.getDates();
//       const startDate = new Date(dates[0] * 1000).toDateString();
//       const endDate = new Date(dates[1] * 1000).toDateString();
//       document.getElementById("dates").textContent = `${startDate} - ${endDate}`;
//     } catch (err) {
//       console.error("Error fetching dates:", err.message);
//     }
//   },

//   async checkVoteStatus(instance) {
//     try {
//       const voted = await instance.checkVote();
//       document.getElementById("voteButton").disabled = voted;
//     } catch (err) {
//       console.error("Error checking vote status:", err.message);
//     }
//   },

//   // async vote(instance) {
//   //   const candidateID = document.querySelector("input[name='candidate']:checked")?.value;

//   //   if (!candidateID) {
//   //     document.getElementById("msg").innerHTML = "<p>Please vote for a candidate.</p>";
//   //     return;
//   //   }

//   //   try {
//   //     const result = await instance.vote(parseInt(candidateID), { 
//   //     gas: 300000,
//   //     gasPrice: Web3.utils.toWei('20', 'gwei')});

//   //     const gas = await contract.methods.vote(candidateID).estimateGas({ from: userAddress });
//   //     await contract.methods.vote(candidateID).send({ from: userAddress, gas });

//   //     document.getElementById("voteButton").disabled = true;
//   //     document.getElementById("msg").innerHTML = "<p>Voted successfully!</p>";
//   //     console.log("Vote successful:", result);
//   //     window.location.reload();
//   //   } catch (err) {
//   //     // console.error("Error casting vote:", err.message);
//   //     // document.getElementById("msg").innerHTML = `<p>Error: ${err.message}</p>`;
//   //     if (err.message.includes("RPC Error")) {
//   //       console.error("RPC Error:", err);
//   //     } else {
//   //       console.error("Error casting vote:", err);
//   //     }
//   //   }
//   // },



//   // async  vote(instance, userAddress) {


//   //   console.log("Instance object2:", instance);

//   //   // Get the selected candidate ID
//   //   const candidateID = document.querySelector("input[name='candidate']:checked")?.value;
   
  
//   //   if (!candidateID) {
//   //     document.getElementById("msg").innerHTML = "<p>Please select a candidate before voting.</p>";
//   //     return;
//   //   }
    
  
//   //   try {
//   //     // Estimate gas for the transaction
//   //     const gas = await instance.methods.vote(parseInt(candidateID)).estimateGas({ from: userAddress });
  
//   //     // Send the vote transactionS
//   //     const receipt = await instance.methods.vote(parseInt(candidateID)).send({ 
//   //       from: userAddress, 
//   //       gas, 
//   //       gasPrice: Web3.utils.toWei('20', 'gwei') 
//   //     });
  
//   //     // Disable the vote button and show success message
//   //     document.getElementById("voteButton").disabled = true;
//   //     document.getElementById("msg").innerHTML = "<p>Voted successfully!</p>";
//   //     console.log("Vote transaction receipt:", receipt);
  
//   //     // Optionally reload to fetch updated contract state
//   //     window.location.reload();
//   //   } catch (err) {
//   //     console.error("Error casting vote:", err);
//   //     let errorMessage = "An error occurred while casting your vote.";
//   //     if (err.message.includes("RPC Error")) {
//   //       errorMessage = "There was an issue connecting to the blockchain. Please try again later.";
//   //     } else if (err.message.includes("revert")) {
//   //       errorMessage = "Voting failed. Please ensure the conditions for voting are met.";
//   //     }
//   //     document.getElementById("msg").innerHTML = `<p>${errorMessage}</p>`;
//   //   }
//   // },
//   //WORKING TILL KALRAAAAAAAAAAAA

//   async vote(instance, userAddress) {
//     console.log("vote address",userAddress);
//     const candidateID = document.querySelector("input[name='candidate']:checked")?.value;
//     console.log("useraddress" , userAddress);
//     if (!candidateID) {
//       document.getElementById("msg").innerHTML = "<p>Please select a candidate before voting.</p>";
//       return;
//     }
  
//     try {
//       console.log("Instance methods 1:", instance.methods);
//       // console.log("Vote method:", instance.methods.vote);

//       // console.log("Instance methods 2:", instance.vote(candidateID));
//       // console.log("Instance methods 3:", instance.vote(candidateID).estimateGas());
//       // console.log("Instance methods 4:", instance.vote(candidateID).estimateGas({ userAddress }));
//       // console.log("Instance methods 5:", instance.estimateGas({ from: userAddress }));
//       // Optional: Check gas estimation separately
//       // const gas = await instance.estimateGas({ from: userAddress });
//       // console.log("Estimated Gas:", gas);


//       const receipt = await instance.vote(parseInt(candidateID)).send({ 
//         from: userAddress, 
//         // gas, 
//         // gasPrice: Web3.utils.toWei('20', 'gwei') 
//       });
//       console.log("Receipt",receipt);
//       // document.getElementById("voteButton").addEventListener("click", () => this.vote(instance, this.account));
//       document.getElementById("voteButton").disabled = true;
//       document.getElementById("msg").innerHTML = "<p>Voted successfully!</p>";
//       console.log("Vote transaction receipt:", receipt);
  
//       window.location.reload();
//     } catch (err) {
//       // console.error("Error casting vote:", err);
//       // document.getElementById("msg").innerHTML = "<p>An error occurred while casting your vote.</p>";
//       // // console.error("Gas estimation failed:", err.message);
//       // document.getElementById("msg").innerHTML = `<p>Gas estimation failed. Please check your input or contract logic.</p>`;
//       // return;
//       console.error("Error casting vote:", err);

//         // Handle specific errors
//         if (err.message.includes('revert')) {
//             document.getElementById("msg").innerHTML = "<p>The vote could not be cast. Please check if the voting period is valid or if you've already voted.</p>";
//         } else {
//             document.getElementById("msg").innerHTML = `<p>An error occurred while casting your vote. Error: ${err.message}</p>`;
//         }
//         // Optionally disable the button in case of error
//         // document.getElementById("voteButton").disabled = true;
//     }
//   }
  
// };

// window.addEventListener("load", async () => {
//   if (typeof window.ethereum !== "undefined") {
//     console.warn("Using MetaMask detected.");
//     window.eth = new Web3(window.ethereum);
//   } else {
//     console.warn("No MetaMask detected. Falling back to local blockchain.");
//     window.eth = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
//   }
//   await window.App.eventStart();
// });
// window.addEventListener("load", () => App.initialize());


const Web3 = require('web3');
const contract = require('@truffle/contract');

const votingArtifacts = require('../../build/contracts/Voting.json');
var VotingContract = contract(votingArtifacts)


window.App = {
  eventStart: function() { 
    window.ethereum.request({ method: 'eth_requestAccounts' });
    VotingContract.setProvider(window.ethereum)
    VotingContract.defaults({from: window.ethereum.selectedAddress,gas:6654755})

    // Load account data
    App.account = window.ethereum.selectedAddress;
    $("#accountAddress").html("Your Account: " + window.ethereum.selectedAddress);
    VotingContract.deployed().then(function(instance){
     instance.getCountCandidates().then(function(countCandidates){

            $(document).ready(function(){
              $('#addCandidate').click(function() {
                  var nameCandidate = $('#name').val();
                  var partyCandidate = $('#party').val();
                 instance.addCandidate(nameCandidate,partyCandidate).then(function(result){ })

            });   
              $('#addDate').click(function(){             
                  var startDate = Date.parse(document.getElementById("startDate").value)/1000;

                  var endDate =  Date.parse(document.getElementById("endDate").value)/1000;
           
                  instance.setDates(startDate,endDate).then(function(rslt){ 
                    console.log("tarihler verildi");
                  });

              });     

               instance.getDates().then(function(result){
                var startDate = new Date(result[0]*1000);
                var endDate = new Date(result[1]*1000);

                $("#dates").text( startDate.toDateString(("#DD#/#MM#/#YYYY#")) + " - " + endDate.toDateString("#DD#/#MM#/#YYYY#"));
              }).catch(function(err){ 
                console.error("ERROR! " + err.message)
              });           
          });
             
          for (var i = 0; i < countCandidates; i++ ){
            instance.getCandidate(i+1).then(function(data){
              var id = data[0];
              var name = data[1];
              var party = data[2];
              var voteCount = data[3];
              var viewCandidates = `<tr><td> <input class="form-check-input" type="radio" name="candidate" value="${id}" id=${id}>` + name + "</td><td>" + party + "</td><td>" + voteCount + "</td></tr>"
              $("#boxCandidate").append(viewCandidates)
            })
        }
        
        window.countCandidates = countCandidates 
      });

      instance.checkVote().then(function (voted) {
          console.log(voted);
          if(!voted)  {
            $("#voteButton").attr("disabled", false);

          }
      });

    }).catch(function(err){ 
      console.error("ERROR! " + err.message)
    })
  },

  vote: function() {    
    var candidateID = $("input[name='candidate']:checked").val();
    if (!candidateID) {
      $("#msg").html("<p>Please vote for a candidate.</p>")
      return
    }
    VotingContract.deployed().then(function(instance){
      instance.vote(parseInt(candidateID)).then(function(result){
        $("#voteButton").attr("disabled", true);
        $("#msg").html("<p>Voted</p>");
         window.location.reload(1);
      })
    }).catch(function(err){ 
      console.error("ERROR! " + err.message)
    })
  }
}

window.addEventListener("load", function() {
  if (typeof web3 !== "undefined") {
    console.warn("Using web3 detected from external source like Metamask")
    window.eth = new Web3(window.ethereum)
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for deployment. More info here: http://truffleframework.com/tutorials/truffle-and-metamask")
    window.eth = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"))
  }
  window.App.eventStart()
})