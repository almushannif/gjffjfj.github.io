import { PluginFile } from './pluginTypes';

export const PLUGIN_NOTARY_GAS_FILES: PluginFile[] = [
  // =========================================================================
  // 1. GAS: Code.gs (MASTER REQUEST ROUTER & HANDLER)
  // =========================================================================
  {
    path: 'google-apps-script/Code.gs',
    name: 'Code.gs',
    category: 'GAS',
    description: 'Google Apps Script Master Web App: Handles doGet and doPost with HMAC-SHA256 signature verification, replay protection, and action whitelist.',
    content: `/**
 * ============================================================================
 * GOOGLE APPS SCRIPT MIDDLEWARE - NOTARIS & PPAT LALU DAUD NURJADI, M.Kn.
 * File: Code.gs
 * Version: 2.6.0
 * ============================================================================
 */

function doGet(e) {
  return Utils.jsonResponse({
    success: true,
    service: 'Lalu Daud Notary & PPAT System - Google Apps Script Middleware',
    version: '2.6.0',
    status: 'ACTIVE',
    timestamp: new Date().toISOString()
  });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return Utils.errorResponse('EMPTY_REQUEST', 'Request payload kosong.', 400);
    }

    var request = JSON.parse(e.postData.contents);
    var action    = request.action;
    var timestamp = request.timestamp;
    var nonce     = request.nonce;
    var signature = request.signature;
    var data      = request.data || {};
    var corrId    = request.correlation_id || ('LDN-REQ-' + new Date().getTime());

    // 1. Security Check: Validate Timestamp (5-Min Tolerance)
    if (!Security.isTimestampValid(timestamp)) {
      return Utils.errorResponse('REQUEST_EXPIRED', 'Permintaan kedaluwarsa (Timestamp tolerance > 5 menit).', 403);
    }

    // 2. Security Check: Nonce Replay Protection
    if (!Security.verifyAndConsumeNonce(nonce, action)) {
      return Utils.errorResponse('REPLAY_DETECTED', 'Permintaan tidak valid (Nonce sudah pernah digunakan).', 403);
    }

    // 3. Security Check: HMAC-SHA256 Signature Verification
    if (!Security.verifyHmac(data, action, timestamp, nonce, signature)) {
      return Utils.errorResponse('INVALID_SIGNATURE', 'Tanda tangan digital HMAC-SHA256 tidak valid.', 403);
    }

    // 4. Action Whitelist & Router
    var result = null;
    switch (action) {
      case 'healthCheck':
        result = { status: 'OK', ping: 'pong', verified_at: new Date().toISOString() };
        break;

      case 'create_case':
        result = Cases.createCase(data);
        break;

      case 'update_case_status':
        result = Cases.updateCaseStatus(data.case_id, data.status);
        break;

      case 'upload_document':
        result = DriveService.uploadDocument(data);
        break;

      case 'get_document_stream':
        result = DriveService.getDocumentStream(data.document_id, data.gas_drive_ref);
        break;

      case 'record_audit':
        result = SheetsService.appendRow(Config.getSheets().AUDIT_LOG, data);
        break;

      default:
        return Utils.errorResponse('INVALID_ACTION', 'Action tidak terdaftar dalam whitelist.', 400);
    }

    // Write Audit Log
    SheetsService.appendAuditLog(corrId, action, 'SUCCESS');

    return Utils.jsonResponse({
      success: true,
      correlation_id: corrId,
      data: result
    });

  } catch (err) {
    return Utils.errorResponse('SERVER_ERROR', 'Terjadi kesalahan sistem internal pada middleware.', 500);
  }
}
`
  },

  // =========================================================================
  // 2. GAS: Config.gs (PROPERTIES SERVICE CREDENTIAL ACCESS)
  // =========================================================================
  {
    path: 'google-apps-script/Config.gs',
    name: 'Config.gs',
    category: 'GAS',
    description: 'Centralized configuration using PropertiesService. Zero hardcoded secrets in source files.',
    content: `/**
 * Google Apps Script Configuration & PropertiesService
 * File: Config.gs
 */

var Config = {
  getSpreadsheetId: function() {
    var id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (!id) {
      throw new Error('SPREADSHEET_ID belum dikonfigurasi di Script Properties.');
    }
    return id;
  },

  getDriveRootFolderId: function() {
    var id = PropertiesService.getScriptProperties().getProperty('DRIVE_ROOT_FOLDER_ID');
    if (!id) {
      // Auto-create or detect root folder if not set
      var folders = DriveApp.getFoldersByName('NOTARIS LALU DAUD');
      if (folders.hasNext()) {
        id = folders.next().getId();
      } else {
        id = DriveApp.createFolder('NOTARIS LALU DAUD').getId();
      }
      PropertiesService.getScriptProperties().setProperty('DRIVE_ROOT_FOLDER_ID', id);
    }
    return id;
  },

  getHmacSecret: function() {
    var sec = PropertiesService.getScriptProperties().getProperty('HMAC_SECRET');
    if (!sec) {
      throw new Error('HMAC_SECRET belum dikonfigurasi di Script Properties.');
    }
    return sec;
  },

  getSheets: function() {
    return {
      CLIENTS: 'CLIENTS',
      CASES: 'CASES',
      SERVICES: 'SERVICES',
      DOCUMENTS: 'DOCUMENTS',
      PAYMENTS: 'PAYMENTS',
      ACTIVITIES: 'ACTIVITIES',
      USERS: 'USERS',
      SETTINGS: 'SETTINGS',
      AUDIT_LOG: 'AUDIT_LOG'
    };
  }
};
`
  },

  // =========================================================================
  // 3. GAS: Security.gs (HMAC-SHA256, NONCE, TIMESTAMP TOLERANCE)
  // =========================================================================
  {
    path: 'google-apps-script/Security.gs',
    name: 'Security.gs',
    category: 'GAS',
    description: 'Cryptographic validation engine for Google Apps Script with 5-minute tolerance and cache-based nonce tracker.',
    content: `/**
 * Security Engine: HMAC Verification, Nonce Replay, Timestamp Checking
 * File: Security.gs
 */

var Security = {
  TIMESTAMP_TOLERANCE_SEC: 300, // 5 Minutes

  isTimestampValid: function(timestamp) {
    if (!timestamp) return false;
    var now = Math.floor(new Date().getTime() / 1000);
    var diff = Math.abs(now - parseInt(timestamp, 10));
    return diff <= this.TIMESTAMP_TOLERANCE_SEC;
  },

  verifyAndConsumeNonce: function(nonce, action) {
    if (!nonce) return false;
    var cache = CacheService.getScriptCache();
    var key = 'nonce_' + nonce;
    if (cache.get(key)) {
      return false; // Replay attack detected!
    }
    cache.put(key, action, 360); // Store for 6 minutes
    return true;
  },

  verifyHmac: function(payload, action, timestamp, nonce, providedSignature) {
    if (!providedSignature) return false;
    var secret = Config.getHmacSecret();
    var payloadString = typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
    
    // Hash payload SHA-256
    var payloadDigest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, payloadString);
    var payloadHash = Utilities.base64Encode(payloadDigest);

    // Compute HMAC-SHA256
    var signatureBase = [timestamp, nonce, action, payloadHash].join('|');
    var hmacBytes = Utilities.computeHmacSha256Signature(signatureBase, secret);
    var computedHex = hmacBytes.map(function(byte) {
      var v = (byte < 0 ? byte + 256 : byte).toString(16);
      return v.length === 1 ? '0' + v : v;
    }).join('');

    return computedHex === providedSignature;
  }
};
`
  },

  // =========================================================================
  // 4. GAS: Cases.gs (LOCKSERVICE CONCURRENCY & UNIQUE NUMBERING)
  // =========================================================================
  {
    path: 'google-apps-script/Cases.gs',
    name: 'Cases.gs',
    category: 'GAS',
    description: 'Case manager with LockService concurrency protection to ensure strictly unique LDN-2026-XXXXX case numbers.',
    content: `/**
 * Case Manager & Concurrency Lock
 * File: Cases.gs
 */

var Cases = {
  createCase: function(data) {
    var lock = LockService.getScriptLock();
    try {
      // Acquire script lock for 10 seconds to prevent race conditions
      lock.waitLock(10000);

      var year = new Date().getFullYear();
      var ss = SpreadsheetApp.openById(Config.getSpreadsheetId());
      var sheet = ss.getSheetByName(Config.getSheets().CASES);
      if (!sheet) {
        sheet = SheetsService.ensureSheet(Config.getSheets().CASES, [
          'case_id', 'case_number', 'client_id', 'service_id', 'title', 'description', 'status', 'assigned_staff', 'created_at', 'updated_at'
        ]);
      }

      var lastRow = sheet.getLastRow();
      var sequence = Math.max(1, lastRow); // Header is row 1
      var paddedSeq = ('00000' + sequence).slice(-5);
      var caseNumber = 'LDN-' + year + '-' + paddedSeq;
      var caseId = 'CASE-' + caseNumber;
      var now = new Date().toISOString();

      var newRow = [
        caseId,
        caseNumber,
        data.client_id || '',
        data.service_id || '',
        data.title || '',
        data.description || '',
        'SUBMITTED',
        '',
        now,
        now
      ];

      sheet.appendRow(newRow);

      // Create isolated case folder in Google Drive
      DriveService.ensureCaseFolder(data.client_id, caseNumber);

      return {
        case_id: caseId,
        case_number: caseNumber,
        status: 'SUBMITTED',
        created_at: now
      };

    } finally {
      lock.releaseLock();
    }
  },

  updateCaseStatus: function(caseId, status) {
    var lock = LockService.getScriptLock();
    try {
      lock.waitLock(10000);
      var ss = SpreadsheetApp.openById(Config.getSpreadsheetId());
      var sheet = ss.getSheetByName(Config.getSheets().CASES);
      if (!sheet) return false;

      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        if (data[i][0] === caseId) {
          sheet.getRange(i + 1, 7).setValue(status); // Column 7: status
          sheet.getRange(i + 1, 10).setValue(new Date().toISOString()); // Column 10: updated_at
          return true;
        }
      }
      return false;
    } finally {
      lock.releaseLock();
    }
  }
};
`
  },

  // =========================================================================
  // 5. GAS: Drive.gs (PRIVATE DRIVE VAULT, ZERO PUBLIC SHARING, STREAMING)
  // =========================================================================
  {
    path: 'google-apps-script/Drive.gs',
    name: 'Drive.gs',
    category: 'GAS',
    description: 'Private Google Drive vault with nested case hierarchy (NOTARIS LALU DAUD/CLIENTS/CLIENT-XXXXX/CASE-XXXXX/{IDENTITAS, DOKUMEN, AKTA, LAINNYA}).',
    content: `/**
 * Google Drive Private Vault Service
 * File: Drive.gs
 */

var DriveService = {
  ensureCaseFolder: function(clientId, caseNumber) {
    var rootId = Config.getDriveRootFolderId();
    var root = DriveApp.getFolderById(rootId);

    // 1. Get or create CLIENTS folder
    var clientsFolder = this._getOrCreateSubfolder(root, 'CLIENTS');

    // 2. Get or create Client folder
    var clientFolder = this._getOrCreateSubfolder(clientsFolder, clientId || 'CLIENT-GENERAL');

    // 3. Get or create Case folder
    var caseFolder = this._getOrCreateSubfolder(clientFolder, 'CASE-' + caseNumber);

    // 4. Create standard category subfolders
    var subfolders = ['IDENTITAS', 'DOKUMEN', 'AKTA', 'LAINNYA'];
    for (var i = 0; i < subfolders.length; i++) {
      this._getOrCreateSubfolder(caseFolder, subfolders[i]);
    }

    return caseFolder;
  },

  uploadDocument: function(data) {
    var caseFolder = this.ensureCaseFolder(data.client_id, data.case_id.replace('CASE-', ''));
    var subfolder = this._getOrCreateSubfolder(caseFolder, 'DOKUMEN');

    var bytes = Utilities.base64Decode(data.file_base64);
    var blob = Utilities.newBlob(bytes, data.mime_type, data.filename);
    var file = subfolder.createFile(blob);

    // Strictly enforce private sharing (No public URL)
    file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);

    // Log to Documents Sheet
    SheetsService.appendRow(Config.getSheets().DOCUMENTS, [
      data.document_id,
      data.case_id,
      data.client_id,
      data.document_type,
      data.filename,
      data.mime_type,
      bytes.length,
      file.getId(),
      subfolder.getId(),
      new Date().toISOString(),
      'SYSTEM',
      'PENDING_VERIFICATION'
    ]);

    return {
      document_id: data.document_id,
      drive_file_id: file.getId(),
      filename: data.filename
    };
  },

  getDocumentStream: function(documentId, driveFileId) {
    var file = DriveApp.getFileById(driveFileId);
    var blob = file.getBlob();
    var base64Data = Utilities.base64Encode(blob.getBytes());

    return {
      document_id: documentId,
      filename: file.getName(),
      mime_type: blob.getContentType(),
      base64_data: base64Data
    };
  },

  _getOrCreateSubfolder: function(parent, name) {
    var it = parent.getFoldersByName(name);
    if (it.hasNext()) {
      return it.next();
    }
    return parent.createFolder(name);
  }
};
`
  },

  // =========================================================================
  // 6. GAS: Sheets.gs & Utils.gs
  // =========================================================================
  {
    path: 'google-apps-script/Sheets.gs',
    name: 'Sheets.gs',
    category: 'GAS',
    description: 'Spreadsheet database manager for CLIENTS, CASES, SERVICES, DOCUMENTS, PAYMENTS, ACTIVITIES, USERS, SETTINGS, AUDIT_LOG.',
    content: `/**
 * Google Sheets Database Manager
 * File: Sheets.gs
 */

var SheetsService = {
  ensureSheet: function(name, headers) {
    var ss = SpreadsheetApp.openById(Config.getSpreadsheetId());
    var sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      if (headers && headers.length) {
        sheet.appendRow(headers);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#0A192F').setFontColor('#D4AF37');
      }
    }
    return sheet;
  },

  appendRow: function(sheetName, rowArray) {
    var sheet = this.ensureSheet(sheetName);
    sheet.appendRow(rowArray);
    return true;
  },

  appendAuditLog: function(corrId, action, result) {
    try {
      var row = [
        'LOG-' + new Date().getTime(),
        new Date().toISOString(),
        corrId,
        'WORDPRESS_SYSTEM',
        action,
        result
      ];
      this.appendRow(Config.getSheets().AUDIT_LOG, row);
    } catch (e) {}
  }
};
`
  },
  {
    path: 'google-apps-script/Utils.gs',
    name: 'Utils.gs',
    category: 'GAS',
    description: 'Utility helpers for clean JSON serialization and structured error responses.',
    content: `/**
 * Utility Helpers
 * File: Utils.gs
 */

var Utils = {
  jsonResponse: function(data) {
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  },

  errorResponse: function(code, message, status) {
    var res = {
      success: false,
      code: code || 'ERROR',
      message: message || 'Terjadi kesalahan.',
      timestamp: new Date().toISOString()
    };
    return ContentService.createTextOutput(JSON.stringify(res))
      .setMimeType(ContentService.MimeType.JSON);
  }
};
`
  }
];
