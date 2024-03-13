const http = require('http');
const url = require('url');
const port = process.env.PORT || 3000;
const DBconnection = require('./scripts/dbconnection');
const messages = require('./lang/en/user');
const endpoint = '/api/query/';

const msg = new messages();

const server = http.createServer(async (req, res) => {
  const db = new DBconnection();
  const connection = await db.connect();
  let output = '';
  if (req.method === 'GET') {
    const parsedUrl = url.parse(req.url, true);
    const sql = parsedUrl.query.sql.replaceAll('%', ' ');
    const sqlStatement = sql.substring(0, 6).toLowerCase();
    let statusCode = 200;
    
    if (sql.substring(0, 6).toLowerCase() === 'select') {
      try {
        const [row, fields] = await connection.query(sql);
        output = JSON.stringify(row);
      } catch (error) {
        statusCode = 400;
        output = msg.invalid_query();
      }
      //output = 'Query executed successfully';
    } else {
      statusCode = 403;
      output = msg.forbidden_query_get();
    }
    res.writeHead(statusCode, {'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',});
    res.write(output);
    res.end();
  }
  else if (req.method === 'POST' && req.url === endpoint) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      const parsedBody = JSON.parse(body);
      const sql = parsedBody.sql;
      if (sql.substring(0, 6).toLowerCase() === 'select') {
        try {
          const [row, fields] = await connection.query(sql);
          res.writeHead(200, {'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',});
          res.end(JSON.stringify(row));
        } catch (error) {
          res.writeHead(400, {'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',});
          res.end(msg.invalid_query());
        }
      } else if (sql.substring(0, 6).toLowerCase() === 'insert'){
        try {
          const [result, fields] = await connection.query(sql);
          res.writeHead(201, {'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',});
          res.end(msg.inserted(result.affectedRows));
        } catch (error) {
          res.writeHead(400, {'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',});
          res.end(msg.invalid_query());
        }

      } else {
        res.writeHead(403, {'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',});
        res.end(msg.forbidden_query_post());
      }
    });
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',});
    res.end(msg.error());
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});