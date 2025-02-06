//import { renderImportWindow } from './statBlockFoundry.mjs'

console.log('bfr-fof-stats-generator | Is loaded!');

Hooks.on("renderActorDirectory", (app, html, data) => {
    console.log('bfr-statblock-parser | rendering button');

    // Add the import button to the UI in the characters tab.
    const importButton = $("<button id='sbi-main-button'><i class='fas fa-skull'></i></i>Generate Monster</button>");
    html.find(".directory-footer").append(importButton);

    importButton.click(async (ev) => {
        console.log("Module button clicked");
        //renderImportWindow();
    });
});