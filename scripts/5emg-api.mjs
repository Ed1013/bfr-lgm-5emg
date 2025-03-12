import { mgUtils } from "./5emg-utils.mjs";

//Functions to call on game time using the game.lgm_mg.api object
export class mgApi {
    cleanNewMonsters(){
        //deletes al actors with the "New Monster" default name. Mainly used for testing
        const actors = game.actors.filter((act) => act.name === "New Monster")
        actors.forEach(actor1 => actor1.delete())
    }
}