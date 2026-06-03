const axios = require('axios');
const config = require('./config');

class AutobuildClient {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async authenticate() {
    try {
      console.log('Authenticating with Autodesk Build API...');
      
      const response = await axios.post(
        config.autodesk.authUrl,
        {
          client_id: config.autodesk.clientId,
          client_secret: config.autodesk.clientSecret,
          grant_type: 'client_credentials',
          scope: 'data:write data:read',
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000;
      console.log('✓ Authentication successful');
      return this.accessToken;
    } catch (error) {
      console.error('Authentication failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async isTokenExpired() {
    return !this.accessToken || Date.now() >= this.tokenExpiry;
  }

  async ensureAuthenticated() {
    if (await this.isTokenExpired()) {
      await this.authenticate();
    }
  }

  async getProjects() {
    try {
      await this.ensureAuthenticated();
      
      const response = await axios.get(
        `${config.autodesk.apiUrl}/projects`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.results || response.data;
    } catch (error) {
      console.error('Failed to fetch projects:', error.response?.data || error.message);
      throw error;
    }
  }

  async createRFI(projectId, rfiData) {
    try {
      await this.ensureAuthenticated();
      
      if (config.debug) {
        console.log('Creating RFI with data:', JSON.stringify(rfiData, null, 2));
      }

      const response = await axios.post(
        `${config.autodesk.apiUrl}/projects/${projectId}/rfis`,
        rfiData,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to create RFI:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateRFI(projectId, rfiId, rfiData) {
    try {
      await this.ensureAuthenticated();
      
      if (config.debug) {
        console.log('Updating RFI with data:', JSON.stringify(rfiData, null, 2));
      }

      const response = await axios.patch(
        `${config.autodesk.apiUrl}/projects/${projectId}/rfis/${rfiId}`,
        rfiData,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to update RFI:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new AutobuildClient();
