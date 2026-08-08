'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Biofeedback fréquence cardiaque — réaliste pour le web :
 * 1) Capteur Bluetooth (montre / ceinture BLE Heart Rate)
 * 2) Comptage manuel (15 s × 4) si pas d’appareil
 *
 * Le navigateur ne peut pas lire le pouls « magiquement » sans
 * capteur ou estimation caméra peu fiable. On reste honnête.
 */

type Source = 'none' | 'ble' | 'manual';

export default function HeartRateFeedback() {
  const [bpm, setBpm] = useState<number | null>(null);
  const [source, setSource] = useState<Source>('none');
  const [status, setStatus] = useState<string>('');
  const [bleSupported, setBleSupported] = useState(false);
  const [manualCounting, setManualCounting] = useState(false);
  const [manualTicks, setManualTicks] = useState(0);
  const [manualLeft, setManualLeft] = useState(15);
  const deviceRef = useRef<BluetoothDevice | null>(null);
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setBleSupported(
      typeof navigator !== 'undefined' && 'bluetooth' in navigator
    );
  }, []);

  const disconnectBle = useCallback(() => {
    unsubRef.current?.();
    unsubRef.current = null;
    try {
      deviceRef.current?.gatt?.disconnect();
    } catch {
      /* ignore */
    }
    deviceRef.current = null;
    if (source === 'ble') {
      setSource('none');
      setBpm(null);
      setStatus('Capteur déconnecté');
    }
  }, [source]);

  useEffect(() => () => disconnectBle(), [disconnectBle]);

  const connectBle = async () => {
    if (!('bluetooth' in navigator)) {
      setStatus('Bluetooth non disponible sur cet appareil / navigateur.');
      return;
    }
    setStatus('Choisis ton capteur…');
    try {
      // @ts-expect-error Web Bluetooth
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
        optionalServices: ['heart_rate'],
      });
      deviceRef.current = device;
      device.addEventListener('gattserverdisconnected', () => {
        setStatus('Capteur déconnecté');
        setSource('none');
        setBpm(null);
      });
      const server = await device.gatt!.connect();
      const service = await server.getPrimaryService('heart_rate');
      const characteristic = await service.getCharacteristic(
        'heart_rate_measurement'
      );

      const onValue = (event: Event) => {
        const target = event.target as BluetoothRemoteGATTCharacteristic;
        const value = target.value;
        if (!value) return;
        // Flags : bit 0 = format uint8 ou uint16
        const flags = value.getUint8(0);
        let hr: number;
        if (flags & 0x01) {
          hr = value.getUint16(1, true);
        } else {
          hr = value.getUint8(1);
        }
        if (hr > 30 && hr < 220) {
          setBpm(hr);
          setSource('ble');
          setStatus('En direct');
        }
      };

      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', onValue);
      unsubRef.current = () => {
        characteristic.removeEventListener(
          'characteristicvaluechanged',
          onValue
        );
        characteristic.stopNotifications().catch(() => {});
      };
      setStatus('Connecté — mesure en cours');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Connexion annulée';
      setStatus(msg.includes('cancel') || msg.includes('User') ? 'Annulé' : msg);
    }
  };

  // Comptage manuel 15 secondes
  useEffect(() => {
    if (!manualCounting) return;
    if (manualLeft <= 0) {
      const estimated = manualTicks * 4;
      setBpm(estimated);
      setSource('manual');
      setManualCounting(false);
      setStatus(`Environ ${estimated} bpm (comptage 15 s)`);
      return;
    }
    const t = setTimeout(() => setManualLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [manualCounting, manualLeft, manualTicks]);

  const startManual = () => {
    setManualTicks(0);
    setManualLeft(15);
    setManualCounting(true);
    setStatus('Compte chaque battement (doigt sur le cou ou le poignet)');
  };

  const zone =
    bpm == null
      ? null
      : bpm < 60
        ? 'Plutôt bas — respire tranquillement'
        : bpm <= 80
          ? 'Zone calme — idéale pour la cohérence'
          : bpm <= 100
            ? 'Un peu élevé — continue la respiration lente'
            : 'Élevé — privilégie expire longue 4/6, sans forcer';

  return (
    <div
      className="mt-6 p-4 rounded-2xl border"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--card-solid)',
      }}
    >
      <p
        className="text-[10px] uppercase tracking-[0.12em] font-semibold"
        style={{ color: 'var(--accent)' }}
      >
        Biofeedback · fréquence cardiaque
      </p>

      <div className="mt-3 flex items-end gap-2">
        <span
          className="font-serif text-4xl tabular-nums leading-none"
          style={{ color: 'var(--accent)' }}
        >
          {bpm ?? '—'}
        </span>
        <span className="text-sm pb-1" style={{ color: 'var(--muted)' }}>
          bpm
        </span>
      </div>

      {zone && (
        <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          {zone}
        </p>
      )}

      {status && (
        <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
          {status}
          {source === 'ble' ? ' · Bluetooth' : source === 'manual' ? ' · Manuel' : ''}
        </p>
      )}

      {manualCounting ? (
        <div className="mt-4 text-center">
          <p className="font-serif text-2xl" style={{ color: 'var(--accent)' }}>
            {manualLeft}s
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
            Appuie à chaque battement
          </p>
          <button
            type="button"
            onClick={() => setManualTicks((n) => n + 1)}
            className="btn-primary !text-sm mt-3 w-full"
          >
            Battement · {manualTicks}
          </button>
          <button
            type="button"
            onClick={() => setManualCounting(false)}
            className="text-xs mt-2"
            style={{ color: 'var(--muted)' }}
          >
            Annuler
          </button>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          {bleSupported && (
            <button
              type="button"
              onClick={source === 'ble' ? disconnectBle : connectBle}
              className="btn-ghost !text-sm !py-2 w-full"
            >
              {source === 'ble'
                ? 'Déconnecter le capteur'
                : 'Connecter montre / ceinture Bluetooth'}
            </button>
          )}
          <button
            type="button"
            onClick={startManual}
            className="btn-ghost !text-sm !py-2 w-full"
          >
            Compter mon pouls (15 secondes)
          </button>
        </div>
      )}

      <p className="mt-3 text-[11px] leading-relaxed" style={{ color: 'var(--muted)' }}>
        Sans capteur Bluetooth, le site ne peut pas lire ton cœur tout seul.
        Estimation manuelle ou appareil compatible (norme Heart Rate BLE).
        Indicatif uniquement — pas un dispositif médical.
      </p>
    </div>
  );
}
