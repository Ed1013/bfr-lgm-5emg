import { monsterStats, newFofActor } from "./fof-stats.mjs";

export async function renderGeneratorWindow(){
    new Dialog({
        title: `New Monster Stats`,
        content: initForm(),
        buttons: {
            yes: {
                icon: "<i class='fas fa-check'></i>",
                label: `Submit`,
                callback: async (html) => {
                    const fofForm = html[0].querySelector('#fofStats');
                    const fofData = new FormDataExtended(fofForm);

                    await newFofActor(fofData.object);
                }
            },

            no: {
                icon: "<i class='fas fa-times'></i>",
                label: `Cancel`
            },
        },
        default: "no"
    }).render(true)
}

function initForm(){
    let form = '<form id="fofStats">';

    form+=`<label for="crSelect">Select CR:</label>
        <select name="crSelect" id="crSelect">
        ${generateCRs()}
    </select><br />
    <label for="monsterName">Monster Name: </label>
    <input name="monsterName" id="monsterName" type="text" />
    <br>Proficient Abilities:<br>
    <div id="abilityScores">
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
    </div>`

    form += '</form>';
    return form;
}

function generateCRs(){
    let select = '';
    for (const cr in monsterStats) {
        select+=`<option value="${cr}">${cr}</option>`
    }
    return select;
}