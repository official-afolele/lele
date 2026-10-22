/**
 * Kode Google Apps Script (Code.gs) yang bisa disalin ke Google Sheets.
 * Menggunakan String.raw agar karakter backslash pada kode tidak rusak.
 */
export const GOOGLE_APPS_SCRIPT_CODE = String.raw`// =============================================================================
// GOOGLE APPS SCRIPT - RSVP & BUKU TAMU UNDANGAN PERNIKAHAN
// =============================================================================
// CARA PASANG (2 menit):
//  1. Buka https://sheets.google.com -> Spreadsheet baru
//  2. Menu Ekstensi -> Apps Script
//  3. Hapus isinya, tempel SEMUA kode ini, Ctrl+S
//  4. Deploy -> New Deployment -> Web App
//     Execute as: Me
//     Who has access: Anyone  <-- WAJIB "Anyone"
//  5. Salin URL yang berakhiran /exec
//  6. Tempel di Admin Panel -> tab Google Sheets & Script
// =============================================================================

var SHEET_WISHES = "Ucapan & RSVP";
var SHEET_GUESTS = "Daftar Tamu";

function doPost(e) {
  try {
    var data = parseRequest(e);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = data.action || "add_wish";

    if (action === "add_wish")        return addWish(ss, data);
    if (action === "sync_all_wishes") return syncAllWishes(ss, data);
    if (action === "sync_guests")     return syncGuests(ss, data);
    if (action === "test")            return jsonResp({ status: "success", message: "OK", spreadsheetTitle: ss.getName() });

    return jsonResp({ status: "success", message: "received" });
  } catch (err) {
    return jsonResp({ status: "error", message: String(err) });
  }
}

function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || "ping";
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === "get_wishes") {
      var sheet = ss.getSheetByName(SHEET_WISHES);
      if (!sheet || sheet.getLastRow() < 2) return jsonResp({ status: "success", wishes: [] });
      var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
      var list = rows.map(function (row) {
        var att = String(row[2] || "").toLowerCase();
        var code = att.indexOf("ragu") !== -1 ? "ragu"
                 : (att.indexOf("tidak") !== -1 ? "tidak" : "hadir");
        return {
          id: String(row[5] || "wish_" + Math.random()),
          name: String(row[1] || "Tamu"),
          attendance: code,
          message: String(row[3] || ""),
          timestamp: String(row[4] || "Baru saja")
        };
      });
      return jsonResp({ status: "success", wishes: list });
    }

    return jsonResp({
      status: "online",
      message: "Wedding RSVP Script aktif",
      spreadsheetTitle: ss.getName(),
      time: Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss") + " WIB"
    });
  } catch (err) {
    return jsonResp({ status: "error", message: String(err) });
  }
}

function addWish(ss, data) {
  var sheet = getOrCreateSheet(ss, SHEET_WISHES, [
    "Waktu Masuk", "Nama Tamu", "Konfirmasi", "Ucapan", "Waktu Website", "ID"
  ], "#5797d0");
  var now = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss") + " WIB";
  var attLabel = data.attendance === "ragu" ? "Ragu-ragu"
               : (data.attendance === "tidak" ? "Tidak Hadir" : "Hadir");
  sheet.appendRow([
    now, data.name || "-", attLabel,
    data.message || "-", data.timestamp || "-", data.id || ""
  ]);
  return jsonResp({ status: "success", message: "Ucapan tersimpan" });
}

function syncAllWishes(ss, data) {
  var sheet = getOrCreateSheet(ss, SHEET_WISHES, [
    "Waktu Masuk", "Nama Tamu", "Konfirmasi", "Ucapan", "Waktu Website", "ID"
  ], "#5797d0");
  var wishes = data.wishes || [];
  var last = sheet.getLastRow();
  if (last > 1) sheet.deleteRows(2, last - 1);
  if (!wishes.length) return jsonResp({ status: "success", count: 0 });
  var now = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss") + " WIB";
  var rows = wishes.map(function (w) {
    var att = w.attendance === "ragu" ? "Ragu-ragu"
            : (w.attendance === "tidak" ? "Tidak Hadir" : "Hadir");
    return [now, w.name || "-", att, w.message || "-", w.timestamp || "-", w.id || ""];
  });
  sheet.getRange(2, 1, rows.length, 6).setValues(rows);
  return jsonResp({ status: "success", count: rows.length });
}

function syncGuests(ss, data) {
  var sheet = getOrCreateSheet(ss, SHEET_GUESTS, [
    "No", "Nama Tamu", "Kategori", "No WhatsApp", "Link Undangan", "Catatan", "ID"
  ], "#ec79b8");
  var guests = data.guests || [];
  var last = sheet.getLastRow();
  if (last > 1) sheet.deleteRows(2, last - 1);
  if (!guests.length) return jsonResp({ status: "success", count: 0 });
  var baseUrl = data.baseUrl || "";
  var rows = guests.map(function (g, i) {
    return [
      i + 1,
      g.name || "-",
      g.category || "Umum",
      g.phone || "-",
      baseUrl + "?to=" + encodeURIComponent(g.name || ""),
      g.note || "-",
      g.id || ""
    ];
  });
  sheet.getRange(2, 1, rows.length, 7).setValues(rows);
  return jsonResp({ status: "success", count: rows.length });
}

function parseRequest(e) {
  if (!e) return {};
  if (e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents); } catch (err) {}
  }
  return e.parameter || {};
}

function getOrCreateSheet(ss, name, headers, color) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var range = sheet.getRange(1, 1, 1, headers.length);
    range.setBackground(color).setFontColor("#FFFFFF").setFontWeight("bold");
    range.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResp(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
