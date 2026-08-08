/**
 * Profil GATT Heart Rate (Bluetooth SIG)
 * Service UUID : 0x180D (heart_rate)
 * Characteristic : 0x2A37 (heart_rate_measurement)
 *
 * Les capteurs PPG (montre optique) fonctionnent ICI seulement s’ils
 * diffusent ce profil standard. Sinon le firmware est propriétaire
 * et inaccessible depuis le navigateur.
 */

export const HR_SERVICE = 'heart_rate'; // 0x180D
export const HR_MEASUREMENT = 'heart_rate_measurement'; // 0x2A37
export const HR_SENSOR_LOCATION = 'body_sensor_location'; // 0x2A38

export type SensorContact = 'unknown' | 'supported_no_contact' | 'supported_contact' | 'not_supported';

export type HeartRateSample = {
  bpm: number;
  contact: SensorContact;
  /** Intervalles RR en millisecondes (si fournis) — base future HRV */
  rrIntervalsMs: number[];
  energyExpendedKj: number | null;
  rawFlags: number;
  /** Origine probable : ceinture électrique vs PPG optique exposé en BLE */
  sensorHint: 'optical_or_strap' | 'unknown';
};

/**
 * Parse le payload Heart Rate Measurement (spec Bluetooth SIG).
 * https://www.bluetooth.com/specifications/specs/heart-rate-service-1-0/
 */
export function parseHeartRateMeasurement(
  dataView: DataView
): HeartRateSample | null {
  if (dataView.byteLength < 2) return null;

  const flags = dataView.getUint8(0);
  const hr16 = (flags & 0x01) !== 0;
  const contactBits = (flags >> 1) & 0x03;
  const energyPresent = (flags & 0x08) !== 0;
  const rrPresent = (flags & 0x10) !== 0;

  let offset = 1;
  let bpm: number;
  if (hr16) {
    if (dataView.byteLength < offset + 2) return null;
    bpm = dataView.getUint16(offset, true);
    offset += 2;
  } else {
    bpm = dataView.getUint8(offset);
    offset += 1;
  }

  if (bpm < 30 || bpm > 220) return null;

  let contact: SensorContact = 'unknown';
  if (contactBits === 0b10) contact = 'supported_no_contact';
  else if (contactBits === 0b11) contact = 'supported_contact';
  else if (contactBits === 0b00 || contactBits === 0b01) {
    // 0b01 sometimes "not supported" depending on interpretation
    contact = contactBits === 0b01 ? 'not_supported' : 'unknown';
  }

  let energyExpendedKj: number | null = null;
  if (energyPresent && dataView.byteLength >= offset + 2) {
    energyExpendedKj = dataView.getUint16(offset, true);
    offset += 2;
  }

  const rrIntervalsMs: number[] = [];
  if (rrPresent) {
    while (offset + 2 <= dataView.byteLength) {
      // Unit: 1/1024 second
      const rr = dataView.getUint16(offset, true);
      offset += 2;
      const ms = Math.round((rr / 1024) * 1000);
      if (ms > 200 && ms < 2000) rrIntervalsMs.push(ms);
    }
  }

  return {
    bpm,
    contact,
    rrIntervalsMs,
    energyExpendedKj,
    rawFlags: flags,
    sensorHint: 'optical_or_strap',
  };
}

export function contactLabel(c: SensorContact): string {
  switch (c) {
    case 'supported_contact':
      return 'Contact détecté';
    case 'supported_no_contact':
      return 'Pas de contact peau — repositionne le capteur';
    case 'not_supported':
      return 'Contact non signalé par l’appareil';
    default:
      return 'Contact non renseigné';
  }
}

/** Emplacements body sensor location (0x2A38) */
export function locationLabel(code: number): string {
  const map: Record<number, string> = {
    0: 'Autre',
    1: 'Poitrine',
    2: 'Poignet (souvent PPG)',
    3: 'Doigt (souvent PPG)',
    4: 'Main',
    5: 'Oreille',
    6: 'Pied',
  };
  return map[code] || `Code ${code}`;
}
