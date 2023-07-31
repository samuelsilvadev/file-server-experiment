const { createServer } = require("http");

const PORT = 3001;
const methods = Object.create(null);

async function notAllowed(request) {
  return {
    status: 405,
    body: JSON.stringify({ message: `Method ${request.method} not allowed.` }),
    contentType: "application/json",
  };
}

createServer((request, response) => {
  console.log(request.method, request.url);
  const handler = methods[request.method] || notAllowed;

  handler(request)
    .then(({ status = 200, contentType = "text/plain", body }) => {
      response.writeHead(status, { "Content-Type": contentType });

      if (body?.pipe) {
        body.pipe(response);
      } else {
        response.end(body);
      }
    })
    .catch((error) => {
      if (error.status != null) {
        return error;
      }

      return {
        body: String(error),
        status: 500,
      };
    });
}).listen(PORT);
