/**
 * Source code Google Apps Script (Code.gs) mandiri untuk disalin ke Google Sheets
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT - SINKRONISASI BUKU TAMU & RSVP UNDANGAN PERNIKAHAN
 * Mempelai: Jaka, S.Kom & Harinurdian, S.E (Dian)
 * ==============================================================================
 * 
 * FUNGSI:
 * 1. Menerima otomatis kiriman Ucapan & Doa Restu (RSVP) dari website undangan
 * 2. Menyimpan data tamu, kehadiran, dan ucapan langsung ke Google Spreadsheet
 * 3. Menyimpan daftar tamu undangan (WhatsApp link & kategori)
 * 4. Dapat dibaca kembali oleh website undangan jika diperlukan
 *
 * CARA MEMASANG:
 * 1. Buat Spreadsheet baru di Google Drive (https://sheets.google.com)
 *    Beri judul misal: "Buku Tamu Undangan Pernikahan Jaka & Dian"
 * 2. Klik menu "Ekstensi" (Extensions) > "Apps Script".
 * 3. Hapus semua teks yang ada di editor Apps Script, lalu tempelkan (paste) SEMUA isi kode ini.
 * 4. Klik ikon "Simpan" (Ctrl + S).
 * 5. Klik tombol biru "Terapkan" (Deploy) di kanan atas > pilih "Penerapan Baru" (New Deployment).
 * 6. Klik ikon Gear (roda gigi) di sebelah "Pilih jenis", pilih "Aplikasi Web" (Web app).
 * 7. Atur konfigurasi:
 *    - Deskripsi: Undangan Pernikahan RSVP & Tamu
 *    - Jalankan sebagai (Execute as): "Saya" (email Google Anda)
 *    - Siapa yang memiliki akses (Who has access): "Siapa saja" (Anyone) -> SANGAT PENTING!
 * 8. Klik tombol "Terapkan" (Deploy).
 * 9. Klik "Beri Akses" (Review Permissions) > Pilih akun Google Anda > Klik "Lanjutan" (Advanced) >
 *    Klik "Buka (tidak aman)" / "Go to project (unsafe)" > Klik "Izinkan" (Allow).
 * 10. Salin "URL Aplikasi Web" (yang berakhiran "/exec").
 * 11. Buka Admin Panel website undangan > Tab "Google Sheets" > Tempelkan URL tersebut dan klik Simpan!
 * ==============================================================================
 */

// Nama Sheet
var SHEET_WISHES_NAME = "Ucapan & RSVP";
var SHEET_GUESTS_NAME = "Daftar Tamu";

/**
 * Handle POST request (Menerima Ucapan Baru / Sinkronisasi Tamu)
 */
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

    // 2. Sinkronkan Seluruh Daftar Ucapan (Batch Sync)
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

    // 3. Sinkronkan Daftar Tamu Undangan
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

    // 5. Simpan Seluruh Pengaturan Undangan (Love Story, Love Your Wishes, dll)
    if (action === "save_config") {
      var configSheet = getOrCreateSheet(ss, "Pengaturan Undangan", [
        "Kunci",
        "Data Konfigurasi (JSON)",
        "Terakhir Disimpan"
      ], "#5797d0");

      var cfgStr = JSON.stringify(data.config || {});
      var timeStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss") + " WIB";
      configSheet.getRange(2, 1, 1, 3).setValues([
        ["wedding_config", cfgStr, timeStr]
      ]);

      return createJsonResponse({
        status: "success",
        message: "Pengaturan undangan (Love Story, Ucapan, Acara) berhasil disimpan ke Google Spreadsheet!"
      });
    }

    return createJsonResponse({
      status: "success",
      message: "Data diterima oleh Google Apps Script.",
      receivedData: data
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
}

/**
 * Handle GET request (Uji Coba URL & Baca Data dari Spreadsheet)
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "ping";

    // Kembalikan daftar ucapan dari Spreadsheet (Membaca kolom dengan deteksi cerdas)
    if (action === "get_wishes") {
      var sheet = ss.getSheetByName(SHEET_WISHES_NAME);
      if (!sheet || sheet.getLastRow() < 2) {
        return createJsonResponse({ status: "success", count: 0, wishes: [] });
      }

      var lastRow = sheet.getLastRow();
      var lastCol = Math.max(sheet.getLastColumn(), 6);
      var allData = sheet.getRange(1, 1, lastRow, lastCol).getValues();
      var headerRow = allData[0];

      // 1. Deteksi kolom berdasarkan nama header (Fleksibel)
      var colName = -1, colTime = -1, colAtt = -1, colMsg = -1, colId = -1;
      for (var c = 0; c < headerRow.length; c++) {
        var h = String(headerRow[c] || "").trim().toLowerCase();
        if (colName === -1 && (h.indexOf("nama") !== -1 || h.indexOf("name") !== -1 || h.indexOf("pengirim") !== -1)) colName = c;
        else if (colAtt === -1 && (h.indexOf("hadir") !== -1 || h.indexOf("kehadiran") !== -1 || h.indexOf("konfirmasi") !== -1 || h.indexOf("status") !== -1)) colAtt = c;
        else if (colMsg === -1 && (h.indexOf("pesan") !== -1 || h.indexOf("ucapan") !== -1 || h.indexOf("doa") !== -1 || h.indexOf("message") !== -1)) colMsg = c;
        else if (colTime === -1 && (h.indexOf("waktu") !== -1 || h.indexOf("tanggal") !== -1 || h.indexOf("timestamp") !== -1 || h.indexOf("time") !== -1)) colTime = c;
        else if (colId === -1 && h.indexOf("id") !== -1) colId = c;
      }

      var list = [];
      for (var i = 1; i < allData.length; i++) {
        var row = allData[i];
        if (!row || row.every(function(cell) { return cell === "" || cell === null || cell === undefined; })) continue;

        var nameVal = colName !== -1 ? String(row[colName] || "").trim() : "";
        var attVal = colAtt !== -1 ? String(row[colAtt] || "").trim() : "";
        var msgVal = colMsg !== -1 ? String(row[colMsg] || "").trim() : "";
        var timeVal = colTime !== -1 ? formatDateTimeCell(row[colTime]) : "";
        var idVal = colId !== -1 ? String(row[colId] || "").trim() : "";

        // 2. Deteksi Cerdas berdasarkan Pola Isi Sel jika header tidak cocok atau kolom bergeser
        var candidateTime = "";
        var candidateAtt = "";
        var candidateMsg = "";
        var candidateName = "";

        for (var k = 0; k < row.length; k++) {
          var cell = row[k];
          if (cell === "" || cell === null || cell === undefined) continue;
          var str = (cell instanceof Date)
            ? Utilities.formatDate(cell, "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss") + " WIB"
            : String(cell).trim();

          // A. Tanggal / Waktu
          if (!candidateTime && (cell instanceof Date || /^\\d{1,4}[-/.]\\d{1,2}[-/.]\\d{1,4}/.test(str) || str.indexOf("WIB") !== -1)) {
            candidateTime = str;
            continue;
          }

          // B. Kehadiran
          var lower = str.toLowerCase();
          if (!candidateAtt && (lower.indexOf("hadir") !== -1 || lower.indexOf("ragu") !== -1 || lower.indexOf("tidak") !== -1 || str.indexOf("✅") !== -1 || str.indexOf("❓") !== -1 || str.indexOf("❌") !== -1)) {
            candidateAtt = str;
            continue;
          }

          // C. Pesan Doa
          if (!candidateMsg && (str.length > 25 || lower.indexOf("selamat") !== -1 || lower.indexOf("semoga") !== -1 || lower.indexOf("barakallah") !== -1 || lower.indexOf("aamiin") !== -1 || lower.indexOf("amin") !== -1)) {
            candidateMsg = str;
            continue;
          }

          // D. Nama Tamu
          if (!candidateName && !/^\\d+$/.test(str) && str.indexOf("wish-") === -1 && str.length < 50) {
            candidateName = str;
          }
        }

        var finalName = nameVal || candidateName || (row[2] && !/^\\d+$/.test(String(row[2])) ? String(row[2]) : "Tamu Undangan");
        var finalTime = timeVal || candidateTime || (row[1] ? String(row[1]) : "Baru saja");
        var finalMsg = msgVal || candidateMsg || (row[4] ? String(row[4]) : (row[3] ? String(row[3]) : "Selamat menempuh hidup baru!"));
        var finalAttRaw = (attVal || candidateAtt || String(row[3] || row[2] || "")).toLowerCase();

        var attCode = "hadir";
        if (finalAttRaw.indexOf("ragu") !== -1) attCode = "ragu";
        else if (finalAttRaw.indexOf("tidak") !== -1 || finalAttRaw.indexOf("batal") !== -1) attCode = "tidak";

        list.push({
          id: idVal || ("wish_" + i + "_" + Date.now()),
          name: finalName,
          attendance: attCode,
          message: finalMsg,
          timestamp: finalTime
        });
      }

      return createJsonResponse({
        status: "success",
        count: list.length,
        wishes: list
      });
    }

    // Ambil konfigurasi undangan tersimpan (Love Story, Love Your Wishes, dll)
    if (action === "get_config") {
      var configSheet = ss.getSheetByName("Pengaturan Undangan");
      if (!configSheet || configSheet.getLastRow() < 2) {
        return createJsonResponse({ status: "empty", config: null });
      }

      var rawCfg = configSheet.getRange(2, 2).getValue();
      var parsedCfg = null;
      try {
        parsedCfg = JSON.parse(rawCfg);
      } catch (err) {
        parsedCfg = null;
      }

      return createJsonResponse({
        status: "success",
        config: parsedCfg
      });
    }

    // Default: Informasi Status Web App (Ping / Test)
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

/**
 * Helper: Ambil Sheet atau buat baru jika belum ada + beri styling header
 */
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

/**
 * Helper: Kembalikan JSON Output
 */
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper: Format cell Date menjadi string waktu
 */
function formatDateTimeCell(val) {
  if (!val) return "";
  if (val instanceof Date) {
    return Utilities.formatDate(val, "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss") + " WIB";
  }
  return String(val).trim();
}
`;
