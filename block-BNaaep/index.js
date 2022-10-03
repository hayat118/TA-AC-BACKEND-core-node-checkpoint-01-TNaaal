var http = require('http');

var fs = require('fs');

var path = require('path')

var qs = require('querystring')

var url = require('url')

var server = http.createServer(handleRequest)







const userDir = path.join(__dirname, "contacts/");
function handleRequest(req, res) {

    if (req.method === "GET" && req.url === "/") {
        res.setHeader('content-type', 'text.html')
        fs.createReadStream('./index.html').pipe(res)
    }
    if (req.method === "GET" && req.url === "/about") {
        res.setHeader('content-type', 'text/html')
        fs.createReadStream('./about.html').pipe(res)
    }
    if (req.url.split(".").pop() === "css") {
        res.setHeader("Content-Type", "text/css");
        fs.createReadStream('./stylesheet/style.css').pipe(res)
    }
    if (req.url.split(".").pop() === "jpg") {
        res.setHeader("Content-Type", "image/jpg");
        fs.createReadStream('./name.jpg').pipe(res)
    }
    var parsedUrl = url.parse(req.url, true)
    var store = '';
    req.on('data', (chunk) => {
        store = store + chunk
    })
    req.on('end', () => {

        if (req.method === "GET" && req.url === "/contact") {
            fs.createReadStream('./form.html').pipe(res)
        }
        if (req.method === "POST" && req.url === "/form") {
            console.log(store);
            var userName = qs.parse(store).username;
            var jsonData = JSON.stringify(qs.parse(store))
            console.log(userName);
            fs.open(userDir + userName + ".json", "wx", (err, fd) => {
                fs.writeFile(fd, jsonData, (err) => {
                    if (err) return console.log(err);
                    fs.close(fd, (err) => {
                        res.end(`${userName} successfully created`);
                    });
                });
            });

        }
        if (parsedUrl.pathname === "/contact" && req.method === "GET") {
            var username = parsedUrl.query.username
            fs.readFile(userDir + username + '.json', (err, content) => {
                if (err) return console.log(err);
                let userName = (JSON.parse(content.toString()));
                console.log((JSON.parse(content.toString()).username));
                res.setHeader('Content-Type', 'text/html');
                res.end(`<h1>${userName.username}<h1> `)

            });
        }
    })
}
server.listen(2000, () => {
    console.log(`WELCOME`)
})