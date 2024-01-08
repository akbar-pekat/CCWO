$(document).ready(function () {
  const maxBoxCount = 5;
  const minBoxCount = 1;
  let boxCount = 1;
  let maxToppingCount = 6;
  const maxToppingPerBox = 6;
  let toppingCounts = Array($(".menu").length).fill(0);
  // let totalPrice;

  function updateBoxCount() {
    $(".display-number-box .number").text(boxCount);
    updateMaxToppingCount();
    updateRemainingQuota();
  }

  function updateMaxToppingCount() {
    const oldMaxToppingCount = maxToppingPerBox * boxCount;
    maxToppingCount = maxToppingPerBox * boxCount;

    if (getTotalToppingCount() > maxToppingCount) {
      toppingCounts.forEach((count, i) => {
        toppingCounts[i] = Math.floor(
          (count * maxToppingCount) / oldMaxToppingCount
        );
      });
      updateToppingCounts();
    }

    toggleIncrementDecrementButtonStates();
  }

  function updateToppingCounts() {
    const totalToppingCount = getTotalToppingCount();
    const maxAllowedToppingCount = maxToppingPerBox * boxCount;

    if (totalToppingCount > maxAllowedToppingCount) {
      const reductionFactor = maxAllowedToppingCount / totalToppingCount;

      toppingCounts.forEach((count, i) => {
        toppingCounts[i] = Math.floor(count * reductionFactor);
      });

      $(".menu").each(function (index) {
        updateToppingCount($(this));
      });
    }
  }

  function updateToppingCount(menu) {
    const displayNumber = menu.find(".display-number-topping .number");
    const index = $(".menu").index(menu);
    displayNumber.text(toppingCounts[index]);

    menu
      .find(".decrement-topping")
      .prop("disabled", toppingCounts[index] === 0);
  }

  function getTotalToppingCount() {
    return toppingCounts.reduce((total, count) => total + count, 0);
  }

  function toggleIncrementButtonState() {
    $(".increment-box").prop("disabled", boxCount === maxBoxCount);
  }

  function toggleDecrementButtonState() {
    $(".decrement-box").prop("disabled", boxCount === minBoxCount);
  }

  function toggleIncrementDecrementButtonStates() {
    const totalToppingCount = getTotalToppingCount();
    $(".increment-topping").prop(
      "disabled",
      totalToppingCount >= maxToppingCount
    );
  }

  function updateRemainingQuota() {
    const totalToppingCount = getTotalToppingCount();
    const remainingQuota = maxToppingCount - totalToppingCount;

    // console.log(`Remaining Quota - ${remainingQuota}`);
    if (remainingQuota > 0) {
      $(".note .text").text(
        `Anda bisa memilih ${remainingQuota} pcs topping yang tersedia.`
      );
    } else {
      $(".note .text").text("Anda telah mencapai batas maksimum topping.");
    }
  }

  $(".increment-box").on("click", function () {
    if (boxCount < maxBoxCount) {
      boxCount++;
      updateBoxCount();
    }

    toggleIncrementButtonState();
    toggleDecrementButtonState();
  });

  $(".decrement-box").on("click", function () {
    if (boxCount > minBoxCount) {
      boxCount--;
      updateBoxCount();
    }

    toggleDecrementButtonState();
    toggleIncrementButtonState();
  });

  $(".increment-topping").on("click", function () {
    const menu = $(this).closest(".menu");
    const index = $(".menu").index(menu);

    if (getTotalToppingCount() < maxToppingCount) {
      toppingCounts[index]++;
      updateToppingCount(menu);
      updateRemainingQuota();
    }

    toggleIncrementDecrementButtonStates();

    // const selectedToppingsData = getSelectedToppingsData();
    // console.log(selectedToppingsData);

    updateTotalPricing();
  });

  $(".decrement-topping").on("click", function () {
    const menu = $(this).closest(".menu");
    const index = $(".menu").index(menu);

    if (toppingCounts[index] > 0) {
      toppingCounts[index]--;
      updateToppingCount(menu);
      updateRemainingQuota();
    }

    toggleIncrementDecrementButtonStates();

    // const selectedToppingsData = getSelectedToppingsData();
    // console.log(selectedToppingsData);

    updateTotalPricing();
  });

  $(".menu").each(function (index) {
    const toppingCount = toppingCounts[index];
    const menuName = $(this).find(".topping-name").text();

    // if (toppingCount > 0) {
    //   // console.log(`${menuName} x ${toppingCount}pcs`);
    // }
  });

  function getSelectedToppingsData() {
    const selectedToppingsData = [];

    $(".menu").each(function (index) {
      const menu = $(this);
      const toppingCount = toppingCounts[index];

      if (toppingCount > 0) {
        const menuName = menu.find(".topping-name").text();
        const toppingData = {
          menuName: menuName,
          toppingCount: toppingCount,
        };

        selectedToppingsData.push(toppingData);
      }
    });

    return selectedToppingsData;
  }

  function updateWhatsAppButtonState() {
    const selectedToppingsData = getSelectedToppingsData();
    const whatsappButton = $(".send-whatsapp-button");
    const nama = $("#form #nama").val();
    const whatsapp = $("#form #nomorwa").val();
    const alamat = $("#form #alamat").val();
    const isFormNotEmpty =
      nama.trim() !== "" && whatsapp.trim() !== "" && alamat.trim() !== "";
    whatsappButton.prop(
      "disabled",
      selectedToppingsData.length === 0 || !isFormNotEmpty
    );
  }

  $(".increment-topping, .decrement-topping").on("click", function () {
    updateWhatsAppButtonState();
    updateTotalPricing();
  });

  $("#form input").on("input", function () {
    updateWhatsAppButtonState();
  });

  function updateTotalPricing() {
    const totalPrice = calculateTotalPrice();
    const formattedPrice = formatCurrency(totalPrice);
    $("#pricing").text(formattedPrice);
  }

  // function formatCurrency(amount) {
  //   return `Rp${amount}`;
  // }
  function formatCurrency(amount) {
    return `Rp${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  }

  function calculateTotalPrice() {
    const selectedToppingsData = getSelectedToppingsData();
    const toppingPrice = 5000;
    totalPrice = 0;

    selectedToppingsData.forEach((topping) => {
      totalPrice += topping.toppingCount * toppingPrice;
    });

    return totalPrice;
  }

  updateWhatsAppButtonState();
  updateTotalPricing();

  function sendWhatsAppMessage() {
    const selectedToppingsData = getSelectedToppingsData();
    const nama = $("#form #nama").val();
    const whatsapp = $("#form #nomorwa").val();
    const alamat = $("#form #alamat").val();
    const messageText = selectedToppingsData
      .map((topping) => `- ${topping.menuName} x ${topping.toppingCount}pcs`)
      .join("\n");
    const fullMessageText = `Halo, saya ingin memesan Donat dengan Topping:\n${messageText}\n\n----------\n\nNama: ${nama}\nNo. Whatsapp: ${whatsapp}\nAlamat Pengiriman: ${alamat}\n\n----------\n\nOrder via CCWO`;
    const whatsappLink = `https://api.whatsapp.com/send?phone=+6281906955567&text=${encodeURIComponent(
      fullMessageText
    )}`;

    window.open(whatsappLink, "_blank");
  }

  $(".send-whatsapp-button").on("click", sendWhatsAppMessage);

  toggleIncrementDecrementButtonStates();
  updateRemainingQuota();
});
