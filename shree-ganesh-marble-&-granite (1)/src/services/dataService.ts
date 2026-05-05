import { apiClient } from './apiClient';

export const ProductService = {
  async getAll() {
    return apiClient.get('/products');
  },
  
  async getById(id: string) {
    return apiClient.get(`/products/${id}`);
  },
  
  async create(productData: any) {
    return apiClient.post('/products', productData);
  },
  
  async delete(id: string) {
    return apiClient.delete(`/products/${id}`);
  }
};

export const OrderService = {
  async create(orderData: any) {
    return apiClient.post('/orders', orderData);
  },

  async getUserOrders() {
    return apiClient.get('/orders/my');
  },

  async delete(orderId: string) {
    return apiClient.delete(`/admin/orders/${orderId}`);
  }
};

export const AdminService = {
  async getOrders() {
    return apiClient.get('/admin/orders');
  },
  
  async updateOrderStatus(orderId: string, updateData: any) {
    return apiClient.patch(`/admin/orders/${orderId}`, updateData);
  },

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async getUsers() {
    return apiClient.get('/admin/users');
  },

  async updateUserRole(userId: string, role: string) {
    return apiClient.patch(`/admin/users/${userId}`, { role });
  },

  async deleteOrder(orderId: string) {
    return apiClient.delete(`/admin/orders/${orderId}`);
  }
};
