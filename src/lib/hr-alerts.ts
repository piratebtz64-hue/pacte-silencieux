/**
 * Seuils indicatifs — PAS un diagnostic médical.
 * Les limites « dangereuses » dépendent de l’âge, du sport, des traitements, etc.
 * En malaise : 15 / 112.
 */

export type HrLevel = 'low' | 'calm' | 'elevated' | 'high' | 'very_high';

export type HrAssessment = {
  level: HrLevel;
  label: string;
  advice: string;
  /** Afficher bandeau d’attention */
  warn: boolean;
  /** Proposer notification navigateur */
  notify: boolean;
  /** Orientation urgence (malaise) — toujours accompagné du disclaimer */
  emergencyHint: boolean;
};

export function assessHeartRate(bpm: number): HrAssessment {
  if (bpm < 50) {
    return {
      level: 'low',
      label: 'Rythme bas',
      advice:
        'Peut être normal au repos (sportif) ou lié à un capteur mal placé. Si malaise, étourdissement : contacte les secours.',
      warn: true,
      notify: false,
      emergencyHint: true,
    };
  }
  if (bpm < 60) {
    return {
      level: 'low',
      label: 'Plutôt bas',
      advice: 'Souvent OK au repos. Respire tranquillement.',
      warn: false,
      notify: false,
      emergencyHint: false,
    };
  }
  if (bpm <= 90) {
    return {
      level: 'calm',
      label: 'Zone calme',
      advice: 'Idéale pour la cohérence cardiaque.',
      warn: false,
      notify: false,
      emergencyHint: false,
    };
  }
  if (bpm <= 110) {
    return {
      level: 'elevated',
      label: 'Un peu élevé',
      advice: 'Continue une respiration lente (4/6 ou cohérence 5/5), sans forcer.',
      warn: true,
      notify: false,
      emergencyHint: false,
    };
  }
  if (bpm <= 140) {
    return {
      level: 'high',
      label: 'Élevé',
      advice:
        'Au repos, c’est inhabituel. Arrête l’effort, assieds-toi, expire long. Si douleur thoracique, essoufflement intense ou malaise : 15 ou 112.',
      warn: true,
      notify: true,
      emergencyHint: true,
    };
  }
  return {
    level: 'very_high',
    label: 'Très élevé',
    advice:
      'Valeur très haute. Ce site n’est pas un outil médical. Si tu te sens mal : 15 ou 112 immédiatement.',
      warn: true,
      notify: true,
      emergencyHint: true,
  };
}

const NOTIFY_COOLDOWN_MS = 3 * 60 * 1000;
let lastNotifyAt = 0;
let lastNotifyLevel: HrLevel | null = null;

export async function ensureNotificationPermission(): Promise<
  NotificationPermission | 'unsupported'
> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

/**
 * Notification locale navigateur — uniquement si l’onglet / PWA peut l’afficher.
 * Ne remplace PAS une montre médicale ni les secours.
 */
export function maybeNotifyHighHr(bpm: number, assessment: HrAssessment) {
  if (!assessment.notify) return;
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const now = Date.now();
  if (
    now - lastNotifyAt < NOTIFY_COOLDOWN_MS &&
    lastNotifyLevel === assessment.level
  ) {
    return;
  }
  lastNotifyAt = now;
  lastNotifyLevel = assessment.level;

  try {
    new Notification('Pacte silencieux — rythme élevé',
      {
        body: `${bpm} bpm · ${assessment.label}. Si malaise : 15 ou 112. Ceci n’est pas un avis médical.`,
        tag: 'pacte-hr-high',
        silent: false,
      }
    );
  } catch {
    /* ignore */
  }
}
