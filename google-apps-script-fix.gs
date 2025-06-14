// Perbaikan untuk Google Apps Script - gunakan email sebagai user_id untuk konsistensi

// Dalam function handleProductsCRUD, ganti bagian create:
case "create":
  if (role !== "seller") {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: "Access denied. Only sellers can create products" 
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  if (!data) {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: "Product data is required" 
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const productId = Utilities.getUuid();
  const userId = email; // UBAH: Gunakan email langsung sebagai user_id
  let imageUrl = "";
  
  if (data.imageData) {
    imageUrl = uploadImageToDrive({ 
      imageData: data.imageData, 
      mimeType: data.mimeType, 
      fileName: data.fileName 
    });
  }
  
  const createdAt = new Date().toISOString();
  const status = data.status !== undefined ? data.status : 1; // Default status 1 (tersedia)
  const row = [
    productId, 
    userId, // Ini sekarang email langsung
    data.product_name || "", 
    imageUrl, 
    data.description || "", 
    data.price || 0, 
    data.stock || 0, 
    data.category || "", 
    status, 
    createdAt, 
    createdAt
  ];
  
  sheet.appendRow(row);
  return ContentService.createTextOutput(JSON.stringify({ 
    success: true, 
    product_id: productId 
  })).setMimeType(ContentService.MimeType.JSON);

// Juga perlu update bagian update dan delete untuk menggunakan email:
case "update":
  if (role !== "seller") {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: "Access denied. Only sellers can update products" 
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const updateIndex = findRowIndex(sheet, json.product_id, 0);
  if (updateIndex !== -1) {
    const currentUserId = sheet.getRange(updateIndex + 2, 2).getValue();
    if (currentUserId === email) { // UBAH: Bandingkan dengan email langsung
      // ... rest of update logic
    }
  }

case "delete":
  if (role !== "seller") {
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: "Access denied. Only sellers can delete products" 
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const delIndex = findRowIndex(sheet, json.product_id, 0);
  if (delIndex !== -1) {
    const currentUserId = sheet.getRange(delIndex + 2, 2).getValue();
    if (currentUserId === email) { // UBAH: Bandingkan dengan email langsung
      sheet.deleteRow(delIndex + 2);
      return ContentService.createTextOutput(JSON.stringify({ 
        success: true 
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }