
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

// Initial render
renderTxnSteps();
updateTxnControls();
