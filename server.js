const http = require('http');

const PORT = process.env.PORT ?? 3000;
let STATUS = 'SERVER STARTED'


const server = http.createServer(function(req, res){
  let body = `
    <h1>Get me some matcha soda ASAP<h1>
    <h2>BOT STATUS: ${STATUS}</h2>
  `

  let url = req.url;
  if(url === '/'){
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(body);
    res.end();
  }else{
    res.writeHead(404).end();
  }
});

setStatus = function(status){
  STATUS = status;
}

server.listen(PORT || 3000, () => {
  console.log(`Server listening on port ${PORT}`);
})

module.exports = { setStatus };
