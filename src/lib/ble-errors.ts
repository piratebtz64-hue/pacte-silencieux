/** Erreurs Web Bluetooth → messages FR + actions */

export type BleErrorInfo = {
  code: string;
  title: string;
  message: string;
  actions: string[];
};

export function parseBleError(err: unknown): BleErrorInfo {
  const raw =
    err instanceof Error
      ? `${err.name}: ${err.message}`
      : String(err ?? 'Erreur inconnue');
  const name = err instanceof Error ? err.name : '';
  const message = err instanceof Error ? err.message : '';
  const lower = `${name} ${message}`.toLowerCase();

  if (
    lower.includes('cancel') ||
    lower.includes('user cancelled') ||
    lower.includes('user denied')
  ) {
    return {
      code: 'USER_CANCEL',
      title: 'Sélection annulée',
      message: 'Tu as fermé la fenêtre de choix d’appareil.',
      actions: ['Réessaie et sélectionne le capteur dans la liste'],
    };
  }

  if (name === 'NotFoundError' || lower.includes('no devices') || lower.includes('not found')) {
    return {
      code: 'NOT_FOUND',
      title: 'Aucun capteur trouvé',
      message:
        'Aucun appareil avec le service GATT Heart Rate (0x180D) n’est visible.',
      actions: [
        'Allume le capteur (LED / mode appairage)',
        'Rapproche-le (< 1 m)',
        'Active le scan élargi',
        'Android : autorise la localisation pour le scan BLE',
        'Ferme Strava / Polar / Google Fit qui monopolisent le capteur',
      ],
    };
  }

  if (name === 'SecurityError' || lower.includes('secure context') || lower.includes('https')) {
    return {
      code: 'SECURITY',
      title: 'Connexion bloquée',
      message: 'Web Bluetooth exige HTTPS et un clic utilisateur.',
      actions: [
        'Utilise https://pacte-silencieux.vercel.app',
        'Chrome ou Edge (Android / desktop)',
      ],
    };
  }

  if (lower.includes('user gesture') || lower.includes('user activation')) {
    return {
      code: 'GESTURE',
      title: 'Clic requis',
      message: 'Le navigateur exige un appui direct sur le bouton.',
      actions: ['Appuie sur « Connecter le capteur »'],
    };
  }

  if (
    name === 'NetworkError' ||
    lower.includes('gatt') ||
    lower.includes('connect')
  ) {
    return {
      code: 'GATT',
      title: 'Échec de liaison GATT',
      message: 'Appareil vu, mais la session Bluetooth s’est coupée.',
      actions: [
        'Rapproche le capteur',
        'Éteins / rallume le capteur',
        'Redémarre le Bluetooth du téléphone',
        'Recharge la page si ça reste bloqué',
      ],
    };
  }

  if (
    lower.includes('no services') ||
    lower.includes('service') ||
    lower.includes('characteristic')
  ) {
    return {
      code: 'NO_HR_SERVICE',
      title: 'Profil Heart Rate absent',
      message:
        'Cet appareil n’expose pas le service GATT 0x180D. Beaucoup de montres PPG restent en mode propriétaire.',
      actions: [
        'Ceinture BLE (Polar H9/H10, etc.) : souvent compatible',
        'Montre : active « diffusion FC » / broadcast si le réglage existe',
        'Sinon : comptage manuel 15 s',
      ],
    };
  }

  if (lower.includes('bluetooth') && (lower.includes('not available') || lower.includes('undefined'))) {
    return {
      code: 'UNSUPPORTED',
      title: 'Web Bluetooth non supporté',
      message: 'Fréquent sur iPhone Safari et Firefox.',
      actions: ['Chrome Android', 'Chrome / Edge ordinateur', 'Comptage manuel'],
    };
  }

  if (name === 'InvalidStateError' || lower.includes('already')) {
    return {
      code: 'BUSY',
      title: 'Bluetooth occupé',
      message: 'Une opération est déjà en cours.',
      actions: ['Attends 5 s', 'Recharge la page', 'Déconnecte les autres applis'],
    };
  }

  return {
    code: 'UNKNOWN',
    title: 'Erreur de connexion',
    message: raw.slice(0, 180),
    actions: ['Réessaie', 'Voir le guide ci-dessous', 'Comptage manuel'],
  };
}

/** Guide structuré en 4 blocs clairs */
export const BLE_GUIDE = {
  intro:
    'Le site lit uniquement le profil Bluetooth standard « Heart Rate » (GATT 0x180D). Les capteurs PPG (optiques) marchent seulement s’ils diffusent ce profil.',
  sections: [
    {
      id: '1',
      title: '1. Ce qui est compatible',
      items: [
        'Ceintures cardio BLE avec service Heart Rate',
        'Montres / bracelets PPG qui exposent 0x180D (rare sans réglage « broadcast »)',
        'Chrome ou Edge sur Android / ordinateur (HTTPS)',
      ],
    },
    {
      id: '2',
      title: '2. PPG : comment ça s’intègre',
      items: [
        'PPG = mesure optique (LED verte sous la montre)',
        'Si la montre envoie le bpm via GATT Heart Rate → l’app l’affiche comme n’importe quel capteur',
        'Si la montre garde le PPG en protocole fermé (Apple Watch, etc.) → le navigateur ne peut pas y accéder',
        'Dans ce cas : ceinture BLE ou comptage manuel',
      ],
    },
    {
      id: '3',
      title: '3. Étapes de connexion',
      items: [
        'Allumer le capteur / mode appairage',
        'Chrome → bouton « Connecter le capteur »',
        'Choisir l’appareil dans la liste',
        'Attendre « Mesure en direct » et le bpm',
        'Si liste vide : cocher « Scan élargi »',
      ],
    },
    {
      id: '4',
      title: '4. Si ça échoue',
      items: [
        'Bluetooth OFF/ON',
        'Capteur à < 1 m, pas pris par une autre appli',
        'Android : permission Localisation pour le scan BLE',
        'Recharger la page',
        'Plan B : comptage manuel 15 secondes (×4 = bpm)',
        'La cohérence cardiaque 5/5 fonctionne sans aucun capteur',
      ],
    },
  ],
} as const;
