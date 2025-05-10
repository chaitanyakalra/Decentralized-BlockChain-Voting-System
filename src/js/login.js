document.addEventListener("DOMContentLoaded", () => {
  console.log("[login.js] DOM fully loaded and parsed")

  // Elements
  const connectWalletBtn = document.getElementById("connect-wallet")
  const walletStatus = document.getElementById("wallet-status")
  const roleSelect = document.getElementById("role")
  const loginForm = document.getElementById("loginForm")

  // Animation for the blockchain SVG
  const blockchainSvg = document.querySelector(".blockchain-svg svg")
  if (blockchainSvg) {
    const polygons = blockchainSvg.querySelectorAll("polygon")
    const lines = blockchainSvg.querySelectorAll("line")

    // Animate polygons
    polygons.forEach((polygon, index) => {
      polygon.style.opacity = 0
      polygon.style.animation = `fadeIn 0.5s ease-out forwards ${0.5 + index * 0.2}s`
    })

    // Animate lines
    lines.forEach((line, index) => {
      line.style.opacity = 0
      line.style.strokeDasharray = line.getTotalLength()
      line.style.strokeDashoffset = line.getTotalLength()
      line.style.animation = `drawLine 1s ease-out forwards ${1 + index * 0.1}s`
    })
  }

  // Add keyframes for line drawing animation
  const style = document.createElement("style")
  style.textContent = `
        @keyframes drawLine {
            to {
                stroke-dashoffset: 0;
                opacity: 1;
            }
        }
    `
  document.head.appendChild(style)

  // Connect wallet functionality
  connectWalletBtn.addEventListener("click", async () => {
    console.log("[login.js] Connect wallet button clicked")

    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== "undefined") {
        console.log("[login.js] MetaMask is installed!")

        // Request account access
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        const account = accounts[0]

        // Update UI
        walletStatus.innerHTML = `
                    <i class="fas fa-check-circle" style="color: var(--success);"></i>
                    Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}
                `
        walletStatus.style.color = "var(--success)"

        // Add success animation
        connectWalletBtn.innerHTML = '<i class="fas fa-check"></i> Wallet Connected'
        connectWalletBtn.style.backgroundColor = "var(--success)"

        console.log("[login.js] Wallet connected:", account)
      } else {
        console.log("[login.js] MetaMask is not installed")
        walletStatus.innerHTML = `
                    <i class="fas fa-exclamation-circle" style="color: var(--error);"></i>
                    Please install MetaMask
                `
        walletStatus.style.color = "var(--error)"
      }
    } catch (error) {
      console.error("[login.js] Error connecting wallet:", error)
      walletStatus.innerHTML = `
                <i class="fas fa-exclamation-circle" style="color: var(--error);"></i>
                ${error.message || "Error connecting wallet"}
            `
      walletStatus.style.color = "var(--error)"
    }
  })

  // Role selection change
  roleSelect.addEventListener("change", function () {
    console.log("[login.js] Role selected:", this.value)

    // You can add logic here to show/hide different form fields based on role
    if (this.value === "admin") {
      // Show admin-specific fields or change UI
      console.log("[login.js] Admin role selected")
    } else if (this.value === "voter") {
      // Show voter-specific fields or change UI
      console.log("[login.js] Voter role selected")
    }
  })

  // Login form submission
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault()
    console.log("[login.js] Login form submitted")

    const voter_id = document.getElementById("voter-id").value
    const password = document.getElementById("password").value

    if (!voter_id || !password) {
      showMessage("Please fill in all fields", "error")
      return
    }

    // Prepare data to be sent to the backend
    const data = {
      voter_id: voter_id,
      password: password,
      role: roleSelect.value,
    }

    console.log("[login.js] Sending login data:", data)

    // Simulate API call with animation
    const submitBtn = loginForm.querySelector('button[type="submit"]')
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Logging in...'
    submitBtn.disabled = true

    // Use POST request to send login data to the backend
    fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error("Login failed")
        }
      })
      .then((data) => {
        console.log("[login.js] Login successful:", data)

        // Check if the response contains the user role and JWT token
        if (data.role === "admin") {
          localStorage.setItem("jwtTokenAdmin", data.token)
          showMessage("Login successful! Redirecting to admin panel...", "success")

          // Redirect after a short delay for better UX
          setTimeout(() => {
            window.location.replace(
              `http://127.0.0.1:8080/admin.html?Authorization=Bearer ${localStorage.getItem("jwtTokenAdmin")}`,
            )
          }, 1500)
        } else if (data.role === "user") {
          localStorage.setItem("jwtTokenVoter", data.token)
          showMessage("Login successful! Redirecting to voting page...", "success")

          // Redirect after a short delay for better UX
          setTimeout(() => {
            window.location.replace(
              `http://127.0.0.1:8080/index.html?Authorization=Bearer ${localStorage.getItem("jwtTokenVoter")}`,
            )
          }, 1500)
        } else {
          throw new Error("Invalid role")
        }
      })
      .catch((error) => {
        console.error("[login.js] Login failed:", error.message)
        showMessage("Login failed. Please check your credentials and try again.", "error")

        // Reset button
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
        submitBtn.disabled = false;

        // Reset button
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login'
        submitBtn.disabled = false
      })
  })

  // Helper function to show messages
  function showMessage(message, type) {
    const messageContainer = document.createElement("div")
    messageContainer.className = `message ${type}`
    messageContainer.innerHTML = `<i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"}"></i> ${message}`

    // Remove any existing messages
    const existingMessages = document.querySelectorAll(".message")
    existingMessages.forEach((msg) => msg.remove())

    // Add the new message after the form
    loginForm.insertAdjacentElement("afterend", messageContainer)

    // Auto-remove after 5 seconds
    if (type === "error") {
      setTimeout(() => {
        messageContainer.style.opacity = "0"
        messageContainer.style.transform = "translateY(-10px)"
        messageContainer.style.transition = "opacity 0.5s ease, transform 0.5s ease"

        setTimeout(() => {
          messageContainer.remove()
        }, 500)
      }, 5000)
    }
  }

  // Check if MetaMask is already connected on page load
  if (typeof window.ethereum !== "undefined") {
    window.ethereum
      .request({ method: "eth_accounts" })
      .then((accounts) => {
        if (accounts.length > 0) {
          const account = accounts[0]
          walletStatus.innerHTML = `
                        <i class="fas fa-check-circle" style="color: var(--success);"></i>
                        Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}
                    `
          walletStatus.style.color = "var(--success)"
          connectWalletBtn.innerHTML = '<i class="fas fa-check"></i> Wallet Connected'
          connectWalletBtn.style.backgroundColor = "var(--success)"
          console.log("[login.js] Wallet already connected:", account)
        }
      })
      .catch((error) => {
        console.error("[login.js] Error checking accounts:", error)
      })
  }
})

// Default dates (e.g., now and now + 1 day)
const getDefaultDates = () => {
    const now = Math.floor(Date.now() / 1000);
    const tomorrow = now + 24 * 60 * 60;
    return { start: now, end: tomorrow };
};

$("#resetDates").on("click", function () {
    const { start, end } = getDefaultDates();

    // Optional: Show confirmation modal
    if (!confirm("Are you sure you want to reset the voting dates to default (now and tomorrow)?")) {
        return;
    }

    // Show loading state
    $(this).html('<i class="fas fa-circle-notch fa-spin"></i> Resetting...');
    $(this).prop("disabled", true);

    VotingContract.deployed()
        .then((instance) => instance.setDates(start, end))
        .then((result) => {
            $("#dates").html(`
                <div class="message success">
                    <i class="fas fa-check-circle"></i>
                    Voting dates reset to default!
                </div>
            `);
            App.loadVotingDates();
            $("#resetDates").html('<i class="fas fa-undo"></i> Reset Dates to Default');
            $("#resetDates").prop("disabled", false);
        })
        .catch((err) => {
            $("#dates").html(`
                <div class="message error">
                    <i class="fas fa-exclamation-circle"></i>
                    Error resetting dates: ${err.message}
                </div>
            `);
            $("#resetDates").html('<i class="fas fa-undo"></i> Reset Dates to Default');
            $("#resetDates").prop("disabled", false);
        });
});
