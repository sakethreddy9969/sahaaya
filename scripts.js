const yearLabel = document.getElementById("year");
if (yearLabel) {
  yearLabel.textContent = new Date().getFullYear();
}

const dashboardPanel = document.getElementById("dashboardPanel");
const dashboardMessage = document.getElementById("dashboardMessage");
const adoptionChoice = document.getElementById("adoptionChoice");
const donationFlow = document.getElementById("donationFlow");
const screenshotField = document.getElementById("screenshotField");
const billSummary = document.getElementById("billSummary");
const billAmount = document.getElementById("billAmount");
const billTotal = document.getElementById("billTotal");
const donationChoice = document.getElementById("donationChoice");
const authSection = document.getElementById("authSection");

const hideAuthSection = () => {
  authSection?.classList.add("hidden");
};

const revealDashboard = (userEmail) => {
  if (!dashboardPanel) return;
  dashboardPanel.classList.remove("hidden");
  donationFlow?.classList.add("hidden");
  billSummary?.classList.add("hidden");
  if (dashboardMessage) {
    dashboardMessage.textContent = `Welcome ${userEmail || ""}! Pick Adoption or Donation to continue.`;
  }
  dashboardPanel.scrollIntoView({ behavior: "smooth", block: "start" });
};

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const email = loginForm.querySelector('input[type="email"]')?.value.trim();
    const password = loginForm.querySelector('input[type="password"]')?.value.trim();
    if (!email || !password) {
      alert("Please fill in both email and password to login.");
      return;
    }
    alert("Login successful. Welcome back to SAHAAYA.");
    loginForm.reset();
    revealDashboard(email);
  });
}

const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const inputs = signupForm.querySelectorAll("input[required]");
    const emptyField = Array.from(inputs).find((input) => !input.value.trim());
    if (emptyField) {
      alert("Kindly complete all required fields to create your account.");
      emptyField.focus();
      return;
    }
    alert("Sign up successful. Thank you for joining SAHAAYA.");
    signupForm.reset();
  });
}

adoptionChoice?.addEventListener("click", () => {
  hideAuthSection();
  window.location.href = "adoptions.html?access=adoption";
});

donationChoice?.addEventListener("click", () => {
  hideAuthSection();
  donationFlow?.classList.remove("hidden");
  if (dashboardMessage) {
    dashboardMessage.textContent = "Share the amount, occasion, and purpose to continue.";
  }
  screenshotField?.classList.add("hidden");
  billSummary?.classList.add("hidden");
});

const updateBillSummary = (value) => {
  if (!billSummary || !billAmount || !billTotal) return;
  const amountNumber = Number(value);
  if (!value || amountNumber <= 0 || Number.isNaN(amountNumber)) {
    billSummary.classList.add("hidden");
    billAmount.textContent = "0";
    billTotal.textContent = "0";
    return;
  }
  billAmount.textContent = amountNumber.toLocaleString("en-IN");
  billTotal.textContent = amountNumber.toLocaleString("en-IN");
  billSummary.classList.remove("hidden");
};

const amountField = donationFlow?.querySelector('input[type="number"]');
amountField?.addEventListener("input", (event) => {
  updateBillSummary(event.target.value);
});

donationFlow?.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const amountInput = donationFlow.querySelector('input[type="number"]');
  const occasionInput = donationFlow.querySelector('input[type="text"]');
  const purposeInput = donationFlow.querySelector("textarea");
  const paymentMethod = donationFlow.querySelector('input[name="paymentMethod"]:checked');
  const screenshotInput = screenshotField?.querySelector('input[type="file"]');

  if (!amountInput?.value.trim() || Number(amountInput.value) < 100) {
    alert("Please enter a valid donation amount (minimum ₹100).");
    amountInput?.focus();
    return;
  }

  if (!occasionInput?.value.trim() || !purposeInput?.value.trim()) {
    alert("Please share the occasion and purpose for your donation.");
    return;
  }

  if (!paymentMethod) {
    alert("Select a payment method to proceed.");
    return;
  }

  if (paymentMethod.value === "Google Pay" || paymentMethod.value === "PhonePe") {
    if (!screenshotInput?.files?.length) {
      alert("Please upload the Google Pay or PhonePe payment screenshot.");
      screenshotInput?.focus();
      return;
    }
  }

  alert(
    `Thank you for pledging ₹${amountInput.value} via ${paymentMethod.value}. Our team will reach out shortly to finalize your ${occasionInput.value} contribution.`
  );
  donationFlow.reset();
  donationFlow.classList.add("hidden");
  screenshotField?.classList.add("hidden");
  billSummary?.classList.add("hidden");
});

donationFlow
  ?.querySelectorAll('input[name="paymentMethod"]')
  .forEach((radio) =>
    radio.addEventListener("change", (event) => {
      const value = event.target.value;
      if (value === "Google Pay" || value === "PhonePe") {
        screenshotField?.classList.remove("hidden");
      } else {
        screenshotField?.classList.add("hidden");
        const uploadInput = screenshotField?.querySelector('input[type="file"]');
        if (uploadInput) uploadInput.value = "";
      }
    })
  );

