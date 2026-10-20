/**
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
 * CARA MEMASANG (HANYA 2 MENIT):
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
 * 11. Buka Admin Panel website undangan > Tab "Google Sheets & Script" > Tempelkan URL tersebut dan klik Simpan!
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
        // Simpan baris header, bersihkan sisa baris
        var lastRow = wishSheet.getLastRow();
        if (lastRow > 1) {
          wishSheet.deleteRows(2, lastRow - 1);
        }

        var rows = [];
        var nowStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss") + " WIB";

        for (var i = 0; i < wishes.length; i++) {
          var w = wishes[i];
          var attLabel = "✅ Hadir";
          if (w.attendance === "ragu") attLabel = "❓ Ragu-ragu";
          else if (w.attendance === "tidak") attLabel = "❌ Tidak Hadir";

          rows.push([
            nowStr,
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
        "No WhatsApp",
        "Link Undangan Khusus",
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
        var baseUrl = data.baseUrl || "https://ais-pre-dl3ag26jsusy2o4eewdsjr-862196243200.asia-southeast1.run.app";

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

    // Kembalikan daftar ucapan dari Spreadsheet
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

    // Default: Informasi Status Web App
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
 * Helper: Ambil atau buat Sheet dengan Header bergaya rapi
 */
function getOrCreateSheet(spreadsheet, sheetName, headers, headerColor) {
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  // Jika sheet masih baru atau kosong, pasang header
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground(headerColor || "#5797d0");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setFontSize(10);
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 35);
    sheet.setFrozenRows(1);

    // Auto-fit lebar kolom
    for (var col = 1; col <= headers.length; col++) {
      sheet.autoResizeColumn(col);
    }
  }

  return sheet;
}

/**
 * Helper: Kembalikan JSON Output dengan Header CORS
 */
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
