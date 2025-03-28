import { world, system, Player } from "@minecraft/server";
import { clamp, debug, Check, getCooldownTime } from "./mathAndCalculations.js";

export class CombatManager {
	static attack(eventData) {
		const { player, target } = eventData;
		const status = player.getStatus();

 		status.attackReady = false;

		//  if (!player.isSprinting) {
		// 	status.sprintKnockbackHitUsed = false;
		// 	status.sprintKnockbackValid = false;
		// 	status.critSweepValid = true;
		//   } else if (player.isSprinting && !status.sprintKnockbackHitUsed) {
		// 	status.sprintKnockbackValid = true;
		//   } else if (player.isSprinting && status.sprintKnockbackHitUsed) {
		// 	status.sprintKnockbackValid = false;
		//   }
		//   status.critSweepValid = !player.isSprinting || status.sprintKnockbackHitUsed;
		
		const headLoc = player.getHeadLocation();
		const loc = player.location;
		const currentTime = Date.now();
		
		const { equippableComp, item, stats } = player.getItemStats();
		const specialCheck = Check.specialValid(currentTime, player, stats);
		const dmg = Check.damageCalculation(currentTime, player, target, item, stats);
		const fireAspect = Check.enchantLevel(item, "fire_aspect");
		const crit = Check.criticalHit(currentTime, player, target, stats, { damage: dmg });
		const sprintKnockback = Check.sprintKnockback(currentTime, player, target, stats, { damage: dmg });
		const sweptEntities = Check.sweep(currentTime, player, target, stats, { fireAspect: fireAspect, damage: dmg })??[];
		const inanimate = Check.inanimate(target, {
			excludeTypes: [ "minecraft:armor_stand" ]
		})
		let hit = false;
		
		// If the player is sprinting, add a knockback level on top of current enchantment knockback level. 
		let knockback = Check.enchantLevel(item, "knockback")??0;
		if (sprintKnockback) knockback += 1;
		
		/** 
		* Checks for target's shield and attacker's axe.
		* Fun fact: entityAttack damage cause can knockback the damagingEntity(attacker)
		* if the victim is holding a shield and has their view towards the attacker.
		* Also the victim's shield can be disabled if the attacker is holding an axe.
		* And for some reason, entityExplosion damage cause behaves the same as entityAttack,
		* except it doesn't knockback the attacker nor checks for axe and
		* disable the shield.
		*/
		status.shieldDelay = 0;
		const shieldBlock = Check.shieldBlock(currentTime, player, target, stats);
		let dmgType = shieldBlock?"entityExplosion":"entityAttack";
		
		/**
		* Check if the iframes have passed or if the base damage done to the victim is larger than the one in the last attack.
		* This is to prevent the attacker from damaging the target rapidly while in iframes.
		*/
		const maxCD = getCooldownTime(player, stats?.attackSpeed).ticks;
		const curCD = status.cooldown;
		const perc = clamp( ((maxCD - curCD) / maxCD), 0.9, 1 );
		
		/**
		* Since applyAttackKnockback knockbacks the entity to the specific location, it would need
		* a calculation to get the direction for getting the coordinates the victim entity will land on.
		*/
		function calculateKnockbackDistance(baseDistance, knockback, perc) {
   		return Math.max(perc * baseDistance * (knockback || 1), 1);
		}
		
		function dir(k) {
			const l = target.location;
			const direction = {
				x: l.x - loc.x,
				y: l.y,
				z: l.z - loc.z
			};
			const length = Math.sqrt(direction.x ** 2 + direction.z ** 2);
			
			return {
				x: l.x + (direction.x / length) * k,
				y: direction.y,
				z: l.z + (direction.z / length) * k
			};
		}
		
		const lastAttack = target.__lastAttack || { damage: 0, time: 0 };
		const timeElapsed = currentTime - lastAttack.time;
		
		if (timeElapsed > 500 || (stats?.damage > lastAttack.damage && specialCheck)) {
			const damageValid = !status.mace ? target.applyDamage(dmg, { cause: dmgType, damagingEntity: player }) : false;
			hit = damageValid;
			
			// if the target is inanimate, skip durability reduction
			 if (!inanimate && dmg > 0) Check.durability(player, equippableComp, item, stats);
			
			try {
			    if (damageValid && !shieldBlock) {
			        const knockbackX = knockback > 0 
			            ? calculateKnockbackDistance(stats?.enchantedKnockback??2.586, knockback, perc) 
			            : calculateKnockbackDistance(stats?.regularKnockback??1.552, 1, perc);
			        const knockbackY = target.isOnGround ? (knockback > 0 ? perc * 1 : perc * 0.8125) : 0;
			
			        target.applyAttackKnockback(dir(knockbackX), knockbackY);
			    }
			} catch (e) { 
			    debug("Error during knockback: " + e + ", knockback skipped"); 
			}
			
			if (dmg > 0) {
				specialCheck
				? world.playSound("game.player.attack.strong", headLoc)
				: world.playSound("game.player.attack.weak.se", headLoc);
			}
			
			debug(`damage result\n\nattacked with: ${item?.typeId}\nattempted damage: ${dmg.toFixed(4)}\ntime since last atk: ${currentTime - status.lastAttackTime}ms`);
			
		} else {
			if (dmg > 0) world.playSound("game.player.attack.nodamage.se", headLoc);
			
			debug(`attacked with: ${item?.typeId}\nattempted damage: ${dmg.toFixed(4)} (iframes immunity)\ntime since last atk: ${currentTime - status.lastAttackTime}ms`);
		}
		
		if (dmg > 0) status.lastAttackTime = currentTime;
		if (stats?.script) { stats.script({ world, player, target, item, sweptEntities, dmg, hit, shieldBlock, specialCheck, crit, sprintKnockback, inanimate }) }
	}
};