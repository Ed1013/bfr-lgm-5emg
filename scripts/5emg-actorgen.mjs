import { mgUtils } from "./5emg-utils.mjs";

export async function mgNew5eActor(formData){
	if(formData.monsterName.value.trim() === ''){
		formData.monsterName.value = 'New Monster'
	}

	const selStats = mgUtils.monsterStats[formData.crSelect.value];

	const newActor = await Actor.create({
        name: formData.monsterName.value,
        type: "npc"
    });
	//placeholder object to edit changes
	const dummy = {...newActor};

	//set CR
	const crValue = formData.crSelect.value.match(/[\d\/]+/)[0];
	if (crValue.includes("/")) {
		dummy.system.attributes.cr = mgUtils.parseFraction(crValue);
	} else {
		dummy.system.attributes.cr = parseInt(crValue);
	}

	//set AC
	mgUtils.assignToObject(dummy,"system.attributes.ac.baseFormulas",new Set([ "natural" ]));
    mgUtils.assignToObject(dummy,"system.attributes.ac.flat",selStats.acdc);


	//set HP
	const hpValue = parseInt(selStats.hp.match(/^\d*/)[0]);
	mgUtils.assignToObject(dummy,"system.attributes.hp.max",hpValue);
    mgUtils.assignToObject(dummy,"system.attributes.hp.value",hpValue);

	//If ability string was pasted, assign abilities
	if(formData.abilityString.value != ''){
		// Look for ability values, six numbers with a plus and minus or +0
		const valueMatches = [...mgUtils.cleanString(formData.abilityString.value).matchAll(/(?<modifier>[+-]\d*)/g)];
		if (valueMatches.length >= 6) {
			let i=0;
			const abilities = ["strength","dexterity","constitution","intelligence","wisdom","charisma"];
			for(const match of valueMatches){
				mgUtils.assignToObject(dummy,`system.abilities.${abilities[i]}.mod`,parseInt(mgUtils.cleanString(match.groups.modifier)));
				if(i == 5){
					break;
				}
				i++;
			}
		} else {
			//not enough abilities pasted
			ui.notifications.warn("Not enough abilities included in input, need 6 numbers with their corresponding signs");
		}
	}

	//Set proficient abilities
	for(const ability of formData["abilities[]"]){
		if(ability.checked){
			mgUtils.assignToObject(dummy,`system.abilities.${ability.value}.proficient`,true);
			mgUtils.assignToObject(dummy,`system.abilities.${ability.value}.mod`,mgUtils.abilityAssign(newActor.system.attributes.cr, selStats.atkprof));
		}
	}

	//Set Stealth and Perception
	mgUtils.assignToObject(dummy,'system.attributes.stealth', 10 + ((dummy.system.abilities?.dexterity.mod)? dummy.system.abilities.dexterity.mod : 0));
	mgUtils.assignToObject(dummy,'system.attributes.perception', 10 + ((dummy.system.abilities?.wisdom.mod)? dummy.system.abilities.wisdom.mod : 0));

	//Set reference for the Stats in Bio
	mgUtils.assignToObject(dummy,'system.biography.value', mgUtils.statsString(formData.crSelect.value,selStats));

	//Add modifications to new actor
	await newActor.update(dummy);

	//set Attack
	//If it has more than 1 attack per turn, set the multiattack feature
	if(selStats.atks > 1){
		await newActor.createEmbeddedDocuments("Item",[{ name:"Multiattack", type: "feature", 
			system: { description: { value: `The ${newActor.name} makes ${selStats.atks} attacks.`}, 
			activities: mgUtils.newActivity("utility", "action")}}]);
	}
	//get damage value rolls
	const dmgValue = /\(((?<dicenum>\d*)d(?<dicedenom>\d*))(.\+.(?<bonus>\d*))?\)/.exec(selStats.dmg)//get damage value
	//Set main attack
	const newAtk = {"system":{"attack":{"bonus":selStats.atkprof, "flat": true}, "damage":{"parts":[{"additionalTypes": [ ], "bonus": (dmgValue.groups?.bonus)? dmgValue.groups.bonus : "", "custom": { "enabled": false, "formula": "" }, "denomination": parseInt(dmgValue.groups.dicedenom), "number": parseInt(dmgValue.groups.dicenum), "scaling": { "number": 1 }, "type": ""}]}}}

	await newActor.createEmbeddedDocuments("Item",[{ name:"Attack", type: "feature", 
		system: { description: { value: `<em>Melee or Ranged Weapon Attack:</em> [[/attack]] reach 5 ft. or range 60 ft., one target. <em>Hit:</em> [[/damage average]] damage`}, 
		activities: mgUtils.newActivity("attack", "action", newAtk)}}]);
}