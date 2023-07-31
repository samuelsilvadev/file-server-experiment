function buildErrorMessage(status, message) {
  return {
    status,
    ...(message && {
      body: JSON.stringify({ message }),
      contentType: "application/json",
    }),
  };
}

module.exports = {
  buildErrorMessage,
};
