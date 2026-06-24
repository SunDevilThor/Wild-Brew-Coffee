"use strict";

window.WildBrewCartRender = (function createWildBrewCartRender() {
  function updateCartCount() {
    const cartItems = window.WildBrewCartStore.readCart();
    const cartCountElements = document.querySelectorAll("[data-cart-count]");

    cartCountElements.forEach(function updateCartCountElement(cartCountElement) {
      cartCountElement.textContent = String(cartItems.length);
    });

    window.WildBrewLogger.info("Cart count updated.", { cartCount: cartItems.length });
  }

  function createOptionElements(options, selectedValue) {
    return options.map(function createOption(optionValue) {
      const optionElement = document.createElement("option");
      optionElement.value = optionValue;
      optionElement.textContent = optionValue;

      if (optionValue === selectedValue) {
        optionElement.selected = true;
      }

      return optionElement;
    });
  }

  function renderMenuProducts() {
    const productGridElement = document.querySelector("[data-menu-products]");

    if (!productGridElement) {
      window.WildBrewLogger.info("Menu product grid was not found on this page.");
      return;
    }

    productGridElement.innerHTML = "";

    window.WildBrewMenuData.products.forEach(function renderProductCard(product) {
      const productCardElement = document.createElement("article");
      productCardElement.className = "product-card";
      productCardElement.dataset.productId = product.id;

      const imageElement = document.createElement("img");
      imageElement.src = product.image;
      imageElement.alt = product.name;

      const titleElement = document.createElement("h3");
      titleElement.textContent = product.name;

      const categoryElement = document.createElement("p");
      categoryElement.className = "eyebrow";
      categoryElement.textContent = product.category;

      const descriptionElement = document.createElement("p");
      descriptionElement.textContent = product.description;

      const priceElement = document.createElement("p");
      priceElement.className = "product-price";
      priceElement.textContent = window.WildBrewCartStore.formatCurrency(product.price);

      const controlsElement = document.createElement("div");
      controlsElement.className = "product-controls";

      for (let drinkNumber = 1; drinkNumber <= product.drinkCount; drinkNumber += 1) {
        controlsElement.appendChild(createDrinkCustomizer(product, drinkNumber));
      }

      const addButtonElement = document.createElement("button");
      addButtonElement.className = "button button-primary";
      addButtonElement.type = "button";
      addButtonElement.textContent = "Add to cart";
      addButtonElement.addEventListener("click", function handleAddToCartClick() {
        addConfiguredProductToCart(product, productCardElement);
      });

      productCardElement.appendChild(imageElement);
      productCardElement.appendChild(categoryElement);
      productCardElement.appendChild(titleElement);
      productCardElement.appendChild(descriptionElement);
      productCardElement.appendChild(priceElement);
      productCardElement.appendChild(controlsElement);
      productCardElement.appendChild(addButtonElement);
      productGridElement.appendChild(productCardElement);
    });

    window.WildBrewLogger.info("Menu products rendered.", { productCount: window.WildBrewMenuData.products.length });
  }

  function createDrinkCustomizer(product, drinkNumber) {
    const drinkCustomizerElement = document.createElement("div");
    drinkCustomizerElement.className = "drink-customizer";
    drinkCustomizerElement.dataset.drinkNumber = String(drinkNumber);

    const headingElement = document.createElement("h4");
    headingElement.textContent = product.drinkCount === 1 ? "Drink" : `Drink ${drinkNumber}`;

    const flavorLabelElement = document.createElement("label");
    flavorLabelElement.textContent = "Flavor";
    const flavorSelectElement = document.createElement("select");
    flavorSelectElement.name = `flavor-${product.id}-${drinkNumber}`;
    createOptionElements(window.WildBrewMenuData.flavors, "Vanilla").forEach(function appendFlavorOption(optionElement) {
      flavorSelectElement.appendChild(optionElement);
    });
    flavorLabelElement.appendChild(flavorSelectElement);

    const coldFoamLabelElement = document.createElement("label");
    coldFoamLabelElement.textContent = "Cold foam";
    const coldFoamSelectElement = document.createElement("select");
    coldFoamSelectElement.name = `cold-foam-${product.id}-${drinkNumber}`;
    createOptionElements(window.WildBrewMenuData.coldFoamFlavors, "None").forEach(function appendColdFoamOption(optionElement) {
      coldFoamSelectElement.appendChild(optionElement);
    });
    coldFoamLabelElement.appendChild(coldFoamSelectElement);

    const addOnGridElement = document.createElement("div");
    addOnGridElement.className = "addon-grid";

    window.WildBrewMenuData.addOns.forEach(function renderAddOnCheckbox(addOn) {
      const addOnLabelElement = document.createElement("label");
      addOnLabelElement.className = "checkbox-row";

      const addOnInputElement = document.createElement("input");
      addOnInputElement.type = "checkbox";
      addOnInputElement.value = addOn.id;
      addOnInputElement.dataset.addOnName = addOn.name;
      addOnInputElement.dataset.addOnPrice = String(addOn.price);

      const addOnTextElement = document.createElement("span");
      addOnTextElement.textContent = `${addOn.name} (${addOn.pricingLabel})`;

      addOnLabelElement.appendChild(addOnInputElement);
      addOnLabelElement.appendChild(addOnTextElement);
      addOnGridElement.appendChild(addOnLabelElement);
    });

    drinkCustomizerElement.appendChild(headingElement);
    drinkCustomizerElement.appendChild(flavorLabelElement);
    drinkCustomizerElement.appendChild(coldFoamLabelElement);
    drinkCustomizerElement.appendChild(addOnGridElement);

    return drinkCustomizerElement;
  }

  function addConfiguredProductToCart(product, productCardElement) {
    const drinkCustomizerElements = Array.from(productCardElement.querySelectorAll(".drink-customizer"));

    const drinks = drinkCustomizerElements.map(function buildDrinkCustomization(drinkCustomizerElement) {
      const flavorSelectElement = drinkCustomizerElement.querySelector("select[name^='flavor']");
      const coldFoamSelectElement = drinkCustomizerElement.querySelector("select[name^='cold-foam']");
      const checkedAddOnElements = Array.from(drinkCustomizerElement.querySelectorAll("input[type='checkbox']:checked"));

      return {
        drinkNumber: Number(drinkCustomizerElement.dataset.drinkNumber),
        flavor: flavorSelectElement ? flavorSelectElement.value : "Not selected",
        coldFoam: coldFoamSelectElement ? coldFoamSelectElement.value : "None",
        addOns: checkedAddOnElements.map(function buildAddOnSelection(addOnInputElement) {
          return {
            id: addOnInputElement.value,
            name: addOnInputElement.dataset.addOnName,
            price: Number(addOnInputElement.dataset.addOnPrice)
          };
        })
      };
    });

    const cartItem = {
      cartItemId: `cart-item-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      productId: product.id,
      name: product.name,
      category: product.category,
      basePrice: product.price,
      sizeLabel: product.sizeLabel,
      drinks
    };

    window.WildBrewCartStore.addCartItem(cartItem);
    updateCartCount();
    window.WildBrewLogger.info("Configured product added to cart.", { cartItem });

    const addButtonElement = productCardElement.querySelector("button");
    if (addButtonElement) {
      addButtonElement.textContent = "Added";
      window.setTimeout(function resetAddButtonText() {
        addButtonElement.textContent = "Add to cart";
      }, 1200);
    }
  }

  function renderOptionLists() {
    renderSimpleList("[data-flavor-list]", window.WildBrewMenuData.flavors);
    renderSimpleList("[data-cold-foam-list]", window.WildBrewMenuData.coldFoamFlavors.filter(function keepPaidFoamOptions(foamFlavor) {
      return foamFlavor !== "None";
    }));
    renderSimpleList("[data-addon-list]", window.WildBrewMenuData.addOns.map(function formatAddOn(addOn) {
      return `${addOn.name} · ${addOn.pricingLabel}`;
    }));
  }

  function renderSimpleList(selector, values) {
    const listElement = document.querySelector(selector);

    if (!listElement) {
      return;
    }

    listElement.innerHTML = "";

    values.forEach(function appendListItem(value) {
      const listItemElement = document.createElement("li");
      listItemElement.textContent = value;
      listElement.appendChild(listItemElement);
    });
  }

  function renderCartPage() {
    const cartItemsElement = document.querySelector("[data-cart-items]");
    const cartTotalElement = document.querySelector("[data-cart-total]");

    if (!cartItemsElement || !cartTotalElement) {
      window.WildBrewLogger.info("Cart page elements were not found on this page.");
      return;
    }

    const cartItems = window.WildBrewCartStore.readCart();
    cartItemsElement.innerHTML = "";

    if (cartItems.length === 0) {
      const emptyCartElement = document.createElement("div");
      emptyCartElement.className = "empty-cart";
      emptyCartElement.textContent = "Your cart is empty. Add drinks from the menu to create an order request.";
      cartItemsElement.appendChild(emptyCartElement);
    } else {
      cartItems.forEach(function appendCartItem(cartItem) {
        cartItemsElement.appendChild(createCartItemElement(cartItem));
      });
    }

    cartTotalElement.textContent = window.WildBrewCartStore.formatCurrency(window.WildBrewCartStore.calculateCartTotal(cartItems));
    updateCartCount();
    window.WildBrewLogger.info("Cart page rendered.", { cartItemCount: cartItems.length });
  }

  function createCartItemElement(cartItem) {
    const cartItemElement = document.createElement("article");
    cartItemElement.className = "cart-item";

    const titleElement = document.createElement("h3");
    titleElement.textContent = cartItem.name;

    const detailWrapperElement = document.createElement("div");

    cartItem.drinks.forEach(function appendDrinkDetail(drinkCustomization) {
      const detailElement = document.createElement("p");
      detailElement.className = "cart-item-detail";

      const addOnText = drinkCustomization.addOns.length > 0
        ? drinkCustomization.addOns.map(function getAddOnName(addOn) {
            return addOn.name;
          }).join(", ")
        : "No add-ons";

      detailElement.textContent = `Drink ${drinkCustomization.drinkNumber}: ${drinkCustomization.flavor}, foam: ${drinkCustomization.coldFoam}, add-ons: ${addOnText}`;
      detailWrapperElement.appendChild(detailElement);
    });

    const actionRowElement = document.createElement("div");
    actionRowElement.className = "cart-item-actions";

    const priceElement = document.createElement("span");
    priceElement.className = "cart-item-price";
    priceElement.textContent = window.WildBrewCartStore.formatCurrency(window.WildBrewCartStore.calculateCartItemTotal(cartItem));

    const removeButtonElement = document.createElement("button");
    removeButtonElement.className = "text-button";
    removeButtonElement.type = "button";
    removeButtonElement.textContent = "Remove";
    removeButtonElement.addEventListener("click", function handleRemoveCartItemClick() {
      window.WildBrewCartStore.removeCartItem(cartItem.cartItemId);
      renderCartPage();
    });

    actionRowElement.appendChild(priceElement);
    actionRowElement.appendChild(removeButtonElement);

    cartItemElement.appendChild(titleElement);
    cartItemElement.appendChild(detailWrapperElement);
    cartItemElement.appendChild(actionRowElement);

    return cartItemElement;
  }

  function bindClearCartButton() {
    const clearCartButtonElement = document.querySelector("[data-clear-cart]");

    if (!clearCartButtonElement) {
      return;
    }

    clearCartButtonElement.addEventListener("click", function handleClearCartClick() {
      window.WildBrewCartStore.clearCart();
      renderCartPage();
    });
  }

  function renderSavedOrderSummary() {
    const savedOrderSummaryElement = document.querySelector("[data-saved-order-summary]");

    if (!savedOrderSummaryElement) {
      return;
    }

    const savedOrderSummary = window.WildBrewCartStore.readOrderSummary();
    savedOrderSummaryElement.textContent = savedOrderSummary || "No order summary found yet.";
  }

  return {
    updateCartCount,
    renderMenuProducts,
    renderOptionLists,
    renderCartPage,
    bindClearCartButton,
    renderSavedOrderSummary
  };
})();
