"use strict";

(function initializeWildBrewSite() {
  function initializePage() {
    window.WildBrewLogger.info("Initializing page.");

    window.WildBrewCartRender.updateCartCount();
    window.WildBrewCartRender.renderMenuProducts();
    window.WildBrewCartRender.renderOptionLists();
    window.WildBrewCartRender.renderCartPage();
    window.WildBrewCartRender.bindClearCartButton();
    window.WildBrewCartRender.renderSavedOrderSummary();
    window.WildBrewOrderForm.bindOrderForm();

    window.WildBrewLogger.info("Page initialized.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePage);
  } else {
    initializePage();
  }
})();
