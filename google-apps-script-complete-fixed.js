// Google Apps Script LENGKAP - SUDAH DIPERBAIKI MASALAH SELLER UPDATE

// Konstanta
const FOLDER_ID = "1-6Q4ngLuEzmzBW9lsWHmqs2Iio9a_43J";
const SHEET_NAMES = ["Users", "Products", "Orders"];

/**
 * FUNGSI UNTUK MEMPERBAIKI DATA ORDERS YANG SUDAH ADA
 * Jalankan sekali setelah deploy untuk memperbaiki seller_id yang masih UUID
 */
function fixExistingOrdersData() {
  try {
    const ordersSheet = getSheet("Orders");
    const productsSheet = getSheet("Products");
    
    if (!ordersSheet || !productsSheet) {
      console.log("Orders atau Products sheet tidak ditemukan");
      return "Error: Sheet tidak ditemukan";
    }
    
    const ordersData = ordersSheet.getDataRange().getValues();
    const productsData = productsSheet.getDataRange().getValues();
    
    let fixedCount = 0;
    
    // Skip header row (mulai dari index 1)
    for (let i = 1; i < ordersData.length; i++) {
      const orderRow = ordersData[i];
      const orderId = orderRow[0];
      const currentSellerId = orderRow[2]; // seller_id di kolom C
      const productId = orderRow[3]; // product_id di kolom D
      
      // Cari seller email berdasarkan product_id
      let sellerEmail = null;
      for (let j = 1; j < productsData.length; j++) {
        const productRow = productsData[j];
        if (productRow[0] === productId) { // product_id match
          sellerEmail = productRow[1]; // user_id (email) dari products
          break;
        }
      }
      
      // Jika ditemukan seller email dan berbeda dari current seller_id
      if (sellerEmail && sellerEmail !== currentSellerId) {
        console.log(`Fixing order ${orderId}: ${currentSellerId} -> ${sellerEmail}`);
        
        // Update seller_id dan updated_at
        ordersSheet.getRange(i + 1, 3).setValue(sellerEmail); // kolom C
        ordersSheet.getRange(i + 1, 9).setValue(new Date().toISOString()); // kolom I
        
        fixedCount++;
      }
    }
    
    console.log(`Fixed ${fixedCount} orders`);
    return `Berhasil memperbaiki ${fixedCount} pesanan`;
    
  } catch (error) {
    console.error("Error fixing orders:", error);
    return "Error: " + error.message;
  }
}

/**
 * Menghasilkan hash password menggunakan SHA-256
 */
function hashPassword(password) {
  if (!password) throw new Error("Password is required");
  const hashed = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password, Utilities.Charset.UTF_8);
  return hashed.map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
}

/**
 * Memeriksa apakah email sudah ada
 */
function isEmailUnique(email) {
  const sheet = getSheet("Users");
  if (!sheet) throw new Error("Users sheet not found");
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return true;
  return !data.slice(1).some(row => row[1] === email);
}

/**
 * Mendapatkan role user berdasarkan email
 */
function getUserRole(email) {
  const sheet = getSheet("Users");
  if (!sheet) return null;
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return null;
  const user = data.slice(1).find(row => row[1] === email);
  return user ? user[6] : null;
}

/**
 * Mengunggah gambar ke Google Drive
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
    return "";
  }
}

/**
 * Mendapatkan sheet dengan pengecekan
 */
function getSheet(name) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(name);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(name);
      
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
 * Registrasi user
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
    const userId = email;
    const createdAt = new Date().toISOString();
    const row = [userId, email, hashedPassword, fullName, nomorHp || "", jurusan || "", role, createdAt, createdAt];
    
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
        updatedAt: createdAt
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
 * Login user
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
    
    const user = data.slice(1).find(row => row[1] === email);
    if (!user) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Email not found" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const storedHash = user[2];
    const inputHash = hashPassword(password);
    if (storedHash !== inputHash) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Invalid password" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ 
      success: true, 
      data: {
        userId: user[1],
        email: user[1],
        fullName: user[3],
        nomorHp: user[4],
        jurusan: user[5],
        role: user[6],
        createdAt: user[7],
        updatedAt: user[8]
      },
      redirect: user[6] === "buyer" ? "/buyer" : "/seller" 
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
 * CRUD Products
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
        let imageUrl = "";
        
        if (data.imageData) {
          imageUrl = uploadImageToDrive({ 
            imageData: data.imageData, 
            mimeType: data.mimeType, 
            fileName: data.fileName 
          });
        }
        
        const createdAt = new Date().toISOString();
        const status = data.status !== undefined ? data.status : 1;
        const row = [
          productId, 
          email, 
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
        const allProducts = sheet.getDataRange().getValues();
        if (allProducts.length <= 1) {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: true, 
            data: [] 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        return ContentService.createTextOutput(JSON.stringify({ 
          success: true, 
          data: allProducts.slice(1)
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
          if (currentUserId === email) {
            const currentRow = sheet.getRange(updateIndex + 2, 1, 1, 11).getValues()[0];
            let newImageUrl = currentRow[3];
            
            if (data.imageData) {
              newImageUrl = uploadImageToDrive({ 
                imageData: data.imageData, 
                mimeType: data.mimeType, 
                fileName: data.fileName 
              });
            }
            
            const updatedRow = [
              json.product_id || currentRow[0],
              currentRow[1],
              data.product_name !== undefined ? data.product_name : currentRow[2],
              newImageUrl,
              data.description !== undefined ? data.description : currentRow[4],
              data.price !== undefined ? data.price : currentRow[5],
              data.stock !== undefined ? data.stock : currentRow[6],
              data.category !== undefined ? data.category : currentRow[7],
              data.status !== undefined ? data.status : currentRow[8],
              currentRow[9],
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
          if (currentUserId === email) {
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
 * CRUD Orders - SUDAH DIPERBAIKI
 */
function handleOrdersCRUD(json) {
  try {
    const sheet = getSheet("Orders");
    if (!sheet) throw new Error("Orders sheet not found");

    const { email, action, data, order_id, order_status } = json;
    if (!email || !action) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Missing required fields" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    console.log("handleOrdersCRUD:", { email, action, order_id, order_status });

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
        
        // Dapatkan seller email dari product
        const sellerEmail = getSellerEmailByProductId(data.product_id);
        if (!sellerEmail) {
          return ContentService.createTextOutput(JSON.stringify({ 
            success: false, 
            error: "Product not found or seller not found" 
          })).setMimeType(ContentService.MimeType.JSON);
        }
        
        const orderId = Utilities.getUuid();
        const createdAt = new Date().toISOString();
        const row = [
          orderId, 
          email, // buyer email
          sellerEmail, // seller email (BUKAN UUID!)
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
          data: allOrders.slice(1)
        })).setMimeType(ContentService.MimeType.JSON);

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
          
          // PERBAIKAN UTAMA: Bandingkan email dengan email
          if (currentSellerId === email) {
            const currentRow = sheet.getRange(updateIndex + 2, 1, 1, 9).getValues()[0];
            
            const newStatus = order_status || (data && data.order_status) || currentRow[6];
            console.log("Updating status to:", newStatus);
            
            const updatedRow = [
              currentRow[0], // order_id
              currentRow[1], // user_id (buyer)
              currentRow[2], // seller_id (seller)
              currentRow[3], // product_id
              currentRow[4], // quantity
              currentRow[5], // total_price
              newStatus,     // order_status - INI YANG DIUPDATE
              currentRow[7], // created_at
              new Date().toISOString() // updated_at
            ];
            
            sheet.getRange(updateIndex + 2, 1, 1, updatedRow.length).setValues([updatedRow]);
            
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
        
      default:
        return ContentService.createTextOutput(JSON.stringify({ 
          success: false, 
          error: "Invalid action: " + action
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
 * Mendapatkan email seller berdasarkan product_id
 */
function getSellerEmailByProductId(productId) {
  const sheet = getSheet("Products");
  if (!sheet) return null;
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return null;
  const product = data.slice(1).find(row => row[0] === productId);
  return product ? product[1] : null; // user_id (email) di kolom B
}

/**
 * Mencari indeks baris
 */
function findRowIndex(sheet, value, column) {
  try {
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][column] === value) {
        return i - 1;
      }
    }
    return -1;
  } catch (error) {
    console.error("Error finding row index:", error);
    return -1;
  }
}

/**
 * Handler POST request
 */
function doPost(e) {
  try {
    console.log("Received POST:", e.postData.contents);
    
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
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      success: false, 
      error: "Invalid request" 
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
 * Handler GET request
 */
function doGet(e) {
  return HtmlService.createHtmlOutput("Web App is running. Use POST for operations.");
}