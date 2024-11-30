// components/ManageProducts.js
import React, { useEffect, useState } from 'react';
import ProductListTable from '../components/ProductListTable';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from API
  }, []);

  return (
    <div>
      <h2>Manage Products</h2>
      <ProductListTable products={products} />
      {/* UploadCSVButton component */}
    </div>
  );
};

export default ManageProducts;
