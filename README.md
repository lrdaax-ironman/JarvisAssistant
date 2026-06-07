# JARVIS Assistant

Application desktop Electron locale avec interface JARVIS, Ollama, memoire, organisation, automatisations et synthese vocale.

## Version PWA mobile

Depuis la V4.0, JARVIS prepare aussi une version web mobile installable.

Fichiers PWA :

- `manifest.json`
- `service-worker.js`
- `assets/icons/icon-192.png`
- `assets/icons/icon-512.png`

La version mobile peut etre ouverte dans un navigateur puis ajoutee a l'ecran d'accueil si le navigateur le permet.

Commandes utiles :

```text
version mobile
mode mobile
installer jarvis
fonctionnalites mobile
fonctionnalites desktop
```

Notes :

- La version desktop Electron continue de fonctionner avec `npm.cmd start`.
- Les commandes Windows restent reservees a Electron.
- Ollama local reste disponible sur le desktop. Une passerelle mobile pourra etre ajoutee plus tard.
- Le service worker est enregistre uniquement en contexte web `http` ou `https`, pas en `file://` Electron.

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
