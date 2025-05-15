import { mgUtils } from "./5emg-utils.mjs";

//Functions to call on game time using the game.lgm_mg.api object
export class mgApi {
    cleanNewMonsters(){
        //deletes al actors with the "New Monster" default name. Mainly used for testing
        const actors = game.actors.filter((act) => act.name === "New Monster")
        actors.forEach(actor1 => actor1.delete())
    }

    async addMonsterFeatures(){
        const selectedMonster = game.actors.get(ui.activeWindow?.document?.id);
        if(selectedMonster?.type==="npc"){
            const dialogPrompt = new foundry.applications.api.DialogV2({
                window: { title: `Add features to ${selectedMonster.name}` },
                content: `<label for="featureType">Feature type:</label>
                            <select name="featureType" id="featuretype">
                                <option value="feature">Feature</option>
                                <option value="action">Action</option>
                                <option value="bonus">Bonus Action</option>
                                <option value="reaction">Reaction</option>
                                <option value="spellcasting">Spellcasting</option>
                                <option value="legendary">Legendary Action</option>
                                <option value="traits">Traits (size, type, resistances, speeds)</option>
                            </select>
                            <label for="pastedString">Paste feature:</label>
                            <textarea id="pastedString" name="pastedString" rows="20" cols="40"></textarea>`,
                buttons: [{
                    action: "add",
                    label: "Submit",
                    callback: (event, button, dialog) => { return button.form.elements }
                },
                { action: "cancel",
                    label: "Cancel"
                }],
                submit: (submittedData) => {
                    if(submittedData){
                        //console.log(submittedData);
                        const featureType = submittedData.namedItem("featureType").value;
                        switch(featureType){
                            case("spellcasting"):
                                mgUtils.parseSpellcasting(submittedData.namedItem("pastedString").value,selectedMonster);
                                break;
                            case("traits"):
                                mgUtils.parseTraits(submittedData.namedItem("pastedString").value,selectedMonster);
                                break;
                            default:
                                mgUtils.parseFeature(submittedData.namedItem("pastedString").value,selectedMonster,featureType);
                                break;
                        }
                    }
                }
            });

            await dialogPrompt.render({ force: true });
        } else {
            ui.notifications.error("You must have a monster opened in the window and the context on them");
        }
    }
}