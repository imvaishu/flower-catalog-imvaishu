const fs = require("fs");
const { loadTemplate } = require("./lib/viewTemplate");

const MIME_TYPES = require("./lib/mimeTypes");
const STATIC_FOLDER = `${__dirname}/public`;

const notFound = function(req, res) {
  res.writeHead(404, { "Content-Length": 0 });
  res.end();
};

const serveStaticPage = function(req, res) {
  const url = req.url === "/" ? "/index.html" : req.url;
  const path = STATIC_FOLDER + url;
  if (!fs.existsSync(path)) return notFound(req, res);
  const content = fs.readFileSync(path);

  const [, extension] = path.match(/.*\.(.*)$/);
  res.setHeader("Content-Type", `${MIME_TYPES[extension]}`);
  res.setHeader("Content-Length", `${content.length}`);
  res.end(content);
};

const serveGuestBookPage = function(req, res) {
  const content = loadTemplate("guestBook.html", { comments: "" });
  res.setHeader("Content-Type", `text/html`);
  res.setHeader("Content-Length", `${content.length}`);
  res.write(content);
  res.end();
};

const findHandler = function(req) {
  if (req.method === "GET" && req.url === "/guestBook.html")
    return serveGuestBookPage;
  if (req.method === "GET") return serveStaticPage;
};

const processRequest = function(req, res) {
  const handler = findHandler(req);
  handler(req, res);
};

module.exports = { processRequest };
