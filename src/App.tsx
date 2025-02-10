
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Index from '@/pages/Index';
import Orders from '@/pages/Orders';
import OrderDetail from '@/pages/orders/[orderId]';
import Logistics from '@/pages/Logistics';
import ShipperOrders from '@/pages/logistics/ShipperOrders';
import Pharmacy from '@/pages/Pharmacy';
import Products from '@/pages/Products';
import StockCount from '@/pages/StockCount';
import Clients from '@/pages/Clients';
import ClientDetail from '@/pages/clients/[clientId]';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:orderId" element={<OrderDetail />} />
            <Route path="/logistics" element={<Logistics />} />
            <Route path="/logistics/shipper/:shipperId" element={<ShipperOrders />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/products" element={<Products />} />
            <Route path="/stockcount" element={<StockCount />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:clientId" element={<ClientDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DashboardLayout>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;
