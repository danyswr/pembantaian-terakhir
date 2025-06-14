// LANGKAH 1: Jalankan fungsi ini di Google Apps Script untuk memperbaiki data existing
function fixAllSellerIds() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ordersSheet = ss.getSheetByName("Orders");
  const productsSheet = ss.getSheetByName("Products");
  
  const orders = ordersSheet.getDataRange().getValues();
  const products = productsSheet.getDataRange().getValues();
  
  console.log("Starting fix...");
  
  for (let i = 1; i < orders.length; i++) {
    const productId = orders[i][3]; // kolom D
    
    // Cari seller email berdasarkan product_id
    for (let j = 1; j < products.length; j++) {
      if (products[j][0] === productId) {
        const sellerEmail = products[j][1]; // kolom B products
        ordersSheet.getRange(i + 1, 3).setValue(sellerEmail); // kolom C orders
        console.log(`Fixed row ${i + 1}: ${sellerEmail}`);
        break;
      }
    }
  }
  
  console.log("Fix completed!");
}

// LANGKAH 2: Ganti case "update" di handleOrdersCRUD dengan kode ini:
/*
case "update":
  if (role !== "seller") {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: "Access denied. Only sellers can update order status" 
    })).setMimeType(ContentService.MimeType.JSON);
  }

  const updateIndex = findRowIndex(sheet, order_id, 0);
  if (updateIndex !== -1) {
    const currentSellerId = sheet.getRange(updateIndex + 2, 3).getValue();
    
    if (currentSellerId === email) {
      const newStatus = order_status || "confirmed";
      sheet.getRange(updateIndex + 2, 7).setValue(newStatus);
      sheet.getRange(updateIndex + 2, 9).setValue(new Date().toISOString());
      
      return ContentService.createTextOutput(JSON.stringify({ 
        success: true,
        message: "Order status updated successfully"
      })).setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Access denied. Seller mismatch."
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({ 
    success: false, 
    error: "Order not found"
  })).setMimeType(ContentService.MimeType.JSON);
*/