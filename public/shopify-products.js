fetch('/api/shopify-products')
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('shopify-products-list');
    if (!data.products || data.products.length === 0) {
      list.innerHTML = '<p>No products found.</p>';
      return;
    }
    list.innerHTML = '';
    data.products.forEach(product => {
      const div = document.createElement('div');
      div.className = 'shopify-product';
      div.innerHTML = `
        <img src="${product.featuredImage ? product.featuredImage.url : ''}" alt="${product.title}" />
        <div class="shopify-product-details">
          <div class="shopify-product-title">${product.title}</div>
          <div class="shopify-product-desc">${product.description || ''}</div>
          <div class="shopify-product-price">${product.priceRange.minVariantPrice.amount} ${product.priceRange.minVariantPrice.currencyCode}</div>
        </div>
      `;
      list.appendChild(div);
    });
  })
  .catch(() => {
    document.getElementById('shopify-products-list').innerHTML = '<p>Error loading products.</p>';
  });
