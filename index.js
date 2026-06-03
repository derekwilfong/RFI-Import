const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');
const config = require('./config');
const autobuildClient = require('./autobuildClient');
const csvParser = require('./csvParser');
const rfiMapper = require('./rfiMapper');
const projectSelector = require('./projectSelector');

class RFIImporter {
  constructor() {
    this.importLog = {
      startTime: new Date(),
      totalRecords: 0,
      successCount: 0,
      failureCount: 0,
      errors: [],
      results: [],
    };
  }

  async run() {
    try {
      console.log('\n╔════════════════════════════════════════╗');
      console.log('║   RFI Import to Autodesk Build        ║');
      console.log('╚════════════════════════════════════════╝\n');

      // Authenticate
      await autobuildClient.authenticate();

      // Fetch and select project
      console.log('Fetching available projects...');
      const projects = await autobuildClient.getProjects();
      const selectedProject = await projectSelector.selectProject(projects);

      if (!selectedProject) {
        console.log('Import cancelled.');
        process.exit(0);
      }

      const projectId = selectedProject.id;

      // Parse CSV
      console.log('Parsing CSV file...');
      if (!fs.existsSync(config.csvFilePath)) {
        throw new Error(`CSV file not found: ${config.csvFilePath}`);
      }

      const records = await csvParser.parseRFIFile(config.csvFilePath);
      console.log(`✓ Found ${records.length} RFI records\n`);

      // Validate records
      const { validRecords, errors: validationErrors } = csvParser.validateRecords(records);
      this.importLog.totalRecords = validRecords.length;

      if (validationErrors.length > 0) {
        console.log('⚠ Validation warnings:');
        validationErrors.forEach(error => console.log(`  - ${error}`));
        console.log('');
      }

      // Import RFIs
      console.log(`Starting import of ${validRecords.length} RFIs...\n`);

      for (let i = 0; i < validRecords.length; i++) {
        const record = validRecords[i];
        try {
          const rfiData = rfiMapper.mapCSVtoRFI(record);
          
          if (config.debug) {
            console.log(`[${i + 1}/${validRecords.length}] Importing RFI #${rfiData.number}...`);
          }

          const result = await autobuildClient.createRFI(projectId, rfiData);
          
          this.importLog.successCount++;
          this.importLog.results.push({
            rfiNumber: rfiData.number,
            subject: rfiData.subject,
            status: 'success',
            autobuildId: result.id || 'N/A',
          });
          
          console.log(`✓ [${i + 1}/${validRecords.length}] RFI #${rfiData.number} imported successfully`);
        } catch (error) {
          this.importLog.failureCount++;
          const errorMessage = error.response?.data?.message || error.message;
          this.importLog.errors.push({
            rfiNumber: record.Number,
            error: errorMessage,
            lineNumber: record.lineNumber,
          });
          this.importLog.results.push({
            rfiNumber: record.Number,
            subject: record.Subject,
            status: 'failed',
            error: errorMessage,
          });
          
          console.log(`✗ [${i + 1}/${validRecords.length}] RFI #${record.Number} failed: ${errorMessage}`);
        }
      }

      // Summary
      this.printSummary();
      this.saveImportLog();
    } catch (error) {
      console.error('\n❌ Fatal error:', error.message);
      process.exit(1);
    }
  }

  printSummary() {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║          Import Complete              ║');
    console.log('╚════════════════════════════════════════╝\n');
    console.log(`Total Records Processed: ${this.importLog.totalRecords}`);
    console.log(`✓ Successful: ${this.importLog.successCount}`);
    console.log(`✗ Failed: ${this.importLog.failureCount}`);
    console.log(`Success Rate: ${((this.importLog.successCount / this.importLog.totalRecords) * 100).toFixed(2)}%`);

    if (this.importLog.errors.length > 0) {
      console.log('\n❌ Errors:');
      this.importLog.errors.forEach(err => {
        console.log(`  - RFI #${err.rfiNumber} (Line ${err.lineNumber}): ${err.error}`);
      });
    }

    console.log('');
  }

  saveImportLog() {
    this.importLog.endTime = new Date();
    const logPath = path.join(process.cwd(), 'import_log.json');
    fs.writeFileSync(logPath, JSON.stringify(this.importLog, null, 2));
    console.log(`Import log saved to: ${logPath}\n`);
  }
}

// Run importer
if (require.main === module) {
  const importer = new RFIImporter();
  importer.run();
}

module.exports = RFIImporter;
