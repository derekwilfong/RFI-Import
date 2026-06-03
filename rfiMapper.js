const rfiMapper = {
  /**
   * Map CSV row to Autodesk Build RFI format
   * Customize field mappings based on your Autodesk Build schema
   */
  mapCSVtoRFI(csvRow) {
    const rfiData = {
      // Required fields
      number: csvRow.Number?.trim() || '',
      subject: csvRow.Subject?.trim() || '',
      status: this.mapStatus(csvRow.Status?.trim()),
      
      // Optional fields
      ...(csvRow['Initiated At'] && {
        initiatedAt: this.parseDate(csvRow['Initiated At']),
      }),
      ...(csvRow['Due Date'] && {
        dueDate: this.parseDate(csvRow['Due Date']),
      }),
      ...(csvRow['Closed Date'] && csvRow['Closed Date'] && {
        closedDate: this.parseDate(csvRow['Closed Date']),
      }),
      ...(csvRow['RFI Manager'] && {
        manager: csvRow['RFI Manager'].trim(),
      }),
      ...(csvRow['Responsible Contractor Id'] && {
        responsibleContractor: csvRow['Responsible Contractor Id'].trim(),
      }),
      ...(csvRow['Location Id'] && csvRow['Location Id'] && {
        location: csvRow['Location Id'].trim(),
      }),
      ...(csvRow['Cost Code'] && csvRow['Cost Code'] && {
        costCode: csvRow['Cost Code'].trim(),
      }),
      ...(csvRow['RFI Stage'] && {
        stage: csvRow['RFI Stage'].trim(),
      }),
      ...(csvRow['Schedule Impact'] && {
        scheduleImpact: csvRow['Schedule Impact'] === 'Yes',
      }),
      ...(csvRow['Cost Impact'] && {
        costImpact: csvRow['Cost Impact'] === 'Yes',
      }),
      ...(csvRow['Private'] !== undefined && {
        isPrivate: csvRow['Private'] === 'true' || csvRow['Private'] === '1',
      }),
    };

    return rfiData;
  },

  mapStatus(status) {
    const statusMap = {
      'open': 'OPEN',
      'closed': 'CLOSED',
      'pending': 'PENDING',
      'in progress': 'IN_PROGRESS',
    };

    return statusMap[status?.toLowerCase()] || status || 'OPEN';
  },

  parseDate(dateString) {
    if (!dateString || dateString.trim() === '') {
      return null;
    }

    // Handle MM/DD/YY format
    const parts = dateString.trim().split('/');
    if (parts.length === 3) {
      const month = parts[0].padStart(2, '0');
      const day = parts[1].padStart(2, '0');
      let year = parts[2];
      
      // Convert 2-digit year to 4-digit
      if (year.length === 2) {
        year = parseInt(year) > 50 ? '19' + year : '20' + year;
      }
      
      return `${year}-${month}-${day}`;
    }

    return dateString;
  },

  parseAssignees(assigneeString) {
    if (!assigneeString || assigneeString.trim() === '') {
      return [];
    }

    return assigneeString
      .split(';')
      .map(name => name.trim())
      .filter(name => name.length > 0);
  },

  parseDistribution(distributionString) {
    if (!distributionString || distributionString.trim() === '') {
      return [];
    }

    return distributionString
      .split(',')
      .map(name => name.trim())
      .filter(name => name.length > 0);
  },
};

module.exports = rfiMapper;
