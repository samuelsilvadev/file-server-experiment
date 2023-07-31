function buildErrorMessage(status, message) {
  return {
    status,
    body: JSON.stringify({ message }),
    contentType: "application/json",
  };
}

module.exports = {
  buildErrorMessage,
};
