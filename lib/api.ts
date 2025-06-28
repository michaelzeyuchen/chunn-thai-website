// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://chunn-thai-api.ondigitalocean.app' 
    : 'http://localhost:3001');

export const api = {
  // Square endpoints
  square: {
    createOrder: (data: any) => 
      fetch(`${API_BASE_URL}/api/square/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }),
    
    getOrder: (orderId: string) =>
      fetch(`${API_BASE_URL}/api/square/orders/${orderId}`),
    
    listCatalog: () =>
      fetch(`${API_BASE_URL}/api/square/catalog/items`),
    
    processPayment: (data: any) =>
      fetch(`${API_BASE_URL}/api/square/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
  },

  // UberEats endpoints
  ubereats: {
    getActiveOrders: () =>
      fetch(`${API_BASE_URL}/api/ubereats/orders/active`),
    
    acceptOrder: (orderId: string, prepTime: number) =>
      fetch(`${API_BASE_URL}/api/ubereats/orders/${orderId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prepTime })
      }),
    
    updateStoreStatus: (status: string) =>
      fetch(`${API_BASE_URL}/api/ubereats/store/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
  }
};