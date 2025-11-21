

let steps = [];
let currentStep = 0;
let autoDemoActive = true;

function renderSteps() {
  const flow = document.getElementById('process-flow');
  flow.innerHTML = '';
  steps.forEach((step, idx) => {
    const div = document.createElement('div');
    div.className = 'step' + (idx === currentStep ? ' active' : '');
    div.innerHTML = `
      <div class="name">${step.name}</div>
      <div class="agent">Agent: ${step.agent}</div>
      <div class="status">Status: ${step.status}</div>
      <div class="log">${step.log}</div>
    `;
    if (!autoDemoActive) {
      div.onclick = () => showStepDetails(idx);
    }
    flow.appendChild(div);
  });
}

function showStepDetails(idx) {
  currentStep = idx;
  renderSteps();
  const details = document.getElementById('step-details');
  const step = steps[idx];
  details.innerHTML = `
    <h3>${step.name}</h3>
    <p><b>Agent:</b> ${step.agent}</p>
    <p><b>Status:</b> ${step.status}</p>
    <p><b>Log:</b> ${step.log}</p>
    <p>${getStepExplanation(step)}</p>
    ${autoDemoActive ? '<p style="color:#007bff"><b>Demo:</b> This step is being highlighted automatically. Manual controls will be enabled after the demo.</p>' : ''}
  `;
  details.style.display = 'block';
  updateControls();
}

function getStepExplanation(step) {
  switch (step.agent) {
    case 'Recommender':
      return 'The Recommender agent analyzes your preferences and suggests products you might like.';
    case 'Cart Manager':
      return 'The Cart Manager reviews your selections and ensures your cart is optimized.';
    case 'Negotiator':
      return 'The Negotiator agent works to get you the best possible price.';
    case 'Payment Processor':
      return 'The Payment Processor securely handles your payment information.';
    case 'Fulfillment Bot':
      return 'The Fulfillment Bot manages shipping and delivery of your order.';
    default:
      return '';
  }
}

function updateControls() {
  document.getElementById('prev-step').disabled = autoDemoActive || currentStep === 0;
  document.getElementById('next-step').disabled = autoDemoActive || currentStep === steps.length - 1;
}

document.getElementById('prev-step').onclick = () => {
  if (!autoDemoActive && currentStep > 0) {
    showStepDetails(currentStep - 1);
  }
};
document.getElementById('next-step').onclick = () => {
  if (!autoDemoActive && currentStep < steps.length - 1) {
    showStepDetails(currentStep + 1);
  }
};

function runAutoDemo() {
  let idx = 0;
  function next() {
    showStepDetails(idx);
    idx++;
    if (idx < steps.length) {
      setTimeout(next, 1800);
    } else {
      autoDemoActive = false;
      showStepDetails(currentStep);
    }
  }
  next();
}

fetch('/api/process')
  .then(res => res.json())
  .then(data => {
    steps = data.steps;
    renderSteps();
    runAutoDemo();
  });
