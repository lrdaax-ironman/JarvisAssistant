(function exposeMobileCommandRouting(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.JarvisMobileCommands = api;
})(typeof globalThis !== "undefined" ? globalThis : this, () => {
  const DESKTOP_ONLY_COMMANDS = new Set([
    "ouvrir documents",
    "ouvre documents",
    "ouvrir bureau",
    "ouvre bureau",
    "ouvrir calculatrice",
    "ouvre calculatrice",
    "ouvrir navigateur",
    "ouvre navigateur",
    "infos systeme",
    "plein ecran",
    "fenetre",
    "minimise",
    "ferme jarvis"
  ]);

  function normalizeMobileCommand(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[-_']/g, " ")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  }

  function isDesktopOnlyMobileCommand(command) {
    return DESKTOP_ONLY_COMMANDS.has(normalizeMobileCommand(command));
  }

  return { DESKTOP_ONLY_COMMANDS, normalizeMobileCommand, isDesktopOnlyMobileCommand };
});
