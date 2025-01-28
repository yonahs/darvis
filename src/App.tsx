import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Orders from '@/pages/Orders';
import OrderDetail from '@/pages/orders/[orderId]';
import Logistics from '@/pages/Logistics';
import Pharmacy from '@/pages/Pharmacy';
import NotFound from '@/pages/NotFound';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Index />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="/logistics" element={<Logistics />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;