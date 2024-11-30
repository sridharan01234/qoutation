// components/AdminDashboard.js
import React from 'react';
import QuickActions from '../components/QuickActions';
import ProductOverview from '../components/ProductOverview';
import CustomerOverview from '../components/CustomerOverview';
import QuotationOverview from '../components/QuotationOverview';

const AdminDashboard = () => {
  return (
<>
<h2>Dashboard</h2>
      <QuickActions />
      <ProductOverview />
      <CustomerOverview />
      <QuotationOverview /></>
  );
};

export default AdminDashboard;
