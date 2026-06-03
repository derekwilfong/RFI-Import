# RFI Import to Autodesk Build

Automated RFI (Request for Information) import tool for Autodesk Build from CSV files.

## Features

- 📁 Parse CSV files with RFI data
- 🔐 Secure Autodesk Build API authentication
- 🎯 Interactive project selection
- ✅ Data validation and error handling
- 📊 Detailed import logging and reporting
- 🔄 Batch processing with progress tracking

## Prerequisites

- Node.js 14+ installed
- Autodesk Build API credentials (Client ID & Secret)
- CSV file with RFI data

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/derekwilfong/RFI-Import.git
   cd RFI-Import
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and add your Autodesk credentials:
   ```
   AUTODESK_CLIENT_ID=your_client_id
   AUTODESK_CLIENT_SECRET=your_client_secret
   CSV_FILE_PATH=./rfi_list.csv
   ```

## Usage

1. Place your `rfi_list.csv` file in the project root directory

2. Run the import:
   ```bash
   npm start
   ```

3. Follow the prompts to:
   - Authenticate with Autodesk Build
   - Select the target project
   - Confirm the import

4. Monitor the progress and review the import log

## CSV Format

The CSV file should include the following columns:

| Column | Required | Description |
|--------|----------|-------------|
| Number | Yes | RFI identifier/number |
| Subject | Yes | RFI subject/title |
| Status | No | RFI status (Open, Closed, etc.) |
| Initiated At | No | Date RFI was initiated (MM/DD/YY) |
| Due Date | No | Due date for response (MM/DD/YY) |
| Closed Date | No | Date RFI was closed (MM/DD/YY) |
| RFI Manager | No | Name of RFI manager |
| Responsible Contractor Id | No | Responsible contractor |
| Location Id | No | Location identifier |
| Cost Code | No | Cost code |
| RFI Stage | No | Stage of RFI (e.g., Course of Construction) |
| Schedule Impact | No | Whether RFI impacts schedule (Yes/No) |
| Cost Impact | No | Whether RFI impacts cost (Yes/No) |
| Private | No | Whether RFI is private (true/false) |

## Output

After import completion, the tool generates:

- **Console Report**: Real-time progress and summary statistics
- **import_log.json**: Detailed JSON log with:
  - Success/failure counts
  - List of imported RFIs
  - Error details and line numbers
  - Timestamps

## Configuration

### Environment Variables

- `AUTODESK_CLIENT_ID`: Your Autodesk API client ID
- `AUTODESK_CLIENT_SECRET`: Your Autodesk API client secret
- `AUTODESK_BUILD_API_URL`: Autodesk Build API endpoint (default: https://api.autodesk.com/build/v1)
- `CSV_FILE_PATH`: Path to your CSV file (default: ./rfi_list.csv)
- `DEBUG`: Enable debug logging (true/false)

## Field Mapping

The tool maps CSV fields to Autodesk Build RFI fields via `rfiMapper.js`. Customize the mappings as needed for your specific Autodesk Build configuration.

## Error Handling

The importer includes comprehensive error handling:
- CSV validation errors are logged with line numbers
- API errors are caught and reported
- The import continues even if individual RFIs fail
- All errors are saved to `import_log.json`

## Troubleshooting

### Authentication Failed
- Verify your Autodesk credentials in `.env`
- Ensure credentials have appropriate permissions
- Check that the API base URL is correct

### CSV Parsing Errors
- Verify CSV format matches expected structure
- Check for special characters or encoding issues
- Ensure required columns (Number, Subject) are present

### API Errors During Import
- Check that the selected project ID is valid
- Verify field mappings are compatible with your Autodesk Build instance
- Review detailed error messages in `import_log.json`

## Support

For issues or questions, please refer to:
- Autodesk Build API Documentation
- Project GitHub Issues

## License

ISC
