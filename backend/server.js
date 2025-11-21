
const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Serve static files from /public
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// Shopify Storefront API endpoint and test store
const SHOPIFY_API_URL = 'https://mock.shop/api';

app.get('/api/shopify-products', async (req, res) => {
  const query = `{
    products(first: 5) {
      edges {
        node {
          id
          title
          description
          featuredImage { url }
          priceRange { minVariantPrice { amount currencyCode } }
        }
      }
    }
  }`;
  try {
    const response = await fetch(SHOPIFY_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await response.json();
    if (!data.data || !data.data.products) {
      console.error('Shopify API response error:', data);
      return res.status(500).json({ error: 'Invalid response from Shopify.' });
    }
    const products = data.data.products.edges.map(edge => edge.node);
    res.json({ products });
  } catch (err) {
    console.error('Shopify API fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch products from Shopify.' });
  }
});

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
