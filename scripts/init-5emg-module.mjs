import { renderGeneratorWindow } from './5emg-form.mjs'
import { mgApi } from './5emg-api.mjs';

console.log('bfr-lgm-5emg Monster Generator | Is loaded!');

Hooks.on("renderActorDirectory", (app, html) => {
    //console.log('bfr-statblock-parser | rendering button');

    // Add the import button to the UI in the characters tab.
    const importButton = $("<button id='sbi-main-button'><i class='fas fa-skull'></i></i>Generate Monster</button>");
    html.find(".directory-footer").append(importButton);

    importButton.click(async () => {
        await renderGeneratorWindow();
    });
});

Hooks.once("ready", async function() {
    //Register the API to the game object
    game.lgm_mg = {}
    game.lgm_mg.api = new mgApi();
});
