'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { parseBleError, BLE_GUIDE, type BleErrorInfo } from '@/lib/ble-errors';
import {
  HR_SERVICE,
  HR_MEASUREMENT,
  HR_SENSOR_LOCATION,
  parseHeartRateMeasurement,
  contactLabel,
  locationLabel,
  type HeartRateSample,
} from '@/lib/gatt-heart-rate';

type Source = 'none' | 'ble' | 'manual';
type ConnState = 'idle' | 'picking' | 'connecting' | 'live' | 'error';

export default function HeartRateFeedback() {
  const [bpm, setBpm] = useState<number | null>(null);
  const [sample, setSample] = useState<HeartRateSample | null>(null);
  const [location, setLocation] = useState<string | null>(null);
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
    setSample(null);
    setLocation(null);
    setConn('idle');
    setStatus('Capteur déconnecté');
    setErrorInfo(null);
  }, [cleanupBle]);

  useEffect(() => () => cleanupBle(), [cleanupBle]);

  const attachGattProfile = async (device: BluetoothDevice) => {
    setConn('connecting');
    setStatus('GATT : connexion…');

    if (!device.gatt) {
      throw Object.assign(new Error('GATT indisponible'), {
        name: 'NetworkError',
      });
    }

    const server = device.gatt.connected
      ? device.gatt
      : await device.gatt.connect();

    setStatus('GATT : service Heart Rate (0x180D)…');
    const service = await server.getPrimaryService(HR_SERVICE);

    // Emplacement capteur (poignet PPG vs poitrine) — optionnel
    try {
      const locChar = await service.getCharacteristic(HR_SENSOR_LOCATION);
      const locVal = await locChar.readValue();
      if (locVal.byteLength >= 1) {
        setLocation(locationLabel(locVal.getUint8(0)));
      }
    } catch {
      setLocation(null);
    }

    setStatus('GATT : notifications mesure (0x2A37)…');
    const characteristic = await service.getCharacteristic(HR_MEASUREMENT);

    const onValue = (event: Event) => {
      const target = event.target as BluetoothRemoteGATTCharacteristic;
      if (!target.value) return;
      const parsed = parseHeartRateMeasurement(target.value);
      if (!parsed) return;
      setSample(parsed);
      setBpm(parsed.bpm);
      setSource('ble');
      setConn('live');
      setStatus('Mesure en direct (profil GATT HR)');
      setErrorInfo(null);
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
    setStatus('Connecté — en attente des échantillons…');
  };

  const connectBle = async () => {
    setErrorInfo(null);
    setSample(null);
    setLocation(null);

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
        ? 'Sélecteur élargi — choisis l’appareil…'
        : 'Sélecteur Heart Rate (0x180D)…'
    );

    try {
      // @ts-expect-error Web Bluetooth
      const device = await navigator.bluetooth.requestDevice(
        wideScan
          ? {
              acceptAllDevices: true,
              optionalServices: [HR_SERVICE],
            }
          : {
              filters: [{ services: [HR_SERVICE] }],
              optionalServices: [HR_SERVICE],
            }
      );

      deviceRef.current = device;
      device.addEventListener('gattserverdisconnected', () => {
        setStatus('Déconnecté (signal ou appareil)');
        setSource('none');
        setConn('idle');
        setBpm(null);
        setSample(null);
      });

      await attachGattProfile(device);
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
      setStatus(`Environ ${estimated} bpm (manuel 15 s)`);
      setConn('idle');
      return;
    }
    const t = setTimeout(() => setManualLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [manualCounting, manualLeft, manualTicks]);

  const zone =
    bpm == null
      ? null
      : bpm < 60
        ? 'Plutôt bas — respire tranquillement'
        : bpm <= 80
          ? 'Zone calme — idéale pour la cohérence'
          : bpm <= 100
            ? 'Un peu élevé — continue la respiration lente'
            : 'Élevé — expire longue 4/6, sans forcer';

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
        Biofeedback · GATT Heart Rate
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
        <p className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>
          {zone}
        </p>
      )}

      {sample && source === 'ble' && (
        <div className="mt-2 text-[11px] space-y-0.5" style={{ color: 'var(--muted)' }}>
          <p>{contactLabel(sample.contact)}</p>
          {location && <p>Emplacement : {location}</p>}
          {sample.rrIntervalsMs.length > 0 && (
            <p>RR : {sample.rrIntervalsMs.slice(-3).join(' · ')} ms</p>
          )}
        </div>
      )}

      {status && (
        <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
          {status}
          {source === 'ble' ? ' · BLE' : ''}
          {source === 'manual' ? ' · Manuel' : ''}
        </p>
      )}

      {errorInfo && (
        <div
          className="mt-3 p-3 rounded-xl border text-sm"
          style={{
            borderColor: 'color-mix(in srgb, var(--gold) 40%, var(--border))',
            background: 'var(--gold-soft)',
          }}
        >
          <p className="font-semibold">{errorInfo.title}</p>
          <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
            {errorInfo.message}
          </p>
          <ul className="mt-2 space-y-1 text-xs" style={{ color: 'var(--muted)' }}>
            {errorInfo.actions.map((a) => (
              <li key={a}>· {a}</li>
            ))}
          </ul>
          <p className="mt-2 text-[10px]" style={{ color: 'var(--muted)' }}>
            Code {errorInfo.code}
          </p>
        </div>
      )}

      {manualCounting ? (
        <div className="mt-4 text-center">
          <p className="font-serif text-2xl" style={{ color: 'var(--accent)' }}>
            {manualLeft}s
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
                  ? 'Connexion GATT…'
                  : conn === 'live'
                    ? 'Déconnecter'
                    : 'Connecter le capteur (GATT HR / PPG BLE)'}
              </button>
              <label
                className="flex items-center gap-2 text-xs cursor-pointer"
                style={{ color: 'var(--muted)' }}
              >
                <input
                  type="checkbox"
                  checked={wideScan}
                  onChange={(e) => setWideScan(e.target.checked)}
                />
                Scan élargi (si le capteur n’apparaît pas)
              </label>
            </>
          ) : (
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Web Bluetooth absent (souvent iPhone Safari). Comptage manuel ou
              Chrome Android.
            </p>
          )}
          <button
            type="button"
            onClick={() => {
              setManualTicks(0);
              setManualLeft(15);
              setManualCounting(true);
              setErrorInfo(null);
              setStatus('Compte chaque battement');
            }}
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
        {showGuide ? 'Masquer le guide' : 'Guide : Bluetooth, GATT, PPG'}
      </button>

      {showGuide && (
        <div className="mt-3 space-y-4 text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
          <p style={{ color: 'var(--foreground)' }}>{BLE_GUIDE.intro}</p>
          {BLE_GUIDE.sections.map((s) => (
            <div key={s.id}>
              <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                {s.title}
              </p>
              <ul className="mt-1.5 space-y-1">
                {s.items.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <p className="mt-3 text-[11px]" style={{ color: 'var(--muted)' }}>
        Indicatif — pas un dispositif médical. Cohérence 5/5 sans capteur possible.
      </p>
    </div>
  );
}
