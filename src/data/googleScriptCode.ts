/**
 * Source code Google Apps Script (Code.gs) mandiri untuk disalin ke Google Sheets
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT - SINKRONISASI BUKU TAMU & RSVP UNDANGAN PERNIKAHAN
 * Mempelai: Jaka, S.Kom & Harinurdian, S.E (Dian)
 * ==============================================================================
 */

var SHEET_WISHES_NAME = "Ucapan & RSVP";
var SHEET_GUESTS_NAME = "Daftar Tamu";

function doPost(e) {
  try {
    var raw = e && e.postData ? e.postData.contents : "";
    var data = {};
    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch (err) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }

    var action = data.action || (e.parameter ? e.parameter.action : "add_wish");
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Tambah Ucapan / RSVP Baru
    if (action === "add_wish" || (!action && data.name)) {
      var wishSheet = getOrCreateSheet(ss, SHEET_WISHES_NAME, [
        "Waktu Masuk",
        "Nama Tamu",
        "Konfirmasi Kehadiran",
        "Pesan Ucapan & Doa Restu",
        "Waktu Input Website",
        "ID Pesan"
      ], "#5797d0");

      var nowStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss") + " WIB";
      var attendanceLabel = "✅ Hadir";
      if (data.attendance === "ragu") {
        attendanceLabel = "❓ Ragu-ragu";
      } else if (data.attendance === "tidak") {
        attendanceLabel = "❌ Tidak Hadir";
      }

      wishSheet.appendRow([
        nowStr,
        data.name || "-",
        attendanceLabel,
        data.message || "-",
        data.timestamp || "-",
        data.id || ""
      ]);

      return createJsonResponse({
        status: "success",
        message: "Ucapan & RSVP berhasil dicatat ke Google Spreadsheet!",
        name: data.name
      });
    }

    // 2. Sinkronkan Seluruh Ucapan
    if (action === "sync_all_wishes") {
      var wishSheet = getOrCreateSheet(ss, SHEET_WISHES_NAME, [
        "Waktu Masuk",
        "Nama Tamu",
        "Konfirmasi Kehadiran",
        "Pesan Ucapan & Doa Restu",
        "Waktu Input Website",
        "ID Pesan"
      ], "#5797d0");

      var wishes = data.wishes || [];
      if (Array.isArray(wishes) && wishes.length > 0) {
        var lastRow = wishSheet.getLastRow();
        if (lastRow > 1) {
          wishSheet.deleteRows(2, lastRow - 1);
        }

        var rows = [];
        for (var i = 0; i < wishes.length; i++) {
          var w = wishes[i];
          var attLabel = "✅ Hadir";
          if (w.attendance === "ragu") attLabel = "❓ Ragu-ragu";
          else if (w.attendance === "tidak") attLabel = "❌ Tidak Hadir";

          rows.push([
            w.time || "-",
            w.name || "-",
            attLabel,
            w.message || "-",
            w.timestamp || "-",
            w.id || ""
          ]);
        }

        if (rows.length > 0) {
          wishSheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
        }
      }

      return createJsonResponse({
        status: "success",
        message: "Berhasil menyinkronkan " + (wishes.length || 0) + " ucapan ke Google Sheets!"
      });
    }

    // 3. Sinkronkan Daftar Tamu
    if (action === "sync_guests") {
      var guestSheet = getOrCreateSheet(ss, SHEET_GUESTS_NAME, [
        "No",
        "Nama Tamu",
        "Kategori",
        "Nomor WhatsApp",
        "Link Undangan Personal",
        "Catatan",
        "ID Tamu"
      ], "#ec79b8");

      var guests = data.guests || [];
      if (Array.isArray(guests) && guests.length > 0) {
        var lastRow = guestSheet.getLastRow();
        if (lastRow > 1) {
          guestSheet.deleteRows(2, lastRow - 1);
        }

        var rows = [];
        var baseUrl = data.baseUrl || "https://ayonikah.web.id";

        for (var j = 0; j < guests.length; j++) {
          var g = guests[j];
          var guestUrl = baseUrl + "?to=" + encodeURIComponent(g.name || "");
          rows.push([
            j + 1,
            g.name || "-",
            g.category || "Umum",
            g.phone || "-",
            guestUrl,
            g.note || "-",
            g.id || ""
          ]);
        }

        if (rows.length > 0) {
          guestSheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
        }
      }

      return createJsonResponse({
        status: "success",
        message: "Berhasil menyinkronkan " + (guests.length || 0) + " tamu ke Google Sheets!"
      });
    }

    // 4. Test Koneksi
    if (action === "test") {
      return createJsonResponse({
        status: "success",
        message: "Koneksi Google Apps Script berhasil terhubung ke Spreadsheet!",
        spreadsheetTitle: ss.getName(),
        serverTime: Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss") + " WIB"
      });
    }

    return createJsonResponse({
      status: "success",
      message: "Data diterima oleh Google Apps Script."
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "ping";

    if (action === "get_wishes") {
      var sheet = ss.getSheetByName(SHEET_WISHES_NAME);
      if (!sheet || sheet.getLastRow() < 2) {
        return createJsonResponse({ status: "success", wishes: [] });
      }

      var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
      var list = [];
      for (var i = 0; i < values.length; i++) {
        var row = values[i];
        var att = "hadir";
        var attStr = String(row[2]).toLowerCase();
        if (attStr.indexOf("ragu") !== -1) att = "ragu";
        else if (attStr.indexOf("tidak") !== -1) att = "tidak";

        list.push({
          waktu: row[0],
          name: row[1],
          attendance: att,
          message: row[3],
          timestamp: row[4],
          id: row[5]
        });
      }

      return createJsonResponse({
        status: "success",
        count: list.length,
        wishes: list
      });
    }

    return createJsonResponse({
      status: "online",
      message: "Google Apps Script Wedding Undangan Jaka & Dian aktif!",
      spreadsheetTitle: ss.getName(),
      sheets: ss.getSheets().map(function(s) { return s.getName(); }),
      time: Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss") + " WIB"
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
}

function getOrCreateSheet(ss, sheetName, headers, headerColor) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground(headerColor || "#5797d0");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setFontFamily("Arial");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
    for (var c = 1; c <= headers.length; c++) {
      sheet.setColumnWidth(c, 180);
    }
  }
  return sheet;
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
\`;
