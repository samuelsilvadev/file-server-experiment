const { stat, rmdir, unlink } = require("fs/promises");
const { buildErrorMessage } = require("./utils/buildErrorMessage");
const { getUrlPath } = require("./utils/getUrlPath");

async function DELETE(request) {
  let path, pathStats;

  try {
    path = getUrlPath(request.url);
  } catch (error) {
    return error.message === ACCESS_DENIED
      ? buildErrorMessage(403, ACCESS_DENIED)
      : buildErrorMessage(500, error.message);
  }

  try {
    pathStats = await stat(path);
  } catch (error) {
    return error.code === "ENOENT"
      ? buildErrorMessage(204)
      : buildErrorMessage(500, error.message);
  }

  try {
    if (pathStats.isDirectory()) {
      await rmdir(path);
    } else {
      await unlink(path);
    }
  } catch (error) {
    return buildErrorMessage(500, error.message);
  }

  return {
    status: 204,
  };
}

module.exports = {
  DELETE,
};
