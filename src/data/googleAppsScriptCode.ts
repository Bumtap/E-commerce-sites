export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * =========================================================================
 * GELEPHU MINDFULNESS CITY (GMC) MARKETPLACE - GOOGLE SHEETS BACKEND
 * =========================================================================
 * 100% Free Cloud Database using your own Google Spreadsheet.
 * No Firebase billing, no credit card, no expiration.
 *
 * HOW TO DEPLOY:
 * 1. Open your Google Sheet (create a blank one at https://sheets.new)
 * 2. In the top menu, click: Extensions > Apps Script
 * 3. Delete any code in the editor and PASTE THIS ENTIRE SCRIPT
 * 4. Click the Save icon (Floppy disk or Ctrl+S / Cmd+S)
 * 5. Click the blue "Deploy" button (top right) > "New deployment"
 * 6. Click the gear icon next to "Select type" > choose "Web app"
 * 7. Set configuration:
 *      - Description: GMC Marketplace API
 *      - Execute as: Me (your Google account)
 *      - Who has access: Anyone (IMPORTANT: Allows customers & sellers to sync)
 * 8. Click "Deploy" > Grant access if prompted
 * 9. Copy the "Web app URL" (ends in /exec)
 * 10. Paste that URL into the GMC Marketplace Admin Portal > Google Sheets tab!
 * =========================================================================
 */

// Custom menu when opening the Google Sheet
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🛍️ GMC Marketplace')
    .addItem('✨ Initialize All Database Sheets', 'initAllSheets')
    .addItem('📊 Check Database Summary', 'showDatabaseSummary')
    .addToUi();
}

/**
 * Auto-creates all necessary tabs with headers, styling, and frozen rows
 */
function initAllSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var schemas = {
    'Stores': [
      'id', 'name', 'slug', 'category', 'ownerName', 'phone', 'email',
      'location', 'rating', 'reviewCount', 'productCount', 'isVerified',
      'status', 'tagline', 'description', 'logo', 'coverImage', 'updatedAt'
    ],
    'Products': [
      'id', 'name', 'category', 'price', 'originalPrice', 'stock',
      'rating', 'reviewCount', 'sellerId', 'sellerName', 'sellerVerified',
      'description', 'images', 'origin', 'dzongkhag', 'isOrganic', 'badge', 'updatedAt'
    ],
    'Sellers': [
      'id', 'storeName', 'ownerName', 'email', 'phone', 'location',
      'category', 'storeId', 'isVerified', 'createdAt'
    ],
    'Orders': [
      'id', 'orderNumber', 'customerName', 'customerEmail', 'customerPhone',
      'status', 'total', 'itemCount', 'paymentMethod', 'createdAt', 'shippingAddress', 'itemsSummary'
    ],
    'Categories': [
      'id', 'name', 'slug', 'description', 'image', 'order', 'featured', 'isActive'
    ]
  };

  var headerColors = {
    'Stores': '#0f766e',     // Teal 700
    'Products': '#0369a1',   // Sky 700
    'Sellers': '#7c2d12',    // Orange/Amber 900
    'Orders': '#4338ca',     // Indigo 700
    'Categories': '#374151'  // Gray 700
  };

  Object.keys(schemas).forEach(function(sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    // Set headers if empty or row 1 doesn't match
    var headers = schemas[sheetName];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground(headerColors[sheetName] || '#0f766e');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setFontFamily('Arial');
      sheet.setFrozenRows(1);
    }
  });

  // Remove default "Sheet1" if empty
  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && defaultSheet.getLastRow() === 0 && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch(e) {}
  }

  return { status: 'success', message: 'All database sheets created and styled successfully!' };
}

function showDatabaseSummary() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  var msg = '📊 GMC Marketplace Database:\\n';
  ['Stores', 'Products', 'Sellers', 'Orders', 'Categories'].forEach(function(name) {
    var s = ss.getSheetByName(name);
    var count = s ? Math.max(0, s.getLastRow() - 1) : 0;
    msg += '• ' + name + ': ' + count + ' records\\n';
  });
  ui.alert('Database Status', msg, ui.ButtonSet.OK);
}

/**
 * GET Request Handler (Fetch data)
 */
function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'ping';
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'ping') {
      return createJsonResponse({
        status: 'success',
        message: 'GMC Google Sheets API is online and responding!',
        spreadsheetName: ss.getName(),
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'getAll') {
      return createJsonResponse({
        status: 'success',
        data: {
          stores: readSheetData(ss, 'Stores'),
          products: readSheetData(ss, 'Products'),
          sellers: readSheetData(ss, 'Sellers'),
          orders: readSheetData(ss, 'Orders'),
          categories: readSheetData(ss, 'Categories')
        }
      });
    }

    if (action === 'getStores') {
      return createJsonResponse({ status: 'success', data: readSheetData(ss, 'Stores') });
    }
    if (action === 'getProducts') {
      return createJsonResponse({ status: 'success', data: readSheetData(ss, 'Products') });
    }
    if (action === 'getSellers') {
      return createJsonResponse({ status: 'success', data: readSheetData(ss, 'Sellers') });
    }
    if (action === 'getOrders') {
      return createJsonResponse({ status: 'success', data: readSheetData(ss, 'Orders') });
    }

    return createJsonResponse({ status: 'error', message: 'Unknown action: ' + action });
  } catch (error) {
    return createJsonResponse({ status: 'error', message: error.toString() });
  }
}

/**
 * POST Request Handler (Write/Update data)
 */
function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    } else if (e && e.parameter && e.parameter.data) {
      body = JSON.parse(e.parameter.data);
    }

    var action = body.action || '';
    var payload = body.payload || {};
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Auto-initialize sheets if not present
    initAllSheets();

    if (action === 'syncAll') {
      var stores = body.stores || payload.stores;
      var products = body.products || payload.products;
      var sellers = body.sellers || payload.sellers;
      var categories = body.categories || payload.categories;

      if (stores) writeEntireSheet(ss, 'Stores', stores);
      if (products) writeEntireSheet(ss, 'Products', products);
      if (sellers) writeEntireSheet(ss, 'Sellers', sellers);
      if (categories) writeEntireSheet(ss, 'Categories', categories);
      return createJsonResponse({
        status: 'success',
        success: true,
        message: 'Successfully synchronized all marketplace data to Google Sheets!'
      });
    }

    if (action === 'saveStore') {
      var storeItem = body.store || payload.store || payload;
      upsertRecord(ss, 'Stores', storeItem);
      return createJsonResponse({ status: 'success', success: true, message: 'Store saved' });
    }

    if (action === 'deleteStore') {
      var storeId = body.storeId || payload.storeId || body.id || payload.id;
      deleteRecord(ss, 'Stores', storeId);
      return createJsonResponse({ status: 'success', success: true, message: 'Store deleted' });
    }

    if (action === 'saveProduct') {
      var productItem = body.product || payload.product || payload;
      upsertRecord(ss, 'Products', productItem);
      return createJsonResponse({ status: 'success', success: true, message: 'Product saved' });
    }

    if (action === 'deleteProduct') {
      var productId = body.productId || payload.productId || body.id || payload.id;
      deleteRecord(ss, 'Products', productId);
      return createJsonResponse({ status: 'success', success: true, message: 'Product deleted' });
    }

    if (action === 'saveSeller') {
      var sellerItem = body.seller || payload.seller || payload;
      upsertRecord(ss, 'Sellers', sellerItem);
      return createJsonResponse({ status: 'success', success: true, message: 'Seller saved' });
    }

    if (action === 'deleteSeller') {
      var sellerId = body.sellerId || payload.sellerId || body.id || payload.id;
      deleteRecord(ss, 'Sellers', sellerId);
      return createJsonResponse({ status: 'success', success: true, message: 'Seller deleted' });
    }

    if (action === 'saveCategory') {
      var categoryItem = body.category || payload.category || payload;
      upsertRecord(ss, 'Categories', categoryItem);
      return createJsonResponse({ status: 'success', success: true, message: 'Category saved' });
    }

    if (action === 'deleteCategory') {
      var categoryId = body.categoryId || payload.categoryId || body.id || payload.id;
      deleteRecord(ss, 'Categories', categoryId);
      return createJsonResponse({ status: 'success', success: true, message: 'Category deleted' });
    }

    if (action === 'saveOrder') {
      var orderItem = body.order || payload.order || payload;
      var flatOrder = Object.assign({}, orderItem);
      if (flatOrder.shippingAddress && typeof flatOrder.shippingAddress === 'object') {
        flatOrder.shippingAddress = flatOrder.shippingAddress.addressLine + ', ' + (flatOrder.shippingAddress.city || '');
      }
      if (flatOrder.items && Array.isArray(flatOrder.items)) {
        flatOrder.itemsSummary = flatOrder.items.map(function(i) {
          return (i.quantity || 1) + 'x ' + (i.name || i.productName || 'Item') + ' (Nu. ' + ((i.price || 0) * (i.quantity || 1)) + ')';
        }).join(' | ');
      }
      upsertRecord(ss, 'Orders', flatOrder);
      return createJsonResponse({ status: 'success', success: true, message: 'Order recorded' });
    }

    return createJsonResponse({ status: 'error', message: 'Unknown POST action: ' + action });
  } catch (error) {
    return createJsonResponse({ status: 'error', message: error.toString() });
  }
}

// ----------------- HELPER FUNCTIONS -----------------

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function readSheetData(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow <= 1 || lastCol === 0) return [];

  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var rows = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  return rows.map(function(row) {
    var obj = {};
    headers.forEach(function(h, idx) {
      var val = row[idx];
      // Convert stringified arrays or objects
      if (typeof val === 'string' && (val.indexOf('[') === 0 || val.indexOf('{') === 0)) {
        try { val = JSON.parse(val); } catch(e) {}
      }
      obj[h] = val;
    });
    return obj;
  });
}

// Safeguards against Google Sheets 50,000 characters per single cell hard limit
function safeCellValue(val) {
  if (val === undefined || val === null) return '';
  if (typeof val === 'object') {
    try {
      val = JSON.stringify(val);
    } catch (e) {
      val = String(val);
    }
  } else {
    val = String(val);
  }
  // Hard cap to 48,000 characters to safely prevent "more than maximum of 50000 characters" error
  if (val.length > 48000) {
    return val.substring(0, 48000) + '... [truncated: 50,000 char cell limit]';
  }
  return val;
}

function upsertRecord(ss, sheetName, item) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;
  if (!item.id) item.id = 'gen-' + new Date().getTime();
  item.updatedAt = new Date().toISOString();

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var lastRow = sheet.getLastRow();

  var existingRowIndex = -1;
  if (lastRow > 1) {
    var idColIdx = headers.indexOf('id');
    if (idColIdx >= 0) {
      var ids = sheet.getRange(2, idColIdx + 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === String(item.id)) {
          existingRowIndex = i + 2; // 1-based, plus 1 for header
          break;
        }
      }
    }
  }

  var rowData = headers.map(function(header) {
    return safeCellValue(item[header]);
  });

  if (existingRowIndex > 0) {
    sheet.getRange(existingRowIndex, 1, 1, headers.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
}

function deleteRecord(ss, sheetName, recordId) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var idColIdx = headers.indexOf('id');
  if (idColIdx === -1) return;

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return;

  var ids = sheet.getRange(2, idColIdx + 1, lastRow - 1, 1).getValues();
  for (var i = ids.length - 1; i >= 0; i--) {
    if (String(ids[i][0]) === String(recordId)) {
      sheet.deleteRow(i + 2);
      break;
    }
  }
}

function writeEntireSheet(ss, sheetName, items) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet || !items || items.length === 0) return;

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  // Clear old data rows
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, headers.length).clearContent();
  }

  var rowsData = items.map(function(item) {
    return headers.map(function(header) {
      return safeCellValue(item[header]);
    });
  });

  if (rowsData.length > 0) {
    sheet.getRange(2, 1, rowsData.length, headers.length).setValues(rowsData);
  }
}
`;
