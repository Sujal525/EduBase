// server/zkpServer.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5002;

app.use(cors());
app.use(bodyParser.json());

// POST endpoint to generate dummy zk-proof
app.post('/generate-proof', (req, res) => {
  const { studentWallet, score } = req.body;

  if (!studentWallet || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // Fake proof (Normally you would generate a real ZK proof)
  const fakeProof = {
    wallet: studentWallet,
    scoreHash: `hash_${Buffer.from(score.toString()).toString('base64')}`, // simple mock
    timestamp: new Date().toISOString(),
  };

  res.json({ proof: fakeProof });
});

app.listen(PORT, () => {
  console.log(`✅ ZKP server running at http://localhost:${PORT}`);
});
