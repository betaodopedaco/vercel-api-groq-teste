const express = require('express');
const app = express();
const port = 3000;

app.get('/api/hello', (req, res) => {
  res.json({ message: 'API Gorq funcionando!' });
});

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
