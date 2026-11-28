/**
 * SEKARANTI - Open PO Batch 1 (Google Apps Script Backend & Owner Portal)
 *
 * Cara pakai:
 * 1. Salin file ini ke `Kode.gs` di editor Apps Script Google Sheets Anda.
 * 2. Pastikan ada file HTML bernama `Index` (huruf I besar) berisi `Index.html`.
 * 3. Deploy / Kelola deployment -> Versi baru -> Execute as: Me -> Who has access: Anyone.
 */

const SHEET_ORDERS = "Pesanan_Batch_1";
const SHEET_SUMMARY = "Rekap_Produksi";
const SHEET_OWNERS = "Admin_Owner";

const SEEDED_OWNER_EMAIL = "admin@sekaranti.web.id";
const SEEDED_OWNER_NAME = "Admin SEKARANTI";
const SEEDED_OWNER_SALT = "sk-owner-2026-9f4a2c";
const SEEDED_OWNER_HASH =
  "a6214691816804c223db1988b791d85f2952e6fde155712df70e22aa3835621e";

const SESSION_TTL_SECONDS = 21600; // 6 jam

const ORDER_STATUSES = [
  "Konfirmasi",
  "Proses",
  "Selesai",
  "Dibatalkan",
];

const STATUS_CELL_COLORS = {
  "Konfirmasi": "#FEF3C7",
  "Proses": "#DBEAFE",
  "Selesai": "#DCFCE7",
  "Dibatalkan": "#FEE2E2",
};

function normalizeOrderStatus_(rawStatus) {
  const val = String(rawStatus || "").trim();
  if (ORDER_STATUSES.indexOf(val) !== -1) return val;
  if (val === "Menunggu Konfirmasi" || !val) return "Konfirmasi";
  if (
    val === "Sudah DP / Lunas" ||
    val === "Sedang Diproduksi" ||
    val === "Siap COD / Dikirim"
  ) {
    return "Proses";
  }
  return "Konfirmasi";
}

/**
 * Mengubah byte array digest menjadi string hex lowercase.
 */
function bytesToHex_(bytes) {
  return bytes
    .map(function (b) {
      const v = b < 0 ? b + 256 : b;
      return (v < 16 ? "0" : "") + v.toString(16);
    })
    .join("");
}

/**
 * Menghasilkan hash SHA-256 dengan salt untuk password owner.
 */
function hashPassword_(salt, password) {
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    salt + ":" + password,
    Utilities.Charset.UTF_8
  );
  return bytesToHex_(digest);
}

/**
 * Memastikan nilai sel aman dikirim lewat google.script.run (tidak boleh berupa Date object).
 */
function formatCellString_(val) {
  if (val === null || val === undefined) return "";
  if (val instanceof Date) {
    return Utilities.formatDate(val, "Asia/Jakarta", "dd/MM/yyyy HH:mm") + " WIB";
  }
  return String(val).replace(/^'/, "");
}

function getOrCreateOrdersSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_ORDERS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_ORDERS);
  }

  if (sheet.getLastRow() === 0) {
    const headers = [
      "Waktu Order",
      "Kode PO",
      "Batch",
      "Nama Lengkap",
      "No. WhatsApp",
      "Kategori Pemesan",
      "Jurusan / Prodi / Kelas",
      "Ringkasan Motif",
      "Qty Puspa Raras",
      "Qty Sekar Wengi",
      "Qty Taman Sari Sekar",
      "Qty Tirta Sekar",
      "Total Qty",
      "Kode Diskon",
      "Harga Satuan",
      "Harga Normal",
      "Nominal Diskon",
      "Total Bayar",
      "Metode Pengambilan",
      "Titik COD",
      "Alamat Lengkap",
      "Metode Pembayaran",
      "Status",
    ];

    sheet.appendRow(headers);
    sheet
      .getRange(1, 1, 1, headers.length)
      .setBackground("#311908")
      .setFontColor("#FFFFFF")
      .setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function ensureSummarySheet_(ss) {
  let summary = ss.getSheetByName(SHEET_SUMMARY);
  if (summary) return summary;

  summary = ss.insertSheet(SHEET_SUMMARY);
  const rows = [
    ["REKAP PRODUKSI & ORDER - OPEN PO BATCH 1 SEKARANTI-SMG", ""],
    ["Item Rekap (Aktif / Non-Batal)", "Jumlah"],
    ["Puspa Raras (pcs)", '=SUMIF(' + SHEET_ORDERS + '!W2:W, "<>Dibatalkan", ' + SHEET_ORDERS + '!I2:I)'],
    ["Sekar Wengi (pcs)", '=SUMIF(' + SHEET_ORDERS + '!W2:W, "<>Dibatalkan", ' + SHEET_ORDERS + '!J2:J)'],
    ["Taman Sari Sekar (pcs)", '=SUMIF(' + SHEET_ORDERS + '!W2:W, "<>Dibatalkan", ' + SHEET_ORDERS + '!K2:K)'],
    ["Tirta Sekar (pcs)", '=SUMIF(' + SHEET_ORDERS + '!W2:W, "<>Dibatalkan", ' + SHEET_ORDERS + '!L2:L)'],
    ["Total Semua Hijab Aktif (pcs)", '=SUMIF(' + SHEET_ORDERS + '!W2:W, "<>Dibatalkan", ' + SHEET_ORDERS + '!M2:M)'],
    ["Total Order Pakai Kode BERSAMASEKARANTI", '=COUNTIFS(' + SHEET_ORDERS + '!N2:N, "BERSAMASEKARANTI", ' + SHEET_ORDERS + '!W2:W, "<>Dibatalkan")'],
    ["Total Order COD Kampus Polines", '=COUNTIFS(' + SHEET_ORDERS + '!S2:S, "COD Kampus Polines (Tembalang)", ' + SHEET_ORDERS + '!W2:W, "<>Dibatalkan")'],
    ["Total Omzet Aktif (Rp)", '=SUMIF(' + SHEET_ORDERS + '!W2:W, "<>Dibatalkan", ' + SHEET_ORDERS + '!R2:R)'],
  ];

  summary.getRange(1, 1, rows.length, 2).setValues(rows);
  summary.getRange("A1:B1").merge().setBackground("#311908").setFontColor("#FFE088").setFontWeight("bold");
  summary.getRange("A2:B2").setBackground("#6B1D2F").setFontColor("#FFFFFF").setFontWeight("bold");
  summary.getRange("B10").setNumberFormat('"Rp"#,##0');
  summary.autoResizeColumns(1, 2);
  return summary;
}

function getOrCreateOwnersSheet_(ss) {
  getOrCreateOrdersSheet_(ss);

  let sheet = ss.getSheetByName(SHEET_OWNERS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_OWNERS);
  }

  if (sheet.getLastRow() === 0) {
    const headers = [
      "Email",
      "Nama Owner",
      "Role",
      "Salt",
      "Password Hash",
      "Dibuat Pada",
      "Login Terakhir",
    ];
    sheet.appendRow(headers);
    sheet
      .getRange(1, 1, 1, headers.length)
      .setBackground("#1F1D1A")
      .setFontColor("#FFE088")
      .setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  if (sheet.getLastRow() === 1) {
    const nowStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm") + " WIB";
    sheet.appendRow([
      SEEDED_OWNER_EMAIL,
      SEEDED_OWNER_NAME,
      "Owner",
      SEEDED_OWNER_SALT,
      SEEDED_OWNER_HASH,
      "'" + nowStr,
      "-",
    ]);
  }

  try {
    if (!sheet.isSheetHidden()) {
      sheet.hideSheet();
    }
  } catch (err) {
    // Abaikan jika gagal menyembunyikan sheet
  }

  return sheet;
}

/**
 * Menyajikan Portal Management PO untuk Owner saat URL /exec dibuka di browser.
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("SEKARANTI · Management Open PO Batch 1")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Menerima kiriman data pesanan baru dari web Next.js (POST /api/open-po).
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    const raw = e && e.postData ? e.postData.contents : "{}";
    const data = JSON.parse(raw);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateOrdersSheet_(ss);
    ensureSummarySheet_(ss);

    const initialStatus = normalizeOrderStatus_(data.status || "Konfirmasi");

    sheet.appendRow([
      "'" + String(data.timestamp || ""),
      data.orderCode || "",
      data.batch || "",
      data.fullName || "",
      "'" + String(data.whatsapp || ""),
      data.affiliationLabel || "",
      data.departmentOrClass || "",
      data.itemsSummary || "",
      Number(data.qtyPuspaRaras || 0),
      Number(data.qtySekarWengi || 0),
      Number(data.qtyTamanSariSekar || 0),
      Number(data.qtyTirtaSekar || 0),
      Number(data.totalQty || 0),
      data.promoCode || "-",
      Number(data.unitPrice || 0),
      Number(data.originalTotal || 0),
      Number(data.discountAmount || 0),
      Number(data.totalAmount || 0),
      data.deliveryMethodLabel || "",
      data.codSpot || "",
      data.address || "",
      data.paymentMethodLabel || "",
      initialStatus,
    ]);

    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 15, 1, 4).setNumberFormat('"Rp"#,##0');
    const statusColor = STATUS_CELL_COLORS[initialStatus] || "#FEF3C7";
    sheet.getRange(lastRow, 23).setBackground(statusColor);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true, status: "success", orderCode: data.orderCode || "" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, status: "error", message: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/* ============================================================
   OWNER AUTHENTICATION & MANAGEMENT RPC (google.script.run)
   ============================================================ */

function createSessionToken_(user) {
  const token = Utilities.getUuid() + "-" + Utilities.getUuid();
  CacheService.getScriptCache().put(
    "session_" + token,
    JSON.stringify(user),
    SESSION_TTL_SECONDS
  );
  return token;
}

function getSessionUser_(token) {
  if (!token || typeof token !== "string") return null;
  const cached = CacheService.getScriptCache().get("session_" + token);
  if (!cached) return null;
  try {
    return JSON.parse(cached);
  } catch (err) {
    return null;
  }
}

function verifySession(token) {
  const user = getSessionUser_(token);
  if (!user) {
    return { ok: false, authenticated: false };
  }
  return { ok: true, authenticated: true, user: user };
}

function logoutOwner(token) {
  if (token) {
    CacheService.getScriptCache().remove("session_" + token);
  }
  return { ok: true };
}

function loginOwner(payload) {
  const email = String((payload && payload.email) || "").trim().toLowerCase();
  const password = String((payload && payload.password) || "");

  if (!email || !password) {
    return { ok: false, message: "Email dan password wajib diisi." };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ownersSheet = getOrCreateOwnersSheet_(ss);
  const lastRow = ownersSheet.getLastRow();

  const rows = ownersSheet.getRange(2, 1, lastRow - 1, 7).getValues();
  for (let i = 0; i < rows.length; i++) {
    const rowEmail = String(rows[i][0] || "").trim().toLowerCase();
    if (rowEmail === email) {
      const name = formatCellString_(rows[i][1]);
      const role = formatCellString_(rows[i][2]) || "Owner";
      const salt = String(rows[i][3] || "");
      const savedHash = String(rows[i][4] || "");
      const inputHash = hashPassword_(salt, password);

      if (inputHash !== savedHash) {
        return { ok: false, message: "Email atau password salah." };
      }

      const nowStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm") + " WIB";
      ownersSheet.getRange(i + 2, 7).setValue("'" + nowStr);

      const user = { email: rowEmail, name: name, role: role };
      const token = createSessionToken_(user);
      return { ok: true, token: token, user: user };
    }
  }

  return { ok: false, message: "Email atau password salah." };
}

function getDashboardData(token) {
  const user = getSessionUser_(token);
  if (!user) {
    return {
      ok: false,
      unauthorized: true,
      message: "Sesi login berakhir. Silakan masuk kembali.",
    };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ordersSheet = getOrCreateOrdersSheet_(ss);
  ensureSummarySheet_(ss);
  const ownersSheet = getOrCreateOwnersSheet_(ss);

  const ordersLastRow = ordersSheet.getLastRow();
  const orders = [];

  const stats = {
    totalOrders: 0,
    activeOrders: 0,
    pendingOrders: 0,
    totalQty: 0,
    totalRevenue: 0,
    promoUsedCount: 0,
    codPolinesCount: 0,
  };

  if (ordersLastRow > 1) {
    const values = ordersSheet.getRange(2, 1, ordersLastRow - 1, 23).getValues();
    for (let i = values.length - 1; i >= 0; i--) {
      const r = values[i];
      const status = normalizeOrderStatus_(formatCellString_(r[22]));
      const isCancelled = status === "Dibatalkan";

      const order = {
        rowNumber: i + 2,
        timestamp: formatCellString_(r[0]),
        orderCode: formatCellString_(r[1]),
        batch: formatCellString_(r[2]),
        fullName: formatCellString_(r[3]),
        whatsapp: formatCellString_(r[4]),
        affiliationLabel: formatCellString_(r[5]),
        departmentOrClass: formatCellString_(r[6]),
        itemsSummary: formatCellString_(r[7]),
        qtyPuspaRaras: Number(r[8] || 0),
        qtySekarWengi: Number(r[9] || 0),
        qtyTamanSariSekar: Number(r[10] || 0),
        qtyTirtaSekar: Number(r[11] || 0),
        totalQty: Number(r[12] || 0),
        promoCode: formatCellString_(r[13]) || "-",
        unitPrice: Number(r[14] || 0),
        originalTotal: Number(r[15] || 0),
        discountAmount: Number(r[16] || 0),
        totalAmount: Number(r[17] || 0),
        deliveryMethodLabel: formatCellString_(r[18]),
        codSpot: formatCellString_(r[19]),
        address: formatCellString_(r[20]),
        paymentMethodLabel: formatCellString_(r[21]),
        status: status,
      };

      orders.push(order);

      stats.totalOrders++;
      if (!isCancelled) {
        stats.activeOrders++;
        if (status === "Konfirmasi") stats.pendingOrders++;
        stats.totalQty += order.totalQty;
        stats.totalRevenue += order.totalAmount;
        if (order.promoCode === "BERSAMASEKARANTI") stats.promoUsedCount++;
        if (order.deliveryMethodLabel.indexOf("Polines") !== -1) {
          stats.codPolinesCount++;
        }
      }
    }
  }

  const owners = [];
  const ownersLastRow = ownersSheet.getLastRow();
  if (ownersLastRow > 1) {
    const ownerValues = ownersSheet.getRange(2, 1, ownersLastRow - 1, 7).getValues();
    for (let j = 0; j < ownerValues.length; j++) {
      owners.push({
        email: formatCellString_(ownerValues[j][0]),
        name: formatCellString_(ownerValues[j][1]),
        role: formatCellString_(ownerValues[j][2]) || "Owner",
        createdAt: formatCellString_(ownerValues[j][5]),
        lastLogin: formatCellString_(ownerValues[j][6]),
      });
    }
  }

  return {
    ok: true,
    user: user,
    orders: orders,
    stats: stats,
    owners: owners,
    statuses: ORDER_STATUSES,
    spreadsheetUrl: ss.getUrl(),
  };
}

function updateOrderStatus(token, orderCode, newStatus) {
  const user = getSessionUser_(token);
  if (!user) {
    return { ok: false, unauthorized: true, message: "Sesi berakhir. Silakan login ulang." };
  }

  if (ORDER_STATUSES.indexOf(newStatus) === -1) {
    return { ok: false, message: "Status pesanan tidak valid." };
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateOrdersSheet_(ss);
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return { ok: false, message: "Data pesanan belum tersedia." };
    }

    const codes = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
    for (let i = 0; i < codes.length; i++) {
      if (formatCellString_(codes[i][0]) === String(orderCode)) {
        const targetRow = i + 2;
        const cell = sheet.getRange(targetRow, 23);
        cell.setValue(newStatus);
        cell.setBackground(STATUS_CELL_COLORS[newStatus] || "#FFFFFF");
        return { ok: true, orderCode: orderCode, newStatus: newStatus };
      }
    }

    return { ok: false, message: "Kode PO tidak ditemukan." };
  } catch (err) {
    return { ok: false, message: "Gagal mengubah status: " + String(err) };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Menghapus satu baris pesanan PO berdasarkan Kode PO dari Google Sheets.
 */
function deleteOrder(token, orderCode) {
  const user = getSessionUser_(token);
  if (!user) {
    return { ok: false, unauthorized: true, message: "Sesi berakhir. Silakan login ulang." };
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateOrdersSheet_(ss);
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return { ok: false, message: "Data pesanan kosong." };
    }

    const codes = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
    for (let i = 0; i < codes.length; i++) {
      if (formatCellString_(codes[i][0]) === String(orderCode)) {
        sheet.deleteRow(i + 2);
        return { ok: true, orderCode: orderCode, message: "Pesanan " + orderCode + " berhasil dihapus." };
      }
    }

    return { ok: false, message: "Kode PO tidak ditemukan." };
  } catch (err) {
    return { ok: false, message: "Gagal menghapus pesanan: " + String(err) };
  } finally {
    lock.releaseLock();
  }
}

function addOwnerAccount(token, payload) {
  const user = getSessionUser_(token);
  if (!user) {
    return { ok: false, unauthorized: true, message: "Sesi berakhir. Silakan login ulang." };
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    const name = String((payload && payload.name) || "").trim();
    const email = String((payload && payload.email) || "").trim().toLowerCase();
    const password = String((payload && payload.password) || "");

    if (name.length < 2) {
      return { ok: false, message: "Nama owner minimal 2 karakter." };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, message: "Format email tidak valid." };
    }
    if (password.length < 6) {
      return { ok: false, message: "Password minimal 6 karakter." };
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ownersSheet = getOrCreateOwnersSheet_(ss);
    const lastRow = ownersSheet.getLastRow();

    if (lastRow > 1) {
      const existingEmails = ownersSheet.getRange(2, 1, lastRow - 1, 1).getValues();
      for (let i = 0; i < existingEmails.length; i++) {
        if (String(existingEmails[i][0] || "").trim().toLowerCase() === email) {
          return { ok: false, message: "Email owner ini sudah terdaftar." };
        }
      }
    }

    const salt = Utilities.getUuid();
    const passwordHash = hashPassword_(salt, password);
    const nowStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm") + " WIB";

    ownersSheet.appendRow([
      email,
      name,
      "Owner",
      salt,
      passwordHash,
      "'" + nowStr,
      "-",
    ]);

    return { ok: true, message: "Owner baru berhasil ditambahkan." };
  } catch (err) {
    return { ok: false, message: "Gagal menambah owner: " + String(err) };
  } finally {
    lock.releaseLock();
  }
}

function changeOwnPassword(token, payload) {
  const user = getSessionUser_(token);
  if (!user) {
    return { ok: false, unauthorized: true, message: "Sesi berakhir. Silakan login ulang." };
  }

  const currentPassword = String((payload && payload.currentPassword) || "");
  const newPassword = String((payload && payload.newPassword) || "");

  if (newPassword.length < 6) {
    return { ok: false, message: "Password baru minimal 6 karakter." };
  }

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ownersSheet = getOrCreateOwnersSheet_(ss);
    const lastRow = ownersSheet.getLastRow();
    const rows = ownersSheet.getRange(2, 1, lastRow - 1, 7).getValues();

    for (let i = 0; i < rows.length; i++) {
      const rowEmail = String(rows[i][0] || "").trim().toLowerCase();
      if (rowEmail === user.email) {
        const oldSalt = String(rows[i][3] || "");
        const oldHash = String(rows[i][4] || "");
        if (hashPassword_(oldSalt, currentPassword) !== oldHash) {
          return { ok: false, message: "Password saat ini salah." };
        }

        const newSalt = Utilities.getUuid();
        const newHash = hashPassword_(newSalt, newPassword);
        ownersSheet.getRange(i + 2, 4, 1, 2).setValues([[newSalt, newHash]]);
        return { ok: true, message: "Password berhasil diperbarui." };
      }
    }

    return { ok: false, message: "Akun tidak ditemukan." };
  } catch (err) {
    return { ok: false, message: "Gagal memperbarui password: " + String(err) };
  } finally {
    lock.releaseLock();
  }
}
