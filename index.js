const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");
const slugify = require("slugify");
/*
// Synchronous & blocking Code
const input = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(input);

fs.writeFileSync("./txt/output.txt", `Avocado:${input}`);

// Asynchronous & non-blocking Code
fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
    fs.readFile(`./txt/${data}.txt`, "utf-8", (err1, data1) => {
        console.log(data1);
    });
});
console.log("Loading...");
*/

// Htttp Server

const overviewPage = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    "utf-8"
);
const productsPage = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    "utf-8"
);
const cardPage = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    "utf-8"
);

// Data
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const prods = JSON.parse(data);

// Slugging
const slugs = prods.map((product) =>
    slugify(product.productName, { lower: true })
);
console.log(slugs, slugify("Fresh Avocados", { lower: true }));

// Intialising Server
const server = http.createServer((req, resp) => {
    const { query, pathname } = url.parse(req.url, true);

    // Overview Page
    if (pathname === "/" || pathname === "/overview") {
        resp.writeHead(200, {
            "Content-type": "text/html",
        });

        const cards = prods
            .map((prod) => replaceTemplate(cardPage, prod))
            .join("");
        const output = overviewPage.replace(/{%PRODUCT_CARDS%}/, cards);
        resp.end(output);
    }

    // Products Page
    else if (pathname === "/product") {
        const product = prods[query.id];
        resp.writeHead(200, {
            "Content-type": "text/html",
        });
        const output = replaceTemplate(productsPage, product);
        resp.end(output);
    }

    // API
    else if (pathname === "/api") {
        resp.writeHead(200, {
            "Content-type": "application/json",
        });
        resp.end(data);
    }

    // Error
    else {
        resp.writeHead(404, {
            "Content-type": "text/html",
            "my-header": "hi-mom",
        });
        resp.end("Page Not Found");
    }
});

server.listen(8000, "127.0.0.1", () => {
    console.log("Listening for request");
});
