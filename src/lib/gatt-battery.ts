/**
 * Profil GATT Battery Service (Bluetooth SIG)
 * Service 0x180F · Characteristic Battery Level 0x2A19 (uint8 0–100 %)
 */

export const BATTERY_SERVICE = 'battery_service';
export const BATTERY_LEVEL = 'battery_level';

export type BatteryInfo = {
  percent: number;
  level: 'critical' | 'low' | 'ok' | 'full';
  label: string;
};

export function classifyBattery(percent: number): BatteryInfo {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  if (p <= 10) {
    return {
      percent: p,
      level: 'critical',
      label: 'Batterie critique — recharge le capteur',
    };
  }
  if (p <= 25) {
    return {
      percent: p,
      level: 'low',
      label: 'Batterie faible',
    };
  }
  if (p >= 90) {
    return {
      percent: p,
      level: 'full',
      label: 'Batterie pleine',
    };
  }
  return {
    percent: p,
    level: 'ok',
    label: 'Batterie OK',
  };
}

/**
 * Tente de lire le % batterie. Beaucoup de ceintures l’exposent ;
 * certaines montres non.
 */
export async function readBatteryPercent(
  server: BluetoothRemoteGATTServer
): Promise<BatteryInfo | null> {
  try {
    const service = await server.getPrimaryService(BATTERY_SERVICE);
    const characteristic = await service.getCharacteristic(BATTERY_LEVEL);
    const value = await characteristic.readValue();
    if (value.byteLength < 1) return null;
    return classifyBattery(value.getUint8(0));
  } catch {
    return null;
  }
}
