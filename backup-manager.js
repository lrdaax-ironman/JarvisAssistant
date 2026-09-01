const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const path = require("node:path");

const BACKUP_FORMAT = "jarvis-assistant-backup";
const BACKUP_SCHEMA_VERSION = 1;
const MAX_IMPORT_BYTES = 10 * 1024 * 1024;
const WINDOWS_REPLACE_ERRORS = new Set(["EEXIST", "ENOTEMPTY", "EPERM"]);

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function sanitizeLabel(label) {
  return String(label || "manual")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "manual";
}

function createBackupManager({
  store,
  backupDirectory,
  appVersion,
  normalizeData = (value) => value,
  retention = 10,
  fsApi = fs,
  now = () => new Date()
}) {
  if (!store || typeof store.read !== "function" || typeof store.mutate !== "function") {
    throw new TypeError("Un stockage transactionnel est requis pour les sauvegardes.");
  }
  if (!backupDirectory) throw new TypeError("Le dossier de sauvegarde est requis.");

  async function replaceFile(sourcePath, destinationPath) {
    try {
      await fsApi.rename(sourcePath, destinationPath);
    } catch (error) {
      if (!WINDOWS_REPLACE_ERRORS.has(error.code)) throw error;
      try {
        await fsApi.unlink(destinationPath);
      } catch (unlinkError) {
        if (unlinkError.code !== "ENOENT") throw unlinkError;
      }
      await fsApi.rename(sourcePath, destinationPath);
    }
  }

  async function writeJsonAtomic(destinationPath, payload) {
    const temporaryPath = `${destinationPath}.tmp`;
    await fsApi.mkdir(path.dirname(destinationPath), { recursive: true });
    const handle = await fsApi.open(temporaryPath, "w");
    try {
      await handle.writeFile(`${JSON.stringify(payload, null, 2)}\n`, "utf8");
      if (typeof handle.sync === "function") await handle.sync();
    } finally {
      await handle.close();
    }
    await replaceFile(temporaryPath, destinationPath);
  }

  function createEnvelope(data, createdAt = now()) {
    return {
      format: BACKUP_FORMAT,
      schemaVersion: BACKUP_SCHEMA_VERSION,
      appVersion: String(appVersion || "unknown"),
      createdAt: createdAt.toISOString(),
      data: normalizeData(cloneJson(data))
    };
  }

  function parseEnvelope(rawData) {
    let payload;
    try {
      payload = JSON.parse(rawData);
    } catch (error) {
      throw new Error("Le fichier selectionne ne contient pas un JSON valide.", { cause: error });
    }

    if (!payload || payload.format !== BACKUP_FORMAT || payload.schemaVersion !== BACKUP_SCHEMA_VERSION) {
      throw new Error("Ce fichier n'est pas une sauvegarde JARVIS compatible.");
    }
    if (!payload.data || typeof payload.data !== "object" || Array.isArray(payload.data)) {
      throw new Error("La sauvegarde JARVIS ne contient aucune donnee exploitable.");
    }

    return normalizeData(cloneJson(payload.data));
  }

  function createBackupFileName(label, date = now()) {
    const timestamp = date.toISOString().replace(/[:.]/g, "-");
    const suffix = crypto.randomBytes(2).toString("hex");
    return `jarvis-backup-${timestamp}-${sanitizeLabel(label)}-${suffix}.json`;
  }

  async function listBackups() {
    try {
      const entries = await fsApi.readdir(backupDirectory, { withFileTypes: true });
      const backups = await Promise.all(entries
        .filter((entry) => entry.isFile() && /^jarvis-backup-.*\.json$/i.test(entry.name))
        .map(async (entry) => {
          const filePath = path.join(backupDirectory, entry.name);
          const stats = await fsApi.stat(filePath);
          return {
            fileName: entry.name,
            path: filePath,
            size: stats.size,
            createdAt: stats.mtime.toISOString()
          };
        }));
      return backups.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    } catch (error) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }

  async function pruneBackups() {
    const backups = await listBackups();
    const expired = backups.slice(Math.max(1, Number(retention) || 10));
    await Promise.all(expired.map((backup) => fsApi.unlink(backup.path).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    })));
  }

  async function writeSnapshot(data, label) {
    const createdAt = now();
    const fileName = createBackupFileName(label, createdAt);
    const destinationPath = path.join(backupDirectory, fileName);
    await writeJsonAtomic(destinationPath, createEnvelope(data, createdAt));
    await pruneBackups();
    const stats = await fsApi.stat(destinationPath);
    return {
      ok: true,
      fileName,
      path: destinationPath,
      size: stats.size,
      createdAt: createdAt.toISOString()
    };
  }

  async function create(label = "manual") {
    return writeSnapshot(await store.read(), label);
  }

  async function exportTo(destinationPath) {
    const data = await store.read();
    const createdAt = now();
    await writeJsonAtomic(destinationPath, createEnvelope(data, createdAt));
    const stats = await fsApi.stat(destinationPath);
    return {
      ok: true,
      fileName: path.basename(destinationPath),
      path: destinationPath,
      size: stats.size,
      createdAt: createdAt.toISOString()
    };
  }

  async function importFrom(sourcePath) {
    const stats = await fsApi.stat(sourcePath);
    if (stats.size > MAX_IMPORT_BYTES) {
      throw new Error("La sauvegarde depasse la taille maximale autorisee de 10 Mo.");
    }
    const importedData = parseEnvelope(await fsApi.readFile(sourcePath, "utf8"));

    return store.mutate(async (currentData) => {
      const safetyBackup = await writeSnapshot(currentData, "before-import");
      Object.keys(currentData).forEach((key) => delete currentData[key]);
      Object.assign(currentData, importedData);
      return {
        ok: true,
        fileName: path.basename(sourcePath),
        safetyBackup,
        data: importedData
      };
    });
  }

  async function getStatus() {
    const [backups, storage] = await Promise.all([
      listBackups(),
      typeof store.diagnose === "function" ? store.diagnose() : Promise.resolve(null)
    ]);
    return {
      ok: true,
      backups,
      count: backups.length,
      latest: backups[0] || null,
      storage
    };
  }

  return { create, exportTo, getStatus, importFrom, listBackups, parseEnvelope };
}

module.exports = {
  BACKUP_FORMAT,
  BACKUP_SCHEMA_VERSION,
  createBackupManager
};
