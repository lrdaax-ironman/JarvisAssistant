const fs = require("node:fs/promises");
const path = require("node:path");

const WINDOWS_REPLACE_ERRORS = new Set(["EEXIST", "ENOTEMPTY", "EPERM"]);

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function createStoreError(message, cause) {
  const error = new Error(message, { cause });
  error.code = "JARVIS_MEMORY_STORE_ERROR";
  return error;
}

function createMemoryStore({ filePath, defaults, normalize = (value) => value, fsApi = fs }) {
  if (!filePath) throw new TypeError("Le chemin du stockage memoire est requis.");

  const backupPath = `${filePath}.bak`;
  const corruptPath = `${filePath}.corrupt`;
  let queue = Promise.resolve();

  function runExclusive(operation) {
    const result = queue.then(operation, operation);
    queue = result.then(() => undefined, () => undefined);
    return result;
  }

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

  async function writeTemporary(targetPath, contents) {
    const handle = await fsApi.open(targetPath, "w");
    try {
      await handle.writeFile(contents);
      if (typeof handle.sync === "function") await handle.sync();
    } finally {
      await handle.close();
    }
  }

  async function preserveCorruptFile(sourcePath, destinationPath) {
    try {
      const contents = await fsApi.readFile(sourcePath);
      const temporaryPath = `${destinationPath}.tmp`;
      await writeTemporary(temporaryPath, contents);
      await replaceFile(temporaryPath, destinationPath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("[JARVIS memory] Impossible de conserver le fichier corrompu:", error);
      }
    }
  }

  async function readJson(targetPath) {
    const rawData = await fsApi.readFile(targetPath, "utf8");
    return JSON.parse(rawData);
  }

  async function writeAtomic(data, { backupCurrent = true } = {}) {
    const normalizedData = normalize(cloneJson(data));
    const payload = `${JSON.stringify(normalizedData, null, 2)}\n`;
    const temporaryPath = `${filePath}.tmp`;
    const backupTemporaryPath = `${backupPath}.tmp`;

    await fsApi.mkdir(path.dirname(filePath), { recursive: true });

    if (backupCurrent) {
      try {
        const currentContents = await fsApi.readFile(filePath);
        await writeTemporary(backupTemporaryPath, currentContents);
        await replaceFile(backupTemporaryPath, backupPath);
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    }

    await writeTemporary(temporaryPath, payload);
    await replaceFile(temporaryPath, filePath);
    return normalizedData;
  }

  async function restoreBackup() {
    try {
      const backupData = normalize(await readJson(backupPath));
      await writeAtomic(backupData, { backupCurrent: false });
      return backupData;
    } catch (error) {
      if (error instanceof SyntaxError) {
        await preserveCorruptFile(backupPath, `${backupPath}.corrupt`);
      }
      throw error;
    }
  }

  async function readUnlocked() {
    try {
      return normalize(await readJson(filePath));
    } catch (error) {
      if (error.code === "ENOENT") {
        try {
          return await restoreBackup();
        } catch (backupError) {
          if (backupError.code !== "ENOENT") {
            throw createStoreError("La sauvegarde de la memoire locale est illisible.", backupError);
          }

          return writeAtomic(cloneJson(defaults), { backupCurrent: false });
        }
      }

      if (!(error instanceof SyntaxError)) {
        throw createStoreError("Impossible de lire la memoire locale.", error);
      }

      await preserveCorruptFile(filePath, corruptPath);
      try {
        return await restoreBackup();
      } catch (backupError) {
        throw createStoreError(
          "La memoire locale est corrompue et aucune sauvegarde valide n'est disponible.",
          backupError
        );
      }
    }
  }

  return {
    paths: { primary: filePath, backup: backupPath, corrupt: corruptPath },
    read() {
      return runExclusive(() => readUnlocked());
    },
    write(data) {
      return runExclusive(() => writeAtomic(data));
    },
    mutate(mutator) {
      if (typeof mutator !== "function") {
        return Promise.reject(new TypeError("La mutation memoire doit etre une fonction."));
      }

      return runExclusive(async () => {
        const data = await readUnlocked();
        const result = await mutator(data);
        await writeAtomic(data);
        return result;
      });
    }
  };
}

module.exports = { createMemoryStore };
