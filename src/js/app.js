// import { Chart } from "@/components/ui/chart"
// const {Chart} = require("@/components/ui/chart")
const Web3 = require("web3")
const contract = require("@truffle/contract")
const votingArtifacts = require("../../build/contracts/Voting.json")
var VotingContract = contract(votingArtifacts)

// Declare App variable
var App = {
  init: () => {
    console.log("[App.init] Initializing application...")
    return App.initWeb3()
  },

  initWeb3: () => {
    console.log("[App.initWeb3] Initializing Web3…");
  
    // Modern dapp browsers…
    if (window.ethereum) {
      console.log("[App.initWeb3] Detected window.ethereum");
      window.web3 = new Web3(window.ethereum);
    }
    // Legacy dapp browsers…
    else if (window.web3) {
      console.log("[App.initWeb3] Detected legacy window.web3");
      window.web3 = new Web3(window.web3.currentProvider);
    }
    // Fallback to local provider
    else {
      console.warn("[App.initWeb3] No web3 provider detected; falling back to http://127.0.0.1:9545");
      window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
    }
  
    return App.initContract();
  },
  
  initContract: () => {
    console.log("[App.initContract] Initializing contract…");
  
    // Point the Truffle contract abstraction at the detected provider
    VotingContract.setProvider(window.web3.currentProvider);
  
    // First: request accounts from the user
    return window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        if (!accounts || accounts.length === 0) {
          throw new Error("No Ethereum accounts available");
        }
  
        // Use the first account everywhere
        App.account = accounts[0];
        window.web3.eth.defaultAccount = App.account;
  
        console.log("[App.initContract] Using account:", App.account);
  
        // Display a shortened version in the UI
        const shortAddr = `${App.account.slice(0, 6)}…${App.account.slice(-4)}`;
        $("#accountAddress").html(`
          <i class="fas fa-wallet"></i>
          <span>${shortAddr}</span>
        `);
  
        // Now that we have the account, we can set default tx options
        VotingContract.defaults({
          from: App.account,
          gas: 500000,            // or whatever default you need
        });
  
        // Initialize the rest of your app
        App.initUI();
        return App.loadContractData();
      })
      .catch((err) => {
        console.error("[App.initContract] Failed to get accounts:", err);
        $("#accountAddress").html(`
          <i class="fas fa-exclamation-circle"></i>
          <span>Wallet not connected</span>
        `);
      });
  },
  

  // initWeb3: () => {
  //   console.log("[App.initWeb3] Initializing Web3...")
  //   if (typeof web3 !== "undefined") {
  //     console.log("[App.initWeb3] Using web3 detected from external source like MetaMask")
  //     window.eth = new Web3(window.ethereum)
  //   } else {
  //     console.warn("[App.initWeb3] No web3 detected. Falling back to http://localhost:9545.")
  //     window.eth = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"))
  //   }
  //   return App.initContract()
  // },

  // initContract: () => {
  //   console.log("[App.initContract] Initializing contract...")
  //   VotingContract.setProvider(window.ethereum)
  //   VotingContract.defaults({ from: window.ethereum.selectedAddress, gas: 6654755 })

  //   // Request accounts from the browser wallet
  //   window.ethereum
  //     .request({ method: "eth_requestAccounts" })
  //     .then(() => {
  //       console.log("[App.initContract] Ethereum accounts requested.")
  //       App.account = window.ethereum.selectedAddress

  //       // Format and display account address
  //       const shortAddress = `${App.account.substring(0, 6)}...${App.account.substring(App.account.length - 4)}`
  //       $("#accountAddress").html(`
  //                   <i class="fas fa-wallet"></i>
  //                   <span>${shortAddress}</span>
  //               `)

  //       console.log("[App.initContract] Using account:", App.account)

  //       // Initialize UI components
  //       App.initUI()

  //       // Load contract data
  //       return App.loadContractData()
  //     })
  //     .catch((err) => {
  //       console.error("[App.initContract] Error requesting accounts:", err)
  //       $("#accountAddress").html(`
  //                   <i class="fas fa-exclamation-circle"></i>
  //                   <span>Wallet not connected</span>
  //               `)
  //     })
  // },

  initUI: () => {
    console.log("[App.initUI] Initializing UI components...")

    // Initialize page-specific UI elements
    if (window.location.pathname.includes("admin.html")) {
      App.initAdminUI()
    } else if (window.location.pathname.includes("index.html")) {
      App.initVoterUI()
    }

    // Add event listeners for modals
    $(".close-modal").on("click", () => {
      $(".modal").removeClass("show")
    })

    // Mobile menu toggle
    $(".menu-toggle").on("click", () => {
      $(".sidebar").toggleClass("show")
      $(".main-content").toggleClass("sidebar-open")
    })

    // Sidebar navigation
    $(".sidebar-nav a").on("click", function (e) {
      e.preventDefault()
      const target = $(this).attr("href")

      // Update active state
      $(".sidebar-nav li").removeClass("active")
      $(this).parent().addClass("active")

      // Scroll to section
      $("html, body").animate(
        {
          scrollTop: $(target).offset().top - 80,
        },
        500,
      )

      // Close sidebar on mobile
      if (window.innerWidth < 992) {
        $(".sidebar").removeClass("show")
        $(".main-content").removeClass("sidebar-open")
      }
    })
  },

  loadVotingDates: () => {
    console.log("[App.loadVotingDates] Loading voting dates...");
  
    App.votingInstance
      .getDates()
      .then((result) => {
        const startDate = new Date(result[0] * 1000);
        const endDate = new Date(result[1] * 1000);
  
        console.log("[App.loadVotingDates] Retrieved voting dates:", startDate, endDate);
  
        if (startDate.getTime() === 0 || endDate.getTime() === 0) {
          $("#dates").text("No voting period has been set.");
          return;
        }
  
        const formatOptions = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        };
  
        const formattedStart = startDate.toLocaleDateString(undefined, formatOptions);
        const formattedEnd = endDate.toLocaleDateString(undefined, formatOptions);
  
        $("#dates").text(`${formattedStart} - ${formattedEnd}`);
  
        App.votingStartDate = startDate;
        App.votingEndDate = endDate;
  
        App.updateVotingStatus();
      })
      .catch((err) => {
        console.error("[App.loadVotingDates] Error retrieving dates:", err.message);
        $("#dates").text("No voting period has been set.");
      });
  },
  
  initAdminUI: () => {
    console.log("[App.initAdminUI] Initializing admin UI...");
  
    // Add candidate
    $("#addCandidate").on("click", function () {
      const nameCandidate = $("#name").val();
      const partyCandidate = $("#party").val();
  
      if (!nameCandidate || !partyCandidate) {
        $("#msg").html(`
          <div class="message error">
            <i class="fas fa-exclamation-circle"></i> Please fill in all fields
          </div>`);
        return;
      }
  
      $(this).html('<i class="fas fa-circle-notch fa-spin"></i> Adding...').prop("disabled", true);
  
      VotingContract.deployed()
        .then((instance) => instance.addCandidate(nameCandidate, partyCandidate))
        .then(() => {
          $("#msg").html(`
            <div class="message success">
              <i class="fas fa-check-circle"></i> Candidate "${nameCandidate}" added successfully!
            </div>`);
  
          $("#name").val("");
          $("#party").val("");
          App.loadCandidates();
        })
        .catch((err) => {
          console.error("[App.initAdminUI] Error adding candidate:", err);
          $("#msg").html(`
            <div class="message error">
              <i class="fas fa-exclamation-circle"></i> Error adding candidate: ${err.message}
            </div>`);
        })
        .finally(() => {
          $("#addCandidate").html('<i class="fas fa-plus"></i> Add Candidate').prop("disabled", false);
          setTimeout(() => $("#msg").html(""), 5000);
        });
    });
  
    // Set voting dates
    $("#addDate").on("click", function () {
      const startDate = Date.parse($("#startDate").val()) / 1000;
      const endDate = Date.parse($("#endDate").val()) / 1000;
  
      if (!startDate || !endDate) {
        $("#dates").html(`
          <div class="message error">
            <i class="fas fa-exclamation-circle"></i> Please select both start and end dates
          </div>`);
        return;
      }
  
      if (endDate <= startDate) {
        $("#dates").html(`
          <div class="message error">
            <i class="fas fa-exclamation-circle"></i> End date must be after start date
          </div>`);
        return;
      }
  
      $(this).html('<i class="fas fa-circle-notch fa-spin"></i> Setting Dates...').prop("disabled", true);
  
      VotingContract.deployed()
        .then((instance) => instance.setDates(startDate, endDate, { from: App.account, gas: 300000 }))
        .then((tx) => {
          console.log("Dates set:", tx);
          $("#dates").html(`
            <div class="message success">
              <i class="fas fa-check-circle"></i> Voting dates set successfully!
            </div>`);
          App.loadVotingDates();
        })
        .catch((err) => {
          console.error("[App.initAdminUI] Error setting dates:", err);
          $("#dates").html(`
            <div class="message error">
              <i class="fas fa-exclamation-circle"></i> Error setting dates: ${err.message}
            </div>`);
        })
        .finally(() => {
          $("#addDate").html('<i class="fas fa-calendar-check"></i> Define Dates').prop("disabled", false);
          setTimeout(() => $("#dates").html(""), 5000);
        });
    });
  
    // Reset voting dates
    $("#resetDates").on("click", function () {
      console.log("[App.initAdminUI] Reset dates button clicked");
  
      const defaultStartDate = new Date();
      defaultStartDate.setDate(defaultStartDate.getDate() + 1);
      defaultStartDate.setHours(9, 0, 0, 0);
  
      const defaultEndDate = new Date(defaultStartDate);
      defaultEndDate.setDate(defaultEndDate.getDate() + 7);
      defaultEndDate.setHours(17, 0, 0, 0);
  
      const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };
  
      $("#startDate").val(formatDateForInput(defaultStartDate));
      $("#endDate").val(formatDateForInput(defaultEndDate));
  
      $("#dates").html(`
        <div class="message success">
          <i class="fas fa-check-circle"></i> Dates reset to default values. Don't forget to save changes.
        </div>`);
  
      setTimeout(() => $("#dates").html(""), 3000);
    });
  },
  

  // initAdminUI: () => {
  //   console.log("[App.initAdminUI] Initializing admin UI...")

  //   // Add candidate form submission
  //   $("#addCandidate").on("click", function () {
  //     const nameCandidate = $("#name").val()
  //     const partyCandidate = $("#party").val()

  //     if (!nameCandidate || !partyCandidate) {
  //       $("#msg").html(`
  //                   <div class="message error">
  //                       <i class="fas fa-exclamation-circle"></i>
  //                       Please fill in all fields
  //                   </div>
  //               `)
  //       return
  //     }

  //     console.log("[App.initAdminUI] Adding candidate:", nameCandidate, partyCandidate)

  //     // Show loading state
  //     $(this).html('<i class="fas fa-circle-notch fa-spin"></i> Adding...')
  //     $(this).prop("disabled", true)

  //     VotingContract.deployed()
  //       .then((instance) => instance.addCandidate(nameCandidate, partyCandidate))
  //       .then((result) => {
  //         console.log("[App.initAdminUI] Candidate added successfully:", result)

  //         // Show success message
  //         $("#msg").html(`
  //                   <div class="message success">
  //                       <i class="fas fa-check-circle"></i>
  //                       Candidate "${nameCandidate}" added successfully!
  //                   </div>
  //               `)

  //         // Clear form
  //         $("#name").val("")
  //         $("#party").val("")

  //         // Update candidates list
  //         App.loadCandidates()

  //         // Reset button
  //         $("#addCandidate").html('<i class="fas fa-plus"></i> Add Candidate')
  //         $("#addCandidate").prop("disabled", false)

  //         // Auto-hide message after 5 seconds
  //         setTimeout(() => {
  //           $("#msg").html("")
  //         }, 5000)
  //       })
  //       .catch((err) => {
  //         console.error("[App.initAdminUI] Error adding candidate:", err)

  //         // Show error message
  //         $("#msg").html(`
  //                   <div class="message error">
  //                       <i class="fas fa-exclamation-circle"></i>
  //                       Error adding candidate: ${err.message}
  //                   </div>
  //               `)

  //         // Reset button
  //         $("#addCandidate").html('<i class="fas fa-plus"></i> Add Candidate')
  //         $("#addCandidate").prop("disabled", false)
  //       })
  //   })

  //   // Set voting dates form submission
  //   $("#addDate").on("click", function () {
  //     const startDate = Date.parse(document.getElementById("startDate").value) / 1000
  //     const endDate = Date.parse(document.getElementById("endDate").value) / 1000

  //     if (!startDate || !endDate) {
  //       $("#dates").html(`
  //                   <div class="message error">
  //                       <i class="fas fa-exclamation-circle"></i>
  //                       Please select both start and end dates
  //                   </div>
  //               `)
  //       return
  //     }

  //     if (endDate <= startDate) {
  //       $("#dates").html(`
  //                   <div class="message error">
  //                       <i class="fas fa-exclamation-circle"></i>
  //                       End date must be after start date
  //                   </div>
  //               `)
  //       return
  //     }

  //     console.log("[App.initAdminUI] Setting voting dates:", new Date(startDate * 1000), new Date(endDate * 1000))

  //     // Show loading state
  //     $(this).html('<i class="fas fa-circle-notch fa-spin"></i> Setting Dates...')
  //     $(this).prop("disabled", true)

  //     VotingContract.deployed()
  //       .then((instance) => instance.setDates(startDate, endDate))
  //       .then((result) => {
  //         console.log("[App.initAdminUI] Dates set successfully:", result)

  //         // Show success message
  //         $("#dates").html(`
  //                   <div class="message success">
  //                       <i class="fas fa-check-circle"></i>
  //                       Voting dates set successfully!
  //                   </div>
  //               `)

  //         // Update displayed dates
  //         App.loadVotingDates()

  //         // Reset button
  //         $("#addDate").html('<i class="fas fa-calendar-check"></i> Define Dates')
  //         $("#addDate").prop("disabled", false)

  //         // Auto-hide message after 5 seconds
  //         setTimeout(() => {
  //           $("#dates").html("")
  //         }, 5000)
  //       })
  //       .catch((err) => {
  //         console.error("[App.initAdminUI] Error setting dates:", err)

  //         // Show error message
  //         $("#dates").html(`
  //                   <div class="message error">
  //                       <i class="fas fa-exclamation-circle"></i>
  //                       Error setting dates: ${err.message}
  //                   </div>
  //               `)

  //         // Reset button
  //         $("#addDate").html('<i class="fas fa-calendar-check"></i> Define Dates')
  //         $("#addDate").prop("disabled", false)
  //       })
  //   })


  //   // Fixed version of the reset dates functionality
  //   $("#resetDates").on("click", function () {
  //     console.log("[App.initAdmin] Reset dates button clicked")

  //     // Set default dates (adjust these to your application's defaults)
  //     const defaultStartDate = new Date()
  //     defaultStartDate.setDate(defaultStartDate.getDate() + 1) // tomorrow
  //     defaultStartDate.setHours(9, 0, 0, 0) // 9:00 AM

  //     const defaultEndDate = new Date(defaultStartDate)
  //     defaultEndDate.setDate(defaultEndDate.getDate() + 7) // a week after start date
  //     defaultEndDate.setHours(17, 0, 0, 0) // 5:00 PM

  //     // Format dates for input fields - improved formatting for better browser compatibility
  //     const formatDateForInput = (date) => {
  //       const year = date.getFullYear();
  //       const month = String(date.getMonth() + 1).padStart(2, '0');
  //       const day = String(date.getDate()).padStart(2, '0');
  //       const hours = String(date.getHours()).padStart(2, '0');
  //       const minutes = String(date.getMinutes()).padStart(2, '0');

  //       return `${year}-${month}-${day}T${hours}:${minutes}`;
  //     }

  //     // Set values in form fields
  //     $("#startDate").val(formatDateForInput(defaultStartDate))
  //     $("#endDate").val(formatDateForInput(defaultEndDate))

  //     // Show confirmation message - use #dates instead of #adminMsg 
  //     // to match with your existing code
  //     $("#dates").html(`
  //   <div class="message success">
  //     <i class="fas fa-check-circle"></i>
  //     Dates reset to default values. Don't forget to save changes.
  //   </div>
  // `)

  //     // Hide message after 3 seconds
  //     setTimeout(() => {
  //       $("#dates").html("")
  //     }, 3000)
  //   })
  // },

  initVoterUI: () => {
    console.log("[App.initVoterUI] Initializing voter UI...")

    // Initialize vote button
    $("#voteButton").on("click", () => {
      const candidateID = $("input[name='candidate']:checked").val()
      if (!candidateID) {
        $("#msg").html(`
                    <div class="message error">
                        <i class="fas fa-exclamation-circle"></i>
                        Please select a candidate
                    </div>
                `)
        return
      }

      // Get candidate name for confirmation
      const candidateName = $(`input[name='candidate'][value='${candidateID}']`)
        .closest("tr")
        .find("td:nth-child(2)")
        .text()

      // Show confirmation modal
      $("#candidateName").text(candidateName)
      $("#confirmModal").addClass("show")

      // Confirm vote button
      $("#confirmVote")
        .off("click")
        .on("click", () => {
          // Hide modal
          $("#confirmModal").removeClass("show")

          // Show loading state
          $("#voteButton").html('<i class="fas fa-circle-notch fa-spin"></i> Voting...')
          $("#voteButton").prop("disabled", true)

          // Call vote function
          App.vote(candidateID)
        })

      // Cancel vote button
      $("#cancelVote")
        .off("click")
        .on("click", () => {
          $("#confirmModal").removeClass("show")
        })
    })

    // Close modal when clicking outside
    $(window).on("click", (event) => {
      if ($(event.target).is(".modal")) {
        $(".modal").removeClass("show")
      }
    })
  },

  // loadVotingDates: () => {
  //   console.log("[App.loadVotingDates] Loading voting dates...")

  //   App.votingInstance
  //     .getDates()
  //     .then((result) => {
  //       const startDate = new Date(result[0] * 1000)
  //       const endDate = new Date(result[1] * 1000)

  //       console.log("[App.loadVotingDates] Retrieved voting dates:", startDate, endDate)

  //       // Format dates
  //       const formatOptions = {
  //         weekday: "long",
  //         year: "numeric",
  //         month: "long",
  //         day: "numeric",
  //         hour: "2-digit",
  //         minute: "2-digit",
  //       }

  //       const formattedStart = startDate.toLocaleDateString(undefined, formatOptions)
  //       const formattedEnd = endDate.toLocaleDateString(undefined, formatOptions)

  //       // Update UI
  //       $("#dates").text(`${formattedStart} - ${formattedEnd}`)

  //       // Store dates for countdown
  //       App.votingStartDate = startDate
  //       App.votingEndDate = endDate

  //       // Update voting status
  //       App.updateVotingStatus()
  //     })
  //     .catch((err) => {
  //       console.error("[App.loadVotingDates] Error retrieving dates:", err.message)
  //       $("#dates").text("No voting period has been set.")
  //     })
  // },

  checkVoteStatus: () => {
    console.log("[App.checkVoteStatus] Checking if user has already voted...")

    App.votingInstance
      .checkVote()
      .then((voted) => {
        console.log("[App.checkVoteStatus] Vote status for account:", voted)

        if (!voted) {
          $("#voteButton").attr("disabled", false)
          $("#voter-status").removeClass("cannot-vote").addClass("can-vote")
          $("#voter-status").html(`
                    <i class="fas fa-circle-check"></i>
                    <span>You can vote</span>
                `)
          console.log("[App.checkVoteStatus] Vote button enabled.")
        } else {
          $("#voteButton").attr("disabled", true)
          $("#voter-status").removeClass("can-vote").addClass("cannot-vote")
          $("#voter-status").html(`
                    <i class="fas fa-ban"></i>
                    <span>You have already voted</span>
                `)
          console.log("[App.checkVoteStatus] Account already voted; vote button remains disabled.")
        }
      })
      .catch((err) => {
        console.error("[App.checkVoteStatus] Error checking vote status:", err)
        $("#voter-status").removeClass("can-vote").addClass("cannot-vote")
        $("#voter-status").html(`
                <i class="fas fa-exclamation-circle"></i>
                <span>Error checking vote status</span>
            `)
      })
  },

  vote: (candidateID) => {
    console.log("[App.vote] Vote function triggered for candidate ID:", candidateID)

    App.votingInstance
      .vote(Number.parseInt(candidateID))
      .then((result) => {
        console.log("[App.vote] Vote cast successfully. Transaction details:", result)

        // Show success message with animation
        $("#msg").html(`
                <div class="message success">
                    <i class="fas fa-check-circle"></i>
                    Your vote has been cast successfully!
                </div>
            `)

        // Disable vote button
        $("#voteButton").attr("disabled", true)
        $("#voteButton").html('<i class="fas fa-check"></i> Vote Cast')

        // Update voter status
        $("#voter-status").removeClass("can-vote").addClass("cannot-vote")
        $("#voter-status").html(`
                <i class="fas fa-ban"></i>
                <span>You have already voted</span>
            `)

        // Reload candidates to update vote count
        setTimeout(() => {
          App.loadCandidates()
        }, 2000)
      })
      .catch((err) => {
        const msg = err.message || err
        console.error("[App.vote] Error casting vote:", msg)

        // Format error message
        let errorMessage = "Vote failed: "
        if (msg.includes("Voting has not started yet")) {
          errorMessage += "Voting has not started yet!"
        } else if (msg.includes("Voting has ended")) {
          errorMessage += "Voting has ended!"
        } else if (msg.includes("Invalid candidate ID")) {
          errorMessage += "Invalid candidate selected!"
        } else if (msg.includes("You have already voted")) {
          errorMessage += "You have already voted with this account."
        } else {
          errorMessage += msg
        }

        // Show error message
        $("#msg").html(`
                <div class="message error">
                    <i class="fas fa-exclamation-circle"></i>
                    ${errorMessage}
                </div>
            `)

        // Reset button
        $("#voteButton").attr("disabled", false)
        $("#voteButton").html('<i class="fas fa-check-circle"></i> Cast Your Vote')
      })
  },

  updateVotingStatus: () => {
    if (!App.votingStartDate || !App.votingEndDate) return

    const now = new Date()
    let status

    if (now < App.votingStartDate) {
      status = "Not Started"
    } else if (now < App.votingEndDate) {
      status = "In Progress"
    } else {
      status = "Ended"
    }

    // Update admin dashboard if on admin page
    if (window.location.pathname.includes("admin.html")) {
      $("#votingStatus").text(status)
    }
  },

  loadCandidates: () => {
    console.log("[App.loadCandidates] Loading candidates...")

    App.votingInstance
      .getCountCandidates()
      .then((countCandidates) => {
        console.log("[App.loadCandidates] Number of candidates:", countCandidates)

        // Update admin stats if on admin page
        if (window.location.pathname.includes("admin.html")) {
          $("#totalCandidates").text(countCandidates)
        }

        // Clear existing candidates and chart data
        $("#boxCandidate").empty()
        $("#candidatesList").empty()
        App.candidatesData = []

        const candidatePromises = []

        for (let i = 0; i < countCandidates; i++) {
          const candidatePromise = App.votingInstance.getCandidate(i + 1)
            .then((data) => {
              const id = data[0]
              const name = data[1]
              const party = data[2]
              const voteCount = parseInt(data[3].toString()) // ensure number

              console.log("[App.loadCandidates] Loaded candidate:", { id, name, party, voteCount })

              App.candidatesData.push({ id, name, party, voteCount })

              // Update chart if it exists
              if (App.resultsChart) {
                App.updateResultsChart()
              }

              // Render based on page
              if (window.location.pathname.includes("index.html")) {
                const candidateRow = `
                  <tr class="candidate-row" data-id="${id}">
                    <td>
                      <label class="radio-container">
                        <input class="form-check-input" type="radio" name="candidate" value="${id}" id="candidate-${id}">
                        <span class="checkmark"></span>
                      </label>
                    </td>
                    <td>${name}</td>
                    <td>${party}</td>
                    <td>${voteCount}</td>
                  </tr>
                `
                $("#boxCandidate").append(candidateRow)
              } else if (window.location.pathname.includes("admin.html")) {
                const candidateRow = `
                  <tr>
                    <td>${id}</td>
                    <td>${name}</td>
                    <td>${party}</td>
                    <td>${voteCount}</td>
                    <td>
                      <button class="btn btn-secondary btn-sm view-candidate" data-id="${id}">
                        <i class="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                `
                $("#candidatesList").append(candidateRow)
              }
            })
            .catch((err) => {
              console.error("[App.loadCandidates] Error loading candidate at index", i, ":", err.message)
            })

          candidatePromises.push(candidatePromise)
        }

        // After all candidates are loaded, attach handlers once
        Promise.all(candidatePromises).then(() => {
          if (window.location.pathname.includes("index.html")) {
            // Clear old event listeners to prevent duplicates
            $(".candidate-row").off("mouseenter mouseleave click")

            // Hover effect
            $(".candidate-row").hover(
              function () {
                $(this).addClass("highlight")
              },
              function () {
                $(this).removeClass("highlight")
              }
            )

            // Click handler
            $(".candidate-row").on("click", function () {
              const radioBtn = $(this).find("input[type='radio']")
              radioBtn.prop("checked", true)
            })
          }
        })
      })
      .catch((err) => {
        console.error("[App.loadCandidates] Error getting candidate count:", err.message)
      })
  },

  initResultsChart: () => {
    console.log("[App.initResultsChart] Initializing results chart...")

    // Check if Chart.js is available
    if (typeof Chart === "undefined") {
      console.error("[App.initResultsChart] Chart.js is not loaded")
      return
    }

    // Create chart
    const ctx = document.getElementById("resultsChart").getContext("2d")
    App.resultsChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            label: "Votes",
            data: [],
            backgroundColor: "rgba(99, 102, 241, 0.6)",
            borderColor: "rgba(99, 102, 241, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
        },
        animation: {
          duration: 1000,
          easing: "easeOutQuart",
        },
      },
    })

    // Update chart if we already have candidate data
    if (App.candidatesData) {
      App.updateResultsChart()
    }
  },

  updateResultsChart: () => {
    if (!App.resultsChart || !App.candidatesData) return

    console.log("[App.updateResultsChart] Updating results chart with data:", App.candidatesData)

    // Extract labels and data
    const labels = App.candidatesData.map((candidate) => candidate.name)
    const data = App.candidatesData.map((candidate) => candidate.voteCount)

    // Generate colors
    const colors = App.candidatesData.map((_, index) => {
      const hue = (index * 137) % 360 // Golden angle approximation for good distribution
      return `hsla(${hue}, 70%, 60%, 0.7)`
    })

    // Update chart data
    App.resultsChart.data.labels = labels
    App.resultsChart.data.datasets[0].data = data
    App.resultsChart.data.datasets[0].backgroundColor = colors

    // Update chart
    App.resultsChart.update()
  },

  initCountdown: () => {
    console.log("[App.initCountdown] Initializing countdown timer...")

    // Update countdown every second
    App.countdownInterval = setInterval(() => {
      App.updateCountdown()
    }, 1000)

    // Initial update
    App.updateCountdown()
  },

  updateCountdown: () => {
    if (!App.votingStartDate || !App.votingEndDate) return

    const now = new Date()
    let targetDate, countdownLabel, timeRemaining

    // Determine if we're counting down to start or end
    if (now < App.votingStartDate) {
      // Counting down to start
      targetDate = App.votingStartDate
      countdownLabel = "Voting starts in:"
      $("#voter-status").removeClass("can-vote cannot-vote").addClass("voting-not-started")
      $("#voter-status").html(`
                <i class="fas fa-clock"></i>
                <span>Voting has not started</span>
            `)
    } else if (now < App.votingEndDate) {
      // Counting down to end
      targetDate = App.votingEndDate
      countdownLabel = "Voting ends in:"
    } else {
      // Voting has ended
      clearInterval(App.countdownInterval)
      $("#countdown").html("<p>Voting has ended</p>")
      $("#voter-status").removeClass("can-vote").addClass("cannot-vote")
      $("#voter-status").html(`
                <i class="fas fa-calendar-times"></i>
                <span>Voting has ended</span>
            `)
      return
    }

    // Calculate time remaining
    timeRemaining = targetDate - now

    // Calculate days, hours, minutes, seconds
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000)

    // Update countdown display
    $("#days").text(days.toString().padStart(2, "0"))
    $("#hours").text(hours.toString().padStart(2, "0"))
    $("#minutes").text(minutes.toString().padStart(2, "0"))
    $("#seconds").text(seconds.toString().padStart(2, "0"))
  },

  loadContractData: () => {
    console.log("[App.loadContractData] Loading contract data...")

    return VotingContract.deployed()
      .then((instance) => {
        App.votingInstance = instance

        // Load voting dates
        App.loadVotingDates()

        // Load candidates
        App.loadCandidates()

        // Check if user has already voted
        App.checkVoteStatus()

        // Initialize countdown timer
        App.initCountdown()

        // Initialize results chart if on voter page
        if (window.location.pathname.includes("index.html")) {
          App.initResultsChart()
        }

        // Update stats if on admin page
        if (window.location.pathname.includes("admin.html")) {
          App.updateAdminStats()
        }
      })
      .catch((err) => {
        console.error("[App.loadContractData] Error loading contract data:", err)
      })
  },

  // updateAdminStats: () => {
  //   console.log("[App.updateAdminStats] Updating admin dashboard stats...")

  //   // Total votes calculation
  //   let totalVotes = 0
  //   if (App.candidatesData) {
  //     totalVotes = App.candidatesData.reduce((sum, candidate) => sum + Number.parseInt(candidate.voteCount), 0)
  //   }

  //   $("#totalVotes").text(totalVotes)
  // },
  updateAdminStats: () => {
    console.log("[App.updateAdminStats] Updating admin dashboard stats...")
    let totalVotes = 0
    if (App.candidatesData) {
      totalVotes = App.candidatesData.reduce((sum, candidate) => sum + Number.parseInt(candidate.voteCount), 0)
    }
    $("#totalVotes").text(totalVotes)
  },

  
}

$(() => {
  $(window).on("load", () => {
    console.log("[Window.load] Page loaded. Starting App.init")
    App.init()
  })
})
