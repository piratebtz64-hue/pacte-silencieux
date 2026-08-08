'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { parseBleError, BLE_TROUBLESHOOTING, type BleErrorInfo } from '@/lib/ble-errors';

type Source = 'none' | 'ble' | 'manual';
type ConnState = 'idle' | 'picking' | 'connecting' | 'live' | 'error';

export default function HeartRateFeedback() {
  const [bpm, setBpm] = useState<number | null>(null);
  const [source, setSource] = useState<Source>('none');
  const [conn, setConn] = useState<ConnState>('idle');
  const [status, setStatus] = useState('');
  const [errorInfo, setErrorInfo] = useState<BleErrorInfo | null>(null);
  const [bleSupported, setBleSupported] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [wideScan, setWideScan] = useState(false);
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

  const cleanupBle = useCallback(() => {
    unsubRef.current?.();
    unsubRef.current = null;
    try {
      deviceRef.current?.gatt?.disconnect();
    } catch {
      /* ignore */
    }
    deviceRef.current = null;
  }, []);

  const disconnectBle = useCallback(() => {
    cleanupBle();
    setSource('none');
    setBpm(null);
    setConn('idle');
    setStatus('Capteur déconnecté');
    setErrorInfo(null);
  }, [cleanupBle]);

  useEffect(() => () => cleanupBle(), [cleanupBle]);

  const attachNotifications = async (device: BluetoothDevice) => {
    setConn('connecting');
    setStatus('Liaison en cours…');

    if (!device.gatt) {
      throw Object.assign(new Error('Pas d’accès GATT sur cet appareil'), {
        name: 'NetworkError',
      });
    }

    const server = device.gatt.connected
      ? device.gatt
      : await device.gatt.connect();

    setStatus('Recherche du service Heart Rate…');
    const service = await server.getPrimaryService('heart_rate');

    setStatus('Activation des mesures…');
    const characteristic = await service.getCharacteristic(
      'heart_rate_measurement'
    );

    const onValue = (event: Event) => {
      const target = event.target as BluetoothRemoteGATTCharacteristic;
      const value = target.value;
      if (!value) return;
      const flags = value.getUint8(0);
      const hr =
        flags & 0x01 ? value.getUint16(1, true) : value.getUint8(1);
      if (hr > 30 && hr < 220) {
        setBpm(hr);
        setSource('ble');
        setConn('live');
        setStatus('Mesure en direct');
        setErrorInfo(null);
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

    setConn('live');
    setStatus('Connecté — en attente des battements…');
  };

  const connectBle = async () => {
    setErrorInfo(null);

    if (!('bluetooth' in navigator)) {
      const info = parseBleError({
        name: 'NotSupportedError',
        message: 'bluetooth not available',
      });
      setErrorInfo(info);
      setConn('error');
      setStatus(info.title);
      return;
    }

    setConn('picking');
    setStatus(
      wideScan
        ? 'Liste élargie — choisis ton appareil…'
        : 'Choisis ton capteur Heart Rate…'
    );

    let device: BluetoothDevice | undefined;

    try {
      // Étape 1 — sélecteur d’appareil (clic utilisateur requis)
      // @ts-expect-error Web Bluetooth
      device = await navigator.bluetooth.requestDevice(
        wideScan
          ? {
              acceptAllDevices: true,
              optionalServices: ['heart_rate'],
            }
          : {
              filters: [{ services: ['heart_rate'] }],
              optionalServices: ['heart_rate'],
            }
      );

      deviceRef.current = device;
      device.addEventListener('gattserverdisconnected', () => {
        setStatus('Capteur déconnecté (signal perdu ou appareil éteint)');
        setSource('none');
        setConn('idle');
        setBpm(null);
      });

      // Étape 2 → 4 : GATT + service + notifications
      await attachNotifications(device);
    } catch (e) {
      cleanupBle();
      const info = parseBleError(e);
      setErrorInfo(info);
      setConn('error');
      setStatus(info.title);
      setSource('none');
      setBpm(null);
    }
  };

  useEffect(() => {
    if (!manualCounting) return;
    if (manualLeft <= 0) {
      const estimated = Math.max(0, manualTicks * 4);
      setBpm(estimated);
      setSource('manual');
      setManualCounting(false);
      setStatus(`Environ ${estimated} bpm (comptage 15 s)`);
      setConn('idle');
      return;
    }
    const t = setTimeout(() => setManualLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [manualCounting, manualLeft, manualTicks]);

  const startManual = () => {
    setManualTicks(0);
    setManualLeft(15);
    setManualCounting(true);
    setErrorInfo(null);
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
          {conn === 'connecting' || conn === 'picking' ? '…' : ''}
          {source === 'ble' ? ' · Bluetooth' : ''}
          {source === 'manual' ? ' · Manuel' : ''}
        </p>
      )}

      {/* Erreur structurée */}
      {errorInfo && (
        <div
          className="mt-3 p-3 rounded-xl border text-sm"
          style={{
            borderColor: 'color-mix(in srgb, var(--gold) 40%, var(--border))',
            background: 'var(--gold-soft)',
          }}
        >
          <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
            {errorInfo.title}
          </p>
          <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
            {errorInfo.message}
          </p>
          <ul className="mt-2 space-y-1 text-xs" style={{ color: 'var(--muted)' }}>
            {errorInfo.actions.map((a) => (
              <li key={a}>· {a}</li>
            ))}
          </ul>
          <p className="mt-2 text-[10px]" style={{ color: 'var(--muted)' }}>
            Code : {errorInfo.code}
          </p>
        </div>
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
          {bleSupported ? (
            <>
              <button
                type="button"
                disabled={conn === 'picking' || conn === 'connecting'}
                onClick={conn === 'live' ? disconnectBle : connectBle}
                className="btn-ghost !text-sm !py-2 w-full disabled:opacity-50"
              >
                {conn === 'picking' || conn === 'connecting'
                  ? 'Connexion…'
                  : conn === 'live'
                    ? 'Déconnecter le capteur'
                    : 'Connecter montre / ceinture Bluetooth'}
              </button>
              <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: 'var(--muted)' }}>
                <input
                  type="checkbox"
                  checked={wideScan}
                  onChange={(e) => setWideScan(e.target.checked)}
                />
                Scan élargi (si le capteur n’apparaît pas)
              </label>
            </>
          ) : (
            <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
              Web Bluetooth non disponible ici (souvent iPhone Safari). Utilise le
              comptage manuel ou Chrome sur Android.
            </p>
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

      <button
        type="button"
        onClick={() => setShowGuide((v) => !v)}
        className="mt-4 text-xs font-semibold w-full text-left"
        style={{ color: 'var(--accent)' }}
      >
        {showGuide ? 'Masquer le guide de dépannage' : 'Guide de dépannage Bluetooth'}
      </button>

      {showGuide && (
        <div className="mt-3 space-y-4 text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          {BLE_TROUBLESHOOTING.map((block) => (
            <div key={block.title}>
              <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                {block.title}
              </p>
              <ul className="mt-1 space-y-1">
                {block.items.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <p className="mt-3 text-[11px] leading-relaxed" style={{ color: 'var(--muted)' }}>
        Indicatif uniquement — pas un dispositif médical. La cohérence 5/5 fonctionne
        sans capteur.
      </p>
    </div>
  );
}
