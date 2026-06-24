"use strict";

window.WildBrewLogger = (function createWildBrewLogger() {
  const logPrefix = "[Wild Brew Coffee]";

  function buildPayload(message, context) {
    return {
      message,
      context: context || {},
      page: document.body ? document.body.dataset.page : "unknown",
      timestamp: new Date().toISOString()
    };
  }

  function info(message, context) {
    console.info(logPrefix, buildPayload(message, context));
  }

  function warn(message, context) {
    console.warn(logPrefix, buildPayload(message, context));
  }

  function error(message, context) {
    console.error(logPrefix, buildPayload(message, context));
  }

  return {
    info,
    warn,
    error
  };
})();
