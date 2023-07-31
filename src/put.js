const { stat } = require("fs/promises");
const { createWriteStream } = require("fs");
const { getUrlPath } = require("./utils/getUrlPath");
const { FILE_NOT_FOUND, NOT_ALLOWED_ON_DIRECTORY } = require("./utils/strings");
const { buildErrorMessage } = require("./utils/buildErrorMessage");

function promisifiedPipe(from, to) {
  return new Promise((resolve, reject) => {
    from.on("error", reject);
    to.on("error", reject);
    to.on("finish", resolve);
    from.pipe(to);
  });
}

async function PUT(request) {
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
      ? buildErrorMessage(404, FILE_NOT_FOUND)
      : buildErrorMessage(500, error.message);
  }

  if (pathStats.isDirectory()) {
    return buildErrorMessage(405, NOT_ALLOWED_ON_DIRECTORY);
  }

  try {
    await promisifiedPipe(request, createWriteStream(path));
  } catch (error) {
    return buildErrorMessage(500, error.message);
  }

  return {
    status: 200,
  };
}

module.exports = {
  PUT,
};
