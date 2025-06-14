// Google Apps Script untuk mengelola Users, Products, dan Orders - DIPERBAIKI

// Konstanta
const FOLDER_ID = "1-6Q4ngLuEzmzBW9lsWHmqs2Iio9a_43J";
const SHEET_NAMES = ["Users", "Products", "Orders"];

/**
 * Menghasilkan hash password menggunakan SHA-256 (sederhana untuk demo)
 * @param {string} password - Password mentah
 * @return {string} Hash dari password
 */
function hashPassword(password) {
  if (!password) throw new Error("Password is required");
  const hashed = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password, Utilities.Charset.UTF_8);
  return hashed.map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
}

/**
 * Memeriksa apakah email sudah ada
 * @param {string} email - Email untuk dicek
 * @return {boolean} True jika unik, False jika sudah ada
 */
function isEmailUnique(email) {
  const sheet = getSheet("Users");
  if (!sheet) throw new Error("Users sheet not found");
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return true; // Hanya header atau kosong
  return !data.slice(1).some(row => row[1] === email); // Skip header, kolom email di indeks 1
}

/**
 * Mendapatkan role user berdasarkan email
 * @param {string} email - Email user
 * @return {string|null} Role user atau null jika tidak ditemukan
 */
function getUserRole(email) {
  const sheet = getSheet("Users");
  if (!sheet) return null;
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return null; // Hanya header atau kosong
  const user = data.slice(1).find(row => row[1] === email); // Skip header, kolom email di indeks 1
  return user ? user[6] : null; // Kolom role di indeks 6
}

/**
 * Mengunggah gambar ke Google Drive dan mengembalikan URL
 * @param {Object} data - Objek berisi imageData, mimeType, fileName
 * @return {string} URL gambar
 */
function uploadImageToDrive(data) {
  try {
    if (!data.imageData || !data.mimeType || !data.fileName) {
      throw new Error("Image data is incomplete");
    }
    const blob = Utilities.newBlob(Utilities.base64Decode(data.imageData), data.mimeType, data.fileName);
    const file = DriveApp.getFolderById(FOLDER_ID).createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return "https://drive.google.com/uc?export=view&id=" + file.getId();
  } catch (error) {
    console.error("Error uploading image:", error);
    return ""; // Return empty string if upload fails
  }
}

/**
 * Mendapatkan sheet berdasarkan nama dengan pengecekan
 * @param {string} name - Nama sheet
 * @return {GoogleAppsScript.Spreadsheet.Sheet|null} Sheet atau null jika tidak ditemukan
 */
function getSheet(name) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(name);
    
    // Jika sheet tidak ada, buat sheet baru dengan header
    if (!sheet) {
      sheet = spreadsheet.insertSheet(name);
      
      // Tambahkan header sesuai dengan sheet
      if (name === "Users") {
        sheet.getRange(1, 1, 1, 9).setValues([["user_id", "email", "password", "full_name", "nomor_hp", "jurusan", "role", "created_at", "updated_at"]]);
      } else if (name === "Products") {
        sheet.getRange(1, 1, 1, 11).setValues([["product_id", "user_id", "product_name", "image_url", "description", "price", "stock", "category", "status", "created_at", "updated_at"]]);
      } else if (name === "Orders") {
        sheet.getRange(1, 1, 1, 9).setValues([["order_id", "user_id", "seller_id", "product_id", "quantity", "total_price", "order_status", "created_at", "updated_at"]]);
      }
    }
    
    return sheet;
  } catch (error) {
    console.error("Error getting sheet:", error);
    return null;
  }
}

/**
 * Menangani registrasi user
 * @param {Object} json - Data JSON dari permintaan
 * @return {GoogleAppsScript.Content.TextOutput} Respons
 */
function registerUser(json) {
  try {
    const sheet = getSheet("Users");
    if (!sheet) throw new Error("Users sheet not found");

    const { email, password, fullName, nomorHp, jurusan, role } = json;
    if (!email || !password || !fullName || !role) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Missing required fields" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (!isEmailUnique(email)) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Email already exists" 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    if (role !== "buyer" && role !== "seller") {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Role must be 'buyer' or 'seller'" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const hashedPassword = hashPassword(password);
    const userId = email; // PERBAIKAN: Gunakan email sebagai userId untuk konsistensi
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const row = [userId, email, hashedPassword, fullName, nomorHp || "", jurusan || "", role, createdAt, updatedAt];
    
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      data: {
        userId: email,
        email: email,
        fullName: fullName,
        nomorHp: nomorHp || "",
        jurusan: jurusan || "",
        role: role,
        createdAt: createdAt,
        updatedAt: updatedAt
      },
      redirect: role === "buyer" ? "/buyer" : "/seller" 
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Registration error:", error);
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Menangani login user
 * @param {Object} json - Data JSON dari permintaan
 * @return {GoogleAppsScript.Content.TextOutput} Respons
 */
function loginUser(json) {
  try {
    const sheet = getSheet("Users");
    if (!sheet) throw new Error("Users sheet not found");

    const { email, password } = json;
    if (!email || !password) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Email and password are required" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Email not found" 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const user = data.slice(1).find(row => row[1] === email); // Skip header, kolom email di indeks 1
    if (!user) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Email not found" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const storedHash = user[2]; // Kolom password di indeks 2
    const inputHash = hashPassword(password);
    if (storedHash !== inputHash) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Invalid password" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const role = user[6]; // Kolom role di indeks 6
    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      data: {
        userId: user[1], // PERBAIKAN: Gunakan email sebagai userId
        email: user[1],
        fullName: user[3],
        nomorHp: user[4],
        jurusan: user[5],
        role: user[6],
        createdAt: user[7],
        updatedAt: user[8]
      },
      redirect: role === "buyer" ? "/buyer" : "/seller" 
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("Login error:", error);
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Menangani CRUD untuk sheet Products
 * @param {Object} json - Data JSON dari permintaan
 * @return {GoogleAppsScript.Content.TextOutput} Respons
 */
function handleProductsCRUD(json) {
  try {
    const sheet = getSheet("Products");
    if (!sheet) throw new Error("Products sheet not found");

    const { email, action, data } = json;
    if (!email || !action) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Missing required fields" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const role = getUserRole(email);
    
    switch (action) {
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
        const userId = email; // PERBAIKAN: Gunakan email langsung sebagai user_id
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
          userId, // Sekarang ini adalah email
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
        
      case "read":
        // Buyer dan seller bisa membaca products
        const allProducts = sheet.getDataRange().getValues();
        if (allProducts.length <= 1) {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: true, 
            data: [] 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        return ContentService.createTextOutput(JSON.stringify({ 
          success: true, 
          data: allProducts.slice(1) // Skip header
        })).setMimeType(ContentService.MimeType.JSON);
        
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
          if (currentUserId === email) { // PERBAIKAN: Bandingkan dengan email langsung
            const currentRow = sheet.getRange(updateIndex + 2, 1, 1, 11).getValues()[0];
            let newImageUrl = currentRow[3]; // Keep existing image URL
            
            // Handle image update
            if (data.imageData) {
              newImageUrl = uploadImageToDrive({ 
                imageData: data.imageData, 
                mimeType: data.mimeType, 
                fileName: data.fileName 
              });
            }
            
            const updatedRow = [
              json.product_id || currentRow[0],
              currentRow[1], // user_id tidak diubah
              data.product_name !== undefined ? data.product_name : currentRow[2],
              newImageUrl,
              data.description !== undefined ? data.description : currentRow[4],
              data.price !== undefined ? data.price : currentRow[5],
              data.stock !== undefined ? data.stock : currentRow[6],
              data.category !== undefined ? data.category : currentRow[7],
              data.status !== undefined ? data.status : currentRow[8],
              currentRow[9], // created_at tidak diubah
              new Date().toISOString()
            ];
            
            sheet.getRange(updateIndex + 2, 1, 1, updatedRow.length).setValues([updatedRow]);
            return ContentService.createTextOutput(JSON.stringify({ 
              success: true 
            })).setMimeType(ContentService.MimeType.JSON);
          }
        }
        
        return ContentService.createTextOutput(JSON.stringify({ 
          success: false, 
          error: "Product not found or access denied" 
        })).setMimeType(ContentService.MimeType.JSON);
        
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
          if (currentUserId === email) { // PERBAIKAN: Bandingkan dengan email langsung
            sheet.deleteRow(delIndex + 2);
            return ContentService.createTextOutput(JSON.stringify({ 
              success: true 
            })).setMimeType(ContentService.MimeType.JSON);
          }
        }
        
        return ContentService.createTextOutput(JSON.stringify({ 
          success: false, 
          error: "Product not found or access denied" 
        })).setMimeType(ContentService.MimeType.JSON);
        
      default:
        return ContentService.createTextOutput(JSON.stringify({ 
          success: false, 
          error: "Invalid action" 
        })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    console.error("Products CRUD error:", error);
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Menangani CRUD untuk sheet Orders
 * @param {Object} json - Data JSON dari permintaan
 * @return {GoogleAppsScript.Content.TextOutput} Respons
 */
function handleOrdersCRUD(json) {
  try {
    const sheet = getSheet("Orders");
    if (!sheet) throw new Error("Orders sheet not found");

    const { email, action, data } = json;
    if (!email || !action) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Missing required fields" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const role = getUserRole(email);
    
    switch (action) {
      case "create":
        if (role !== "buyer") {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: false, 
            error: "Access denied. Only buyers can create orders" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        if (!data) {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: false, 
            error: "Order data is required" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        const orderId = Utilities.getUuid();
        const userId = email; // PERBAIKAN: Gunakan email langsung
        const createdAt = new Date().toISOString();
        const row = [
          orderId, 
          userId, 
          data.seller_id || "", 
          data.product_id || "", 
          data.quantity || 1, 
          data.total_price || 0, 
          data.order_status || "pending", 
          createdAt, 
          createdAt
        ];
        
        sheet.appendRow(row);
        return ContentService.createTextOutput(JSON.stringify({ 
          success: true, 
          order_id: orderId 
        })).setMimeType(ContentService.MimeType.JSON);
        
      case "read":
        const allOrders = sheet.getDataRange().getValues();
        if (allOrders.length <= 1) {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: true, 
            data: [] 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        return ContentService.createTextOutput(JSON.stringify({ 
          success: true, 
          data: allOrders.slice(1) // Skip header
        })).setMimeType(ContentService.MimeType.JSON);
        
      case "update":
        if (role !== "seller") {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: false, 
            error: "Access denied. Only sellers can update orders" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        if (!json.order_id || !data) {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: false, 
            error: "Order ID and data are required" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        const orderUpdateIndex = findRowIndex(sheet, json.order_id, 0);
        if (orderUpdateIndex !== -1) {
          const currentOrderRow = sheet.getRange(orderUpdateIndex + 2, 1, 1, 9).getValues()[0];
          const sellerId = currentOrderRow[2]; // seller_id is at index 2
          
          // Check if the current user is the seller of this order
          const currentUserId = getUserId(email);
          if (sellerId === currentUserId || sellerId === email) {
            const updatedOrderRow = [
              json.order_id,
              currentOrderRow[1], // user_id tidak diubah
              currentOrderRow[2], // seller_id tidak diubah
              currentOrderRow[3], // product_id tidak diubah
              currentOrderRow[4], // quantity tidak diubah
              currentOrderRow[5], // total_price tidak diubah
              data.order_status !== undefined ? data.order_status : currentOrderRow[6],
              currentOrderRow[7], // created_at tidak diubah
              new Date().toISOString()
            ];
            
            sheet.getRange(orderUpdateIndex + 2, 1, 1, updatedOrderRow.length).setValues([updatedOrderRow]);
            return ContentService.createTextOutput(JSON.stringify({ 
              success: true 
            })).setMimeType(ContentService.MimeType.JSON);
          } else {
            return ContentService.createTextOutput(JSON.stringify({ 
              success: false, 
              error: "Access denied. You can only update your own orders" 
            })).setMimeType(ContentService.MimeType.JSON);
          }
        } else {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: false, 
            error: "Order not found" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
      default:
        return ContentService.createTextOutput(JSON.stringify({ 
          success: false, 
          error: "Invalid action" 
        })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    console.error("Orders CRUD error:", error);
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Mencari indeks baris berdasarkan nilai di kolom tertentu
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - Sheet untuk dicari
 * @param {string} value - Nilai yang dicari
 * @param {number} column - Indeks kolom (0-based)
 * @return {number} Indeks baris (0-based, -1 jika tidak ditemukan)
 */
function findRowIndex(sheet, value, column) {
  try {
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) { // Skip header
      if (data[i][column] === value) {
        return i - 1; // Return 0-based index (excluding header)
      }
    }
    return -1;
  } catch (error) {
    console.error("Error finding row index:", error);
    return -1;
  }
}

/**
 * Menangani permintaan POST dari website
 * @param {GoogleAppsScript.Events.DoPost} e - Event permintaan
 * @return {GoogleAppsScript.Content.TextOutput} Respons
 */
function doPost(e) {
  try {
    console.log("Received POST request:", e.postData.contents);
    
    const json = JSON.parse(e.postData.contents);
    const { sheet, action } = json;
    
    if (!sheet || !action) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Sheet and action are required" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    switch (sheet) {
      case "Users":
        if (action === "register") return registerUser(json);
        if (action === "login") return loginUser(json);
        break;
      case "Products":
        return handleProductsCRUD(json);
      case "Orders":
        return handleOrdersCRUD(json);
      default:
        return ContentService.createTextOutput(JSON.stringify({ 
          success: false, 
          error: "Invalid sheet" 
        })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: "Invalid action" 
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    console.error("doPost error:", error);
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: error.message 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Menangani permintaan GET untuk testing
 * @param {GoogleAppsScript.Events.DoGet} e - Event permintaan
 * @return {GoogleAppsScript.HtmlOutput} Respons
 */
function doGet(e) {
  return HtmlService.createHtmlOutput("Web App is running. Use POST for register/login or CRUD.");
}