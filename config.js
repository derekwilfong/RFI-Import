require('dotenv').config();

const config = {
  autodesk: {
    clientId: process.env.AUTODESK_CLIENT_ID,
    clientSecret: process.env.AUTODESK_CLIENT_SECRET,
    apiUrl: process.env.AUTODESK_BUILD_API_URL || 'https://api.autodesk.com/build/v1',
    authUrl: 'https://developer.api.autodesk.com/authentication/v2/token',
  },
  csvFilePath: process.env.CSV_FILE_PATH || './rfi_list.csv',
  debug: process.env.DEBUG === 'true',
};

// Validate required credentials
if (!config.autodesk.clientId || !config.autodesk.clientSecret) {
  console.error('ERROR: Missing Autodesk credentials in .env file');
  console.error('Please set AUTODESK_CLIENT_ID and AUTODESK_CLIENT_SECRET');
  process.exit(1);
}

module.exports = config;
