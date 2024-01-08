// Initialize constants and variables
const maxBoxCount = 5;
const minBoxCount = 1;
let boxCount = 1;
const maxToppingPerBox = 6;
let toppingCounts = Array($(".menu").length).fill(0);
let maxToppingCount = calculateMaxToppingCount();

// Event handlers for box count buttons
$(".increment-box").on("click", incrementBoxCount);
$(".decrement-box").on("click", decrementBoxCount);

// Event handlers for topping count buttons
$(".increment-topping").on("click", incrementToppingCount);
$(".decrement-topping").on("click", decrementToppingCount);

function incrementToppingCount() {
  const menu = $(this).closest(".menu");
  const index = $(".menu").index(menu);

  if (getTotalToppingCount() < maxToppingCount) {
    toppingCounts[index]++;
    updateToppingCount(menu);
    updateRemainingQuota();
  }

  toggleIncrementDecrementButtonStates();
  updateWhatsAppButtonAndPricing();
}

// Function to decrement the topping count
function decrementToppingCount() {
  const menu = $(this).closest(".menu");
  const index = $(".menu").index(menu);

  if (toppingCounts[index] > 0) {
    toppingCounts[index]--;
    updateToppingCount(menu);
    updateRemainingQuota();
  }

  toggleIncrementDecrementButtonStates();
  updateWhatsAppButtonAndPricing();
}

// Iterate through each menu item
$(".menu").each(function (index) {
  const menu = $(this);
  const toppingCount = toppingCounts[index];
  const menuName = menu.find(".topping-name").text();

  // if (toppingCount > 0) {
  //   console.log(`${menuName} x ${toppingCount}pcs`);
  // }
});

// Function to calculate the maximum topping count based on the current box count
function calculateMaxToppingCount() {
  return maxToppingPerBox * boxCount;
}

// Function to increment the box count
function incrementBoxCount() {
  if (boxCount < maxBoxCount) {
    boxCount++;
    updateBoxCount();
  }
}

// Function to decrement the box count
function decrementBoxCount() {
  if (boxCount > minBoxCount) {
    boxCount--;
    updateBoxCount();
  }
}

// Function to update UI based on box count changes
function updateBoxCount() {
  $(".display-number-box .number").text(boxCount);
  maxToppingCount = calculateMaxToppingCount();
  updateToppings();
  toggleBoxCountButtonStates(); // Ensure this function is called to update button states
}

// Function to update topping counts and UI
function updateToppings() {
  updateToppingCounts();
  updateRemainingQuota();
}

// Function to update topping counts based on maximum allowed count
function updateToppingCounts() {
  const totalToppingCount = getTotalToppingCount();
  const maxAllowedToppingCount = maxToppingPerBox * boxCount;

  if (totalToppingCount > maxAllowedToppingCount) {
    const reductionFactor = maxAllowedToppingCount / totalToppingCount;

    toppingCounts.forEach((count, i) => {
      toppingCounts[i] = Math.floor(count * reductionFactor);
      updateToppingCount($(".menu").eq(i));
    });
  }
}

// Function to update topping count for a specific menu item
function updateToppingCount(menu) {
  const displayNumber = menu.find(".display-number-topping .number");
  const index = $(".menu").index(menu);
  displayNumber.text(toppingCounts[index]);

  menu.find(".decrement-topping").prop("disabled", toppingCounts[index] === 0);
}

// Function to calculate the total topping count
function getTotalToppingCount() {
  return toppingCounts.reduce((total, count) => total + count, 0);
}

// Function to toggle button states based on topping counts
function toggleIncrementDecrementButtonStates() {
  const totalToppingCount = getTotalToppingCount();
  $(".increment-topping").prop(
    "disabled",
    totalToppingCount === maxToppingCount
  );
}

// Function to toggle box count button states
function toggleBoxCountButtonStates() {
  $(".increment-box").prop("disabled", boxCount === maxBoxCount);
  $(".decrement-box").prop("disabled", boxCount === minBoxCount);
}

// Function to update the remaining quota and display a message
function updateRemainingQuota() {
  const remainingQuota = maxToppingCount - getTotalToppingCount();
  // console.log(`Remaining Quota - ${remainingQuota}`);

  const noteText =
    remainingQuota > 0
      ? `Anda bisa memilih ${remainingQuota} pcs topping yang tersedia.`
      : "Anda telah mencapai batas maksimum topping.";
  $(".note .text").text(noteText);
}

// Event handlers for WhatsApp button and topping count changes
$(".send-whatsapp-button").on("click", sendWhatsAppMessage);
$(".increment-topping, .decrement-topping").on(
  "click",
  updateWhatsAppButtonAndPricing
);

// Function to update WhatsApp button state
function updateWhatsAppButtonAndPricing() {
  updateWhatsAppButtonState();
  updateTotalPricing();
}

// Function to update WhatsApp button state based on selected toppings
function updateWhatsAppButtonState() {
  const selectedToppingsData = getSelectedToppingsData();
  $(".send-whatsapp-button").prop(
    "disabled",
    selectedToppingsData.length === 0
  );
}

// Function to update total pricing display
function updateTotalPricing() {
  const totalPrice = calculateTotalPrice();
  const formattedPrice = formatCurrency(totalPrice);
  $("#pricing").text(formattedPrice);
}

// Function to format currency
function formatCurrency(amount) {
  const formattedAmount = amount.toLocaleString().replace(/,/g, ".");
  // return `Rp${amount.toLocaleString()}`;
  return `Rp${formattedAmount}`;
}

// Function to calculate total price based on selected toppings
function calculateTotalPrice() {
  const selectedToppingsData = getSelectedToppingsData();
  const toppingPrice = 5000; // Assuming each topping costs IDR 5,000
  return selectedToppingsData.reduce(
    (totalPrice, topping) => totalPrice + topping.toppingCount * toppingPrice,
    0
  );
}

// Function to get selected toppings data
function getSelectedToppingsData() {
  const selectedToppingsData = [];
  $(".menu").each(function (index) {
    const menu = $(this);
    const toppingCount = toppingCounts[index];

    if (toppingCount > 0) {
      const menuName = menu.find(".topping-name").text();
      const toppingData = { menuName, toppingCount };
      selectedToppingsData.push(toppingData);
    }
  });
  return selectedToppingsData;
}

// Function to open WhatsApp with selected toppings data
function sendWhatsAppMessage() {
  const selectedToppingsData = getSelectedToppingsData();
  const messageText = selectedToppingsData
    .map((topping) => `${topping.menuName} x ${topping.toppingCount}pcs`)
    .join("\n");
  const whatsappLink = `https://api.whatsapp.com/send?phone=+6281906955567&text=${encodeURIComponent(
    messageText
  )}`;
  window.open(whatsappLink, "_blank");
}

// Initial UI setup
toggleIncrementDecrementButtonStates();
toggleBoxCountButtonStates();
updateRemainingQuota();
updateWhatsAppButtonState();
updateTotalPricing();
