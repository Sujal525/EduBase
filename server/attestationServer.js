// server/attestationServer.js

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// POST endpoint to receive and verify attestation
app.post('/attest-local', (req, res) => {
  const { address, course, date, signature } = req.body;

  if (!address || !course || !date || !signature) {
    return res.status(400).json({ error: 'Missing fields in attestation.' });
  }

  // Basic validation (real apps should do more verification)
  console.log('Received Attestation:', req.body);

  res.json({ message: '✅ Attestation saved successfully in LocalStorage!' });
});

// Health Check
app.get('/', (req, res) => {
  res.send('Attestation Local Server running on Port 5001 ✅');
});

app.listen(PORT, () => {
  console.log(`🚀 Local Attestation server running at http://localhost:${PORT}`);
});
