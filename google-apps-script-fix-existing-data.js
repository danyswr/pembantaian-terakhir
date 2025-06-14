// Google Apps Script untuk memperbaiki data Orders yang sudah ada

/**
 * SCRIPT KHUSUS UNTUK MEMPERBAIKI DATA ORDERS YANG SUDAH ADA
 * Jalankan fungsi fixExistingOrdersData() SEKALI SAJA setelah deploy
 */

/**
 * Memperbaiki data orders yang sudah ada dengan mengubah seller_id dari UUID ke email
 */
function fixExistingOrdersData() {
  try {
    const ordersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
    const productsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Products");
    
    if (!ordersSheet || !productsSheet) {
      console.log("Orders atau Products sheet tidak ditemukan");
      return;
    }
    
    const ordersData = ordersSheet.getDataRange().getValues();
    const productsData = productsSheet.getDataRange().getValues();
    
    console.log("Orders data length:", ordersData.length);
    console.log("Products data length:", productsData.length);
    
    // Skip header row
    for (let i = 1; i < ordersData.length; i++) {
      const orderRow = ordersData[i];
      const orderId = orderRow[0];
      const userId = orderRow[1]; 
      const currentSellerId = orderRow[2]; // Ini yang perlu diperbaiki
      const productId = orderRow[3];
      
      console.log(`Processing order ${orderId}, current seller_id: ${currentSellerId}, product_id: ${productId}`);
      
      // Cari product berdasarkan product_id untuk mendapatkan seller email
      let sellerEmail = null;
      for (let j = 1; j < productsData.length; j++) {
        const productRow = productsData[j];
        if (productRow[0] === productId) { // product_id match
          sellerEmail = productRow[1]; // user_id (email) dari product
          break;
        }
      }
      
      console.log(`Found seller email: ${sellerEmail} for product ${productId}`);
      
      // Jika seller email ditemukan dan berbeda dari current seller_id, update
      if (sellerEmail && sellerEmail !== currentSellerId) {
        console.log(`Updating order ${orderId}: ${currentSellerId} -> ${sellerEmail}`);
        
        // Update seller_id di kolom C (index 2)
        ordersSheet.getRange(i + 1, 3).setValue(sellerEmail);
        
        // Update updated_at di kolom I (index 8)
        ordersSheet.getRange(i + 1, 9).setValue(new Date().toISOString());
        
        console.log(`Order ${orderId} updated successfully`);
      } else if (!sellerEmail) {
        console.log(`Warning: Product ${productId} not found for order ${orderId}`);
      } else {
        console.log(`Order ${orderId} already has correct seller_id: ${currentSellerId}`);
      }
    }
    
    console.log("Data fix completed!");
    return "Data orders berhasil diperbaiki!";
    
  } catch (error) {
    console.error("Error fixing orders data:", error);
    return "Error: " + error.message;
  }
}

/**
 * Fungsi untuk mengecek data setelah perbaikan
 */
function checkOrdersData() {
  try {
    const ordersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
    const ordersData = ordersSheet.getDataRange().getValues();
    
    console.log("=== CHECKING ORDERS DATA ===");
    for (let i = 1; i < ordersData.length; i++) {
      const orderRow = ordersData[i];
      console.log(`Order ${orderRow[0]}: buyer=${orderRow[1]}, seller=${orderRow[2]}, product=${orderRow[3]}, status=${orderRow[6]}`);
    }
    
    return "Check completed - see logs";
  } catch (error) {
    console.error("Error checking data:", error);
    return "Error: " + error.message;
  }
}