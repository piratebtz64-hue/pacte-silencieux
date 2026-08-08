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
import {
  assessHeartRate,
  ensureNotificationPermission,
  maybeNotifyHighHr,
  type HrAssessment,
} from '@/lib/hr-alerts';
import {
  readBatteryPercent,
  BATTERY_SERVICE,
  type BatteryInfo,
} from '@/lib/gatt-battery';

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
  const [notifPermission, setNotifPermission] = useState<string>('default');
  const [assessment, setAssessment] = useState<HrAssessment | null>(null);
  const [battery, setBattery] = useState<BatteryInfo | null>(null);
  const deviceRef = useRef<BluetoothDevice | null>(null);
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setBleSupported(
      typeof navigator !== 'undefined' && 'bluetooth' in navigator
    );
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (bpm == null) {
      setAssessment(null);
      return;
    }
    const a = assessHeartRate(bpm);
    setAssessment(a);
    maybeNotifyHighHr(bpm, a);
  }, [bpm]);

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
    setBattery(null);
    setConn('idle');
    setStatus('Capteur déconnecté');
    setErrorInfo(null);
  }, [cleanupBle]);

  useEffect(() => () => cleanupBle(), [cleanupBle]);

  const enableNotifs = async () => {
    const p = await ensureNotificationPermission();
    setNotifPermission(p);
  };

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

    try {
      const locChar = await service.getCharacteristic(HR_SENSOR_LOCATION);
      const locVal = await locChar.readValue();
      if (locVal.byteLength >= 1) {
        setLocation(locationLabel(locVal.getUint8(0)));
      }
    } catch {
      setLocation(null);
    }

    setStatus('GATT : batterie…');
    const bat = await readBatteryPercent(server);
    setBattery(bat);

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
    setBattery(null);

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
              optionalServices: [HR_SERVICE, BATTERY_SERVICE],
            }
          : {
              filters: [{ services: [HR_SERVICE] }],
              optionalServices: [HR_SERVICE, BATTERY_SERVICE],
            }
      );

      deviceRef.current = device;
      device.addEventListener('gattserverdisconnected', () => {
        setStatus('Déconnecté (signal ou appareil)');
        setSource('none');
        setConn('idle');
        setBpm(null);
        setSample(null);
        setBattery(null);
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

  const warnStyle =
    assessment?.level === 'very_high'
      ? {
          borderColor: 'color-mix(in srgb, #b33 45%, var(--border))',
          background: 'color-mix(in srgb, #b33 12%, var(--card-solid))',
        }
      : assessment?.warn
        ? {
            borderColor: 'color-mix(in srgb, var(--gold) 50%, var(--border))',
            background: 'var(--gold-soft)',
          }
        : {
            borderColor: 'var(--border)',
            background: 'var(--card-solid)',
          };

  return (
    <div className="mt-6 p-4 rounded-2xl border" style={warnStyle}>
      <p
        className="text-[10px] uppercase tracking-[0.12em] font-semibold"
        style={{ color: 'var(--accent)' }}
      >
        Biofeedback · GATT Heart Rate
      </p>

      <div className="mt-3 flex items-end gap-2">
        <span
          className="font-serif text-4xl tabular-nums leading-none"
          style={{
            color:
              assessment?.level === 'very_high' || assessment?.level === 'high'
                ? '#a33'
                : 'var(--accent)',
          }}
        >
          {bpm ?? '—'}
        </span>
        <span className="text-sm pb-1" style={{ color: 'var(--muted)' }}>
          bpm
        </span>
      </div>

      {assessment && (
        <div className="mt-2">
          <p className="text-sm font-semibold">{assessment.label}</p>
          <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
            {assessment.advice}
          </p>
          {assessment.emergencyHint && (
            <p className="mt-2 text-xs font-semibold">
              Malaise, douleur, essoufflement intense →{' '}
              <a href="tel:15" className="underline">
                15
              </a>{' '}
              /{' '}
              <a href="tel:112" className="underline">
                112
              </a>
            </p>
          )}
        </div>
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

      {battery && (
        <p
          className="mt-2 text-xs font-semibold"
          style={{
            color:
              battery.level === 'critical' || battery.level === 'low'
                ? '#a33'
                : 'var(--muted)',
          }}
        >
          Batterie capteur : {battery.percent} % — {battery.label}
        </p>
      )}

      {status && (
        <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
          {status}
          {source === 'ble' ? ' · BLE' : ''}
          {source === 'manual' ? ' · Manuel' : ''}
        </p>
      )}

      <div className="mt-3 p-3 rounded-xl border text-xs" style={{ borderColor: 'var(--border)' }}>
        <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
          Alertes téléphone
        </p>
        <p className="mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
          Si le rythme dépasse ~110–140 bpm au repos, une notification navigateur
          peut s’afficher (onglet ou PWA ouverte). Ce n’est pas une surveillance
          médicale 24h/24.
        </p>
        {notifPermission === 'granted' ? (
          <p className="mt-2" style={{ color: 'var(--accent)' }}>
            Notifications activées
          </p>
        ) : notifPermission === 'denied' ? (
          <p className="mt-2" style={{ color: 'var(--muted)' }}>
            Refusées — réactive-les dans les réglages du navigateur.
          </p>
        ) : (
          <button
            type="button"
            onClick={enableNotifs}
            className="btn-ghost !text-xs !py-2 mt-2 w-full"
          >
            Autoriser les notifications d’alerte
          </button>
        )}
      </div>

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
                Scan élargi
              </label>
            </>
          ) : (
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Web Bluetooth absent — comptage manuel ou Chrome Android.
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

      <p className="mt-3 text-[11px] leading-relaxed" style={{ color: 'var(--muted)' }}>
        Indicatif uniquement — pas un dispositif médical ni une alarme d’urgence.
        En détresse : 15 · 112 · 3114.
      </p>
    </div>
  );
}
