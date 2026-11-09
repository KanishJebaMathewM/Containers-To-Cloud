const http = require('http');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === 'GET' && url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CloudLab</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 3rem;
      background-color: #f7f9fa;
      color: #333;
    }
    .card {
      background: #ffffff;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      max-width: 600px;
      margin: 0 auto;
    }
    h1 {
      margin-top: 0;
      color: #0f172a;
    }
    p {
      line-height: 1.6;
    }
    code {
      background-color: #e2e8f0;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.95rem;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Welcome to CloudLab</h1>
    <p>CloudLab is a minimal educational application designed for learning Docker and AWS deployment fundamentals.</p>
    <p>Available endpoints:</p>
    <ul>
      <li><code>GET /</code> - Welcome page</li>
      <li><code>GET /health</code> - Health check endpoint (JSON)</li>
    </ul>
  </div>
</body>
</html>`);
  } else if (method === 'GET' && url === '/health') {
    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime())
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(healthData, null, 2));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`CloudLab server is listening on http://${HOST}:${PORT}`);
});
