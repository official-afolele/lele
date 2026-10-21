import { WishEntry } from '../types';

/**
 * Normalizes and unscrambles wish/RSVP entries from Google Apps Script,
 * localStorage, or server endpoints. Automatically detects and repairs
 * swapped fields (e.g. timestamp in name, attendance in message).
 */
export function normalizeWishEntry(raw: any, index = 0): WishEntry {
  if (!raw || typeof raw !== 'object') {
    return {
      id: `wish_${Date.now()}_${index}`,
      name: 'Tamu Undangan',
      message: 'Selamat menempuh hidup baru!',
      attendance: 'hadir',
      timestamp: 'Baru saja'
    };
  }

  const rawName = String(raw.name || '').trim();
  const rawMsg = String(raw.message || '').trim();
  const rawAtt = String(raw.attendance || '').trim();
  const rawTime = String(raw.timestamp || raw.waktu || raw.time || '').trim();
  const id = String(raw.id || `wish_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 6)}`);

  // Helper patterns
  const isDatePattern = (str: string) =>
    /\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}|\d{1,2}:\d{2}(:\d{2})?(\s*WIB)?/i.test(str);

  const isAttendancePattern = (str: string) => {
    const s = str.toLowerCase();
    return (
      s.includes('hadir') ||
      s.includes('ragu') ||
      s.includes('tidak') ||
      str.includes('✅') ||
      str.includes('❓') ||
      str.includes('❌') ||
      str.includes('✓') ||
      str.includes('✗')
    );
  };

  const parseAttendance = (str: string): 'hadir' | 'ragu' | 'tidak' => {
    const s = str.toLowerCase();
    if (s.includes('ragu') || str.includes('❓')) return 'ragu';
    if (s.includes('tidak') || s.includes('batal') || s.includes('halangan') || str.includes('❌') || str.includes('✗')) return 'tidak';
    return 'hadir';
  };

  // Case 1: Fields are scrambled (name is a timestamp, message is an attendance status, etc.)
  if (isDatePattern(rawName)) {
    const realTimestamp = rawName;
    let realAttendance: 'hadir' | 'ragu' | 'tidak' = 'hadir';
    let realMessage = '';
    let realName = '';

    // Attendance detection
    if (isAttendancePattern(rawMsg)) {
      realAttendance = parseAttendance(rawMsg);
    } else if (isAttendancePattern(rawAtt)) {
      realAttendance = parseAttendance(rawAtt);
    }

    // Message detection
    if (rawTime && !isDatePattern(rawTime)) {
      realMessage = rawTime;
    } else if (!isAttendancePattern(rawMsg)) {
      realMessage = rawMsg;
    } else {
      realMessage = 'Selamat menempuh hidup baru untuk kedua mempelai!';
    }

    // Name detection
    if (raw.waktu && !isDatePattern(String(raw.waktu)) && !/^\d+$/.test(String(raw.waktu).trim())) {
      realName = String(raw.waktu).trim();
    } else if (raw.guestName && !isDatePattern(String(raw.guestName))) {
      realName = String(raw.guestName).trim();
    } else if (raw.sender && !isDatePattern(String(raw.sender))) {
      realName = String(raw.sender).trim();
    } else {
      realName = 'Tamu Undangan';
    }

    return {
      id,
      name: realName,
      message: realMessage,
      attendance: realAttendance,
      timestamp: realTimestamp
    };
  }

  // Case 2: Message contains attendance label (e.g. user or script swapped message and attendance)
  if (isAttendancePattern(rawMsg) && rawMsg.length < 25 && (!rawAtt || rawAtt === 'tidak')) {
    const detectedAtt = parseAttendance(rawMsg);
    let realMsg = rawTime && !isDatePattern(rawTime) ? rawTime : 'Selamat berbahagia!';
    return {
      id,
      name: rawName || 'Tamu Undangan',
      message: realMsg,
      attendance: detectedAtt,
      timestamp: isDatePattern(rawTime) ? rawTime : 'Baru saja'
    };
  }

  // Normal Case
  return {
    id,
    name: rawName || 'Tamu Undangan',
    message: rawMsg || '-',
    attendance: parseAttendance(rawAtt),
    timestamp: rawTime || 'Baru saja'
  };
}

export function normalizeWishList(list: any[]): WishEntry[] {
  if (!Array.isArray(list)) return [];
  return list.map((item, idx) => normalizeWishEntry(item, idx));
}
