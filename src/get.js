const { createReadStream } = require("fs");
const { readdir, stat } = require("fs/promises");
const mime = require("mime");
const { getUrlPath } = require("./utils/getUrlPath");
const { ACCESS_DENIED, FILE_NOT_FOUND } = require("./utils/strings");
const { buildErrorMessage } = require("./utils/buildErrorMessage");

async function GET(request) {
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
    return {
      body: (await readdir(path)).join("\n"),
    };
  }

  return {
    body: createReadStream(path),
    type: mime.getType(path),
  };
}

module.exports = {
  GET,
};
