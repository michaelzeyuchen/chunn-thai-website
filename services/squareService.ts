const { Client, Environment } = require('square');

interface SquareConfig {
  accessToken: string;
  environment: 'sandbox' | 'production';
  applicationId?: string;
}

export class SquareService {
  private client: any; // Using any for now since SquareClient type is not available
  private config: SquareConfig;

  constructor(config: SquareConfig) {
    this.config = config;
    const environment = config.environment === 'sandbox' ? Environment.Sandbox : Environment.Production;
    console.log('Initializing Square client with:', {
      environment: environment,
      accessTokenLength: config.accessToken.length,
      applicationId: config.applicationId
    });
    this.client = new Client({
      accessToken: config.accessToken,
      environment: environment,
    });
  }

  // ========== CATALOG MANAGEMENT ==========
  
  async listCatalogItems() {
    try {
      const response = await this.client.catalogApi.listCatalog(
        undefined, // cursor
        'ITEM' // types - should be a string, not an array
      );
      return response.result;
    } catch (error) {
      console.error('Error listing catalog items:', error);
      throw error;
    }
  }

  async getCatalogItem(itemId: string) {
    try {
      const response = await this.client.catalogApi.retrieveCatalogObject(itemId);
      return response.result;
    } catch (error) {
      console.error('Error getting catalog item:', error);
      throw error;
    }
  }

  async createCatalogItem(name: string, description: string, priceMoney: { amount: bigint, currency: string }) {
    try {
      const response = await this.client.catalogApi.upsertCatalogObject({
        idempotencyKey: `${Date.now()}-${Math.random()}`,
        object: {
          type: 'ITEM',
          id: `#${name.replace(/\s+/g, '_').toUpperCase()}`,
          itemData: {
            name: name,
            description: description,
            variations: [
              {
                type: 'ITEM_VARIATION',
                id: `#${name.replace(/\s+/g, '_').toUpperCase()}_REGULAR`,
                itemVariationData: {
                  itemId: `#${name.replace(/\s+/g, '_').toUpperCase()}`,
                  name: 'Regular',
                  pricingType: 'FIXED_PRICING',
                  priceMoney: priceMoney
                }
              }
            ]
          }
        }
      });
      return response.result;
    } catch (error) {
      console.error('Error creating catalog item:', error);
      throw error;
    }
  }

  // ========== CUSTOMER MANAGEMENT ==========
  
  async listCustomers() {
    try {
      const response = await this.client.customersApi.listCustomers();
      return response.result;
    } catch (error) {
      console.error('Error listing customers:', error);
      throw error;
    }
  }

  async createCustomer(email: string, firstName?: string, lastName?: string, phoneNumber?: string) {
    try {
      const response = await this.client.customersApi.createCustomer({
        emailAddress: email,
        givenName: firstName,
        familyName: lastName,
        phoneNumber: phoneNumber
      });
      return response.result;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  async searchCustomers(query: string) {
    try {
      const response = await this.client.customersApi.searchCustomers({
        filter: {
          emailAddress: {
            fuzzy: query
          }
        }
      });
      return response.result;
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  }

  // ========== LOCATION MANAGEMENT ==========
  
  async listLocations() {
    try {
      const response = await this.client.locationsApi.listLocations();
      return response.result;
    } catch (error) {
      console.error('Error listing locations:', error);
      throw error;
    }
  }

  // ========== ORDER MANAGEMENT ==========
  
  async createOrder(locationId: string, lineItems: any[]) {
    try {
      const response = await this.client.ordersApi.createOrder({
        order: {
          locationId: locationId,
          lineItems: lineItems,
          state: 'DRAFT'
        }
      });
      return response.result;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async listOrders(locationId: string) {
    try {
      const response = await this.client.ordersApi.searchOrders({
        locationIds: [locationId],
        filter: {
          stateFilter: {
            states: ['OPEN', 'COMPLETED']
          }
        }
      });
      return response.result;
    } catch (error) {
      console.error('Error listing orders:', error);
      throw error;
    }
  }

  // ========== PAYMENT PROCESSING ==========
  
  async createPayment(amount: bigint, currency: string, sourceId: string, locationId?: string) {
    try {
      const response = await this.client.paymentsApi.createPayment({
        sourceId: sourceId,
        idempotencyKey: `${Date.now()}-${Math.random()}`,
        amountMoney: {
          amount: amount,
          currency: currency
        },
        locationId: locationId
      });
      return response.result;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  async listPayments(locationId?: string) {
    try {
      const response = await this.client.paymentsApi.listPayments(
        undefined, // beginTime
        undefined, // endTime
        undefined, // sortOrder
        undefined, // cursor
        locationId
      );
      return response.result;
    } catch (error) {
      console.error('Error listing payments:', error);
      throw error;
    }
  }

  // ========== INVENTORY MANAGEMENT ==========
  
  async getInventoryCounts(catalogObjectIds: string[], locationIds: string[]) {
    try {
      const response = await this.client.inventoryApi.batchRetrieveInventoryCounts({
        catalogObjectIds: catalogObjectIds,
        locationIds: locationIds
      });
      return response.result;
    } catch (error) {
      console.error('Error getting inventory counts:', error);
      throw error;
    }
  }

  // ========== TEAM MANAGEMENT ==========
  
  async listTeamMembers(locationId?: string) {
    try {
      const response = await this.client.teamApi.searchTeamMembers({
        query: {
          filter: {
            locationIds: locationId ? [locationId] : undefined,
            status: 'ACTIVE'
          }
        }
      });
      return response.result;
    } catch (error) {
      console.error('Error listing team members:', error);
      throw error;
    }
  }
}

// Export a singleton instance with the configuration
export const squareService = new SquareService({
  accessToken: 'EAAAl_7UMGyKRqZ0wFvQPVW4Px_IkueOrkzOZex_SBGxCVEDmAswpEWR7HPperWN',
  environment: 'production',
  applicationId: 'sq0idp-cXnLRAo5Tt30jVRDnn_jog'
});