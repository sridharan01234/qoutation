// components/CustomerCatalog.js
import React, { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import CatalogGrid from '../components/CatalogGrid';
import UserProfileDropdown from '../components/UserProfileDropdown';

const CustomerCatalog = ({ products }) => {
  return (
    <div>
      <h1>Product Catalog</h1>
      <SearchBar />
      <CatalogGrid products={products} />
      <UserProfileDropdown />
    </div>
  );
};

export default CustomerCatalog;
