import { mgNew5eActor } from "./5emg-actorgen.mjs";
import { mgUtils } from "./5emg-utils.mjs";

export async function renderGeneratorWindow(){

    new foundry.applications.api.DialogV2({
        window: { title: "New Monster Stats" },
        content: initForm(),
        buttons: [{
            action: "submit",
            label: "Submit",
            default: true,
            callback: (event, button, dialog) => { return button.form.elements }
        },
        {
            action: "cancel",
            label: "Cancel",
        }],
        submit: async result => {
            if(result === "cancel"){
                console.log(`User canceled monster generator`);
            } else {
                await mgNew5eActor(result);
            }
            
        }
    }).render({ force: true });
}

function initForm(){
    let form = '<form id="5eStats">';

    form+=`<div style="display: inline">
        <div style="display: inline-block; width:20%; margin-right:5px;">
        <label for="crSelect">Select CR:</label>
        <select name="crSelect" id="crSelect">
            ${generateCRs()}
        </select></div>
        <div style="display: inline-block; width:78%"><label for="monsterName">Monster Name: </label>
        <input name="monsterName" id="monsterName" type="text" /></div>
    </div>
    <p><label for="abilityString">Paste Abilities: </label><br />
    <input name="abilityString" id="abilityString" type="text" /></p>
    <div id="abilityScores">
    <p>Proficient Abilities:<br>
        <input type="checkbox" id="str" name="abilities[]" value="strength">    
        <label for="str">STR</label>
        <input type="checkbox" id="dex" name="abilities[]" value="dexterity">
        <label for="dex">DEX</label>
        <input type="checkbox" id="con" name="abilities[]" value="constitution">
        <label for="con">CON</label>
        <input type="checkbox" id="int" name="abilities[]" value="intelligence">
        <label for="int">INT</label>
        <input type="checkbox" id="wis" name="abilities[]" value="wisdom">
        <label for="wis">WIS</label>
        <input type="checkbox" id="cha" name="abilities[]" value="charisma">
        <label for="cha">CHA</label>
    </p>
    </div>
    `

    form += '</form>';
    return form;
}

function generateCRs(){
    let select = '';
    for (const cr in mgUtils.monsterStats) {
        select+=`<option value="${cr}">${cr}</option>`
    }
    return select;
}