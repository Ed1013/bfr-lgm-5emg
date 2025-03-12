export class mgUtils{
    //Templates for objects
    static activityTemplates = {
        'attack' : { "type": "attack", "description": "", "sort": 0, "system": { "attack": { "critical": { "threshold": null }, "flat": false, "type": { "value": "melee", "classification": "weapon" }, "ability": "", "bonus": "" }, "damage": { "critical": { "bonus": "" }, "includeBase": true, "parts": [] }, "effects": [] }, "activation": { "value": null, "override": false, "primary": true, "type": "action", "condition": "" }, "consumption": { "targets": [], "scale": { "allowed": false } }, "duration": { "units": "instantaneous", "concentration": false, "override": false }, "range": { "override": false, "units": "" }, "magical": false, "target": { "template": { "contiguous": false, "units": "foot", "type": "" }, "affects": { "choice": false, "type": "" }, "prompt": false, "override": false }, "uses": { "spent": 0, "consumeQuantity": false, "recovery": [], "max": "" }, "name": "" },
        'utility': { "type": "utility", "description": "", "sort": 0, "system": { "effects": [], "roll": { "prompt": false, "visible": false } }, "activation": { "value": null, "override": false, "primary": true }, "consumption": { "targets": [], "scale": { "allowed": false } }, "duration": { "units": "instantaneous", "concentration": false, "override": false }, "range": { "override": false }, "magical": false, "target": { "template": { "contiguous": false, "units": "foot" }, "affects": { "choice": false }, "prompt": true, "override": false }, "uses": { "spent": 0, "consumeQuantity": false, "recovery": [] } },
        'save': { "type": "save", "description": "", "flags": {}, "sort": 0, "system": { "damage": { "parts": [] }, "effects": [], "save": { "ability": [], "dc": {} } }, "activation": { "value": null, "override": false, "primary": true }, "consumption": { "targets": [], "scale": { "allowed": false } }, "duration": { "units": "instantaneous", "concentration": false, "override": false }, "range": { "override": false }, "magical": false, "target": { "template": { "contiguous": false, "units": "foot" }, "affects": { "choice": false }, "prompt": true, "override": false }, "uses": { "spent": 0, "consumeQuantity": false, "recovery": [] } },
        'spellTemplate' : { "name": "NAME", "type": "spell", "_id": "GENERATEID", "system": { "identifier": { "value": "NAME" }, "activities": {}, "uses": { "spent": 0, "consumeQuantity": false, "recovery": [ { "period": "longRest", "type": "recoverAll" } ], "max": "" }, "description": { "source": {}, "value": "" }, "casting": { "value": null }, "circle": { "value": null, "base": null }, "components": { "required": [], "material": { "consumed": false, "cost": null, "denomination": "gp" } }, "duration": { "units": "instantaneous" }, "tags": [], "range": {}, "source": [], "target": { "template": { "contiguous": false, "units": "foot" }, "affects": { "choice": false } } }, "img": "systems/black-flag/artwork/types/spell.svg", "effects": [], "folder": null, "sort": 0 },
        'spellConsume': { "type": "utility", "description": "", "flags": {}, "sort": 0, "system": { "effects": [], "roll": { "prompt": false, "visible": false, "formula": "", "name": "" } }, "activation": { "value": null, "override": false, "primary": true }, "consumption": { "targets": [ { "type": "activity", "value": "1", "scaling": {} } ], "scale": { "allowed": false } }, "duration": { "units": "instantaneous", "concentration": false, "override": false }, "range": { "override": false }, "magical": false, "target": { "template": { "contiguous": false, "units": "foot" }, "affects": { "choice": false }, "prompt": true, "override": false }, "uses": { "spent": 0, "consumeQuantity": false, "recovery": [], "max": "" }, "name": "Consume" }
    }
    
    static assignToObject(obj, path, val) {
        const pathArr = path.split(".");

        let length = pathArr.length;
        let current = obj;

        for (let i = 0; i < pathArr.length; i++) {
            const key = pathArr[i];

            // If this is the last item in the loop, assign the value
            if (i === length - 1) {
                current[key] = val;
            } else {
                // If the key doesn't exist, create it
                if (!current[key]) {
                    current[key] = {};
                }

                current = current[key];
            }
        }

        return obj;
    }

    static newActivity(type, activation, override = {}){
        const newActivityId = foundry.utils.randomID();
        const newActivityData = {...this.activityTemplates[type], ...override};
    
        newActivityData._id=newActivityId;
        newActivityData.type = type;
        newActivityData.activation.type = activation;
    
        return { [newActivityId] : newActivityData };
    }
    

    static abilityAssign(cr,crprof){

        if(cr === 0){
            return 1;
        }

        return parseInt(crprof);

    }

    static parseFraction(string) {
        let result = null;
        const numbers = string.split("/");
    
        if (numbers.length == 2) {
            const numerator = parseFloat(numbers[0]);
            const denominator = parseFloat(numbers[1]);
            result = numerator / denominator;
        }
    
        return result;
    }

    static statsString(cr,stats){
        let output = `<H4>${cr}</H4>`;
        for (const key in stats) {
        output += `<strong>${key}:</strong> ${stats[key]}<br>`;
        }

        return output;
    }

    static cleanString(string){
        return string.trim().replace("–","-").replace("−","-");
    }
    
    static regexes = {
        "featureTitle" : /^(([A-Z][\w\d\-+,;'’]+[\s\-]?)((of|and|the|from|in|at|on|with|to|by|into)\s)?([\w\d\-+,;'’]+\s?){0,3}(\((?!spell save)[^)]+\))?)[.!]/,
        "featureDetails" : /(?<name>^(([A-Z][\w\d\-+,;'’]+[\s\-]?)((of|and|the|from|in|at|on|with|to|by|into)\s)?([\w\d\-+,;'’]+\s?){0,3}(\((?!spell save)[^)]+\))?)[.!])(?<details>.*)/,
        "legendaryActionCount" : /take (?<count>\d+) legendary/i,
        "attack": /\+(?<tohit>\d+) to hit/i,
        "damageRoll": /\d* \(?(?<damageroll1>\d+(d\d+)?)(\s?\+\s?(?<damagemod1>\d+))?\)? (?<damagetype1>\w+)( damage)(.+(plus|and)\s+(\d+\s+\(*)?((?<damageroll2>\d+(d\d+)?)(\s?\+\s?(?<damagemod2>\d+))?)\)? (?<damagetype2>\w+)( damage))?/i,
        "diceDamage": /\(((?<dicenum>\d*)d(?<dicedenom>\d*))(.\+.(?<bonus>\d*))?\) (?<type>.*) damage/i,
        "savingThrowDetails" : /must (make|succeed on) a dc (?<savedc>\d+) (?<saveability>\w+) (?<savetext>saving throw|save)/i,
        "spellcastingDetails": /spellcasting ability( score)? is (?<ability1>\w+)|(?<ability2>\w+) as the spellcasting ability|(spell )?save (dc|DC) (?<savedc>\d+)/ig,
        "spellsUses" : /(?<uses>(?<=\()\d slot|\d(?=\/day)|at will).*:(?<spells>(?:(?!\d).)*)/i,
        "featureTypes" : [ "actions", "reactions", "bonus actions", "legendary actions", "mythic actions", "villain actions", "spellcasting", "innate spellcasting", "utility spells" ]
    }
    
    static async parseFeatures(featureString, actor){
        let arrString = featureString.split(/\r?\n/);
        const arrFeatures = [];
        let type = "feature";
        let i = 0;
        while(i<arrString.length){
            if(this.regexes.featureTypes.includes(arrString[i].toLowerCase())){
                //Setting new type to one of the default action types
                type = arrString[i].toLowerCase().substring(0,arrString[i].length);
                //if it's in plural remove last s, for BFR foundry system compatibility
                type = type.replace(/s$/,'');
                //if it's 2 words keep the first one
                type = type.replace(/ .*/,''); //replace everything after first space with nothing
            } else if(this.regexes.featureTitle.exec(arrString[i])){
                const matchDetails = this.regexes.featureDetails.exec(arrString[i]);
                let newFeature = { "name": matchDetails.groups.name.replace(/[.!]$/,""), "details": matchDetails.groups.details, "type":type};
                i++;
                while(i<arrString.length && this.regexes.featureTitle.exec(arrString[i]) === null && !this.regexes.featureTypes.includes(arrString[i].toLowerCase())){
                    newFeature.details+=" "+arrString[i];
                    i++;
                }
                if(newFeature.name.toLowerCase().includes("spellcasting")){
                    ui.notifications.info("Your pasted features contain Spellcasting, use the addMonsterSpells to add those.");
                } else {
                    arrFeatures.push(newFeature);
                }
                continue;
    
            }
            i++;
        }
    
         if(arrFeatures.length > 0){
            for(const feature of arrFeatures){
                if(feature.type === 'feature'){
                    await actor.createEmbeddedDocuments("Item",[{ name:feature.name, type: 'feature', system: { description: { value: this.replaceFoundrySyntax(feature.details)}}}]);
                } else {
                    const atkInfo = this.regexes.attack.exec(feature.details)
                    if(atkInfo){ //check if is an attack
                        const dmgInfo = this.regexes.diceDamage.exec(feature.details)
                        
                        const newAtk = {"system":{"attack":{"bonus":atkInfo.groups.tohit, "flat": true}, "damage":{"parts":[{"additionalTypes": [ ], "bonus": (dmgInfo.groups?.bonus)? dmgInfo.groups.bonus : "", "custom": { "enabled": false, "formula": "" }, "denomination": parseInt(dmgInfo.groups.dicedenom), "number": parseInt(dmgInfo.groups.dicenum), "scaling": { "number": 1 }, "type": dmgInfo.groups.type}]}}}

                        await actor.createEmbeddedDocuments("Item",[{ name:feature.name, type: "feature", "img":"icons/skills/melee/unarmed-punch-fist-white.webp",
                            system: { description: { value:this.replaceFoundrySyntax(feature.details)}, 
                            activities: this.newActivity("attack", feature.type, newAtk)}}]);

                    } else {
                        const saveInfo = this.regexes.savingThrowDetails.exec(feature.details);
                        if(saveInfo){ //check if it is save
                            const dmgInfo = this.regexes.diceDamage.exec(feature.details)
                            const newSave = {"system":{ "damage": { "parts": [ { "number": parseInt(dmgInfo.groups.dicenum), "denomination": dmgInfo.groups.dicedenom, "bonus": "", "custom": { "formula": "", "enabled": false }, "type": dmgInfo.groups.type, "additionalTypes": [], "scaling": { "number": 1 } } ] }, "effects": [], "save": { "ability": [ saveInfo.groups.saveability.toLowerCase() ], "dc": { "ability": "custom", "formula": saveInfo.groups.savedc }} } }

                            await actor.createEmbeddedDocuments("Item",[{ name:feature.name, type: "feature", "img":"icons/skills/movement/figure-running-gray.webp",
                                system: { description: { value:this.replaceFoundrySyntax(feature.details)}, 
                                activities: this.newActivity("save", feature.type, newSave)}}]);
                        } else {
                            await actor.createEmbeddedDocuments("Item",[{ name:feature.name, type: 'feature', system: { description: { value: this.replaceFoundrySyntax(feature.details)}, activities:this.newActivity("utility",feature.type)}}]);
                        }
                    }
                }
    
            }
        }
       // console.log(arrFeatures);
    }
    
    static async parseSpellcasting(spellString, actor){
     	const pack = game.packs.get("kp-tov-players-guide.spells");
        await pack.getIndex();
        
        //Add spellcasting details
        const castingDetails = this.regexes.spellcastingDetails.exec(spellString);
        if(castingDetails?.ability1){
            assignToObject(actor,"system.spellcasting.ability",castingDetails.ability1.toLowerCase());
        } else if(castingDetails?.ability2){
            assignToObject(actor,"system.spellcasting.ability",castingDetails.ability2.toLowerCase());
        }
        if(castingDetails?.savedc){
            assignToObject(actor,"system.spellcasting.dc",castingDetails.savedc.toLowerCase());
        }

        //Check spells
        const spellLines = spellString.split(/\r?\n/);
        const spells = [];
        for(let j=0; j<spellLines.length; j++){
            const spellLine = this.regexes.spellsUses.exec(spellLines[j]);
            if(spellLine){
                for(const spell of spellLine.groups.spells.split(',')){
                    spells.push({"name":spell.trim(),"uses":parseInt(spellLine.groups.uses)})
                }
            }
        }
    
         for(const spell of spells){
            const indexSpell=pack.index.find(e => e.name.toLowerCase().split(" ").join("") === spell.name.toLowerCase().split(" ").join(""));
            if(indexSpell){
                let newSpell = await pack.getDocument(indexSpell._id);
                let createdSpell = await actor.createEmbeddedDocuments("Item",[newSpell]);
                if(spell.uses > 0){
                    actor.updateEmbeddedDocuments("Item",[{_id:createdSpell[0]._id, system: {uses: {max : spell.uses.toString(), recovery:[{"period": "longRest","type": "recoverAll"}]}}}]);
                }
    
            } else {
                console.log(`bfr-statblock-parser | Did not find spell in compendium: ${spell.name}`);
                let newSpell = {...this.activityTemplates.spellTemplate, "_id": foundry.utils.randomID(), "name":spell.name+"?"};
                let createdSpell = await actor.createEmbeddedDocuments("Item",[newSpell]);
                if(spell.uses > 0){
                    actor.updateEmbeddedDocuments("Item",[{_id:createdSpell[0]._id, system: {uses: {max : spell.uses.toString(), recovery:[{"period": "longRest","type": "recoverAll"}]}}}]);
                    const newId = foundry.utils.randomID()
                    let newSpellActivity = { [newId] : {...this.activityTemplates["spellConsume"], "_id":newId, uses:{ "spent": 0, "consumeQuantity": false, "recovery": [], "max": spell.uses.toString() }} }
                    actor.updateEmbeddedDocuments("Item",[{_id:createdSpell[0]._id, system: {activities:newSpellActivity}}]);
                }
            }
        } 
    }

    static replaceFoundrySyntax(line){
        //clean line from newlines breaks
        let newline = line.replace(/[\r\n]+/gm,"");

        //check attack line
        let match = this.regexes.attack.exec(newline);
        if(match){
            newline = newline.replace(match[0],`[[/attack]]`);;
        }
    
        //check damage line
        match = this.regexes.damageRoll.exec(newline)
        while(match){ //handle several damage in same line
            newline = newline.replace(match[0],`[[/damage average]]`);
            match = this.regexes.damageRoll.exec(newline)
        }
    
        //check saves or rolls
        match = this.regexes.savingThrowDetails.exec(newline)
        if(match){
            newline = newline.replace(match[0],`must succeed on a [[/save]] save`);
        }
    
        return newline;
    }

    static monsterStats = {
        "CR 0": {"acdc": 10, "hp": "3 (2-4)", "atkprof": "2", "dpr": "2", "atks": 1, "dmg": "2 (1d4)"},
        "CR 1/8": {"acdc": 11, "hp": "9 (7-11)", "atkprof": "3", "dpr": "3", "atks": 1, "dmg": "4 (1d6 + 1)"},
        "CR 1/4": {"acdc": 11, "hp": "13 (10-16)", "atkprof": "3", "dpr": "5", "atks": 1, "dmg": "5 (1d6 + 2)"},
        "CR 1/2": {"acdc": 12, "hp": "22 (17-28)", "atkprof": "4", "dpr": "8", "atks": 2, "dmg": "4 (1d4 + 2)"},
        "CR 1": {"acdc": 12, "hp": "33 (25-41)", "atkprof": "5", "dpr": "12", "atks": 2, "dmg": "6 (1d8 + 2)"},
        "CR 2": {"acdc": 13, "hp": "45 (34-56)", "atkprof": "5", "dpr": "17", "atks": 2, "dmg": "9 (2d6 + 2)"},
        "CR 3": {"acdc": 13, "hp": "65 (49-81)", "atkprof": "5", "dpr": "23", "atks": 2, "dmg": "12 (2d8 + 3)"},
        "CR 4": {"acdc": 14, "hp": "84 (64-106)", "atkprof": "6", "dpr": "28", "atks": 2, "dmg": "14 (3d8 + 1)"},
        "CR 5": {"acdc": 15, "hp": "95 (71-119)", "atkprof": "7", "dpr": "35", "atks": 3, "dmg": "12 (3d6 + 2)"},
        "CR 6": {"acdc": 15, "hp": "112 (84-140)", "atkprof": "7", "dpr": "41", "atks": 3, "dmg": "14 (3d6 + 4)"},
        "CR 7": {"acdc": 15, "hp": "130 (98-162)", "atkprof": "7", "dpr": "47", "atks": 3, "dmg": "16 (3d8 + 3)"},
        "CR 8": {"acdc": 15, "hp": "136 (102-170)", "atkprof": "7", "dpr": "53", "atks": 3, "dmg": "18 (3d10 + 2)"},
        "CR 9": {"acdc": 16, "hp": "145 (109-181)", "atkprof": "8", "dpr": "59", "atks": 3, "dmg": "22 (3d12 + 3)"},
        "CR 10": {"acdc": 17, "hp": "155 (116-194)", "atkprof": "9", "dpr": "65", "atks": 4, "dmg": "16 (3d8 + 3)"},
        "CR 11": {"acdc": 17, "hp": "165 (124-206)", "atkprof": "9", "dpr": "71", "atks": 4, "dmg": "18 (3d10 + 2)"},
        "CR 12": {"acdc": 17, "hp": "175 (131-219)", "atkprof": "9", "dpr": "77", "atks": 4, "dmg": "19 (3d10 + 3)"},
        "CR 13": {"acdc": 18, "hp": "184 (138-230)", "atkprof": "10", "dpr": "83", "atks": 4, "dmg": "21 (4d8 + 3)"},
        "CR 14": {"acdc": 19, "hp": "196 (147-245)", "atkprof": "11", "dpr": "89", "atks": 4, "dmg": "22 (4d10)"},
        "CR 15": {"acdc": 19, "hp": "210 (158-263)", "atkprof": "11", "dpr": "95", "atks": 5, "dmg": "19 (3d10 + 3)"},
        "CR 16": {"acdc": 19, "hp": "229 (172-286)", "atkprof": "11", "dpr": "101", "atks": 5, "dmg": "21 (4d8 + 3)"},
        "CR 17": {"acdc": 20, "hp": "246 (185-308)", "atkprof": "12", "dpr": "107", "atks": 5, "dmg": "22 (3d12 + 3)"},
        "CR 18": {"acdc": 21, "hp": "266 (200-333)", "atkprof": "13", "dpr": "113", "atks": 5, "dmg": "23 (4d10 + 1)"},
        "CR 19": {"acdc": 21, "hp": "285 (214-356)", "atkprof": "13", "dpr": "119", "atks": 5, "dmg": "24 (4d10 + 2)"},
        "CR 20": {"acdc": 21, "hp": "300 (225-375)", "atkprof": "13", "dpr": "132", "atks": 5, "dmg": "26 (4d12)"},
        "CR 21": {"acdc": 22, "hp": "325 (244-406)", "atkprof": "14", "dpr": "150", "atks": 5, "dmg": "30 (4d12 + 4)"},
        "CR 22": {"acdc": 23, "hp": "350 (263-438)", "atkprof": "15", "dpr": "168", "atks": 5, "dmg": "34 (4d12 + 8)"},
        "CR 23": {"acdc": 23, "hp": "375 (281-469)", "atkprof": "15", "dpr": "186", "atks": 5, "dmg": "37 (6d10 + 4)"},
        "CR 24": {"acdc": 23, "hp": "400 (300-500)", "atkprof": "15", "dpr": "204", "atks": 5, "dmg": "41 (6d10 + 8)"},
        "CR 25": {"acdc": 24, "hp": "430 (323-538)", "atkprof": "16", "dpr": "222", "atks": 5, "dmg": "44 (6d10 + 11)"},
        "CR 26": {"acdc": 25, "hp": "460 (345-575)", "atkprof": "17", "dpr": "240", "atks": 5, "dmg": "48 (6d10 + 15)"},
        "CR 27": {"acdc": 25, "hp": "490 (368-613)", "atkprof": "17", "dpr": "258", "atks": 5, "dmg": "52 (6d10 + 19)"},
        "CR 28": {"acdc": 25, "hp": "540 (405-675)", "atkprof": "17", "dpr": "276", "atks": 5, "dmg": "55 (6d10 + 22)"},
        "CR 29": {"acdc": 26, "hp": "600 (450-750)", "atkprof": "18", "dpr": "294", "atks": 5, "dmg": "59 (6d10 + 26)"},
        "CR 30": {"acdc": 27, "hp": "666 (500-833)", "atkprof": "19", "dpr": "312", "atks": 5, "dmg": "62 (6d10 + 29)"}
    };
}