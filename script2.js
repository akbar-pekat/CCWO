$(document).ready(function () {
  let maxToppingCount = 6;
  const maxBoxCount = 5;
  const minBoxCount = 1;
  let boxCount = 1;
  const maxToppingPerBox = 6;
  let toppingCounts = Array($(".menu").length).fill(0);

  function updateBoxCount() {
    $(".display-number-box .number").text(boxCount);
    updateMaxToppingCount();
    updateRemainingQuota();
  }

  function updateMaxToppingCount() {
    const oldMaxToppingCount = maxToppingCount;
    maxToppingCount = maxToppingPerBox * boxCount;

    if (getTotalToppingCount() > maxToppingCount) {
      toppingCounts.forEach((count, i) => {
        toppingCounts[i] = Math.floor(
          (count * maxToppingCount) / oldMaxToppingCount
        );
      });
      updateToppingCounts();
      toggleIncrementDecrementButtonStates();
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
      totalToppingCount === maxToppingCount
    );
  }

  function updateRemainingQuota() {
    const totalToppingCount = getTotalToppingCount();
    const remainingQuota = maxToppingCount - totalToppingCount;

    console.log(`Remaining Quota - ${remainingQuota}`);
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
      updateMaxToppingCount();
    }

    toggleIncrementButtonState();
    toggleDecrementButtonState();
  });

  $(".decrement-box").on("click", function () {
    if (boxCount > minBoxCount) {
      boxCount--;
      updateBoxCount();
      updateMaxToppingCount();
      updateToppingCounts();
      toggleDecrementButtonState();
      toggleIncrementButtonState();
    }
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

    const selectedToppingsData = getSelectedToppingsData();

    // Log the selected toppings data
    console.log(selectedToppingsData);
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

    const selectedToppingsData = getSelectedToppingsData();

    // Log the selected toppings data
    console.log(selectedToppingsData);
  });

  //   $(".menu").each(function () {
  //     toppingCounts.push(0);
  //   });

  // Ambil elemen dengan kelas 'menu'
  $(".menu").each(function (index) {
    const toppingCount = toppingCounts[index];
    const menuName = $(this).find(".topping-name").text();

    if (toppingCount > 0) {
      console.log(`${menuName} x ${toppingCount}pcs`);
    }
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
    whatsappButton.prop("disabled", selectedToppingsData.length === 0);
  }

  $(".increment-topping, .decrement-topping").on("click", function () {
    updateWhatsAppButtonState();
  });

  updateWhatsAppButtonState();

  function sendWhatsAppMessage() {
    const selectedToppingsData = getSelectedToppingsData();
    const messageText = selectedToppingsData
      .map((topping) => `${topping.menuName} x ${topping.toppingCount}pcs`)
      .join("\n");
    const whatsappLink = `https://web.whatsapp.com/send?phone=+6281906955567&text=${encodeURIComponent(
      messageText
    )}`;
    window.open(whatsappLink, "_blank");
  }

  $(".send-whatsapp-button").on("click", sendWhatsAppMessage);

  toggleIncrementDecrementButtonStates();
  updateRemainingQuota();
});
