
function getTxnInputs() {
  return {
    product: document.getElementById('input-product').value,
    payment: document.getElementById('input-payment').value,
    shipping: document.getElementById('input-shipping').value
  };
}

function buildTxnSteps(inputs) {
  return [
    {
      title: 'Product Selection',
      desc: 'Recommender agent suggests products based on your preferences.',
      action: `Select "${inputs.product}"`,
      result: `${inputs.product} added to cart.`
    },
    {
      title: 'Cart Review',
      desc: 'Cart Manager reviews your cart and suggests optimizations.',
      action: 'Remove duplicate item',
      result: `Cart updated: 1 ${inputs.product}.`
    },
    {
      title: 'Negotiation',
      desc: 'Negotiator agent finds the best price for you.',
      action: 'Negotiate with seller',
      result: `Price reduced from $99 to $89.`
    },
    {
      title: 'Payment',
      desc: 'Payment Processor securely handles your payment.',
      action: `Pay with ${inputs.payment}`,
      result: 'Payment successful.'
    },
    {
      title: 'Fulfillment',
      desc: 'Fulfillment Bot arranges shipping and delivery.',
      action: `Ship to ${inputs.shipping}`,
      result: 'Order shipped. Tracking #ABC123.'
    }
  ];
}

let shopifyProducts = [];
let txnSteps = buildTxnSteps(getTxnInputs());

let txnCurrent = 0;

function renderTxnSteps() {
  const stepsDiv = document.getElementById('txn-steps');
  stepsDiv.innerHTML = '';
  txnSteps.forEach((step, idx) => {
    const div = document.createElement('div');
    div.className = 'txn-step' + (idx === txnCurrent ? ' active' : '');
    div.innerHTML = `
      <div class="title">${step.title}</div>
      <div class="desc">${step.desc}</div>
      <div class="action"><b>Action:</b> ${step.action}</div>
      ${idx < txnCurrent ? `<div class="result"><b>Result:</b> ${step.result}</div>` : ''}
    `;
    stepsDiv.appendChild(div);
  });
}

function updateTxnControls() {
  document.getElementById('txn-prev').disabled = txnCurrent === 0;
  document.getElementById('txn-next').disabled = txnCurrent === txnSteps.length - 1;
}

function showTxnSummary() {
  const inputs = getTxnInputs();
  const summaryDiv = document.getElementById('txn-summary');
  summaryDiv.innerHTML = `
    <h2>Transaction Complete!</h2>
    <ul>
      <li><b>Product:</b> ${inputs.product}</li>
      <li><b>Final Price:</b> $89</li>
      <li><b>Payment:</b> ${inputs.payment}</li>
      <li><b>Shipping:</b> ${inputs.shipping}</li>
      <li><b>Tracking #:</b> ABC123</li>
    </ul>
    <p>All steps were handled by autonomous agents for a seamless experience.</p>
  `;
  summaryDiv.style.display = 'block';
}

document.getElementById('txn-prev').onclick = () => {
  if (txnCurrent > 0) {
    txnCurrent--;
    renderTxnSteps();
    updateTxnControls();
    document.getElementById('txn-summary').style.display = 'none';
  }
};

document.getElementById('txn-next').onclick = () => {
  if (txnCurrent < txnSteps.length - 1) {
    txnCurrent++;
    renderTxnSteps();
    updateTxnControls();
    if (txnCurrent === txnSteps.length - 1) {
      showTxnSummary();
    }
  }
};


// Rebuild flow when user changes input
['input-product', 'input-payment', 'input-shipping'].forEach(id => {
  document.getElementById(id).addEventListener('change', () => {
    txnSteps = buildTxnSteps(getTxnInputs());
    txnCurrent = 0;
    renderTxnSteps();
    updateTxnControls();
    document.getElementById('txn-summary').style.display = 'none';
  });
});


// Fetch Shopify products and populate product select
fetch('/api/shopify-products')
  .then(res => res.json())
  .then(data => {
    shopifyProducts = data.products || [];
    updateProductSelect(shopifyProducts);
    txnSteps = buildTxnSteps(getTxnInputs());
    txnCurrent = 0;
    renderTxnSteps();
    updateTxnControls();
  })
  .catch(() => {
    updateProductSelect([]);
  });

function updateProductSelect(products) {
  const select = document.getElementById('input-product');
  select.innerHTML = '';
  if (!products || products.length === 0) {
    select.innerHTML = '<option value="">No products found</option>';
    return;
  }
  products.forEach(product => {
    const opt = document.createElement('option');
    opt.value = product.title;
    opt.textContent = product.title + ' - ' + product.priceRange.minVariantPrice.amount + ' ' + product.priceRange.minVariantPrice.currencyCode;
    select.appendChild(opt);
  });
}

// Agent selection logic based on criteria
function agentSelectProduct(criteria) {
  if (!shopifyProducts.length) return '';
  criteria = criteria.toLowerCase();
  // Support multiple price filter phrases
  const priceRegexes = [
    /under \$?(\d+)/,
    /less than \$?(\d+)/,
    /below \$?(\d+)/
  ];
  let maxPrice = null;
  for (const re of priceRegexes) {
    const m = criteria.match(re);
    if (m) {
      maxPrice = parseFloat(m[1]);
      break;
    }
  }
  let filtered = shopifyProducts.filter(p => {
    let match = true;
    if (criteria.includes('hoodie')) match = match && p.title.toLowerCase().includes('hoodie');
    if (criteria.includes('t-shirt')) match = match && p.title.toLowerCase().includes('t-shirt');
    if (criteria.includes('sweatpants')) match = match && p.title.toLowerCase().includes('sweatpants');
    if (maxPrice !== null) {
      match = match && parseFloat(p.priceRange.minVariantPrice.amount) <= maxPrice;
    }
    return match;
  });
  // If multiple, pick cheapest
  if (filtered.length) {
    filtered.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
    return filtered[0].title;
  }
  // Fallback: pick cheapest overall
  shopifyProducts.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
  return shopifyProducts[0].title;
}

document.getElementById('criteria-update-btn').addEventListener('click', () => {
  const criteria = document.getElementById('input-criteria').value;
  const selected = agentSelectProduct(criteria);
  document.getElementById('input-product').value = selected;
  document.getElementById('input-product').title = 'Agent selected this product. You can change it.';
  txnSteps = buildTxnSteps(getTxnInputs());
  txnCurrent = 0;
  renderTxnSteps();
  updateTxnControls();
  document.getElementById('txn-summary').style.display = 'none';
});

// Allow manual override: update selected product when dropdown changes
document.getElementById('input-product').addEventListener('change', function(e) {
  document.getElementById('input-product').title = 'You manually selected this product.';
  txnSteps = buildTxnSteps(getTxnInputs());
  txnCurrent = 0;
  renderTxnSteps();
  updateTxnControls();
  document.getElementById('txn-summary').style.display = 'none';
});

// Initial render (will be replaced by fetch above)
renderTxnSteps();
updateTxnControls();
