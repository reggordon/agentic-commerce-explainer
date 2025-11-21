
fetch('/api/shopify-products')
  .then(res => res.json())
  .then(data => {
    const grid = document.getElementById('shopify-products-grid');
    if (!data.products || data.products.length === 0) {
      grid.innerHTML = '<p>No products found.</p>';
      return;
    }
    grid.innerHTML = '';
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(220px, 1fr))';
    grid.style.gap = '2rem';
    data.products.forEach(product => {
      const div = document.createElement('div');
      div.className = 'shopify-product';
      div.style.border = '1px solid #eee';
      div.style.borderRadius = '8px';
      div.style.background = '#fafcff';
      div.style.padding = '1rem';
      div.style.display = 'flex';
      div.style.flexDirection = 'column';
      div.style.alignItems = 'center';
      div.innerHTML = `
        <img src="${product.featuredImage ? product.featuredImage.url : ''}" alt="${product.title}" style="width:120px;height:120px;object-fit:cover;border-radius:8px;margin-bottom:1rem;" />
        <div class="shopify-product-title" style="font-weight:bold;font-size:1.1em;text-align:center;">${product.title}</div>
        <div class="shopify-product-desc" style="margin:0.5em 0 0.5em 0;color:#555;text-align:center;">${product.description || ''}</div>
        <div class="shopify-product-price" style="color:#007bff;font-size:1.1em;margin-top:0.5em;">${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}</div>
      `;
      grid.appendChild(div);
    });
  })
  .catch(() => {
    document.getElementById('shopify-products-grid').innerHTML = '<p>Error loading products.</p>';
  });
