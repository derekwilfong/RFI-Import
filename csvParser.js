const fs = require('fs');
const parse = require('csv-parse').parse;
const config = require('./config');

class CSVParser {
  async parseRFIFile(filePath) {
    return new Promise((resolve, reject) => {
      const records = [];
      const errors = [];

      const parser = parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_quotes: true,
        relax_column_count: true,
      });

      parser.on('readable', function () {
        let record;
        while ((record = parser.read()) !== null) {
          records.push(record);
        }
      });

      parser.on('error', (error) => {
        errors.push(error);
      });

      parser.on('end', () => {
        if (errors.length > 0) {
          reject(new Error(`CSV parsing errors: ${errors.join(', ')}`));
        } else {
          resolve(records);
        }
      });

      const stream = fs.createReadStream(filePath);
      stream.pipe(parser);
    });
  }

  validateRecords(records) {
    const validRecords = [];
    const errors = [];

    records.forEach((record, index) => {
      const lineNumber = index + 2; // +2 for header and 0-indexing
      
      // Check required fields
      if (!record.Number || record.Number.trim() === '') {
        errors.push(`Line ${lineNumber}: Missing RFI Number`);
        return;
      }
      
      if (!record.Subject || record.Subject.trim() === '') {
        errors.push(`Line ${lineNumber}: Missing RFI Subject`);
        return;
      }

      validRecords.push({ ...record, lineNumber });
    });

    return { validRecords, errors };
  }
}

module.exports = new CSVParser();
