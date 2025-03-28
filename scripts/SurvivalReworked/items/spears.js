import { world,GameMode} from "@minecraft/server"
import {Damage} from "./item_components.js"

function isFamily(family, entity) {
  try {
  entity.runCommand(`testfor @s[family=${family}]`)
  return true
  } catch { return false }
}
function getScore(player, objective) {
  try {
    const s = world.scoreboard.getObjective(objective);
    if (!s) world.scoreboard.addObjective(objective, objective);
    return s.getScore(player.scoreboardIdentity)!=0?s.getScore(player.scoreboardIdentity):1;
  } catch {
    return 1;
  }
}
function getDistance(player) {
  let dist = 4.3
  if(player.hasTag("long_spear") && player.hasTag('riding'))
      dist+=1.5
  return dist
}
function getDamage(itemUsed,player) {
  let index = spearsList.indexOf(itemUsed.typeId)
  let damage = spearsDamageList[index]
  if(itemUsed?.getComponent('enchantable')?.getEnchantment("sharpness")?.level>0)
      damage += itemUsed?.getComponent('enchantable')?.getEnchantment("sharpness")?.level ?? 0
  if(player.isSprinting && player.hasTag('speed_spear'))
    damage*=1.2
  return damage
}
function getSmiteDamage(itemUsed) {
  let index = spearsList.indexOf(itemUsed.typeId)
  let damage = spearsDamageList[index]
  if(itemUsed?.getComponent('enchantable')?.getEnchantment("smite")?.level>0)
      damage += itemUsed?.getComponent('enchantable')?.getEnchantment("smite")?.level*2.5 ?? 0
  return damage
}
function getArthropodDamage(itemUsed) {
  let index = spearsList.indexOf(itemUsed.typeId)
  let damage = spearsDamageList[index]
  if(itemUsed?.getComponent('enchantable')?.getEnchantment("bane_of_arthropods")?.level>0)
      damage += itemUsed?.getComponent('enchantable')?.getEnchantment("bane_of_arthropods")?.level*2.5 ?? 0
  return damage
}
function getKnockbackValue(itemUsed) {
  var value = 1.5
  if(itemUsed?.getComponent('enchantable')?.getEnchantment("knockback")?.level>0)
      value = itemUsed?.getComponent('enchantable')?.getEnchantment("knockback")?.level*1.25
  return value
}

const spearsList = ['edx:copper_spear_i','edx:tin_spear_i','edx:iron_spear_i','edx:platinium_spear_i','edx:crimson_nickel_spear_i','edx:warped_nickel_spear_i','edx:crimson_netherite_spear_i','edx:warped_netherite_spear_i']
const spearsDamageList = [6,4,5,6,4,3,8,6]



export function Attack(player)
{ 
  let itemUsed =player.getComponent('equippable').getEquipment('Mainhand')
  if(itemUsed!=null)
  {
      //use spear
      if (spearsList.includes(itemUsed.typeId) ) {
          //raycast
          const options = { maxDistance: getDistance(player) ,excludeTypes: ["minecraft:item"],excludeFamilies:["projectile"],includePassableBlocks:false}
          
          
          let raycast1 = player.getEntitiesFromViewDirection( options);
          let raycast2 = world.getDimension(player.dimension.id).getEntitiesFromRay({x:player.getHeadLocation().x-0.2,y:player.getHeadLocation().y-0.2,z:player.getHeadLocation().z-0.2} /*Position de départ*/ , player.getViewDirection() /*Direction sale pute*/, options);
          let raycast3 = world.getDimension(player.dimension.id).getEntitiesFromRay({x:player.getHeadLocation().x+0.2,y:player.getHeadLocation().y-0.2,z:player.getHeadLocation().z+0.2} /*Position de départ*/ , player.getViewDirection() /*Direction sale pute*/, options);
          let raycast4 = world.getDimension(player.dimension.id).getEntitiesFromRay({x:player.getHeadLocation().x-0.2,y:player.getHeadLocation().y+0.2,z:player.getHeadLocation().z-0.2} /*Position de départ*/ , player.getViewDirection() /*Direction sale pute*/, options);
          let raycast5 = world.getDimension(player.dimension.id).getEntitiesFromRay({x:player.getHeadLocation().x+0.2,y:player.getHeadLocation().y+0.2,z:player.getHeadLocation().z+0.2} /*Position de départ*/ , player.getViewDirection() /*Direction sale pute*/, options);
          let raycast6 = world.getDimension(player.dimension.id).getEntitiesFromRay({x:player.getHeadLocation().x,y:player.getHeadLocation().y-0.4,z:player.getHeadLocation().z} /*Position de départ*/ , player.getViewDirection() /*Direction sale pute*/, options);
          let raycast7 = world.getDimension(player.dimension.id).getEntitiesFromRay({x:player.getHeadLocation().x,y:player.getHeadLocation().y-0.4,z:player.getHeadLocation().z} /*Position de départ*/ , player.getViewDirection() /*Direction sale pute*/, options);
          let raycast8 = world.getDimension(player.dimension.id).getEntitiesFromRay({x:player.getHeadLocation().x-0.2,y:player.getHeadLocation().y,z:player.getHeadLocation().z-0.2} /*Position de départ*/ , player.getViewDirection() /*Direction sale pute*/, options);
          let raycast9 = world.getDimension(player.dimension.id).getEntitiesFromRay({x:player.getHeadLocation().x+0.2,y:player.getHeadLocation().y,z:player.getHeadLocation().z+0.2} /*Position de départ*/ , player.getViewDirection() /*Direction sale pute*/, options);
          var entities1= []
          var entities2= []
          var entities3= []
          var entities4= []
          var entities5= []
          var entities6= []
          var entities7= []
          var entities8= []
          var entities9= []
          if(raycast1!=undefined)
            entities1=raycast1
          if(raycast2!=undefined)
            entities2=raycast2
          if(raycast3!=undefined )
            entities3=raycast3
          if(raycast4!=undefined )
            entities4=raycast4
          if(raycast5!=undefined )
            entities5=raycast5
          if(raycast6!=undefined)
            entities6=raycast6
          if(raycast7!=undefined )
            entities7=raycast7
          if(raycast8!=undefined )
            entities8=raycast8
          if(raycast9!=undefined )
            entities9=raycast9
          var entities = entities1.concat(entities2).concat(entities3).concat(entities4).concat(entities5).concat(entities6).concat(entities7).concat(entities8).concat(entities9)
          
          if(entities!=undefined)
          {
           
                  let fireAspectLevel = itemUsed?.getComponent('enchantable')?.getEnchantment("fire_aspect")?.level ?? 0
                  let smiteLevel = itemUsed?.getComponent('enchantable')?.getEnchantment("smite")?.level ?? 0
                  let arthropodLevel = itemUsed?.getComponent('enchantable')?.getEnchantment("bane_of_arthropods")?.level ?? 0
                  var damage = getDamage(itemUsed,player)
                  if(smiteLevel>0)
                      var smiteDamage = getSmiteDamage(itemUsed)
                  if(arthropodLevel>0)
                      var arthropodDamage = getArthropodDamage(itemUsed)
                  let hitEntities =[]
                  //damage every entities
                  let a=0;
                  for (let i = 0; i < entities.length && a<4; i++) {
                    if(entities[i].entity!=player && (entities[i].entity.typeId != "minecraft:player" || world.gameRules.pvp==true) && !hitEntities.includes(entities[i].entity))
                    {
                      if(player.hasTag('sharper_spear'))
                        {
                          if(smiteLevel>0 && isFamily('undead', entities[i]))
                          {
                            entities[i].entity.applyDamage(smiteDamage*8/10,{cause: "entityAttack",damagingEntity: player})
                            entities[i].entity.applyDamage(smiteDamage*2/10,{cause: "override",damagingEntity: player})
                          }
                          else if(arthropodLevel>0 && isFamily('arthropod', entities[i]))
                          {
                            entities[i].entity.applyDamage(arthropodDamage*8/10,{cause: "entityAttack",damagingEntity: player})
                            entities[i].entity.applyDamage(arthropodDamage*2/10,{cause: "override",damagingEntity: player})
                          }
                          else 
                          {
                            entities[i].entity.applyDamage(damage*8/10,{cause: "entityAttack",damagingEntity: player})
                            entities[i].entity.applyDamage(damage*2/10,{cause: "override",damagingEntity: player})
                          }
                        }
                        else
                        {
                          if(smiteLevel>0 && isFamily('undead', entities[i]))
                              entities[i].entity.applyDamage(smiteDamage,{cause: "entityAttack",damagingEntity: player})
                          else if(arthropodLevel>0 && isFamily('arthropod', entities[i]))
                              entities[i].entity.applyDamage(arthropodDamage,{cause: "entityAttack",damagingEntity: player})
                          else 
                              entities[i].entity.applyDamage(damage,{cause: "entityAttack",damagingEntity: player})
                        }
                        entities[i].entity.clearVelocity()
                        var knockbackValue = getKnockbackValue(itemUsed)
                        entities[i].entity.applyKnockback(player.getViewDirection().x, player.getViewDirection().z, Math.sqrt(player.getViewDirection().x ** 2 + player.getViewDirection().z ** 2)*knockbackValue-(knockbackValue*0.8*getScore(player,'Hit_cooldown'))/40, 0.5-(0.5*0.8*getScore(player,'Hit_cooldown'))/40)
                        entities[i].entity.setOnFire(fireAspectLevel*4)
                        hitEntities.push(entities[i].entity)
                        a+=1
                    }
                      
                    
                      
                  }
                  Damage(player,itemUsed)
                  world.getDimension(player.dimension.id).playSound('vr.stutterturn', player.location);
          }
          //cooldown
          const offHand = player.getComponent('equippable').getEquipment('Offhand');
          if(offHand?.type.id == 'minecraft:shield' && player.hasTag('spear_shield'))
            player.runCommand(`scoreboard players set @s Hit_cooldown 10`)
          else
            player.runCommand(`scoreboard players set @s Hit_cooldown 20`)
      }
      else if(itemUsed?.getTags()?.includes('minecraft:is_sword'))
      {
        player.runCommand(`scoreboard players set @s Hit_cooldown 20`)
      }
      
      
  }
}