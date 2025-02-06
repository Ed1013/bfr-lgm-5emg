import { monsterStats, newFofActor } from "./fof-stats.mjs";

export async function renderGeneratorWindow(){
    new Dialog({
        title: `Statblock Generator`,
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
    <input name="monsterName" id="monsterName" type="text" />`

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