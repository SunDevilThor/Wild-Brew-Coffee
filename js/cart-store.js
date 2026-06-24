"use strict";

window.WildBrewCartStore = (function createWildBrewCartStore() {
  const cartStorageKey = "wildBrewCoffeeCart";
  const savedOrderStorageKey = "wildBrewCoffeeSavedOrder";

  function readCart() {
    try {
      const storedCartText = window.localStorage.getItem(cartStorageKey);

      if (!storedCartText) {
        return [];
      }

      const parsedCart = JSON.parse(storedCartText);

      if (!Array.isArray(parsedCart)) {
        window.WildBrewLogger.warn("Stored cart was not an array. Resetting cart.", { parsedCart });
        return [];
      }

      return parsedCart;
    } catch (storageError) {
      window.WildBrewLogger.error("Failed to read cart from localStorage.", { storageError });
      return [];
    }
  }

  function saveCart(cartItems) {
    try {
      window.localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
      window.WildBrewLogger.info("Cart saved.", { itemCount: cartItems.length });
    } catch (storageError) {
      window.WildBrewLogger.error("Failed to save cart to localStorage.", { storageError, cartItems });
    }
  }

  function addCartItem(cartItem) {
    const currentCartItems = readCart();
    currentCartItems.push(cartItem);
    saveCart(currentCartItems);
    return currentCartItems;
  }

  function removeCartItem(cartItemId) {
    const currentCartItems = readCart();
    const updatedCartItems = currentCartItems.filter(function keepCartItem(cartItem) {
      return cartItem.cartItemId !== cartItemId;
    });
    saveCart(updatedCartItems);
    return updatedCartItems;
  }

  function clearCart() {
    saveCart([]);
    return [];
  }

  function saveOrderSummary(orderSummary) {
    try {
      window.localStorage.setItem(savedOrderStorageKey, orderSummary);
      window.WildBrewLogger.info("Saved order summary.", { characterCount: orderSummary.length });
    } catch (storageError) {
      window.WildBrewLogger.error("Failed to save order summary.", { storageError });
    }
  }

  function readOrderSummary() {
    try {
      return window.localStorage.getItem(savedOrderStorageKey) || "";
    } catch (storageError) {
      window.WildBrewLogger.error("Failed to read saved order summary.", { storageError });
      return "";
    }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  }

  function calculateDrinkAddOnTotal(drinkCustomization) {
    if (!drinkCustomization || !Array.isArray(drinkCustomization.addOns)) {
      return 0;
    }

    return drinkCustomization.addOns.reduce(function addAddOnPrice(runningTotal, selectedAddOn) {
      return runningTotal + Number(selectedAddOn.price || 0);
    }, 0);
  }

  function calculateCartItemTotal(cartItem) {
    const drinkAddOnTotal = cartItem.drinks.reduce(function addDrinkTotal(runningTotal, drinkCustomization) {
      return runningTotal + calculateDrinkAddOnTotal(drinkCustomization);
    }, 0);

    return Number(cartItem.basePrice || 0) + drinkAddOnTotal;
  }

  function calculateCartTotal(cartItems) {
    return cartItems.reduce(function addCartItemTotal(runningTotal, cartItem) {
      return runningTotal + calculateCartItemTotal(cartItem);
    }, 0);
  }

  return {
    readCart,
    saveCart,
    addCartItem,
    removeCartItem,
    clearCart,
    saveOrderSummary,
    readOrderSummary,
    formatCurrency,
    calculateCartItemTotal,
    calculateCartTotal
  };
})();
