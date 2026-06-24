"use strict";

window.WildBrewOrderForm = (function createWildBrewOrderForm() {
  function bindOrderForm() {
    const orderFormElement = document.querySelector("[data-order-form]");

    if (!orderFormElement) {
      window.WildBrewLogger.info("Order form was not found on this page.");
      return;
    }

    orderFormElement.addEventListener("submit", function handleOrderFormSubmit(submitEvent) {
      submitEvent.preventDefault();
      handleOrderRequest(orderFormElement);
    });

    bindCopyButton();
    window.WildBrewLogger.info("Order form bound.");
  }

  function handleOrderRequest(orderFormElement) {
    const cartItems = window.WildBrewCartStore.readCart();
    const formMessageElement = document.querySelector("[data-form-message]");

    if (cartItems.length === 0) {
      showFormMessage(formMessageElement, "Add at least one drink before creating an order request.");
      window.WildBrewLogger.warn("Order request blocked because cart was empty.");
      return;
    }

    const orderDetails = collectOrderDetails(orderFormElement);
    const orderSummary = buildOrderSummary(cartItems, orderDetails);

    const orderOutputElement = document.querySelector("[data-order-output]");
    const orderSummaryElement = document.querySelector("[data-order-summary]");

    if (!orderOutputElement || !orderSummaryElement) {
      showFormMessage(formMessageElement, "Order summary could not be displayed. Check console logs.");
      window.WildBrewLogger.error("Order output elements were missing.", {
        hasOutput: Boolean(orderOutputElement),
        hasSummary: Boolean(orderSummaryElement)
      });
      return;
    }

    orderSummaryElement.value = orderSummary;
    orderOutputElement.hidden = false;
    window.WildBrewCartStore.saveOrderSummary(orderSummary);
    showFormMessage(formMessageElement, "Order request created. Copy it and send it through Facebook Messenger or Instagram.");
    window.WildBrewLogger.info("Order request summary created.", { orderDetails });
  }

  function collectOrderDetails(orderFormElement) {
    const formData = new FormData(orderFormElement);

    return {
      customerName: String(formData.get("customerName") || "").trim(),
      contactMethod: String(formData.get("contactMethod") || "").trim(),
      deliveryCity: String(formData.get("deliveryCity") || "").trim(),
      deliveryTiming: String(formData.get("deliveryTiming") || "").trim(),
      paymentPreference: String(formData.get("paymentPreference") || "").trim(),
      orderNotes: String(formData.get("orderNotes") || "").trim()
    };
  }

  function buildOrderSummary(cartItems, orderDetails) {
    const summaryLines = [];
    const orderTotal = window.WildBrewCartStore.calculateCartTotal(cartItems);

    summaryLines.push("Wild Brew Coffee Order Request");
    summaryLines.push("--------------------------------");
    summaryLines.push(`Name: ${orderDetails.customerName}`);
    summaryLines.push(`Contact: ${orderDetails.contactMethod}`);
    summaryLines.push(`Delivery city: ${orderDetails.deliveryCity}`);
    summaryLines.push(`Preferred timing: ${orderDetails.deliveryTiming}`);
    summaryLines.push(`Payment preference: ${orderDetails.paymentPreference}`);
    summaryLines.push("");
    summaryLines.push("Items");

    cartItems.forEach(function addCartItemSummary(cartItem, cartItemIndex) {
      summaryLines.push(`${cartItemIndex + 1}. ${cartItem.name} - ${window.WildBrewCartStore.formatCurrency(window.WildBrewCartStore.calculateCartItemTotal(cartItem))}`);

      cartItem.drinks.forEach(function addDrinkSummary(drinkCustomization) {
        const addOnSummary = drinkCustomization.addOns.length > 0
          ? drinkCustomization.addOns.map(function getAddOnSummary(addOn) {
              return `${addOn.name} (+${window.WildBrewCartStore.formatCurrency(addOn.price)})`;
            }).join(", ")
          : "No add-ons";

        summaryLines.push(`   Drink ${drinkCustomization.drinkNumber}: ${drinkCustomization.flavor}; Cold foam: ${drinkCustomization.coldFoam}; Add-ons: ${addOnSummary}`);
      });
    });

    summaryLines.push("");
    summaryLines.push(`Estimated total: ${window.WildBrewCartStore.formatCurrency(orderTotal)}`);
    summaryLines.push("Delivery: Free in Mesa & Gilbert");
    summaryLines.push("");
    summaryLines.push("Notes");
    summaryLines.push(orderDetails.orderNotes || "None");
    summaryLines.push("");
    summaryLines.push("Please confirm availability, delivery timing, and payment details before preparing the order.");

    return summaryLines.join("\n");
  }

  function bindCopyButton() {
    const copyButtonElement = document.querySelector("[data-copy-order]");
    const orderSummaryElement = document.querySelector("[data-order-summary]");
    const formMessageElement = document.querySelector("[data-form-message]");

    if (!copyButtonElement || !orderSummaryElement) {
      window.WildBrewLogger.info("Copy order controls were not found on this page.");
      return;
    }

    copyButtonElement.addEventListener("click", function handleCopyOrderClick() {
      copyOrderSummary(orderSummaryElement.value, formMessageElement);
    });
  }

  function copyOrderSummary(orderSummary, formMessageElement) {
    if (!orderSummary) {
      showFormMessage(formMessageElement, "Create an order request before copying.");
      window.WildBrewLogger.warn("Copy order request blocked because summary was empty.");
      return;
    }

    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      orderSummaryElementFallback(orderSummary);
      showFormMessage(formMessageElement, "Clipboard API was unavailable. Select and copy the summary manually.");
      window.WildBrewLogger.warn("Clipboard API unavailable; manual copy required.");
      return;
    }

    navigator.clipboard.writeText(orderSummary)
      .then(function handleCopySuccess() {
        showFormMessage(formMessageElement, "Order summary copied.");
        window.WildBrewLogger.info("Order summary copied to clipboard.");
      })
      .catch(function handleCopyFailure(copyError) {
        showFormMessage(formMessageElement, "Copy failed. Select and copy the summary manually.");
        window.WildBrewLogger.error("Failed to copy order summary.", { copyError });
      });
  }

  function orderSummaryElementFallback(orderSummary) {
    const temporaryTextareaElement = document.createElement("textarea");
    temporaryTextareaElement.value = orderSummary;
    document.body.appendChild(temporaryTextareaElement);
    temporaryTextareaElement.select();
    document.body.removeChild(temporaryTextareaElement);
  }

  function showFormMessage(formMessageElement, message) {
    if (!formMessageElement) {
      window.WildBrewLogger.warn("Form message element was missing.", { message });
      return;
    }

    formMessageElement.textContent = message;
  }

  return {
    bindOrderForm,
    buildOrderSummary
  };
})();
