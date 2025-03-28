// This file is used to handle crucial functions. 

import { world, system, Player, World, EntityMovementComponent } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { CombatManager } from "./class.js";
import { WeaponDB } from "../Weapon/Weapons.js"; 
import {
	Check,
	clamp,
	debug,
	getCooldownTime,
	
	toColor
} from "./mathAndCalculations.js";

// If it's the first time running the add-on, set up the world
world.afterEvents.worldInitialize.subscribe(() => {

	
	if (world.getDynamicProperty("shieldBreakSpecial") == undefined) {
		world.setDynamicProperty("shieldBreakSpecial", false);
	}
});

// Initialize dynamic properties
export function initialize(player, dynamicProperty) {
	if (player.getDynamicProperty(dynamicProperty) == undefined) {
		player.setDynamicProperty(dynamicProperty, true);
	}
}



// Config form
// function configForm(player) {
// 	const status = player.getStatus();
// 	const op = player.isOp() || player.hasTag("sweepnslash.config");
// 	let formValuesPush = 0;
	
//     let form = new ModalFormData()
//     .title({ translate:"sweepnslash.configmenutitle" })
    
//     function dp(object, { id, value } = {}) {
// 	    if (value !== undefined) object.setDynamicProperty(id, value);
// 	    return object.getDynamicProperty(id);
// 	}
	
// 	if (op == true) {
// 	    if (!world.isHardcore) form.toggle({ translate: "sweepnslash.toggleaddon" }, dp(world, { id: "addon_toggle" }));
// 		form.toggle({ translate: "sweepnslash.shieldbreakspecial" }, dp(world, { id: "shieldBreakSpecial" }));
// 	    form.toggle({ translate: "sweepnslash.toggledebugmode" }, dp(world, { id: "debug_mode" }));
// 	}
	
// 	form.toggle({ translate: "sweepnslash.excludepetfromsweep" }, dp(player, { id: "excludePetFromSweep" }) ?? false);
// 	form.dropdown(
// 	    { translate: "sweepnslash.indicatorstyle" },
// 	    [{ translate: "sweepnslash.crosshair" }, { translate: "sweepnslash.hotbar" }, { translate: "sweepnslash.geyser" }, { translate: "sweepnslash.none" }],
// 	    dp(player, { id: "cooldownStyle" })
// 	);
// 	form.toggle({ translate: "sweepnslash.bowhitsound" }, dp(player, { id: "bowHitSound" }) ?? false);
// 	form.toggle({ translate: "sweepnslash.sweepparticles" }, dp(player, { id: "sweep" }) ?? false);
// 	form.toggle({ translate: "sweepnslash.enchantedhitparticles" }, dp(player, { id: "enchantedHit" }) ?? false);
// 	form.toggle({ translate: "sweepnslash.damageindicatorparticles" }, dp(player, { id: "damageIndicator" }) ?? false);
// 	form.toggle({ translate: "sweepnslash.critparticles" }, dp(player, { id: "criticalHit" }) ?? false);
// 	form.toggle({ translate: "sweepnslash.critsounds" }, dp(player, { id: "critSound" }) ?? false);
	
// 	form.textField(
// 	    { rawtext: [{ text: "\n" }, { translate: "sweepnslash.sweepRGBtitle" }, { text: "\n\n" }, { text: "R" }] },
// 	    "0~255",
// 	    JSON.stringify(dp(player, { id: "sweepR" }) ?? 255)
// 	);
// 	form.textField("G", "0~255", JSON.stringify(dp(player, { id: "sweepG" }) ?? 255));
// 	form.textField("B", "0~255", JSON.stringify(dp(player, { id: "sweepB" }) ?? 255));
    
//     form.submitButton({ translate:"sweepnslash.saveconfig" });
    
//     form.show(player).then((response) => {
//         const { canceled, formValues, cancelationReason } = response;
        
//         function n(value) {
//         	const num = Number(value);
// 	        if (isNaN(value)) player.sendMessage({ translate:"sweepnslash.nan" })
// 	        return isNaN(num) ? 0 : num
//         }
        
//         if (response && canceled && cancelationReason === "UserBusy") {
//             configForm(player);
//             return;
//         }
//         if (canceled) {
//         	player.sendMessage({ translate:"sweepnslash.canceled" });
// 	        return;
//         } else if (!canceled) {
//         	player.sendMessage({ translate:"sweepnslash.saved" });
//         }

// 		function valuePush(object, dynamicProperty, push, isRgb) {
// 		    if (push) {
// 		        const value = isRgb ? clamp(n(formValues[formValuesPush]), 0, 255) : formValues[formValuesPush];
// 		        object.setDynamicProperty(dynamicProperty, value);
// 		        formValuesPush++;
// 		    }
// 		}
		
// 		const properties = [
// 		    { object: world, dynamicProperty: "addon_toggle", push: op && !world.isHardcore },
// 			{ object: world, dynamicProperty: "shieldBreakSpecial", push: op },
// 		    { object: world, dynamicProperty: "debug_mode", push: op },
// 		    { object: player, dynamicProperty: "excludePetFromSweep", push: true },
// 		    { object: player, dynamicProperty: "cooldownStyle", push: true },
// 			{ object: player, dynamicProperty: "bowHitSound", push: true },
// 		    { object: player, dynamicProperty: "sweep", push: true },
// 		    { object: player, dynamicProperty: "enchantedHit", push: true },
// 		    { object: player, dynamicProperty: "damageIndicator", push: true },
// 		    { object: player, dynamicProperty: "criticalHit", push: true },
// 		    { object: player, dynamicProperty: "critSound", push: true },
// 		    { object: player, dynamicProperty: "sweepR", push: true, isRgb: true },
// 		    { object: player, dynamicProperty: "sweepG", push: true, isRgb: true },
// 		    { object: player, dynamicProperty: "sweepB", push: true, isRgb: true },
// 		];
		
// 		properties.forEach(({ object, dynamicProperty, push, isRgb }) => {
// 		    valuePush(object, dynamicProperty, push, isRgb);
// 		});
        
//     })
// }

// // Config menu opener
// world.beforeEvents.chatSend.subscribe((data) => {
// 	const { message, sender } = data;
// 	if ((sender instanceof Player) && message == "!se.config") {
// 		data.cancel = true;
// 		system.run(() => {
// 			sender.sendMessage({ translate:"sweepnslash.configopened" })
// 			configForm(sender)
// 		})
// 	}
// });


// For air swinging and parsing item stats from other addons
system.afterEvents.scriptEventReceive.subscribe((event) => {
    const { id } = event;
    
    // if (event.id === "sweepnslash:register_weapon") {
	//     const newWeapon = JSON.parse(event.message);
	//     const existingIndex = WeaponDB.getWeapon(newWeapon.id);
	    
	//     if (existingIndex !== -1) {
	//         weaponStats[existingIndex] = newWeapon;
	//     } else {
	//         WeaponDB.(newWeapon);
	//     }
	// }
    
    const player = event.sourceEntity;
    if (!(player instanceof Player)
	    || !player
    ) return;
    
    const status = player.getStatus();
    const { equippableComp, item, stats } = player.getItemStats();
    
    if (id === "se:attack") {
	    if (player.__leftClick == true) {
	        player.__leftClick = false;
	        return;
	    }
	    
	    if (player.__rightClick == true) {
	        player.__rightClick = false;
	        status.shieldDelay = 0;
	        return;
	    }
	    
	    if (Check.block(player) && !Check.view(player)) return;
	    
	    status.lastAttackTime = Date.now();
	    
	    debug(`${Math.random().toFixed(2)} attack event by ${player.name}`);
    }
});

world.afterEvents.entityHitEntity.subscribe((event) => {
  
    const player = event.damagingEntity;
    const target = event.hitEntity;
    
    if (!(player instanceof Player)) {
    	// The 'player' here is actually not a player. It's for disabling shield knockback on non-player mobs. Don't get confused!
	    const { stats } = player.getItemStats();
	    const currentTime = Date.now();
    	const shieldBlock = Check.shieldBlock(currentTime, player, target, stats);
    	if (shieldBlock) player.applyKnockback(0,0,0,0);
	    return;
    }
    
	player.__leftClick = true;
    if (target?.isValid()) CombatManager.attack({ player, target });

	ReworkedHitEntity(event);
    JungleAbomination(event);
	TempestGolem(event);
	hoglinFunc(event);
});

function hoglinFunc(event) {
	const hurtEntity = event.hitEntity;
	const damageSource = event.damagingEntity;
	if (damageSource.typeId === "minecraft:hoglin") {
	  const xDif = hurtEntity.location.x - damageSource.location.x;
	  const zDif = hurtEntity.location.z - damageSource.location.z;
	  hurtEntity.applyKnockback(xDif, zDif, 1.8, 0.64);
	  damageSource.addEffect('slowness', 17, {amplifier: 7, showParticles: false});
	}
  }

function JungleAbomination(event){
	const player = event.damagingEntity;
    const target = event.hitEntity;
	// AOE para Abomination
    if (player.typeId === "dungeons:jungle_abomination") {
        const nearbyMobs = target.dimension.getEntities({
            location: target.location,
            maxDistance: 3,
            excludeFamilies: ['monster', 'ignore']
        });
        for (const mob of nearbyMobs) {
            const xDif = mob.location.x - player.location.x;
            const zDif = mob.location.z - player.location.z;
            if (mob !== target) {
                mob.applyDamage(10, {
                    cause: EntityDamageCause.entityAttack,
                    damagingEntity: player
                });
            }
            if (mob.typeId === 'minecraft:player') {
                mob.runCommandAsync('camerashake add @s 0.2 1 positional');
            }
            mob.applyKnockback(xDif, zDif, 2, 0.4);
        }
    }

}

function TempestGolem(event){

	const player = event.damagingEntity;
    const target = event.hitEntity;
	 // AOE para Tempest
	 if (player.typeId === "dungeons:tempest_golem") {
        const nearbyMobs = target.dimension.getEntities({
            location: target.location,
            maxDistance: 1.5,
            excludeFamilies: ['monster', 'ignore']
        });
        for (const mob of nearbyMobs) {
            const xDif = mob.location.x - player.location.x;
            const zDif = mob.location.z - player.location.z;
            if (mob !== target) {
                mob.applyDamage(6, {
                    cause: EntityDamageCause.entityAttack,
                    damagingEntity: player
                });
            }
            if (mob.typeId === 'minecraft:player') {
                mob.runCommandAsync('camerashake add @s 0.2 1 positional');
            }
            mob.applyKnockback(xDif, zDif, 1.5, 0.6);
        }
    }
}

function isFamily(family, entity) {
    try {
    entity.runCommand(`testfor @s[family=${family}]`)
    return true
    } catch { return false }
  }




function ReworkedHitEntity(evd) {
    if (evd.damagingEntity.typeId === 'minecraft:player' && evd.hitEntity.typeId === 'edx:volley_bomb') {
    const player = evd.damagingEntity;
    const bomb = evd.hitEntity;
    bomb.applyKnockback(player.getViewDirection().x, player.getViewDirection().z, Math.sqrt(player.getViewDirection().x ** 2 + player.getViewDirection().z ** 2)*4, player.getViewDirection().y*1.3)
}

if ((isFamily('monster', evd.hitEntity) === true || isFamily('mob', evd.hitEntity) === true) && isFamily('inanimate', evd.hitEntity) === false && evd.damagingEntity.typeId === 'minecraft:player' && evd.damagingEntity.hasTag("blood_vial")) {
    const player = evd.damagingEntity;
    let health = player.getComponent("health")
    health.setCurrentValue(health.currentValue+0.20)
    evd.hitEntity.runCommand(`particle edx:blood ~~~`);
}



if(evd.hitEntity.typeId == "edx:wither" && evd.hitEntity.getComponent(`health`).currentValue == 0)
{
    const position =evd.hitEntity.location
    const dimension = evd.hitEntity.dimension
    const entityOptions = {
        location: position,
        families: [ "player" ],
        maxDistance: 50
    }
    const entities = dimension.getEntities(entityOptions);
    if(!evd.hitEntity.hasTag("wither"))
        for (let i = 0; i < entities.length ; i++){
            entities[i].runCommand(`scoreboard players add @s[tag=!wither] max_health 4`)
            entities[i].runCommand(`tellraw @s[tag=!wither] { "rawtext": [ { "text": "§cThe Wither has been killed, you can now go in the end but be prepared because when you'll kill the Ender dragon you'll enter in §5Void mode§c monsters will be even more powerful and some new mobs will spawn" } ] }`)
            entities[i].addTag('wither')
            dimension.spawnItem(new ItemStack('edx:corrupted_star', 1), entities[i].location);
        }
    evd.hitEntity.addTag('wither')
}



}

world.afterEvents.projectileHitEntity.subscribe((event) => {
  
    const player = event.source;
    if (!player) return;
    const projectile = event.projectile;
	
	const target = event.getEntityHit().entity;


	
	
	
	if ( !target) return;

    

	const configCheck = (player.getDynamicProperty("bowHitSound") == true);
	
	if (projectile.typeId === "minecraft:arrow"
	&& configCheck
	&& target instanceof Player
	&& player !== target) {
		player.playSound( "random.orb", { pitch: 0.5 });
	}
});

// For making sure the attack cooldown isn't triggered when the player interacts with levers or buttons.
world.afterEvents.playerInteractWithBlock.subscribe((data) => {
	const { player, block } = data;
	if (block) {
		player.__rightClick = true;
	}
});

// Run cooldown when the player hits block.
world.afterEvents.entityHitBlock.subscribe((data) => {
	
	const player = data.damagingEntity;
	
	if (!(player instanceof Player)) return;
	if (player.getGameMode() === "creative") return;
	
	const status = player.getStatus();
	status.shieldDelay = 0;
	status.lastAttackTime = Date.now();
	player.__leftClick = true;
});

