// SCRIPT SEDERHANA UNTUK MEMPERBAIKI SELLER_ID DI ORDERS
// Paste ini ke Google Apps Script dan jalankan fungsi fixSellerIds() sekali saja

function fixSellerIds() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ordersSheet = ss.getSheetByName("Orders");
    const productsSheet = ss.getSheetByName("Products");
    
    if (!ordersSheet || !productsSheet) {
      console.log("Sheet tidak ditemukan");
      return "Error: Sheet tidak ditemukan";
    }
    
    const orders = ordersSheet.getDataRange().getValues();
    const products = productsSheet.getDataRange().getValues();
    
    let fixed = 0;
    
    // Loop mulai dari baris 2 (skip header)
    for (let i = 1; i < orders.length; i++) {
      const productId = orders[i][3]; // product_id di kolom D
      const currentSellerId = orders[i][2]; // seller_id di kolom C
      
      // Cari seller email dari products
      let sellerEmail = null;
      for (let j = 1; j < products.length; j++) {
        if (products[j][0] === productId) { // product_id match
          sellerEmail = products[j][1]; // user_id (email) dari products
          break;
        }
      }
      
      // Update jika seller email ditemukan dan berbeda
      if (sellerEmail && sellerEmail !== currentSellerId) {
        ordersSheet.getRange(i + 1, 3).setValue(sellerEmail); // Update kolom C
        ordersSheet.getRange(i + 1, 9).setValue(new Date().toISOString()); // Update kolom I
        fixed++;
        console.log(`Fixed order row ${i + 1}: ${currentSellerId} -> ${sellerEmail}`);
      }
    }
    
    console.log(`Selesai! Diperbaiki ${fixed} pesanan`);
    return `Berhasil memperbaiki ${fixed} pesanan`;
    
  } catch (error) {
    console.error("Error:", error);
    return "Error: " + error.message;
  }
}

// JUGA PERBAIKI FUNGSI handleOrdersCRUD untuk order update
// Ganti bagian case "update" dengan ini:

/*
case "update":
  if (role !== "seller") {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: "Access denied. Only sellers can update order status" 
    })).setMimeType(ContentService.MimeType.JSON);
  }

  if (!order_id) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: "Order ID is required for update" 
    })).setMimeType(ContentService.MimeType.JSON);
  }

  console.log("Looking for order:", order_id);
  const updateIndex = findRowIndex(sheet, order_id, 0);
  console.log("Found at index:", updateIndex);
  
  if (updateIndex !== -1) {
    const currentSellerId = sheet.getRange(updateIndex + 2, 3).getValue(); // seller_id di kolom C
    console.log("Current seller:", currentSellerId, "Request from:", email);
    
    // PERBAIKAN: Bandingkan email seller dengan email yang login
    if (currentSellerId === email) {
      const currentRow = sheet.getRange(updateIndex + 2, 1, 1, 9).getValues()[0];
      
      const newStatus = order_status || (data && data.order_status) || currentRow[6];
      console.log("Updating status to:", newStatus);
      
      // Update hanya order_status dan updated_at
      sheet.getRange(updateIndex + 2, 7).setValue(newStatus); // kolom G (order_status)
      sheet.getRange(updateIndex + 2, 9).setValue(new Date().toISOString()); // kolom I (updated_at)
      
      return ContentService.createTextOutput(JSON.stringify({ 
        success: true,
        message: "Order status updated successfully",
        new_status: newStatus
      })).setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Access denied. Current seller: " + currentSellerId + ", Your email: " + email
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({ 
    success: false, 
    error: "Order not found: " + order_id
  })).setMimeType(ContentService.MimeType.JSON);
*/