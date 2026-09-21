// Hãy thêm đoạn code này vào file Code.gs trên Google Apps Script của bạn
// và quan trọng nhất: Deploy lại dưới dạng "New version" (Phiên bản mới).

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;

    if (action === 'getAll') {
      // Gọi hàm lấy dữ liệu của bạn, ví dụ: getAllPhanAnh()
      var data = getAllPhanAnh(); 
      return ContentService.createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'create') {
      // Gọi hàm thêm mới của bạn
      // Ví dụ: var newId = addPhanAnh(payload.data);
      // Bạn cần tự điều chỉnh hàm addPhanAnh sao cho phù hợp với logic của bạn
      return ContentService.createTextOutput(JSON.stringify({ success: true, id: newId || "123" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'updateAdmin') {
      // Hàm updateTrangThaiAdmin đã có trong script của bạn
      updateTrangThaiAdmin(payload.id, payload.trangThai, payload.phanHoiAdmin);
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: false, message: "Unknown action" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
