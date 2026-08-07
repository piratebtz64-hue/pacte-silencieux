const STORAGE_KEY = 'pacte-notif-pref';

export type NotifPref = 'on' | 'off' | 'unset';

export function getNotifPref(): NotifPref {
  if (typeof window === 'undefined') return 'unset';
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === 'on' || v === 'off') return v;
  return 'unset';
}

export function setNotifPref(pref: NotifPref) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, pref);
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof Notification === 'undefined') return false;
  if (Notification.permission === 'granted') {
    setNotifPref('on');
    return true;
  }
  if (Notification.permission === 'denied') {
    setNotifPref('off');
    return false;
  }
  const result = await Notification.requestPermission();
  const ok = result === 'granted';
  setNotifPref(ok ? 'on' : 'off');
  return ok;
}

export function notify(title: string, body: string) {
  if (typeof window === 'undefined') return;
  if (getNotifPref() !== 'on') return;
  if (typeof Notification === 'undefined') return;
  if (Notification.permission !== 'granted') return;
  if (document.visibilityState === 'visible') return; // pas de notif si onglet actif

  try {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      silent: false,
    });
  } catch {
    /* ignore */
  }
}
