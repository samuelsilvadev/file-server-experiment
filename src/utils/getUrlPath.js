const { resolve, sep } = require("path");
const { URL } = require("url");
const { ACCESS_DENIED } = require("./strings");
const { HOST, PORT } = require("./config");

function getUrlPath(url) {
  const { pathname } = new URL(url, `http://${HOST}:${PORT}/`);
  const path = resolve(decodeURIComponent(pathname).slice(1));
  const baseDirectory = process.cwd();

  if (path !== baseDirectory && !path.startsWith(baseDirectory + sep)) {
    throw new Error(ACCESS_DENIED);
  }

  return path;
}

module.exports = {
  getUrlPath,
};
