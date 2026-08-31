const assert = require("node:assert/strict");
const test = require("node:test");
const {
  DESKTOP_ONLY_COMMANDS,
  isDesktopOnlyMobileCommand,
  normalizeMobileCommand
} = require("../mobile-command-routing");

test("bloque toutes les commandes reservees au desktop", () => {
  DESKTOP_ONLY_COMMANDS.forEach((command) => {
    assert.equal(isDesktopOnlyMobileCommand(command), true, command);
  });
});

test("normalise les accents, apostrophes et espaces avant la comparaison", () => {
  assert.equal(normalizeMobileCommand("  PLEIN   ÉCRAN "), "plein ecran");
  assert.equal(isDesktopOnlyMobileCommand("  PLEIN   ÉCRAN "), true);
});

test("ne bloque pas une question naturelle contenant un mot de commande", () => {
  assert.equal(isDesktopOnlyMobileCommand("Comment je minimise les risques du projet ?"), false);
  assert.equal(isDesktopOnlyMobileCommand("Explique-moi les informations systeme utiles"), false);
});

test("ne classe pas les commandes mobiles et les questions IA comme commandes desktop", () => {
  assert.equal(isDesktopOnlyMobileCommand("mes taches"), false);
  assert.equal(isDesktopOnlyMobileCommand("Comment organiser ma journee ?"), false);
});
