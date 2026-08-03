# JARVIS Assistant

Application desktop Electron locale avec interface JARVIS, Ollama, memoire, organisation, automatisations et synthese vocale.

## Version PWA mobile

Depuis la V4.2, JARVIS dispose d'une version mobile dediee avec deux fonctionnements : autonome sur le web, ou reliee au desktop par le Bridge local.

Fichiers PWA :

- `mobile.html`
- `mobile.css`
- `mobile.js`
- `manifest.json`
- `service-worker.js`
- `assets/icons/icon-192.png`
- `assets/icons/icon-512.png`

La version mobile peut etre ouverte directement avec `mobile.html`, puis ajoutee a l'ecran d'accueil si le navigateur le permet. Le manifest utilise `mobile.html` comme `start_url`.

La version desktop continue d'utiliser :

- `index.html`
- `style.css`
- `script.js`

Commandes utiles :

```text
aide
version mobile
mode mobile
installer jarvis
notes
taches
rappels
planning
memoire
statut web
deploiement
debug mobile
rafraichir mobile
fonctionnalites mobile
fonctionnalites desktop
bridge statut
adresse bridge
code bridge
aide bridge
```

Notes :

- La version desktop Electron continue de fonctionner avec `npm.cmd start`.
- Les commandes Windows restent reservees a Electron.
- Ollama local est accessible au telephone quand la page mobile est ouverte depuis le Bridge JARVIS sur le meme reseau Wi-Fi.
- La version mobile utilise `localStorage` pour les notes, taches, rappels, planning, memoire et preferences simples.
- `mobile.js` ne depend pas de `window.jarvisAPI` et reste stable dans un navigateur mobile.
- Le service worker est enregistre uniquement en contexte web `http` ou `https`, pas en `file://` Electron.
- Si le mobile garde un ancien rendu, fermer l'onglet puis rouvrir `mobile.html`. Le service worker `jarvis-mobile-v2` utilise une strategie network-first pour les fichiers d'interface.

## Bridge local V4.2

Le Bridge relie un telephone a JARVIS desktop sans API externe. Il est lance automatiquement avec Electron et reste limite au reseau local.

Utilisation :

1. Connecter le PC et le telephone au meme Wi-Fi.
2. Dans JARVIS desktop, taper `adresse bridge`.
3. Ouvrir l'adresse affichee sur le telephone.
4. Taper `code bridge` sur le PC, puis saisir les six chiffres sur le telephone.

Une fois associe, le telephone peut :

- consulter les taches, notes, rappels, planning et memoires du desktop ;
- ajouter des elements aux donnees locales du PC ;
- terminer une tache ;
- envoyer des questions naturelles a Ollama sur le PC ;
- synchroniser les compteurs sans cloud.

Securite :

- le code d'association change apres utilisation ;
- la session expire automatiquement ;
- les origines web externes sont refusees ;
- les commandes Windows, les fichiers et le controle de la fenetre ne sont jamais exposes par le Bridge ;
- la version Vercel reste autonome et ne tente pas de contourner les protections HTTPS du navigateur.

La page Bridge utilise une adresse locale en `http://`. Selon le navigateur, l'installation PWA et le service worker peuvent exiger HTTPS ; la connexion Bridge reste utilisable dans l'onglet mobile, tandis que la PWA installable reste disponible sur Vercel.

## Deploiement web

Depuis la V4.1, JARVIS est prepare pour un deploiement statique sur Vercel ou Netlify.

Production Vercel :

- Mobile/PWA : https://jarvis-assistant-puce.vercel.app/mobile.html
- Interface web complete : https://jarvis-assistant-puce.vercel.app/

Fichiers web attendus a la racine :

- `index.html`
- `mobile.html`
- `style.css`
- `mobile.css`
- `voice.css`
- `script.js`
- `mobile.js`
- `manifest.json`
- `service-worker.js`
- `assets/icons/icon-192.png`
- `assets/icons/icon-512.png`
- `vercel.json`
- `netlify.toml`

### Vercel

Le fichier `vercel.json` sert l'application comme site statique.

Deploiement possible :

```powershell
vercel
```

Ou via l'interface Vercel en connectant le repository GitHub.

### Netlify

Le fichier `netlify.toml` publie le dossier courant :

```toml
[build]
  publish = "."
```

Netlify peut aussi etre connecte directement au repository GitHub.

### Limites de la version web

- Les commandes Windows sont uniquement disponibles dans Electron.
- Ollama local est disponible sur la version desktop.
- Les handlers Electron ne sont pas disponibles dans un navigateur web.
- La version web reste stable meme si `window.jarvisAPI` est absent.
- Les commandes `statut web` et `deploiement` expliquent le mode actif et les limites.

### Difference desktop / web mobile

- Desktop Electron : Ollama local, commandes Windows, memoire Electron et automatisations locales.
- Web/PWA mobile : interface tactile, commandes texte compatibles, installation sur l'ecran d'accueil et messages propres pour les fonctions desktop.

## Reconnaissance vocale locale

Depuis la V3.9, JARVIS utilise une transcription vocale locale via Python et `faster-whisper`.

Installation des dependances :

```powershell
python -m pip install sounddevice scipy faster-whisper
```

Si la commande `python` ne fonctionne pas sous Windows, essayer :

```powershell
py -m pip install sounddevice scipy faster-whisper
```

Notes :

- Python doit etre installe depuis python.org.
- Pendant l'installation de Python, cocher `Add Python to PATH`.
- Le bouton micro enregistre environ 5 secondes d'audio localement.
- Le modele Whisper par defaut est `base`.
- La langue de transcription est le francais.
- Le premier lancement peut etre plus long, le temps de charger ou preparer le modele.
- Aucune API externe payante n'est utilisee pour la transcription.
- Si Python ou les dependances sont absents, JARVIS affiche une erreur claire et tente le fallback Web Speech si possible.

## Commandes utiles

```powershell
npm.cmd start
npm.cmd run build
```
