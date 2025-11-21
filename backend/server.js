const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Serve static files from /public
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// API endpoint for agentic process steps
const steps = [
  { id: 1, name: 'Product Selection', agent: 'Recommender', status: 'completed', log: 'Agent recommended products.' },
  { id: 2, name: 'Cart Review', agent: 'Cart Manager', status: 'completed', log: 'Agent reviewed cart.' },
  { id: 3, name: 'Negotiation', agent: 'Negotiator', status: 'pending', log: 'Agent negotiating best price.' },
  { id: 4, name: 'Payment', agent: 'Payment Processor', status: 'pending', log: 'Awaiting payment.' },
  { id: 5, name: 'Fulfillment', agent: 'Fulfillment Bot', status: 'pending', log: 'Order will be shipped.' }
];

app.get('/api/process', (req, res) => {
  res.json({ steps });
});

// Fallback: serve index.html for any unmatched route
app.use((req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Agentic Commerce backend running on port ${PORT}`);
});
