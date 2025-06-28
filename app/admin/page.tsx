'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

interface Order {
  id: string;
  customerName: string;
  items: any[];
  total: number;
  status: string;
  source: 'square' | 'ubereats';
  createdAt: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [storeStatus, setStoreStatus] = useState<'OPEN' | 'CLOSED' | 'PAUSED'>('OPEN');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const [squareRes, uberEatsRes] = await Promise.all([
        api.square.listCatalog(),
        api.ubereats.getActiveOrders()
      ]);

      const squareData = await squareRes.json();
      const uberEatsData = await uberEatsRes.json();

      // Combine and format orders
      const combinedOrders = [
        ...(squareData.orders || []).map((o: any) => ({ ...o, source: 'square' })),
        ...(uberEatsData.orders || []).map((o: any) => ({ ...o, source: 'ubereats' }))
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setOrders(combinedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setLoading(false);
    }
  };

  const acceptOrder = async (orderId: string, source: string) => {
    try {
      if (source === 'ubereats') {
        await api.ubereats.acceptOrder(orderId, 20);
      } else {
        // Handle Square order acceptance
        // Note: You'll need to add this endpoint to the API
      }
      
      fetchOrders();
    } catch (error) {
      console.error('Failed to accept order:', error);
    }
  };

  const updateStoreStatus = async (newStatus: 'OPEN' | 'CLOSED' | 'PAUSED') => {
    try {
      await api.ubereats.updateStoreStatus(newStatus);
      setStoreStatus(newStatus);
    } catch (error) {
      console.error('Failed to update store status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Store Status:</span>
              <select
                value={storeStatus}
                onChange={(e) => updateStoreStatus(e.target.value as any)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="OPEN">Open</option>
                <option value="PAUSED">Paused</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'active'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600'
                }`}
              >
                Active Orders
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'completed'
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-600'
                }`}
              >
                Completed
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No active orders</div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{order.customerName}</h3>
                          <span className={`px-2 py-1 text-xs rounded ${
                            order.source === 'square' 
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {order.source === 'square' ? 'Square' : 'UberEats'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          Order #{order.id.slice(-6)}
                        </div>
                        <div className="space-y-1">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="text-sm">
                              {item.quantity}x {item.name}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold mb-2">
                          ${order.total.toFixed(2)}
                        </div>
                        {order.status === 'PENDING' && (
                          <button
                            onClick={() => acceptOrder(order.id, order.source)}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                          >
                            Accept Order
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}