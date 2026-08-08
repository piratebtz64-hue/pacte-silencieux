/**
 * Cartographie des erreurs Web Bluetooth → messages FR + actions.
 * Sources : spec Web Bluetooth, Chrome, retours terrain cardio BLE.
 */

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
  const name = err instanceof DOMException || err instanceof Error ? err.name : '';
  const message =
    err instanceof Error ? err.message : typeof err === 'string' ? err : '';
  const lower = `${name} ${message}`.toLowerCase();

  // 1. Annulation utilisateur
  if (
    lower.includes('cancel') ||
    lower.includes('user cancelled') ||
    lower.includes('user denied') ||
    name === 'NotFoundError' && lower.includes('chooser')
  ) {
    return {
      code: 'USER_CANCEL',
      title: 'Sélection annulée',
      message: 'Tu as fermé la fenêtre de choix d’appareil. Ce n’est pas une panne.',
      actions: [
        'Réessaie et choisis ton capteur dans la liste',
        'Assure-toi que le capteur est allumé et visible',
      ],
    };
  }

  // 2. Aucun appareil / pas trouvé
  if (name === 'NotFoundError' || lower.includes('no devices') || lower.includes('not found')) {
    return {
      code: 'NOT_FOUND',
      title: 'Aucun capteur trouvé',
      message:
        'Le navigateur ne voit pas d’appareil qui expose le service « Heart Rate » Bluetooth LE.',
      actions: [
        'Allume le capteur / la ceinture (souvent un bouton jusqu’au clignotement)',
        'Rapproche-le du téléphone (moins d’1 m)',
        'Désactive le Bluetooth puis rallume-le',
        'Sur Android : autorise Localisation pour le scan Bluetooth (exigence système)',
        'Vérifie que l’appareil n’est pas déjà connecté à une autre appli',
        'Essaie le mode « élargi » (accepter plus d’appareils)',
      ],
    };
  }

  // 3. Sécurité / HTTPS / permissions
  if (
    name === 'SecurityError' ||
    lower.includes('secure context') ||
    lower.includes('https') ||
    lower.includes('permissions policy')
  ) {
    return {
      code: 'SECURITY',
      title: 'Connexion bloquée (sécurité)',
      message:
        'Web Bluetooth ne fonctionne que sur un site HTTPS, dans un onglet principal, après un clic.',
      actions: [
        'Ouvre https://pacte-silencieux.vercel.app (pas http)',
        'Utilise Chrome ou Edge (pas Safari iPhone en général)',
        'Ne lance pas depuis un iframe ou une webview fermée',
      ],
    };
  }

  // 4. Gesture utilisateur
  if (lower.includes('user gesture') || lower.includes('user activation')) {
    return {
      code: 'GESTURE',
      title: 'Clic requis',
      message: 'Le navigateur exige un vrai clic sur le bouton pour ouvrir le Bluetooth.',
      actions: ['Appuie directement sur « Connecter » (pas un automatisme)'],
    };
  }

  // 5. Réseau / GATT connect
  if (
    name === 'NetworkError' ||
    lower.includes('gatt') ||
    lower.includes('connect') ||
    lower.includes('connection')
  ) {
    return {
      code: 'GATT',
      title: 'Échec de liaison GATT',
      message:
        'L’appareil a été vu, mais la connexion Bluetooth s’est interrompue avant la mesure.',
      actions: [
        'Rapproche le capteur et réessaie',
        'Éteins / rallume le capteur',
        'Ferme les autres applis qui utilisent le Bluetooth (Strava, Polar, etc.)',
        'Redémarre le Bluetooth du téléphone',
        'Recharge la page si le navigateur reste bloqué « en connexion »',
      ],
    };
  }

  // 6. Service / caractéristique absents
  if (
    lower.includes('no services') ||
    lower.includes('service') ||
    lower.includes('characteristic') ||
    lower.includes('not supported')
  ) {
    return {
      code: 'NO_HR_SERVICE',
      title: 'Pas de service fréquence cardiaque',
      message:
        'Cet appareil Bluetooth ne publie pas le profil standard « Heart Rate ». Beaucoup de montres grand public ne le font pas en mode navigateur.',
      actions: [
        'Privilégie une ceinture cardio BLE (ex. Polar H9/H10 en mode Bluetooth)',
        'Dans les réglages de la montre, active le partage FC / broadcast si disponible',
        'Utilise le comptage manuel 15 secondes en attendant',
      ],
    };
  }

  // 7. Non supporté
  if (
    lower.includes('bluetooth') &&
    (lower.includes('not available') || lower.includes('undefined'))
  ) {
    return {
      code: 'UNSUPPORTED',
      title: 'Bluetooth web non supporté',
      message:
        'Ce navigateur ne propose pas l’API Web Bluetooth (fréquent sur iPhone Safari et Firefox).',
      actions: [
        'Sur Android : Chrome à jour',
        'Sur ordinateur : Chrome ou Edge',
        'Sur iPhone : le comptage manuel reste disponible',
      ],
    };
  }

  // 8. InvalidState / busy
  if (name === 'InvalidStateError' || lower.includes('already')) {
    return {
      code: 'BUSY',
      title: 'Bluetooth occupé',
      message: 'Une opération Bluetooth est déjà en cours ou l’état est incohérent.',
      actions: [
        'Attends 5 secondes et réessaie',
        'Recharge la page',
        'Déconnecte le capteur des autres applis',
      ],
    };
  }

  // 9. Générique
  return {
    code: 'UNKNOWN',
    title: 'Erreur de connexion',
    message: raw.slice(0, 180) || 'Une erreur inattendue s’est produite.',
    actions: [
      'Réessaie une fois',
      'Vérifie Bluetooth + proximité du capteur',
      'Consulte le guide de dépannage ci-dessous',
      'Sinon : comptage manuel du pouls',
    ],
  };
}

export const BLE_TROUBLESHOOTING: {
  title: string;
  items: string[];
}[] = [
  {
    title: 'Navigateur',
    items: [
      'Chrome ou Edge recommandés (Android ou ordinateur)',
      'Safari iPhone : Web Bluetooth en général absent → utilise le comptage manuel',
      'Firefox : support Web Bluetooth très limité ou absent',
      'Site en HTTPS uniquement (déjà le cas sur Vercel)',
    ],
  },
  {
    title: 'Capteur',
    items: [
      'Doit exposer le service BLE standard « Heart Rate » (UUID 0x180D)',
      'Ceintures Polar, Wahoo, Decfit, etc. en mode Bluetooth LE : souvent OK',
      'Montres Apple / certaines Samsung : souvent incompatibles avec le navigateur',
      'Capteur allumé, batterie OK, à moins d’un mètre',
      'Pas déjà verrouillé par une autre appli',
    ],
  },
  {
    title: 'Téléphone / système',
    items: [
      'Bluetooth activé',
      'Android : autorisation Localisation parfois exigée pour le scan BLE',
      'Couper / rallumer le Bluetooth si la liste est vide',
      'Mode avion OFF',
    ],
  },
  {
    title: 'Si rien ne marche',
    items: [
      'Utilise « Compter mon pouls (15 s) » — la cohérence 5/5 fonctionne sans capteur',
      'Recharge la page après un blocage « connexion en cours »',
      'Teste avec une ceinture BLE dédiée plutôt qu’une montre fermée',
    ],
  },
];
