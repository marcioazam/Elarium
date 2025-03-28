import {
    world,
    system,
    EntityDamageCause
  } from "@minecraft/server";

  import { SafeHandler } from "../Elarium/System/Core/Handler.js";

  import {
    ActionFormData
  } from "@minecraft/server-ui";

import { connectedGlassComp } from '../connectedGlassComp.js'

  
world.beforeEvents.worldInitialize.subscribe(async (initEvent) => {

 
  initEvent.itemComponentRegistry.registerCustomComponent(
    "dungeons:common_powershaker",
    {
      onUse(e) {
        const player = e.source;
        const item = e.itemStack;
        player.dimension.spawnParticle("dungeons:party_flair", player.location);
        player.dimension.playSound("random.fuse", player.location, {
          volume: 0.7,
          pitch: 2.5,
        });
        let timeLeft = world.scoreboard.getObjective("powershaker_t");
        let usesLeft = world.scoreboard.getObjective("powershaker_u");

        if (timeLeft.getScore(player) > 0) {
          player.runCommandAsync("function artifact/powershaker_fail");
          return;
        }
        usesLeft.setScore(player, 5);
        timeLeft.setScore(player, 200);
      },
    }
  ),
  initEvent.blockComponentRegistry.registerCustomComponent('dungeons:precise_rotation', {
    beforeOnPlayerPlace(e) {
      const player = e.player;
      const y = player.getRotation().y;
      let rot = y + 360 * (y != Math.abs(y));
      rot = Math.round(rot / 22.5)
      rot = rot != 16 ? rot : 0
      e.permutationToPlace = e.permutationToPlace.withState('dungeons:rotation', rot);
    }
  }),
  initEvent.blockComponentRegistry.registerCustomComponent('dungeons:redstone_core', {
    onPlace(e) {
      const block = e.block;
      if(block.above().type.id === block.type.id || block.below().type.id === block.type.id) {
        block.dimension.runCommand(`setblock ${block.x} ${block.y} ${block.z} air destroy`)
        return;
      }

      const core = e.dimension.spawnEntity('dungeons:redstone_core', block.bottomCenter());
    },
    onPlayerDestroy(e) {
      const block = e.block.center();
      e.dimension.runCommandAsync(`particle dungeons:tuff ${block.x} ${block.y} ${block.z}`)
    },
    onPlayerInteract(e) {
      const block = e.block;
      const player = e.player;
      const entities = e.dimension.getEntitiesAtBlockLocation(block.location);
      for (const entity of entities) {
        if (entity.typeId === 'dungeons:redstone_core' && entity.hasTag('core:ready')) {
          entity.triggerEvent('dungeons:activate_core');
          system.runTimeout(() => {
            const nearbyMobs = block.dimension.getEntities({
              location: block.center(),
              maxDistance: 5,
              excludeFamilies: ['ignore']
            });
            for (const mob of nearbyMobs) {
              if(mob.isValid()) {
                const xDif = mob.location.x - block.center().x;
                const zDif = mob.location.z - block.center().z;
                mob.applyKnockback(xDif, zDif, 1.2, 0.6);
                mob.applyDamage(30, {
                  cause: EntityDamageCause.entityExplosion,
                  damagingEntity: player
                });
              }
            }
          }, 60) // waits 3 seconds for charge to finish
          return;
        }
        return;
      }
    },
    onTick(e) {
      const block = e.block;
      if (!block.isValid) return;
      const playerNear = e.dimension.getPlayers({
        location: block.center(),
        maxDistance: 16
      });
      if(!playerNear) return;
      const entities = e.dimension.getEntities({
        location: block.center(),
        maxDistance: 0.5
      });
      if(!entities || entities.length == 1 ) return;
      console.warn('respawning core entity')
      const core = e.dimension.spawnEntity('dungeons:redstone_core', block.bottomCenter());
      for (const entity of entities) {
        if (entity !== core && entity.typeId === 'dungeons:redstone_core') entity.remove();
      }
    }
  }),
  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:use_artefact', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;

      switch (item.typeId) {


        case 'dungeons:blast_fungus':
          player.runCommandAsync('function artifact/blast_fungus')
          break;
        case 'dungeons:rare_blast_fungus':
          player.runCommandAsync('function artifact/blast_fungus')
          break;
        case 'dungeons:corrupted_seeds':
          player.runCommandAsync('function artifact/corrupted_seeds')
          break;
        case 'dungeons:rare_corrupted_seeds':
          player.runCommandAsync('function artifact/corrupted_seeds')
          break;
        case 'dungeons:death_cap_mushroom':
          player.runCommandAsync('function artifact/death_cap_weak')
          break;
        case 'dungeons:rare_death_cap_mushroom':
          player.runCommandAsync('function artifact/death_cap_strong')
          break;
        case 'dungeons:gong_of_weakening':
          player.runCommandAsync('function artifact/gong_common')
          break;
        case 'dungeons:rare_gong_of_weakening':
          player.runCommandAsync('function artifact/gong_rare')
          break;
        case 'dungeons:harvester':
          player.runCommandAsync('function artifact/harvester')
          break;
        case 'dungeons:rare_harvester':
          player.runCommandAsync('function artifact/harvester_rare')
          break;
        case 'dungeons:satchel_of_elements':
          player.runCommandAsync('function artifact/satchel_elements')
          break;
        case 'dungeons:rare_satchel_of_elements':
          player.runCommandAsync('function artifact/satchel_elements')
          break;
        case 'dungeons:shadow_shifter':
          player.runCommandAsync('function artifact/shadow_shifter_common')
          break;
        case 'dungeons:rare_shadow_shifter':
          player.runCommandAsync('function artifact/shadow_shifter_rare')
          break;
        case 'dungeons:shock_powder':
          player.runCommandAsync('function artifact/shock_powder')
          break;
        case 'dungeons:rare_shock_powder':
          player.runCommandAsync('function artifact/shock_powder_rare')
          break;
        case 'dungeons:soul_healer':
          player.runCommandAsync('function artifact/soul_healer_common')
          break;
        case 'dungeons:rare_soul_healer':
          player.runCommandAsync('function artifact/soul_healer_rare')
          break;
        case 'dungeons:totem_of_regeneration':
          player.runCommandAsync('function artifact/totem_of_regen')
          break;
        case 'dungeons:rare_totem_of_regeneration':
          player.runCommandAsync('function artifact/totem_of_regen')
          break;
        case 'dungeons:totem_of_shielding':
          player.runCommandAsync('function artifact/totem_of_shield')
          break;
        case 'dungeons:rare_totem_of_shielding':
          player.runCommandAsync('function artifact/totem_of_shield')
          break;
        case 'dungeons:wind_horn':
          player.runCommandAsync('function artifact/wind_horn_common')
          break;
        case 'dungeons:rare_wind_horn':
          player.runCommandAsync('function artifact/wind_horn_rare')
          break;

        case 'dungeons:enchanted_grass':
          player.runCommandAsync('function artifact/enchanted_grass')
          const sheep = player.dimension.spawnEntity('dungeons:enchanted_sheep', player.location);

          let sheepTameable = sheep.getComponent('minecraft:tameable')
          sheepTameable.tame(player);

          break;
        case 'dungeons:rare_enchanted_grass':
          player.runCommandAsync('function artifact/enchanted_grass')
          const raresheep = player.dimension.spawnEntity('dungeons:enchanted_sheep', player.location);

          let rareSheepTameable = raresheep.getComponent('minecraft:tameable')
          rareSheepTameable.tame(player);

          break;
        case 'dungeons:vexing_chant':
          player.runCommandAsync('function artifact/vexing_chant')
          const vex0 = player.dimension.spawnEntity('dungeons:guardian_vex', player.location);
          const vex1 = player.dimension.spawnEntity('dungeons:guardian_vex', player.location);
          const vex2 = player.dimension.spawnEntity('dungeons:guardian_vex', player.location);

          let vexTameable0 = vex0.getComponent('minecraft:tameable')
          vexTameable0.tame(player);
          let vexTameable1 = vex1.getComponent('minecraft:tameable')
          vexTameable1.tame(player);
          let vexTameable2 = vex2.getComponent('minecraft:tameable')
          vexTameable2.tame(player);

          break;
        case 'dungeons:rare_vexing_chant':
          player.runCommandAsync('function artifact/vexing_chant')

          const rareVex0 = player.dimension.spawnEntity('dungeons:guardian_vex', player.location);
          const rareVex1 = player.dimension.spawnEntity('dungeons:guardian_vex', player.location);
          const rareVex2 = player.dimension.spawnEntity('dungeons:guardian_vex', player.location);

          let rareVexTameable0 = rareVex0.getComponent('minecraft:tameable')
          rareVexTameable0.tame(player);
          let rareVexTameable1 = rareVex1.getComponent('minecraft:tameable')
          rareVexTameable1.tame(player);
          let rareVexTameable2 = rareVex2.getComponent('minecraft:tameable')
          rareVexTameable2.tame(player);
          break;

        case 'dungeons:ice_wand':
          player.runCommandAsync('function artifact/ice_wand')

          const iceChunkRayCast = player.getBlockFromViewDirection({
            maxDistance: 24,
            includePassableBlocks: false,
            includeLiquidBlocks: true
          });
          if (!iceChunkRayCast) {
            player.runCommandAsync('summon dungeons:ice_chunk_player ^^^24')
            break;
          }
          player.dimension.spawnEntity('dungeons:ice_chunk_player', iceChunkRayCast.block.location);
          break;

        case 'dungeons:rare_ice_wand':
          player.runCommandAsync('function artifact/ice_wand')

          const rareIceChunkRayCast = player.getBlockFromViewDirection({
            maxDistance: 24,
            includePassableBlocks: false,
            includeLiquidBlocks: true
          });
          if (!rareIceChunkRayCast) {
            player.runCommandAsync('summon dungeons:ice_chunk_player ^^^24')
            break;
          }
          player.dimension.spawnEntity('dungeons:ice_chunk_player', rareIceChunkRayCast.block.location);
          break;

        case 'dungeons:lightning_rod':
          let soulGauge = world.scoreboard.getObjective('soulGauge').getScore(player)

          if(soulGauge < 8) {
            player.runCommandAsync('function artifact/lightning_rod_fail')
            break;
          } else {
            player.runCommandAsync('function artifact/lightning_rod_vfx')
          }

            const entities = player.dimension.getEntities({
              location: player.location,
              maxDistance: 16,
              closest: 1,
              minDistance: 2,
              excludeFamilies: ['ignore']
            });
          

          if (!entities) break;

          for (const entity of entities) {
        if (!entity.matches({
            families: ['monster']
          }) && !entity.matches({
            families: ['player']
          })) return;


            const loc = entity.location;
            entity.dimension.spawnParticle('dungeons:lightning_rod_circle', loc);
entity.dimension.playSound('weapon.enchant.thundering', loc, {volume: 0.25});
            system.runTimeout(() => {
entity.dimension.playSound('weapon.enchant.thundering', loc, {volume: 0.5});
            },10)
            system.runTimeout(() => {
entity.dimension.playSound('weapon.enchant.thundering', loc, {volume: 1.0, pitch:1.2});
              
entity.dimension.spawnEntity('minecraft:lightning_bolt', {x:loc.x, y:loc.y+1.33, z:loc.z});

              const damageRange = entity.dimension.getEntities({
                location: loc,
                maxDistance: 2.333,
                excludeFamilies: ['ignore']
              });

              for (const target of damageRange) {
                const damage = 21 - (Math.abs(target.location.x - loc.x) + Math.abs(target.location.y - loc.y) + Math.abs(target.location.z - loc.z));

                target.applyDamage(damage, {
                  cause: EntityDamageCause.lightning,
                  damagingEntity: player
                });

              }
            }, 20);
          }
          break;
        case 'dungeons:rare_lightning_rod':
          let soulGauge2 = world.scoreboard.getObjective('soulGauge').getScore(player)

          if(soulGauge2 < 8) {
            player.runCommandAsync('function artifact/lightning_rod_fail')
            break;
          } else {
            player.runCommandAsync('function artifact/lightning_rod_vfx')
          }

          const rare_entities = player.dimension.getEntities({
              location: player.location,
              maxDistance: 18,
              closest: 1,
              minDistance: 2,
              excludeFamilies: ['ignore']
          });

          if (!rare_entities) break;

          for (const entity of rare_entities) {
        if (!entity.matches({
            families: ['monster']
          }) && !entity.matches({
            families: ['player']
          })) return;

            const loc = entity.location;
            entity.dimension.spawnParticle('dungeons:lightning_rod_circle_large', loc);
entity.dimension.playSound('weapon.enchant.thundering', loc, {volume: 0.25});
            system.runTimeout(() => {
entity.dimension.playSound('weapon.enchant.thundering', loc, {volume: 0.5});
            },8)
            system.runTimeout(() => {
entity.dimension.playSound('weapon.enchant.thundering', loc, {volume: 1.0, pitch:1.2});
              
entity.dimension.spawnEntity('minecraft:lightning_bolt', {x:loc.x, y:loc.y+1.33, z:loc.z});

              const damageRange = entity.dimension.getEntities({
                location: loc,
                maxDistance: 2.6,
                excludeFamilies: ['ignore']
              });

              for (const target of damageRange) {
                const damage = 24 - (Math.abs(target.location.x - loc.x) + Math.abs(target.location.y - loc.y) + Math.abs(target.location.z - loc.z));

                target.applyDamage(damage, {
                  cause: EntityDamageCause.lightning,
                  damagingEntity: player
                });

              }
            }, 16);
          }
          break;

        default:
          return;
      }
    }
  }),
  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:book_of_heroes', {
    onUse(e) {
      const player = e.source;
      player.playSound('item.book.page_turn');
      let CATEGORIES = new ActionFormData();
      CATEGORIES.title("The Book of Heroes");
      CATEGORIES.body("This book will reveal all you need to know about the weapons, artefacts and armour of Alylica's Dungeons");
      CATEGORIES.button("Melee Weapons", "textures/ui/form/weapon");
      CATEGORIES.button("Ranged Weapons", "textures/ui/form/bow");
      CATEGORIES.button("Armour", "textures/ui/form/armour");
      CATEGORIES.button("Artefacts", "textures/ui/form/artefact");
      CATEGORIES.show(player).then(r => {
        player.playSound('item.book.page_turn');
        if (r.canceled) return;
        switch (r.selection) {
          case 0:
            let MELEE = new ActionFormData();
            MELEE.title("Melee Weapons");
            MELEE.body("No hero is fit to fight without their trusty weapon by their side.");
            if (player.hasTag('dungeons:collected_longsword')) {
              MELEE.button("Longswords", "textures/items/weapon/sword")
            } else {
              MELEE.button("Longswords", "textures/ui/form/locked_weapon")
            }
            if (player.hasTag('dungeons:collected_katana')) {
              MELEE.button("Katanas", "textures/items/weapon/katana")
            } else {
              MELEE.button("Katanas", "textures/ui/form/locked_weapon")
            }
            if (player.hasTag('dungeons:collected_claymore')) {
              MELEE.button("Claymores", "textures/items/weapon/claymore")
            } else {
              MELEE.button("Claymores", "textures/ui/form/locked_weapon")
            }
            if (player.hasTag('dungeons:collected_cutlass')) {
              MELEE.button("Cutlasses", "textures/items/weapon/cutlass")
            } else {
              MELEE.button("Cutlasses", "textures/ui/form/locked_weapon")
            }
            if (player.hasTag('dungeons:collected_daggers')) {
              MELEE.button("Daggers", "textures/items/weapon/daggers")
            } else {
              MELEE.button("Daggers", "textures/ui/form/locked_weapon")
            }
            if (player.hasTag('dungeons:collected_rapier')) {
              MELEE.button("Rapiers", "textures/items/weapon/rapier")
            } else {
              MELEE.button("Rapiers", "textures/ui/form/locked_weapon")
            }
            if (player.hasTag('dungeons:collected_battlestaff')) {
              MELEE.button("Battlestaves", "textures/items/weapon/battlestaff")
            } else {
              MELEE.button("Battlestaves", "textures/ui/form/locked_weapon")
            }
            if (player.hasTag('dungeons:collected_cleaving_axe')) {
              MELEE.button("Cleaving Axes", "textures/items/weapon/axe")
            } else {
              MELEE.button("Cleaving Axes", "textures/ui/form/locked_weapon")
            }
            if (player.hasTag('dungeons:collected_double_axe')) {
              MELEE.button("Double Axes", "textures/items/weapon/double_axe")
            } else {
              MELEE.button("Double Axes", "textures/ui/form/locked_weapon")
            }
            if (player.hasTag('dungeons:collected_coral_blade')) {
              MELEE.button("Coral Blades", "textures/items/weapon/coral_blade")
            } else {
              MELEE.button("Coral Blades", "textures/ui/form/locked_weapon")
            }
            if (player.hasTag('dungeons:collected_tempest_knife')) {
              MELEE.button("Tempest Knives", "textures/items/weapon/tempest_knife")
            } else {
              MELEE.button("Tempest Knives", "textures/ui/form/locked_weapon")
            }
            if (player.hasTag('dungeons:collected_soul_knife')) {
              MELEE.button("Soul Knives", "textures/items/weapon/soul_knife")
            } else {
              MELEE.button("Soul Knives", "textures/ui/form/locked_weapon")
            }
            if (player.hasTag('dungeons:collected_soul_scythe')) {
              MELEE.button("Soul Scythes", "textures/items/weapon/soul_scythe")
            } else {
              MELEE.button("Soul Scythes", "textures/ui/form/locked_weapon")
            }
            if (player.hasTag('dungeons:collected_whip')) {
              MELEE.button("Whips", "textures/items/weapon/whip")
            } else {
              MELEE.button("Whips", "textures/ui/form/locked_weapon")
            }
            if (player.hasTag('dungeons:collected_broken_sawblade')) {
              MELEE.button("Sawblades", "textures/items/weapon/broken_sawblade")
            } else {
              MELEE.button("Sawblades", "textures/ui/form/locked_weapon")
            }
            if (player.hasTag('dungeons:collected_hammer')) {
              MELEE.button("Hammers", "textures/items/weapon/great_hammer")
            } else {
              MELEE.button("Hammers", "textures/ui/form/locked_weapon")
            }
            if (player.hasTag('dungeons:collected_anchor')) {
              MELEE.button("Anchors", "textures/items/weapon/anchor")
            } else {
              MELEE.button("Anchors", "textures/ui/form/locked_weapon")
            }
            if (player.hasTag('dungeons:collected_bone_club')) {
              MELEE.button("Bone Clubs", "textures/items/weapon/bone_club")
            } else {
              MELEE.button("Bone Clubs", "textures/ui/form/locked_weapon")
            }
            if (player.hasTag('dungeons:collected_obsidian_claymore')) {
              MELEE.button("Obsidian Claymores", "textures/items/weapon/obsidian_claymore")
            } else {
              MELEE.button("Obsidian Claymores", "textures/ui/form/locked_weapon")
            }
            MELEE.show(player).then(r => {
              player.playSound('item.book.page_turn');
              if (r.canceled) return;
              switch (r.selection) {
                case 0:
                  if (!player.hasTag('dungeons:collected_longsword')) break;
                  let LONGSWORDS = new ActionFormData();
                  LONGSWORDS.title("Longswords");
                  LONGSWORDS.body("Well rounded weapons suitable for any foe.\n\n Able to reduce incoming damage with interact key");
                  if (player.hasTag('dungeons:collected_longsword')) {
                    LONGSWORDS.button("Longsword", "textures/items/weapon/sword")
                  } else {
                    LONGSWORDS.button("Longsword", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_diamond_longsword')) {
                    LONGSWORDS.button("Diamond Longsword", "textures/items/weapon/diamond_sword")
                  } else {
                    LONGSWORDS.button("Diamond Longsword", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_hawkbrand')) {
                    LONGSWORDS.button("Hawkbrand", "textures/items/weapon/hawkbrand")
                  } else {
                    LONGSWORDS.button("Hawkbrand", "textures/ui/form/locked_weapon")
                  }

                  if (player.hasTag('dungeons:collected_sinister_sword')) {
                    LONGSWORDS.button("Sinister Sword ", "textures/items/weapon/sinister_sword")
                  }


                  LONGSWORDS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_longsword')) break;
                        let LONGSWORDS1 = new ActionFormData();
                        LONGSWORDS1.title("Longsword");
                        LONGSWORDS1.body("A sturdy and reliable blade.\n\n Can Block attacks\n\n Damage : \n Durability : 303");
                        LONGSWORDS1.button("Close")
                        LONGSWORDS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_diamond_longsword')) break;
                        let LONGSWORDS2 = new ActionFormData();
                        LONGSWORDS2.title("Diamond Longsword");
                        LONGSWORDS2.body("The Diamond Longsword is the true mark of a hero and an accomplished adventurer.\n\n Can Block attacks\n Boosted Damage\n\n Damage : \n Durability : 1561");
                        LONGSWORDS2.button("Close")
                        LONGSWORDS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_hawkbrand')) break;
                        let LONGSWORDS3 = new ActionFormData();
                        LONGSWORDS3.title("Hawkbrand");
                        LONGSWORDS3.body("The Hawkbrand is the legendary sword of proven warriors.\n\n Can Block attacks\n 10%% Critical Hit Chance\n\n Damage : \n Durability : 1561");
                        LONGSWORDS3.button("Close")
                        LONGSWORDS3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 3:
                        if (!player.hasTag('dungeons:collected_sinister_sword')) break;
                        let LONGSWORDS4 = new ActionFormData();
                        LONGSWORDS4.title("Sinister Sword");
                        LONGSWORDS4.body("The Sinister Sword, drawn to those who face the spookiest of nights, cuts through the night with a howl.\n\n Special event item\n\n Can Block attacks\n 10%% Critical Hit Chance\n\n Damage : \n Durability : 1561");
                        LONGSWORDS4.button("Close")
                        LONGSWORDS4.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 1:
                  if (!player.hasTag('dungeons:collected_katana')) break;
                  let KATANAS = new ActionFormData();
                  KATANAS.title("Katanas");
                  KATANAS.body("Powerful blades with a lower durability, A risky weapon for the most precise wielder.\n\n");
                  if (player.hasTag('dungeons:collected_katana')) {
                    KATANAS.button("Katana", "textures/items/weapon/katana")
                  } else {
                    KATANAS.button("Katana", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_dark_katana')) {
                    KATANAS.button("Dark Katana", "textures/items/weapon/dark_katana")
                  } else {
                    KATANAS.button("Dark Katana", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_masters_katana')) {
                    KATANAS.button("Masters Katana", "textures/items/weapon/master_katana")
                  } else {
                    KATANAS.button("Masters Katana", "textures/ui/form/locked_weapon")
                  }
                  KATANAS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_katana')) break;
                        let KATANAS1 = new ActionFormData();
                        KATANAS1.title("Katana");
                        KATANAS1.body("A blade fit for expert warriors and fighters, its blade is crafted to inflict precision damage.\n\n Damage : \n Durability : 199");
                        KATANAS1.button("Close")
                        KATANAS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_dark_katana')) break;
                        let KATANAS2 = new ActionFormData();
                        KATANAS2.title("Dark Katana");
                        KATANAS2.body("A blade that will not rest until the battle has been won.\n\n Boosted Damage to undead\n\n Damage : \n Durability : 1199");
                        KATANAS2.button("Close")
                        KATANAS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_masters_katana')) break;
                        let KATANAS3 = new ActionFormData();
                        KATANAS3.title("Masters Katana");
                        KATANAS3.body("The Master's Katana has existed throughout the ages, appearing to heroes at the right moment.\n\n 10%% Critical Hit Chance\n\n Damage : \n Durability : 1199");
                        KATANAS3.button("Close")
                        KATANAS3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 2:
                  if (!player.hasTag('dungeons:collected_claymore')) break;
                  let CLAYMORES = new ActionFormData();
                  CLAYMORES.title("Claymores");
                  CLAYMORES.body("Great in size and in strength, the claymore is known to pack a punch.\n\n Enhanced Knockback");
                  if (player.hasTag('dungeons:collected_claymore')) {
                    CLAYMORES.button("Claymore", "textures/items/weapon/claymore")
                  } else {
                    CLAYMORES.button("Claymore", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_heartstealer')) {
                    CLAYMORES.button("Heartstealer", "textures/items/weapon/heartstealer")
                  } else {
                    CLAYMORES.button("Heartstealer", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_broadsword')) {
                    CLAYMORES.button("Broadsword", "textures/items/weapon/broadsword")
                  } else {
                    CLAYMORES.button("Broadsword", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_great_axeblade')) {
                    CLAYMORES.button("Great Axeblade", "textures/items/weapon/great_axeblade")
                  } else {
                    CLAYMORES.button("Great Axeblade", "textures/ui/form/locked_weapon")
                  }
                  CLAYMORES.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_claymore')) break;
                        let CLAYMORES1 = new ActionFormData();
                        CLAYMORES1.title("Claymore");
                        CLAYMORES1.body("A massive sword that seems impossibly heavy yet rests easily in a just warrior's hands.\n\n Enhanced Knockback\n\n Damage : \n Durability : 555");
                        CLAYMORES1.button("Close")
                        CLAYMORES1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_heartstealer')) break;
                        let CLAYMORES2 = new ActionFormData();
                        CLAYMORES2.title("Heartstealer");
                        CLAYMORES2.body("Gifted to one of the illager's most distinguished generals upon their conquest of the Squid Coast - this runeblade is infused with dark witchcraft.\n\n Enhanced Knockback\n Defeated monsters grant healing\n\n Damage : \n Durability : 1861");
                        CLAYMORES2.button("Close")
                        CLAYMORES2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_broadsword')) break;
                        let CLAYMORES3 = new ActionFormData();
                        CLAYMORES3.title("Broadsword");
                        CLAYMORES3.body("Only those with the strength of a champion and the heart of a hero can carry this massive blade.\n\n Enhanced Knockback\n Boosted Damage\n\n Damage : \n Durability : 1861");
                        CLAYMORES3.button("Close")
                        CLAYMORES3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 3:
                        if (!player.hasTag('dungeons:collected_great_axeblade')) break;
                        let CLAYMORES4 = new ActionFormData();
                        CLAYMORES4.title("Great Axeblade");
                        CLAYMORES4.body("A lucky blacksmith turned a workshop blunder into a battlefield wonder, fusing two weapons into something new.\n\n Enhanced Knockback\n Spinning area damage\n\n Damage : \n Durability : 1861");
                        CLAYMORES4.button("Close")
                        CLAYMORES4.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 3:
                  if (!player.hasTag('dungeons:collected_cutlass')) break;
                  let CUTLASSES = new ActionFormData();
                  CUTLASSES.title("Cutlasses");
                  CUTLASSES.body("All-rounder weapons that excel in any swift fighter's hands.\n\n");
                  if (player.hasTag('dungeons:collected_cutlass')) {
                    CUTLASSES.button("Cutlass", "textures/items/weapon/cutlass")
                  } else {
                    CUTLASSES.button("Cutlass", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_dancers_sword')) {
                    CUTLASSES.button("Dancers Sword", "textures/items/weapon/dancers_sword")
                  } else {
                    CUTLASSES.button("Dancers Sword", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_nameless_blade')) {
                    CUTLASSES.button("Nameless Blade", "textures/items/weapon/nameless_blade")
                  } else {
                    CUTLASSES.button("Nameless Blade", "textures/ui/form/locked_weapon")
                  }
                  CUTLASSES.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_cutlass')) break;
                        let CUTLASSES1 = new ActionFormData();
                        CUTLASSES1.title("Cutlass");
                        CUTLASSES1.body("This curved blade, wielded by the warriors of the Squid Coast, requires a steady hand in battle.\n\n Damage : \n Durability : 210");
                        CUTLASSES1.button("Close")
                        CUTLASSES1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_dancers_sword')) break;
                        let CUTLASSES2 = new ActionFormData();
                        CUTLASSES2.title("Dancers Sword");
                        CUTLASSES2.body("Warriors who view battle as a dance with death prefer double-bladed swords.\n\n Boosts power after defeating foe\n\n Damage : \n Durability : 1320");
                        CUTLASSES2.button("Close")
                        CUTLASSES2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_nameless_blade')) break;
                        let CUTLASSES3 = new ActionFormData();
                        CUTLASSES3.title("Nameless Blade");
                        CUTLASSES3.body("This deadly blade's story was lost to the endless sands of time.\n\n Attacks weaken nearby foes\n\n Damage : \n Durability : 1320");
                        CUTLASSES3.button("Close")
                        CUTLASSES3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 4:
                  if (!player.hasTag('dungeons:collected_daggers')) break;
                  let DAGGERS = new ActionFormData();
                  DAGGERS.title("Daggers");
                  DAGGERS.body("Weak on their own, Daggers can devastate enemies when paired together.\n\n Twin Attacks");
                  if (player.hasTag('dungeons:collected_daggers')) {
                    DAGGERS.button("Daggers", "textures/items/weapon/daggers")
                  } else {
                    DAGGERS.button("Daggers", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_sheer_daggers')) {
                    DAGGERS.button("Sheer Daggers", "textures/items/weapon/sheer_daggers")
                  } else {
                    DAGGERS.button("Sheer Daggers", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_moon_daggers')) {
                    DAGGERS.button("Moon Daggers", "textures/items/weapon/moon_daggers")
                  } else {
                    DAGGERS.button("Moon Daggers", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_frost_knives')) {
                    DAGGERS.button("Fangs of Frost", "textures/items/weapon/frost_knives")
                  } else {
                    DAGGERS.button("Fangs of Frost", "textures/ui/form/locked_weapon")
                  }
                  DAGGERS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_daggers')) break;
                        let DAGGERS1 = new ActionFormData();
                        DAGGERS1.title("Daggers");
                        DAGGERS1.body("Daggers are the weapon of cravens - or so folk say.\n\n Twin Attacks\n\n Damage : \n Durability : 180");
                        DAGGERS1.button("Close")
                        DAGGERS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_sheer_daggers')) break;
                        let DAGGERS2 = new ActionFormData();
                        DAGGERS2.title("Sheer Daggers");
                        DAGGERS2.body("Even the simplest of farmers can wield these Sheer Daggers with savage results.\n\n Twin Attacks\n Spinning area damage\n\n Damage : \n Durability : 1861");
                        DAGGERS2.button("Close")
                        DAGGERS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_moon_daggers')) break;
                        let DAGGERS3 = new ActionFormData();
                        DAGGERS3.title("Moon Daggers");
                        DAGGERS3.body("These curved blades shine like the crescent moon on a dark night.\n\n Twin Attacks\n Boosted  Collection\n Critical hit rate rises with Souls\n\n Damage : \n Durability : 1861");
                        DAGGERS3.button("Close")
                        DAGGERS3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 3:
                        if (!player.hasTag('dungeons:collected_frost_knives')) break;
                        let DAGGERS4 = new ActionFormData();
                        DAGGERS4.title("Fangs of Frost");
                        DAGGERS4.body("These lauded twin daggers of the northern mountains are known to freeze their foes to solid ice.\n\n Twin Attacks\n Attacks slow mobs\n\n Damage : \n Durability : 1861");
                        DAGGERS4.button("Close")
                        DAGGERS4.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 5:
                  if (!player.hasTag('dungeons:collected_rapier')) break;
                  let RAPIERS = new ActionFormData();
                  RAPIERS.title("Rapiers");
                  RAPIERS.body("Small but Swift, Rapiers are most efficient dealing with large crowds.\n\n Sweeping attacks");
                  if (player.hasTag('dungeons:collected_rapier')) {
                    RAPIERS.button("Rapier", "textures/items/weapon/rapier")
                  } else {
                    RAPIERS.button("Rapier", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_freezing_foil')) {
                    RAPIERS.button("Freezing Foil", "textures/items/weapon/freezing_foil")
                  } else {
                    RAPIERS.button("Freezing Foil", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_bee_stinger')) {
                    RAPIERS.button("Bee Stinger", "textures/items/weapon/bee_stinger")
                  } else {
                    RAPIERS.button("Bee Stinger", "textures/ui/form/locked_weapon")
                  }
                  RAPIERS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_rapier')) break;
                        let RAPIERS1 = new ActionFormData();
                        RAPIERS1.title("Rapier");
                        RAPIERS1.body("The rapier, a nimble and narrow blade, strikes with quick ferocity.\n\n Sweeping attacks\n\n Damage : \n Durability : 133");
                        RAPIERS1.button("Close")
                        RAPIERS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_freezing_foil')) break;
                        let RAPIERS2 = new ActionFormData();
                        RAPIERS2.title("Freezing Foil");
                        RAPIERS2.body("This needle-like blade is cold to the touch and makes quick work of any cut.\n\n Sweeping attacks\n Attacks slow mobs\n\n Damage : \n Durability : 1011");
                        RAPIERS2.button("Close")
                        RAPIERS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_bee_stinger')) break;
                        let RAPIERS3 = new ActionFormData();
                        RAPIERS3.title("Bee Stinger");
                        RAPIERS3.body("The Bee Stinger, a swift blade inspired by a bee's barb, can draw friendly bees into the fray to fight alongside you.\n\n Sweeping attacks\n Attacks may summon bees\n\n Damage : \n Durability : 1011");
                        RAPIERS3.button("Close")
                        RAPIERS3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 6:
                  if (!player.hasTag('dungeons:collected_battlestaff')) break;
                  let BATTLESTAVES = new ActionFormData();
                  BATTLESTAVES.title("Battlestaves");
                  BATTLESTAVES.body("Large weapons, battlestaves require great skill to master their sweeping attacks.\n\n Large Sweeping attacks");
                  if (player.hasTag('dungeons:collected_battlestaff')) {
                    BATTLESTAVES.button("Battlestaff", "textures/items/weapon/battlestaff")
                  } else {
                    BATTLESTAVES.button("Battlestaff", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_growing_staff')) {
                    BATTLESTAVES.button("Growing Staff", "textures/items/weapon/growing_staff")
                  } else {
                    BATTLESTAVES.button("Growing Staff", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_battlestaff_of_terror')) {
                    BATTLESTAVES.button("Battlestaff of Terror", "textures/items/weapon/battlestaff_of_terror")
                  } else {
                    BATTLESTAVES.button("Battlestaff of Terror", "textures/ui/form/locked_weapon")
                  }
                  BATTLESTAVES.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_battlestaff')) break;
                        let BATTLESTAVES1 = new ActionFormData();
                        BATTLESTAVES1.title("Battlestaff");
                        BATTLESTAVES1.body("The battlestaff is a perfectly balanced staff that is ready for any battle.\n\n Large Sweeping attacks\n\n Damage : \n Durability : 100");
                        BATTLESTAVES1.button("Close")
                        BATTLESTAVES1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_growing_staff')) break;
                        let BATTLESTAVES2 = new ActionFormData();
                        BATTLESTAVES2.title("Freezing Foil");
                        BATTLESTAVES2.body("A staff that grows and shifts as it attacks, the Growing Staff is unpredictable and powerful.\n\n Large Sweeping attacks\n Increased damage to wounded mobs\n\n Damage : \n Durability : 800");
                        BATTLESTAVES2.button("Close")
                        BATTLESTAVES2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_battlestaff_of_terror')) break;
                        let BATTLESTAVES3 = new ActionFormData();
                        BATTLESTAVES3.title("Battlestaff of Terror");
                        BATTLESTAVES3.body("This staff overwhelms its target in battle to explosive effect.\n\n Large Sweeping attacks\n Defeated mobs explode\n\n Damage : \n Durability : 800");
                        BATTLESTAVES3.button("Close")
                        BATTLESTAVES3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 7:
                  if (!player.hasTag('dungeons:collected_cleaving_axe')) break;
                  let AXES = new ActionFormData();
                  AXES.title("Cleaving Axes");
                  AXES.body("The Cleaving Axe is typically suited better for fighting then wood-work.\n\n");
                  if (player.hasTag('dungeons:collected_cleaving_axe')) {
                    AXES.button("Cleaving Axe", "textures/items/weapon/axe")
                  } else {
                    AXES.button("Cleaving Axe", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_highlands_axe')) {
                    AXES.button("Highlands Axe", "textures/items/weapon/highlands_axe")
                  } else {
                    AXES.button("Highlands Axe", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_firebrand')) {
                    AXES.button("Firebrand", "textures/items/weapon/firebrand")
                  } else {
                    AXES.button("Firebrand", "textures/ui/form/locked_weapon")
                  }
                  AXES.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_cleaving_axe')) break;
                        let AXES1 = new ActionFormData();
                        AXES1.title("Cleaving Axe");
                        AXES1.body("The axe is an effective weapon, favored by the relentless Vindicators of the Illager's army.\n\n Damage : \n Durability : 289");
                        AXES1.button("Close")
                        AXES1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_highlands_axe')) break;
                        let AXES2 = new ActionFormData();
                        AXES2.title("Highland Axe");
                        AXES2.body("Expertly crafted and a polished weapon of war, the Highland Axe also makes a daring backscratcher.\n\n Chance to stun mobs\n\n Damage : \n Durability : 1622");
                        AXES2.button("Close")
                        AXES2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_firebrand')) break;
                        let AXES3 = new ActionFormData();
                        AXES3.title("Firebrand");
                        AXES3.body("Crafted in the blackest depths of the Fiery Forge and enchanted with fiery powers.\n\n Attacks burn mobs\n\n Damage : \n Durability : 1622");
                        AXES3.button("Close")
                        AXES3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 8:
                  if (!player.hasTag('dungeons:collected_double_axe')) break;
                  let DOUBLEAXES = new ActionFormData();
                  DOUBLEAXES.title("Double Axes");
                  DOUBLEAXES.body("Heavy weapons that deliver powerful swirling strikes.\n\n Spinning area damage");
                  if (player.hasTag('dungeons:collected_double_axe')) {
                    DOUBLEAXES.button("Double Axe", "textures/items/weapon/double_axe")
                  } else {
                    DOUBLEAXES.button("Double Axe", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_cursed_axe')) {
                    DOUBLEAXES.button("Cursed Axe", "textures/items/weapon/cursed_axe")
                  } else {
                    DOUBLEAXES.button("Cursed Axe", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_whirlwind')) {
                    DOUBLEAXES.button("Whirlwind", "textures/items/weapon/whirlwind")
                  } else {
                    DOUBLEAXES.button("Whirlwind", "textures/ui/form/locked_weapon")
                  }
                  DOUBLEAXES.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_double_axe')) break;
                        let DOUBLEAXES1 = new ActionFormData();
                        DOUBLEAXES1.title("Double Axe");
                        DOUBLEAXES1.body("A devastating weapon fit for barbaric fighters.\n\n Spinning area damage\n\n Damage : \n Durability : 400");
                        DOUBLEAXES1.button("Close")
                        DOUBLEAXES1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_cursed_axe')) break;
                        let DOUBLEAXES2 = new ActionFormData();
                        DOUBLEAXES2.title("Cursed Axe");
                        DOUBLEAXES2.body("This cursed, poisonous axe leaves their victims sick for years with just a single scratch.\n\n Spinning area damage\n Defeated mobs explode\n\n Damage : \n Durability : 1739");
                        DOUBLEAXES2.button("Close")
                        DOUBLEAXES2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_whirlwind')) break;
                        let DOUBLEAXES3 = new ActionFormData();
                        DOUBLEAXES3.title("Whirlwind");
                        DOUBLEAXES3.body("Whirlwind, forged during an epic windstorm, is a double-bladed axe that levitates slightly.\n\n Spinning area damage\n Attacks may deal bonus area damage\n\n Damage : \n Durability : 1739");
                        DOUBLEAXES3.button("Close")
                        DOUBLEAXES3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 9:
                  if (!player.hasTag('dungeons:collected_coral_blade')) break;
                  let CORALS = new ActionFormData();
                  CORALS.title("Coral Blades");
                  CORALS.body("Formed from sharpened coral, these blades are a necessity for diving below the waves.\n\n Stronger against foes in water");
                  if (player.hasTag('dungeons:collected_coral_blade')) {
                    CORALS.button("Coral Blade", "textures/items/weapon/coral_blade")
                  } else {
                    CORALS.button("Coral Blade", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_sponge_striker')) {
                    CORALS.button("Spong Striker", "textures/items/weapon/sponge_striker")
                  } else {
                    CORALS.button("Sponge Striker", "textures/ui/form/locked_weapon")
                  }
                  CORALS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_coral_blade')) break;
                        let CORALS1 = new ActionFormData();
                        CORALS1.title("Coral Blade");
                        CORALS1.body("The Coral Blade cuts through enemies with stinging accuracy..\n\n Stronger against foes in water\n\n Damage : \n Durability : 115");
                        CORALS1.button("Close")
                        CORALS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_sponge_striker')) break;
                        let CORALS2 = new ActionFormData();
                        CORALS2.title("Sponge Striker");
                        CORALS2.body("This blade may look colourless and dead, but it soaks up energy in combat and expels it in a powerful burst.\n\n Stronger against foes in water\n Adds damage you receive to next attack\n\n Damage : \n Durability : 915");
                        CORALS2.button("Close")
                        CORALS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 10:
                  if (!player.hasTag('dungeons:collected_tempest_knife')) break;
                  let TEMPESTKNIVES = new ActionFormData();
                  TEMPESTKNIVES.title("Tempest Knives");
                  TEMPESTKNIVES.body("While these knives may not be the greatest blades, they grant their wielder exceptional grace.\n\n Defeated mobs boost speed\n 0.5s Attack Speed");
                  if (player.hasTag('dungeons:collected_tempest_knife')) {
                    TEMPESTKNIVES.button("Tempest Knife", "textures/items/weapon/tempest_knife")
                  } else {
                    TEMPESTKNIVES.button("Tempest Knife", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_resolute_tempest_knife')) {
                    TEMPESTKNIVES.button("Resolute Tempest Knife", "textures/items/weapon/resolute_tempest_knife")
                  } else {
                    TEMPESTKNIVES.button("Resolute Tempest Knife", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_chill_gale_knife')) {
                    TEMPESTKNIVES.button("Chill Gale Knife", "textures/items/weapon/chill_gale_knife")
                  } else {
                    TEMPESTKNIVES.button("Chill Gale Knife", "textures/ui/form/locked_weapon")
                  }
                  TEMPESTKNIVES.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_tempest_knife')) break;
                        let TEMPESTKNIVES1 = new ActionFormData();
                        TEMPESTKNIVES1.title("Tempest Knife");
                        TEMPESTKNIVES1.body("This knife slices through enemies like the winds that cuts between the mountaintops.\n\n Defeated mobs boost speed\n 0.5s Attack Speed\n\n Damage : \n Durability : 206");
                        TEMPESTKNIVES1.button("Close")
                        TEMPESTKNIVES1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_resolute_tempest_knife')) break;
                        let TEMPESTKNIVES2 = new ActionFormData();
                        TEMPESTKNIVES2.title("Resolute Tempest Knife");
                        TEMPESTKNIVES2.body("Passed down by nomads who roam the mountain peaks, this knife has been used in countless battles.\n\n Defeated mobs boost speed\n 0.5s Attack Speed\n Increased damage to wounded mobs\n\n Damage : \n Durability : 1237");
                        TEMPESTKNIVES2.button("Close")
                        TEMPESTKNIVES2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_chill_gale_knife')) break;
                        let TEMPESTKNIVES3 = new ActionFormData();
                        TEMPESTKNIVES3.title("Chill Gale Knife");
                        TEMPESTKNIVES3.body("Created from the never-melting ice atop the mountain peaks, this knife is forever icy to the touch.\n\n Defeated mobs boost speed\n 0.5s Attack Speed\n Attacks slow mobs\n\n Damage : \n Durability : 1237");
                        TEMPESTKNIVES3.button("Close")
                        TEMPESTKNIVES3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;

                case 11:
                  if (!player.hasTag('dungeons:collected_soul_knife')) break;
                  let SOULKNIVES = new ActionFormData();
                  SOULKNIVES.title("Soul Knives");
                  SOULKNIVES.body("Slow to strike and fuelled by the power of souls, these weapons require a powerful will to master.\n\n Boosted  Collection\n 0.5s Attack Speed");
                  if (player.hasTag('dungeons:collected_soul_knife')) {
                    SOULKNIVES.button("Soul Knife", "textures/items/weapon/soul_knife")
                  } else {
                    SOULKNIVES.button("Soul Knife", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_eternal_knife')) {
                    SOULKNIVES.button("Eternal Knife", "textures/items/weapon/eternal_knife")
                  } else {
                    SOULKNIVES.button("Eternal Knife", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_truthseeker')) {
                    SOULKNIVES.button("Truthseeker", "textures/items/weapon/truthseeker")
                  } else {
                    SOULKNIVES.button("Truthseeker", "textures/ui/form/locked_weapon")
                  }
                  SOULKNIVES.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_soul_knife')) break;
                        let SOULKNIVES1 = new ActionFormData();
                        SOULKNIVES1.title("Soul Knife");
                        SOULKNIVES1.body("A ceremonial knife that uses magical energy to hold the wrath of souls inside its blade.\n\n Boosted  Collection\n 0.5s Attack Speed\n\n Damage : \n Durability : 412");
                        SOULKNIVES1.button("Close")
                        SOULKNIVES1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_eternal_knife')) break;
                        let SOULKNIVES2 = new ActionFormData();
                        SOULKNIVES2.title("Eternal Knife");
                        SOULKNIVES2.body("A disturbing aura surrounds this knife, as if it has existed for all time and will outlive us all.\n\n Boosted  Collection\n 0.5s Attack Speed\n Attacks may grant bonus souls\n\n Damage : \n Durability : 1666");
                        SOULKNIVES2.button("Close")
                        SOULKNIVES2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_truthseeker')) break;
                        let SOULKNIVES3 = new ActionFormData();
                        SOULKNIVES3.title("Truthseeker");
                        SOULKNIVES3.body("The warden of Highblock Keep kept this unpleasant blade by their side during interrogations.\n\n Boosted  Collection\n 0.5s Attack Speed\n Increased damage to wounded mobs\n\n Damage : \n Durability : 1666");
                        SOULKNIVES3.button("Close")
                        SOULKNIVES3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 12:
                  if (!player.hasTag('dungeons:collected_soul_scythe')) break;
                  let SOULSCYTHES = new ActionFormData();
                  SOULSCYTHES.title("Soul Scythes");
                  SOULSCYTHES.body("Souls imbued into these weapons fuel myths of them guarding the deceased to the afterlife.\n\n Boosted  Collection\n Decreased Knockback\n 0.5s Attack Speed");
                  if (player.hasTag('dungeons:collected_soul_scythe')) {
                    SOULSCYTHES.button("Soul Scythe", "textures/items/weapon/soul_scythe")
                  } else {
                    SOULSCYTHES.button("Soul Scythe", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_frost_scythe')) {
                    SOULSCYTHES.button("Frost Scythe", "textures/items/weapon/frost_scythe")
                  } else {
                    SOULSCYTHES.button("Frost Scythe", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_jailors_scythe')) {
                    SOULSCYTHES.button("Jailors Scythe", "textures/items/weapon/jailors_scythe")
                  } else {
                    SOULSCYTHES.button("Jailors Scythe", "textures/ui/form/locked_weapon")
                  }

                  if (player.hasTag('dungeons:collected_skull_scythe')) {
                    SOULSCYTHES.button("Skull Scythe ", "textures/items/weapon/skull_scythe")
                  }

                  SOULSCYTHES.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_soul_scythe')) break;
                        let SOULSCYTHES1 = new ActionFormData();
                        SOULSCYTHES1.title("Soul Scythe");
                        SOULSCYTHES1.body("A cruel reaper of souls, the Soul Scythe is unsentimental in its work.\n\n Boosted  Collection\n Decreased Knockback\n 0.5s Attack Speed\n\n Damage : \n Durability : 699");
                        SOULSCYTHES1.button("Close")
                        SOULSCYTHES1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_frost_scythe')) break;
                        let SOULSCYTHES2 = new ActionFormData();
                        SOULSCYTHES2.title("Frost Scythe");
                        SOULSCYTHES2.body("The Frost Scythe is an indestructible blade that is freezing to the touch and never seems to melt.\n\n Boosted  Collection\n Decreased Knockback\n 0.5s Attack Speed\n Attacks slow mobs\n\n Damage : \n Durability : 1722");
                        SOULSCYTHES2.button("Close")
                        SOULSCYTHES2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_jailors_scythe')) break;
                        let SOULSCYTHES3 = new ActionFormData();
                        SOULSCYTHES3.title("Jailors Scythe");
                        SOULSCYTHES3.body("This scythe belonged to the terror of Highblock Keep, the Jailor.\n\n Boosted  Collection\n Decreased Knockback\n 0.5s Attack Speed\n Attacks can bind and chain enemies\n\n Damage : \n Durability : 1722");
                        SOULSCYTHES3.button("Close")
                        SOULSCYTHES3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;

                      case 3:
                        if (!player.hasTag('dungeons:collected_skull_scythe')) break;
                        let SOULSCYTHES4 = new ActionFormData();
                        SOULSCYTHES4.title("Skull Scythe");
                        SOULSCYTHES4.body("Don't ask what unnatural creature's bones were used to build this weapon. You don't want to know.\n\n Special event item\n\n Boosted  Collection\n Decreased Knockback\n 0.5s Attack Speed\n Attacks slow mobs\n\n Damage : \n Durability : 1722");
                        SOULSCYTHES4.button("Close")
                        SOULSCYTHES4.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;

                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 13:
                  if (!player.hasTag('dungeons:collected_whip')) break;
                  let WHIPS = new ActionFormData();
                  WHIPS.title("Whips");
                  WHIPS.body("Whips are an old-fashioned weapon that gets stronger when striking at range.\n\n Stronger at long range");
                  if (player.hasTag('dungeons:collected_whip')) {
                    WHIPS.button("Whip", "textures/items/weapon/whip")
                  } else {
                    WHIPS.button("Whip", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_vine_whip')) {
                    WHIPS.button("Vine Whip", "textures/items/weapon/vine_whip")
                  } else {
                    WHIPS.button("Vine Whip", "textures/ui/form/locked_weapon")
                  }
                  WHIPS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_whip')) break;
                        let WHIPS1 = new ActionFormData();
                        WHIPS1.title("Whip");
                        WHIPS1.body("A whip made of sturdy rope, very dangerous in the right hands.\n\n Stronger at long range\n\n Damage : \n Durability : 177");
                        WHIPS1.button("Close")
                        WHIPS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_vine_whip')) break;
                        let WHIPS2 = new ActionFormData();
                        WHIPS2.title("Vine Whip");
                        WHIPS2.body("A sturdy whip made from thick, thorn-laden vines capable of poisoning anything it touches. Be careful not to scratch yourself!\n\n Stronger at long range\n Attacks poison mobs\n\n Damage : \n Durability : 1239");
                        WHIPS2.button("Close")
                        WHIPS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 14:
                  if (!player.hasTag('dungeons:collected_broken_sawblade')) break;
                  let SAWBLADES = new ActionFormData();
                  SAWBLADES.title("Sawblades");
                  SAWBLADES.body("Incredibly risky weapons wielded by utter maniacs.. no offence of course.\n\n Deals +1  with each hit\n Attacks have a chance to overheat");
                  if (player.hasTag('dungeons:collected_broken_sawblade')) {
                    SAWBLADES.button("Broken Sawblade", "textures/items/weapon/broken_sawblade")
                  } else {
                    SAWBLADES.button("Broken Sawblade", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_mechanised_sawblade')) {
                    SAWBLADES.button("Mechanised Sawblade", "textures/items/weapon/mechanised_sawblade")
                  } else {
                    SAWBLADES.button("Mechanised Sawblade", "textures/ui/form/locked_weapon")
                  }
                  SAWBLADES.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_whip')) break;
                        let SAWBLADES1 = new ActionFormData();
                        SAWBLADES1.title("Broken Sawblade");
                        SAWBLADES1.body("The Broken Sawblade has been ravaged by time, but it still does considerable damage.\n\n Deals +1  with each hit \n Attacks have 12%% chance to overheat\n\n Damage : \n Durability : 150");
                        SAWBLADES1.button("Close")
                        SAWBLADES1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_mechanised_sawblade')) break;
                        let SAWBLADES2 = new ActionFormData();
                        SAWBLADES2.title("Mechanised Sawblade");
                        SAWBLADES2.body("The Mechanised Sawblade still glows from the fires of the Nether where it was forged.\n\n Deals +1  with each hit\n Attacks have a 6%% chance to overheat\n\n Damage : \n Durability : 912");
                        SAWBLADES2.button("Close")
                        SAWBLADES2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 15:
                  if (!player.hasTag('dungeons:collected_hammer')) break;
                  let HAMMERS = new ActionFormData();
                  HAMMERS.title("Hammers");
                  HAMMERS.body("Huge, Hulking weapons only wielded by those worthy of their strength.\n\n Large area damage\n Cannot be enchanted\n 0.9s Attack Speed");
                  if (player.hasTag('dungeons:collected_hammer')) {
                    HAMMERS.button("Great Hammer", "textures/items/weapon/great_hammer")
                  } else {
                    HAMMERS.button("Great Hammer", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_stormlander')) {
                    HAMMERS.button("Stormlander", "textures/items/weapon/stormlander")
                  } else {
                    HAMMERS.button("Stormlander", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_hammer_of_gravity')) {
                    HAMMERS.button("Hammer of Gravity", "textures/items/weapon/hammer_of_gravity")
                  } else {
                    HAMMERS.button("Hammer of Gravity", "textures/ui/form/locked_weapon")
                  }

                  if (player.hasTag('dungeons:collected_bonehead_hammer')) {
                    HAMMERS.button("Bonehead Hammer ", "textures/items/weapon/bonehead_hammer")
                  }

                  HAMMERS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_hammer')) break;
                        let HAMMERS1 = new ActionFormData();
                        HAMMERS1.title("Great Hammer");
                        HAMMERS1.body("Blacksmiths and soldiers alike use the Great Hammer for its strength in forging and in battle.\n\n Large area damage\n Cannot be enchanted\n 0.9s Attack Speed\n\n Damage : \n Durability : 1120");
                        HAMMERS1.button("Close")
                        HAMMERS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_stormlander')) break;
                        let HAMMERS2 = new ActionFormData();
                        HAMMERS2.title("Stormlander");
                        HAMMERS2.body("The Stormlander, enchanted with the power of the raging storm, is a treasure of the Illagers.\n\n Large area damage\n Cannot be enchanted\n 0.9s Attack Speed\n Attacks may zap nearby mobs\n\n Damage : \n Durability : 2004");
                        HAMMERS2.button("Close")
                        HAMMERS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_hammer_of_gravity')) break;
                        let HAMMERS3 = new ActionFormData();
                        HAMMERS3.title("Hammer of Gravity");
                        HAMMERS3.body("A hammer, embedded with a crystal that harnesses the power of gravity, that is incredibly powerful.\n\n Large area damage\n Cannot be enchanted\n 0.9s Attack Speed\n Attacks pull in enemies\n\n Damage : \n Durability : 2004");
                        HAMMERS3.button("Close")
                        HAMMERS3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;

                      case 3:
                        if (!player.hasTag('dungeons:collected_bonehead_hammer')) break;
                        let HAMMERS4 = new ActionFormData();
                        HAMMERS4.title("Bonehead Hammer");
                        HAMMERS4.body("Fashioned in the likeness of a familiar foe, this hammer pulls your opponent towards their doom.\n\n Special event item\n\n Large area damage\n Cannot be enchanted\n 0.9s Attack Speed\n Attacks pull in enemies\n\n Damage : \n Durability : 2004");
                        HAMMERS4.button("Close")
                        HAMMERS4.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;

                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 16:
                  if (!player.hasTag('dungeons:collected_anchor')) break;
                  let ANCHORS = new ActionFormData();
                  ANCHORS.title("Anchors");
                  ANCHORS.body("Powerhouse weapons that make the strongest of ships come to a stop.\n\n Large area damage\n Attacks pull in enemies\n Cannot be enchanted\n 2.5s Attack Speed");
                  if (player.hasTag('dungeons:collected_anchor')) {
                    ANCHORS.button("Anchor", "textures/items/weapon/anchor")
                  } else {
                    ANCHORS.button("Anchor", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_encrusted_anchor')) {
                    ANCHORS.button("Encrusted Anchor", "textures/items/weapon/encrusted_anchor")
                  } else {
                    ANCHORS.button("Encrusted Anchor", "textures/ui/form/locked_weapon")
                  }
                  ANCHORS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_anchor')) break;
                        let ANCHORS1 = new ActionFormData();
                        ANCHORS1.title("Anchor");
                        ANCHORS1.body("Those strong enough to wield the Anchor in battle follow the tradition of legendary seafaring warriors.\n\n Large area damage\n Attacks pull in enemies\n Cannot be enchanted\n 2.5s Attack Speed\n\n Damage : \n Durability : 1341");
                        ANCHORS1.button("Close")
                        ANCHORS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_encrusted_anchor')) break;
                        let ANCHORS2 = new ActionFormData();
                        ANCHORS2.title("Encrusted Anchor");
                        ANCHORS2.body("This Encrusted Anchor was lost at sea long ago and has become harsh and corrosive during its ages of neglect.\n\n Large area damage\n Attacks pull in enemies\n Cannot be enchanted\n 2.5s Attack Speed\n Attacks poison mobs\n\n Damage : \n Durability : 1957");
                        ANCHORS2.button("Close")
                        ANCHORS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 17:
                  if (!player.hasTag('dungeons:collected_bone_club')) break;
                  let BONECLUBS = new ActionFormData();
                  BONECLUBS.title("Bone Clubs");
                  BONECLUBS.body("Forged in the flames of the nether, these clubs are barbaric and brutal.\n\n Enhanced Knockback\n Cannot be enchanted");
                  if (player.hasTag('dungeons:collected_bone_club')) {
                    BONECLUBS.button("Bone Club", "textures/items/weapon/bone_club")
                  } else {
                    BONECLUBS.button("Bone Club", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_bone_cudgel')) {
                    BONECLUBS.button("Bone Cudgel", "textures/items/weapon/bone_cudgel")
                  } else {
                    BONECLUBS.button("Bone Cudgel", "textures/ui/form/locked_weapon")
                  }
                  BONECLUBS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_bone_club')) break;
                        let BONECLUBS1 = new ActionFormData();
                        BONECLUBS1.title("Bone Club");
                        BONECLUBS1.body("Those who wield a Bone Club prefer as less-subtle approach to problem-solving.\n\n Enhanced Knockback\n Cannot be enchanted\n\n Damage : \n Durability : 800");
                        BONECLUBS1.button("Close")
                        BONECLUBS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_bone_cudgel')) break;
                        let BONECLUBS2 = new ActionFormData();
                        BONECLUBS2.title("Bone Cudgel");
                        BONECLUBS2.body("The Bone Cudgel is old enough to be considered an ancient treasure, but still menacing even by modern standards.\n\n Enhanced Knockback\n Cannot be enchanted\n Boosted damage against illagers\n\n Damage : \n Durability : 1963");
                        BONECLUBS2.button("Close")
                        BONECLUBS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 18:
                  if (!player.hasTag('dungeons:collected_obsidian_claymore')) break;
                  let OBSIDIANCLAYMORES = new ActionFormData();
                  OBSIDIANCLAYMORES.title("Obsidian Claymores");
                  OBSIDIANCLAYMORES.body("These nigh-indestructible weapon are said to originate from a rift between worlds.\n\n Massive area damage\n 2.0s Attack Speed");
                  if (player.hasTag('dungeons:collected_obsidian_claymore')) {
                    OBSIDIANCLAYMORES.button("Obsidian Claymore", "textures/items/weapon/obsidian_claymore")
                  } else {
                    OBSIDIANCLAYMORES.button("Obsidian Claymore", "textures/ui/form/locked_weapon")
                  }
                  if (player.hasTag('dungeons:collected_starless_night')) {
                    OBSIDIANCLAYMORES.button("The Starless Night", "textures/items/weapon/starless_night")
                  } else {
                    OBSIDIANCLAYMORES.button("The Starless Night", "textures/ui/form/locked_weapon")
                  }
                  OBSIDIANCLAYMORES.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_obsidian_claymore')) break;
                        let OBSIDIANCLAYMORES1 = new ActionFormData();
                        OBSIDIANCLAYMORES1.title("Obsidian Claymore");
                        OBSIDIANCLAYMORES1.body("This massive blade cleaves even the thickest shulker shells with style and ease.\n\n Massive area damage\n 2.0s Attack Speed\n\n Damage : \n Durability : 1500");
                        OBSIDIANCLAYMORES1.button("Close")
                        OBSIDIANCLAYMORES1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_starless_night')) break;
                        let OBSIDIANCLAYMORES2 = new ActionFormData();
                        OBSIDIANCLAYMORES2.title("The Starless Night");
                        OBSIDIANCLAYMORES2.body("The Starless Night is haunted by echoes of pain that linger within the pitch-black blade.\n\n Massive area damage\n 2.0s Attack Speed\n Increases damage with more targets\n\n Damage : \n Durability : 2468");
                        OBSIDIANCLAYMORES2.button("Close")
                        OBSIDIANCLAYMORES2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                default:
                  break;
              }
            }).catch((e) => {
              console.error(e, e.stack);
            });
            break;
          case 1:
            let RANGED = new ActionFormData();
            RANGED.title("Ranged Weapons");
            RANGED.body("Ranged weapons are a necessity for taking on powerful foes.");
            if (player.hasTag('dungeons:collected_bow')) {
              RANGED.button("Bows", "textures/items/ranged/bow/standby")
            } else {
              RANGED.button("Bows", "textures/ui/form/locked_bow")
            }
            if (player.hasTag('dungeons:collected_longbow')) {
              RANGED.button("Longbows", "textures/items/ranged/longbow/standby")
            } else {
              RANGED.button("Longbows", "textures/ui/form/locked_bow")
            }
            if (player.hasTag('dungeons:collected_snow_bow')) {
              RANGED.button("Snow Bows", "textures/items/ranged/snow_bow/standby")
            } else {
              RANGED.button("Snow Bows", "textures/ui/form/locked_bow")
            }
            if (player.hasTag('dungeons:collected_wind_bow')) {
              RANGED.button("Wind Bows", "textures/items/ranged/wind_bow/standby")
            } else {
              RANGED.button("Wind Bows", "textures/ui/form/locked_bow")
            }
            if (player.hasTag('dungeons:collected_twisting_vine_bow')) {
              RANGED.button("Nether Vine Bows", "textures/items/ranged/twisting_vine_bow/standby")
            } else {
              RANGED.button("Nether Vine Bows", "textures/ui/form/locked_bow")
            }
            if (player.hasTag('dungeons:collected_crossbow')) {
              RANGED.button("Crossbows", "textures/items/ranged/crossbow/standby")
            } else {
              RANGED.button("Crossbows", "textures/ui/form/locked_bow")
            }
            if (player.hasTag('dungeons:collected_burst_crossbow')) {
              RANGED.button("Burst Crossbows", "textures/items/ranged/burst_crossbow/standby")
            } else {
              RANGED.button("Burst Crossbows", "textures/ui/form/locked_bow")
            }
            if (player.hasTag('dungeons:collected_soul_crossbow')) {
              RANGED.button("Soul Crossbows", "textures/items/ranged/soul_crossbow/standby")
            } else {
              RANGED.button("Soul Crossbows", "textures/ui/form/locked_bow")
            }
            if (player.hasTag('dungeons:collected_heavy_crossbow')) {
              RANGED.button("Heavy Crossbows", "textures/items/ranged/heavy_crossbow/standby")
            } else {
              RANGED.button("Heavy Crossbows", "textures/ui/form/locked_bow")
            }
            if (player.hasTag('dungeons:collected_exploding_crossbow')) {
              RANGED.button("Exploding Crossbows", "textures/items/ranged/exploding_crossbow/standby")
            } else {
              RANGED.button("Exploding Crossbows", "textures/ui/form/locked_bow")
            }
            if (player.hasTag('dungeons:collected_cog_crossbow')) {
              RANGED.button("Cog Crossbows", "textures/items/ranged/cog_crossbow/standby")
            } else {
              RANGED.button("Cog Crossbows", "textures/ui/form/locked_bow")
            }
            if (player.hasTag('dungeons:collected_harpoon_crossbow')) {
              RANGED.button("Harpoon Crossbows", "textures/items/ranged/harpoon_crossbow/standby")
            } else {
              RANGED.button("Harpoon Crossbows", "textures/ui/form/locked_bow")
            }
            RANGED.show(player).then(r => {
              player.playSound('item.book.page_turn');
              if (r.canceled) return;
              switch (r.selection) {
                case 0:
                  if (!player.hasTag('dungeons:collected_bow')) break;
                  let BOWS = new ActionFormData();
                  BOWS.title("Bows");
                  BOWS.body("A classic choice, we all know how these work.\n\n");
                  if (player.hasTag('dungeons:collected_bow')) {
                    BOWS.button("Bow", "textures/items/ranged/bow/standby")
                  } else {
                    BOWS.button("Bow", "textures/ui/form/locked_bow")
                  }
                  if (player.hasTag('dungeons:collected_bonebow')) {
                    BOWS.button("Bonebow", "textures/items/ranged/bone_bow/standby")
                  } else {
                    BOWS.button("Bonebow", "textures/ui/form/locked_bow")
                  }
                  if (player.hasTag('dungeons:collected_twin_bow')) {
                    BOWS.button("Twin Bow", "textures/items/ranged/twin_bow/standby")
                  } else {
                    BOWS.button("Twin Bow", "textures/ui/form/locked_bow")
                  }


                  BOWS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_bow')) break;
                        let BOWS1 = new ActionFormData();
                        BOWS1.title("Bow");
                        BOWS1.body("A simple but well-rounded piece of weaponry. The hunters of the plains say that a bow doesn't let you down, unlike other trinkets.\n\n Draw Time : 1s\n Durability : 306");
                        BOWS1.button("Close")
                        BOWS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_bonebow')) break;
                        let BOWS2 = new ActionFormData();
                        BOWS2.title("Bonebow");
                        BOWS2.body("The Bonebow is the pride of many Villagers, crafted within the walls of their humble village.\n\n Arrows get bigger and stronger overtime\n\n Draw Time : 1s\n Durability : 612");
                        BOWS2.button("Close")
                        BOWS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_twin_bow')) break;
                        let BOWS3 = new ActionFormData();
                        BOWS3.title("Twin Bow");
                        BOWS3.body("The Twin Bow is the champion of the hero who finds themselves outnumbered and alone.\n\n Arrows bounce between nearby monsters\n\n Draw Time : 1s\n Durability : 612");
                        BOWS3.button("Close")
                        BOWS3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 1:
                  if (!player.hasTag('dungeons:collected_longbow')) break;
                  let LONGBOWS = new ActionFormData();
                  LONGBOWS.title("Longbows");
                  LONGBOWS.body("These sturdy bows are great for trained hunters.\n\n");
                  if (player.hasTag('dungeons:collected_longbow')) {
                    LONGBOWS.button("Longbow", "textures/items/ranged/longbow/standby")
                  } else {
                    LONGBOWS.button("Longbow", "textures/ui/form/locked_bow")
                  }
                  if (player.hasTag('dungeons:collected_guardian_bow')) {
                    LONGBOWS.button("Guardian Bow", "textures/items/ranged/guardian_bow/standby")
                  } else {
                    LONGBOWS.button("Guardian Bow", "textures/ui/form/locked_bow")
                  }
                  if (player.hasTag('dungeons:collected_red_snake')) {
                    LONGBOWS.button("Red Snake", "textures/items/ranged/red_snake/standby")
                  } else {
                    LONGBOWS.button("Red Snake", "textures/ui/form/locked_bow")
                  }


                  LONGBOWS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_longbow')) break;
                        let LONGBOWS1 = new ActionFormData();
                        LONGBOWS1.title("Longbow");
                        LONGBOWS1.body("The Longbow, crafted for hunting rather than battle, is still useful in a fight.\n\n Draw Time : 1.5s\n Durability : 421");
                        LONGBOWS1.button("Close")
                        LONGBOWS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_guardian_bow')) break;
                        let LONGBOWS2 = new ActionFormData();
                        LONGBOWS2.title("Guardian Bow");
                        LONGBOWS2.body("Forges from fossilised coral, the Guardian Bow is a remnant from sunken civilisations of lost ages.\n\n Arrows have increased knockback\n\n Draw Time : 1.5s\n Durability : 741");
                        LONGBOWS2.button("Close")
                        LONGBOWS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_red_snake')) break;
                        let LONGBOWS3 = new ActionFormData();
                        LONGBOWS3.title("Red Snake");
                        LONGBOWS3.body("The Red Snake radiates an explosive heat, making it a deadly fire risk in the dry, desert lands.\n\n Arrows will explode on hit\n\n Draw Time : 1.5s\n Durability : 741");
                        LONGBOWS3.button("Close")
                        LONGBOWS3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 2:
                  if (!player.hasTag('dungeons:collected_snow_bow')) break;
                  let SNOWBOWS = new ActionFormData();
                  SNOWBOWS.title("Snow Bows");
                  SNOWBOWS.body("These chilling bows are forged from carved ice, it's recommended you wear some gloves.\n\n Arrows slow mobs");
                  if (player.hasTag('dungeons:collected_snow_bow')) {
                    SNOWBOWS.button("Snow Bow", "textures/items/ranged/snow_bow/standby")
                  } else {
                    SNOWBOWS.button("Snow Bow", "textures/ui/form/locked_bow")
                  }
                  if (player.hasTag('dungeons:collected_winters_touch')) {
                    SNOWBOWS.button("Winter's Touch", "textures/items/ranged/winters_touch/standby")
                  } else {
                    SNOWBOWS.button("Winter's Touch", "textures/ui/form/locked_bow")
                  }


                  SNOWBOWS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_snow_bow')) break;
                        let SNOWBOWS1 = new ActionFormData();
                        SNOWBOWS1.title("Snow Bow");
                        SNOWBOWS1.body("Those who face the Snow Bow in battle must also prepare to face the chill of freezing wintery winds.\n\n Arrows slow mobs\n Draw Time : 1.25s\n Durability : 361");
                        SNOWBOWS1.button("Close")
                        SNOWBOWS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_winters_touch')) break;
                        let SNOWBOWS2 = new ActionFormData();
                        SNOWBOWS2.title("Winter's Touch");
                        SNOWBOWS2.body("Arrows fired from this legendary bow are said to be carried by the winter winds themselves.\n\n Arrows slow mobs\n Arrows stun foes for 1s\n\n Draw Time : 1.25s\n Durability : 591");
                        SNOWBOWS2.button("Close")
                        SNOWBOWS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 3:
                  if (!player.hasTag('dungeons:collected_wind_bow')) break;
                  let WINDBOWS = new ActionFormData();
                  WINDBOWS.title("Wind Bows");
                  WINDBOWS.body("It is said these bows were first formed for the guards of the fabled Gale Sanctum.\n\n Arrows pull mobs towards you");
                  if (player.hasTag('dungeons:collected_wind_bow')) {
                    WINDBOWS.button("Wind Bow", "textures/items/ranged/wind_bow/standby")
                  } else {
                    WINDBOWS.button("Wind Bow", "textures/ui/form/locked_bow")
                  }
                  if (player.hasTag('dungeons:collected_burst_gale_bow')) {
                    WINDBOWS.button("Burst Gale Bow", "textures/items/ranged/burst_gale_bow/standby")
                  } else {
                    WINDBOWS.button("Burst Gale Bow", "textures/ui/form/locked_bow")
                  }
                  if (player.hasTag('dungeons:collected_echo_of_the_valley')) {
                    WINDBOWS.button("Echo of the Valley", "textures/items/ranged/echo_of_the_valley/standby")
                  } else {
                    WINDBOWS.button("Echo of the Valley", "textures/ui/form/locked_bow")
                  }


                  WINDBOWS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_wind_bow')) break;
                        let WINDBOWS1 = new ActionFormData();
                        WINDBOWS1.title("Wind Bow");
                        WINDBOWS1.body("A mesmerising bow that captures the power of the wind to fire mighty Gale Arrows.\n\n Arrows pull mobs towards you\n Draw Time : 1.5s\n Durability : 399");
                        WINDBOWS1.button("Close")
                        WINDBOWS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_burst_gale_bow')) break;
                        let WINDBOWS2 = new ActionFormData();
                        WINDBOWS2.title("Burst Gale Bow");
                        WINDBOWS2.body("A bow infused with the force of a rolling wind which can flare up in an instant.\n\n Arrows pull mobs towards you\n Drawing arrows has no slow-down\n\n Draw Time : 1.5s\n Durability : 698");
                        WINDBOWS2.button("Close")
                        WINDBOWS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_echo_of_the_valley')) break;
                        let WINDBOWS3 = new ActionFormData();
                        WINDBOWS3.title("Echo of the Valley");
                        WINDBOWS3.body("This bow calls upon the twisting winds of the hidden valley where it was first strung.\n\n Arrows pull mobs towards you\n Arrows bounce between nearby monsters\n\n Draw Time : 1.5s\n Durability : 698");
                        WINDBOWS3.button("Close")
                        WINDBOWS3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 4:
                  if (!player.hasTag('dungeons:collected_twisting_vine_bow')) break;
                  let VINEBOWS = new ActionFormData();
                  VINEBOWS.title("Nether Vine Bows");
                  VINEBOWS.body("These bows have been used by ancient nether hunters for centuries, and have a distinctive smell too...\n\n Arrows leave a poison trail");
                  if (player.hasTag('dungeons:collected_twisting_vine_bow')) {
                    VINEBOWS.button("Twisting Vine Bow", "textures/items/ranged/twisting_vine_bow/standby")
                  } else {
                    VINEBOWS.button("Twisting Vine Bow", "textures/ui/form/locked_bow")
                  }
                  if (player.hasTag('dungeons:collected_weeping_vine_bow')) {
                    VINEBOWS.button("Weeping Vine Bow", "textures/items/ranged/weeping_vine_bow/standby")
                  } else {
                    VINEBOWS.button("Weeping Vine Bow", "textures/ui/form/locked_bow")
                  }


                  VINEBOWS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_twisting_vine_bow')) break;
                        let VINEBOWS1 = new ActionFormData();
                        VINEBOWS1.title("Twisting Vine Bow");
                        VINEBOWS1.body("This bow writhes within your grasp as if trying to wrap its tendrils around everything in its path.\n\n Arrows leave a poison trail\n Draw Time : 2s\n Durability : 199");
                        VINEBOWS1.button("Close")
                        VINEBOWS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_weeping_vine_bow')) break;
                        let VINEBOWS2 = new ActionFormData();
                        VINEBOWS2.title("Weeping Vine Bow");
                        VINEBOWS2.body("The Weeping Vine Bow's toxic vines create a poisonous haze on the battlefield.\n\n Arrows leave a poison trail\n Drawing arrows has no slow-down\n\n Draw Time : 2s\n Durability : 461");
                        VINEBOWS2.button("Close")
                        VINEBOWS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 5:
                  if (!player.hasTag('dungeons:collected_crossbow')) break;
                  let CROSSBOWS = new ActionFormData();
                  CROSSBOWS.title("Crossbows");
                  CROSSBOWS.body("Considered by some to be a more elegant weapon for a more civilised age.\n\n");
                  if (player.hasTag('dungeons:collected_crossbow')) {
                    CROSSBOWS.button("Crossbow", "textures/items/ranged/crossbow/standby")
                  } else {
                    CROSSBOWS.button("Crossbow", "textures/ui/form/locked_bow")
                  }


                  CROSSBOWS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_crossbow')) break;
                        let CROSSBOWS1 = new ActionFormData();
                        CROSSBOWS1.title("Crossbow");
                        CROSSBOWS1.body("The crossbow is the ranger weapon of the Illagers and is a common sight among Pillager warriors.\n\n Draw Time : 1.25s\n Durability : 464");
                        CROSSBOWS1.button("Close")
                        CROSSBOWS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 6:
                  if (!player.hasTag('dungeons:collected_burst_crossbow')) break;
                  let BURSTCROSSBOWS = new ActionFormData();
                  BURSTCROSSBOWS.title("Burst Crossbows");
                  BURSTCROSSBOWS.body("These are built for quick fire in the heat of battle.\n\n");
                  if (player.hasTag('dungeons:collected_burst_crossbow')) {
                    BURSTCROSSBOWS.button("Burst Crossbow", "textures/items/ranged/burst_crossbow/standby")
                  } else {
                    BURSTCROSSBOWS.button("Burst Crossbow", "textures/ui/form/locked_bow")
                  }
                  if (player.hasTag('dungeons:collected_corrupted_crossbow')) {
                    BURSTCROSSBOWS.button("Corrupted Crossbow", "textures/items/ranged/corrupted_crossbow/standby")
                  } else {
                    BURSTCROSSBOWS.button("Corrupted Crossbow", "textures/ui/form/locked_bow")
                  }
                  if (player.hasTag('dungeons:collected_soul_hunter_crossbow')) {
                    BURSTCROSSBOWS.button("Soul Hunter Crossbow", "textures/items/ranged/soul_hunter_crossbow/standby")
                  } else {
                    BURSTCROSSBOWS.button("Soul Hunter Bow", "textures/ui/form/locked_bow")
                  }


                  BURSTCROSSBOWS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_burst_crossbow')) break;
                        let BURSTCROSSBOWS1 = new ActionFormData();
                        BURSTCROSSBOWS1.title("Burst Crossbow");
                        BURSTCROSSBOWS1.body("A tactical crossbow favoured by warriors and hunters alike, the Burst Crossbow is a powerful tool for any hero.\n\n Draw Time : 0.5s\n Durability : 465");
                        BURSTCROSSBOWS1.button("Close")
                        BURSTCROSSBOWS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_corrupted_crossbow')) break;
                        let BURSTCROSSBOWS2 = new ActionFormData();
                        BURSTCROSSBOWS2.title("Corrupted Crossbow");
                        BURSTCROSSBOWS2.body("This crossbow has a subtle but corrupting power that is suitable for thieves and nimble warriors alike.\n\n 10%% Critical Hit Chance\n\n Draw Time : 0.5s\n Durability : 651");
                        BURSTCROSSBOWS2.button("Close")
                        BURSTCROSSBOWS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_soul_hunter_crossbow')) break;
                        let BURSTCROSSBOWS3 = new ActionFormData();
                        BURSTCROSSBOWS3.title("Soul Hunter Crossbow");
                        BURSTCROSSBOWS3.body("This crossbow, crafted in a forge rich with souls, thrives when an abundance of souls are nearby.\n\n Boosted  Collection\n Critical hit rate rises with Souls\n\n Draw Time : 0.5s\n Durability : 651");
                        BURSTCROSSBOWS3.button("Close")
                        BURSTCROSSBOWS3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 7:
                  if (!player.hasTag('dungeons:collected_soul_crossbow')) break;
                  let SOULCROSSBOWS = new ActionFormData();
                  SOULCROSSBOWS.title("Soul Crossbows");
                  SOULCROSSBOWS.body("Magical crossbows made to harness souls, nobody truly knows the reason behind their origin.\n\n Boosted  Collection");
                  if (player.hasTag('dungeons:collected_soul_crossbow')) {
                    SOULCROSSBOWS.button("Soul Crossbow", "textures/items/ranged/soul_crossbow/standby")
                  } else {
                    SOULCROSSBOWS.button("Soul Crossbow", "textures/ui/form/locked_bow")
                  }
                  if (player.hasTag('dungeons:collected_feral_soul_crossbow')) {
                    SOULCROSSBOWS.button("Feral Soul Crossbow", "textures/items/ranged/feral_soul_crossbow/standby")
                  } else {
                    SOULCROSSBOWS.button("Feral Soul Crossbow", "textures/ui/form/locked_bow")
                  }
                  if (player.hasTag('dungeons:collected_voidcaller')) {
                    SOULCROSSBOWS.button("Voidcaller", "textures/items/ranged/voidcaller/standby")
                  } else {
                    SOULCROSSBOWS.button("Voidcaller", "textures/ui/form/locked_bow")
                  }


                  SOULCROSSBOWS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_soul_crossbow')) break;
                        let SOULCROSSBOWS1 = new ActionFormData();
                        SOULCROSSBOWS1.title("Soul Crossbow");
                        SOULCROSSBOWS1.body("The Soul Crossbow was crafted by the mysterious Evokers of the Woodland Mansions.\n\n Boosted  Collection\n Draw Time : 1.25s\n Durability : 281");
                        SOULCROSSBOWS1.button("Close")
                        SOULCROSSBOWS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_feral_soul_crossbow')) break;
                        let SOULCROSSBOWS2 = new ActionFormData();
                        SOULCROSSBOWS2.title("Feral Soul Crossbow");
                        SOULCROSSBOWS2.body("If you listen closely you can hear the souls inside the crossbow, usually ridiculing you.\n\n Boosted  Collection\n Critical hit rate rises with Souls\n\n Draw Time : 1.25s\n Durability : 461");
                        SOULCROSSBOWS2.button("Close")
                        SOULCROSSBOWS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_voidcaller')) break;
                        let SOULCROSSBOWS3 = new ActionFormData();
                        SOULCROSSBOWS3.title("Voidcaller");
                        SOULCROSSBOWS3.body("This weapon calls out to souls that are trapped between this world and the next.\n\n Boosted  Collection\n Arrows pull in nearby mobs on hit\n\n Draw Time : 1.25s\n Durability : 461");
                        SOULCROSSBOWS3.button("Close")
                        SOULCROSSBOWS3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 8:
                  if (!player.hasTag('dungeons:collected_heavy_crossbow')) break;
                  let HEAVYCROSSBOWS = new ActionFormData();
                  HEAVYCROSSBOWS.title("Heavy Crossbows");
                  HEAVYCROSSBOWS.body("A lot goes into making a weapon this powerful.\n\n All Arrows have slightly boosted damage");
                  if (player.hasTag('dungeons:collected_heavy_crossbow')) {
                    HEAVYCROSSBOWS.button("Heavy Crossbow", "textures/items/ranged/heavy_crossbow/standby")
                  } else {
                    HEAVYCROSSBOWS.button("Heavy Crossbow", "textures/ui/form/locked_bow")
                  }
                  if (player.hasTag('dungeons:collected_doom_crossbow')) {
                    HEAVYCROSSBOWS.button("Doom Crossbow", "textures/items/ranged/doom_crossbow/standby")
                  } else {
                    HEAVYCROSSBOWS.button("Doom Crossbow", "textures/ui/form/locked_bow")
                  }
                  if (player.hasTag('dungeons:collected_slayer_crossbow')) {
                    HEAVYCROSSBOWS.button("Slayer Crossbow", "textures/items/ranged/slayer_crossbow/standby")
                  } else {
                    HEAVYCROSSBOWS.button("Slayer Crossbow", "textures/ui/form/locked_bow")
                  }


                  HEAVYCROSSBOWS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_heavy_crossbow')) break;
                        let HEAVYCROSSBOWS1 = new ActionFormData();
                        HEAVYCROSSBOWS1.title("Heavy Crossbow");
                        HEAVYCROSSBOWS1.body("The weighted crossbow is a damage-dealing menace and a real threat from a ranged distance.\n\n All Arrows have slightly boosted damage\n Draw Time : 1.5s\n Durability : 696");
                        HEAVYCROSSBOWS1.button("Close")
                        HEAVYCROSSBOWS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_doom_crossbow')) break;
                        let HEAVYCROSSBOWS2 = new ActionFormData();
                        HEAVYCROSSBOWS2.title("Doom Crossbow");
                        HEAVYCROSSBOWS2.body("Many thought that the Doom Crossbow was just a myth, but this time the rumors turned out to be true.\n\n All Arrows have slightly boosted damage\n Arrows have increased knockback.\n\n Draw Time : 1.5s\n Durability : 963");
                        HEAVYCROSSBOWS2.button("Close")
                        HEAVYCROSSBOWS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_slayer_crossbow')) break;
                        let HEAVYCROSSBOWS3 = new ActionFormData();
                        HEAVYCROSSBOWS3.title("Slayer Crossbow");
                        HEAVYCROSSBOWS3.body("The Slayer Crossbow is the treasured heirloom of many legendary hunters\n\n All Arrows have slightly boosted damage\n Arrows bounce between nearby monsters.\n\n Draw Time : 1.5s\n Durability : 963");
                        HEAVYCROSSBOWS3.button("Close")
                        HEAVYCROSSBOWS3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 9:
                  if (!player.hasTag('dungeons:collected_exploding_crossbow')) break;
                  let EXPLODINGCROSSBOWS = new ActionFormData();
                  EXPLODINGCROSSBOWS.title("Exploding Crossbows");
                  EXPLODINGCROSSBOWS.body("This explosive launcher is a marvel of modern technology.\n\n Arrows will explode on hit");
                  if (player.hasTag('dungeons:collected_exploding_crossbow')) {
                    EXPLODINGCROSSBOWS.button("Exploding Crossbow", "textures/items/ranged/exploding_crossbow/standby")
                  } else {
                    EXPLODINGCROSSBOWS.button("Exploding Crossbow", "textures/ui/form/locked_bow")
                  }
                  if (player.hasTag('dungeons:collected_imploding_crossbow')) {
                    EXPLODINGCROSSBOWS.button("Imploding Crossbow", "textures/items/ranged/imploding_crossbow/standby")
                  } else {
                    EXPLODINGCROSSBOWS.button("Imploding Crossbow", "textures/ui/form/locked_bow")
                  }
                  if (player.hasTag('dungeons:collected_firebolt_thrower')) {
                    EXPLODINGCROSSBOWS.button("Firebolt Thrower", "textures/items/ranged/firebolt_thrower/standby")
                  } else {
                    EXPLODINGCROSSBOWS.button("Firebolt Thrower", "textures/ui/form/locked_bow")
                  }


                  EXPLODINGCROSSBOWS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_exploding_crossbow')) break;
                        let EXPLODINGCROSSBOWS1 = new ActionFormData();
                        EXPLODINGCROSSBOWS1.title("Exploding Crossbow");
                        EXPLODINGCROSSBOWS1.body("The power of TNT fused with the latest in archery design resulted in this devastating crossbow.\n\n Arrows explode on hit\n Draw Time : 2s\n Durability : 489");
                        EXPLODINGCROSSBOWS1.button("Close")
                        EXPLODINGCROSSBOWS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_imploding_crossbow')) break;
                        let EXPLODINGCROSSBOWS2 = new ActionFormData();
                        EXPLODINGCROSSBOWS2.title("Imploding Crossbow");
                        EXPLODINGCROSSBOWS2.body("The Imploding Crossbow has been magically fine-tuned to maximise the impact of the explosion.\n\n Arrows explode on hit\n Arrows pull in nearby mobs on hit\n\n Draw Time : 2s\n Durability : 721");
                        EXPLODINGCROSSBOWS2.button("Close")
                        EXPLODINGCROSSBOWS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_firebolt_thrower')) break;
                        let EXPLODINGCROSSBOWS3 = new ActionFormData();
                        EXPLODINGCROSSBOWS3.title("Firebolt Thrower");
                        EXPLODINGCROSSBOWS3.body("The Firebolt Thrower launched chaos in a chain reaction of exploding arrows.\n\n Arrows explode on hit\n 33%% Faster draw speed\n\n Draw Time : 1.32s\n Durability : 721");
                        EXPLODINGCROSSBOWS3.button("Close")
                        EXPLODINGCROSSBOWS3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 10:
                  if (!player.hasTag('dungeons:collected_cog_crossbow')) break;
                  let COGCROSSBOWS = new ActionFormData();
                  COGCROSSBOWS.title("Cog Crossbows");
                  COGCROSSBOWS.body("The mechanisms in the crossbow let arrows be fired and great speed and with extreme power.\n\n All Arrows have boosted damage");
                  if (player.hasTag('dungeons:collected_cog_crossbow')) {
                    COGCROSSBOWS.button("Cog Crossbow", "textures/items/ranged/cog_crossbow/standby")
                  } else {
                    COGCROSSBOWS.button("Cog Crossbow", "textures/ui/form/locked_bow")
                  }
                  if (player.hasTag('dungeons:collected_pride_of_the_piglins')) {
                    COGCROSSBOWS.button("Pride of the Piglins", "textures/items/ranged/pride_of_the_piglins/standby")
                  } else {
                    COGCROSSBOWS.button("Pride of the Piglins", "textures/ui/form/locked_bow")
                  }


                  COGCROSSBOWS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_harpoon_crossbow')) break;
                        let COGCROSSBOWS1 = new ActionFormData();
                        COGCROSSBOWS1.title("Cog Crossbow");
                        COGCROSSBOWS1.body("The gears of this ancient Cog Crossbow still turn up smoothly, making it a reliable weapon choice to this day.\n\n All Arrows have boosted damage\n Draw Time : 2s\n Durability : 500");
                        COGCROSSBOWS1.button("Close")
                        COGCROSSBOWS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_pride_of_the_piglins')) break;
                        let COGCROSSBOWS2 = new ActionFormData();
                        COGCROSSBOWS2.title("Pride of the Piglins");
                        COGCROSSBOWS2.body("Found in the farthest reaches of the Nether, the Pride of the Piglins is both vintage and vicious.\n\n All Arrows have boosted damage\n Arrows pierce through mobs.\n\n Draw Time : 2s\n Durability : 861");
                        COGCROSSBOWS2.button("Close")
                        COGCROSSBOWS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 11:
                  if (!player.hasTag('dungeons:collected_harpoon_crossbow')) break;
                  let HARPOONCROSSBOWS = new ActionFormData();
                  HARPOONCROSSBOWS.title("Harpoon Crossbows");
                  HARPOONCROSSBOWS.body("These weapons have been used by divers for many years.\n\n Harpoon Arrows have boosted damage");
                  if (player.hasTag('dungeons:collected_harpoon_crossbow')) {
                    HARPOONCROSSBOWS.button("Harpoon Crossbow", "textures/items/ranged/harpoon_crossbow/standby")
                  } else {
                    HARPOONCROSSBOWS.button("Harpoon Crossbow", "textures/ui/form/locked_bow")
                  }
                  if (player.hasTag('dungeons:collected_nautical_crossbow')) {
                    HARPOONCROSSBOWS.button("Nautical Crossbow", "textures/items/ranged/nautical_crossbow/standby")
                  } else {
                    HARPOONCROSSBOWS.button("Nautical Crossbow", "textures/ui/form/locked_bow")
                  }


                  HARPOONCROSSBOWS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_harpoon_crossbow')) break;
                        let HARPOONCROSSBOWS1 = new ActionFormData();
                        HARPOONCROSSBOWS1.title("Harpoon Crossbow");
                        HARPOONCROSSBOWS1.body("The Harpoon Crossbow can shoot harpoons that cut through wind and water with devastating power.\n\n Harpoon Arrows have boosted damage\n Draw Time : 1.5s\n Durability : 321");
                        HARPOONCROSSBOWS1.button("Close")
                        HARPOONCROSSBOWS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_nautical_crossbow')) break;
                        let HARPOONCROSSBOWS2 = new ActionFormData();
                        HARPOONCROSSBOWS2.title("Nautical Crossbow");
                        HARPOONCROSSBOWS2.body("Why harpoon one enemy when you can harpoon many!\n\n Harpoon Arrows have boosted damage\n Arrows pierce through mobs.\n\n Draw Time : 1.5s\n Durability : 512");
                        HARPOONCROSSBOWS2.button("Close")
                        HARPOONCROSSBOWS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                default:
                  break;
              }
            }).catch((e) => {
              console.error(e, e.stack);
            });
            break;
          case 2:
            let ARMOUR = new ActionFormData();
            ARMOUR.title("Armour");
            ARMOUR.body("A good set of armour will defer even the toughest blows.");
            if (player.hasTag('dungeons:collected_dark_armour')) {
              ARMOUR.button("Dark Armours", "textures/items/armor/helmet_dark")
            } else {
              ARMOUR.button("Dark Armours", "textures/ui/form/locked_armour")
            }
            if (player.hasTag('dungeons:collected_grim_armour')) {
              ARMOUR.button("Grim Armours", "textures/items/armor/helmet_grim")
            } else {
              ARMOUR.button("Grim Armours", "textures/ui/form/locked_armour")
            }
            if (player.hasTag('dungeons:collected_snow_armour')) {
              ARMOUR.button("Snow Armours", "textures/items/armor/helmet_snow")
            } else {
              ARMOUR.button("Snow Armours", "textures/ui/form/locked_armour")
            }
            if (player.hasTag('dungeons:collected_emerald_armour')) {
              ARMOUR.button("Emerald Armours", "textures/items/armor/helmet_emerald")
            } else {
              ARMOUR.button("Emerald Armours", "textures/ui/form/locked_armour")
            }
            if (player.hasTag('dungeons:collected_piglin_armour')) {
              ARMOUR.button("Piglin Armours", "textures/items/armor/helmet_piglin")
            } else {
              ARMOUR.button("Piglin Armours", "textures/ui/form/locked_armour")
            }
            if (player.hasTag('dungeons:collected_thief_armour')) {
              ARMOUR.button("Thief Armours", "textures/items/armor/helmet_thief")
            } else {
              ARMOUR.button("Thief Armours", "textures/ui/form/locked_armour")
            }
            if (player.hasTag('dungeons:collected_evocation_armour')) {
              ARMOUR.button("Evocation Robes", "textures/items/armor/helmet_evocation")
            } else {
              ARMOUR.button("Evocation Robes", "textures/ui/form/locked_armour")
            }
            if (player.hasTag('dungeons:collected_sprout_armour')) {
              ARMOUR.button("Sprout Armours", "textures/items/armor/helmet_sprout")
            } else {
              ARMOUR.button("Sprout Armours", "textures/ui/form/locked_armour")
            }
            if (player.hasTag('dungeons:collected_root_rot_armour')) {
              ARMOUR.button("Root Armours", "textures/items/armor/helmet_root_rot")
            } else {
              ARMOUR.button("Root Armours", "textures/ui/form/locked_armour")
            }
            if (player.hasTag('dungeons:collected_wolf_armour')) {
              ARMOUR.button("Wolf Armours", "textures/items/armor/helmet_wolf")
            } else {
              ARMOUR.button("Wolf Armours", "textures/ui/form/locked_armour")
            }
            if (player.hasTag('dungeons:collected_ocelot_armour')) {
              ARMOUR.button("Ocelot Armours", "textures/items/armor/helmet_ocelot")
            } else {
              ARMOUR.button("Ocelot Armours", "textures/ui/form/locked_armour")
            }
            if (player.hasTag('dungeons:collected_turtle_armour')) {
              ARMOUR.button("Turtle Armours", "textures/items/armor/helmet_turtle")
            } else {
              ARMOUR.button("Turtle Armours", "textures/ui/form/locked_armour")
            }
            if (player.hasTag('dungeons:collected_squid_armour')) {
              ARMOUR.button("Squid Armours", "textures/items/armor/helmet_squid")
            } else {
              ARMOUR.button("Squid Armours", "textures/ui/form/locked_armour")
            }
            ARMOUR.show(player).then(r => {
              player.playSound('item.book.page_turn');
              if (r.canceled) return;
              switch (r.selection) {
                case 0:
                  if (!player.hasTag('dungeons:collected_dark_armour')) break;
                  let DARKARMOURS = new ActionFormData();
                  DARKARMOURS.title("Dark Armours");
                  DARKARMOURS.body("Forged in fire, these armour sets are seriously tough.\n\n");
                  if (player.hasTag('dungeons:collected_dark_armour')) {
                    DARKARMOURS.button("Dark Armour", "textures/items/armor/helmet_dark")
                  } else {
                    DARKARMOURS.button("Dark Armour", "textures/ui/form/locked_armour")
                  }
                  if (player.hasTag('dungeons:collected_titans_shroud_armour')) {
                    DARKARMOURS.button("Titans Shroud", "textures/items/armor/helmet_titans_shroud")
                  } else {
                    DARKARMOURS.button("Titans Shroud", "textures/ui/form/locked_armour")
                  }
                  DARKARMOURS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_dark_armour')) break;
                        let DARKARMOURS1 = new ActionFormData();
                        DARKARMOURS1.title("Dark Armour");
                        DARKARMOURS1.body("Dark Armour, made in the blackest depths of the Fiery Forge, is worn by the Illager royal guard.\n\n Total Protection : \n Avg Durability : 306");
                        DARKARMOURS1.button("Close")
                        DARKARMOURS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_titans_shroud_armour')) break;
                        let DARKARMOURS2 = new ActionFormData();
                        DARKARMOURS2.title("Titans Shroud");
                        DARKARMOURS2.body("The inspiring tales of the Titans Shroud armour have passed through Villages for generations.\n\n +20%% Damage Reduction\n\n Total Protection : x22\n Avg Durability : 760");
                        DARKARMOURS2.button("Close")
                        DARKARMOURS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 1:
                  if (!player.hasTag('dungeons:collected_grim_armour')) break;
                  let GRIMARMOURS = new ActionFormData();
                  GRIMARMOURS.title("Grim Armours");
                  GRIMARMOURS.body("These unsettling armour sets were built from the scraps of the Nameless Ones vanguard legion.\n\n");
                  if (player.hasTag('dungeons:collected_grim_armour')) {
                    GRIMARMOURS.button("Grim Armour", "textures/items/armor/helmet_grim")
                  } else {
                    GRIMARMOURS.button("Grim Armour", "textures/ui/form/locked_armour")
                  }
                  if (player.hasTag('dungeons:collected_wither_armour')) {
                    GRIMARMOURS.button("Wither Armour", "textures/items/armor/helmet_wither")
                  } else {
                    GRIMARMOURS.button("Wither Armour", "textures/ui/form/locked_armour")
                  }
                  if (player.hasTag('dungeons:collected_spooky_gourdian')) {
                    GRIMARMOURS.button("The Spooky Gourdian ", "textures/items/armor/helmet_spooky_gourdian")
                  }
                  GRIMARMOURS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_grim_armour')) break;
                        let GRIMARMOURS1 = new ActionFormData();
                        GRIMARMOURS1.title("Grim Armour");
                        GRIMARMOURS1.body("Grim Armour invokes a sense of dread for the one who wears it and to those who face it in battle.\n\n Total Protection : \n Avg Durability : 202");
                        GRIMARMOURS1.button("Close")
                        GRIMARMOURS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_wither_armour')) break;
                        let GRIMARMOURS2 = new ActionFormData();
                        GRIMARMOURS2.title("Wither Armour");
                        GRIMARMOURS2.body("Wither Armour, crafted with the parts of slain enemies, was made to terrify the wearer's enemies.\n\n Defeated monsters grant healing \n\n Total Protection : x18\n Avg Durability : 542");
                        GRIMARMOURS2.button("Close")
                        GRIMARMOURS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;

                      case 2:
                        if (!player.hasTag('dungeons:collected_spooky_gourdian')) break;
                        let GRIMARMOURS3 = new ActionFormData();
                        GRIMARMOURS3.title("The Spooky Gourdian");
                        GRIMARMOURS3.body("Those who wear the mantle of The Spooky Gourdian become the legendary terror of Pumpkin Pastures!\n\n Special event item\n\n Defeated monsters grant healing\n\n Total Protection : x18\n Avg Durability : 542");
                        GRIMARMOURS3.button("Close")
                        GRIMARMOURS3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 2:
                  if (!player.hasTag('dungeons:collected_snow_armour')) break;
                  let SNOWARMOURS = new ActionFormData();
                  SNOWARMOURS.title("Snow Armours");
                  SNOWARMOURS.body("Built from condensed ice, only the bravest warriors can wear these without getting chilly.\n\n");
                  if (player.hasTag('dungeons:collected_snow_armour')) {
                    SNOWARMOURS.button("Snow Armour", "textures/items/armor/helmet_snow")
                  } else {
                    SNOWARMOURS.button("Snow Armour", "textures/ui/form/locked_armour")
                  }
                  if (player.hasTag('dungeons:collected_frost_armour')) {
                    SNOWARMOURS.button("Frost Armour", "textures/items/armor/helmet_frost")
                  } else {
                    SNOWARMOURS.button("Frost Armour", "textures/ui/form/locked_armour")
                  }
                  SNOWARMOURS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_snow_armour')) break;
                        let SNOWARMOURS1 = new ActionFormData();
                        SNOWARMOURS1.title("Snow Armour");
                        SNOWARMOURS1.body("A suit of armour that was tempered in snowmelt, protecting the wearer from the harsh cold of the tundra.\n\n Total Protection : \n Avg Durability : 112");
                        SNOWARMOURS1.button("Close")
                        SNOWARMOURS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_frost_armour')) break;
                        let SNOWARMOURS2 = new ActionFormData();
                        SNOWARMOURS2.title("Frost Armour");
                        SNOWARMOURS2.body("This legendary armour, forged from ice that never melts, makes the wearer feel as if they are one with winter.\n\n Periodically slows nearby monsters\n\n Total Protection : x20\n Avg Durability : 440");
                        SNOWARMOURS2.button("Close")
                        SNOWARMOURS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;

                case 3:
                  if (!player.hasTag('dungeons:collected_emerald_armour')) break;
                  let EMERALDARMOURS = new ActionFormData();
                  EMERALDARMOURS.title("Emerald Armours");
                  EMERALDARMOURS.body("Long carried through myth and legends, these armours are cherished by villagers everywhere.\n\n Defeated mobs grant bonus experience");
                  if (player.hasTag('dungeons:collected_emerald_armour')) {
                    EMERALDARMOURS.button("Emerald Gear", "textures/items/armor/helmet_emerald")
                  } else {
                    EMERALDARMOURS.button("Emerald Gear", "textures/ui/form/locked_armour")
                  }
                  if (player.hasTag('dungeons:collected_opulent_armour')) {
                    EMERALDARMOURS.button("Opulent Armour", "textures/items/armor/helmet_opulent")
                  } else {
                    EMERALDARMOURS.button("Opulent Armour", "textures/ui/form/locked_armour")
                  }
                  if (player.hasTag('dungeons:collected_gilded_glory_armour')) {
                    EMERALDARMOURS.button("Gilded Glory", "textures/items/armor/helmet_gilded_glory")
                  } else {
                    EMERALDARMOURS.button("Gilded Glory", "textures/ui/form/locked_armour")
                  }
                  EMERALDARMOURS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_emerald_armour')) break;
                        let EMERALDARMOURS1 = new ActionFormData();
                        EMERALDARMOURS1.title("Emerald Armour");
                        EMERALDARMOURS1.body("Legend says as you wear the Emerald Armor during your adventures, it calls magical energy to you as if by chance.\n\n Defeated mobs grant bonus experience\n Total Protection : \n Avg Durability : 303");
                        EMERALDARMOURS1.button("Close")
                        EMERALDARMOURS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_opulent_armour')) break;
                        let EMERALDARMOURS2 = new ActionFormData();
                        EMERALDARMOURS2.title("Opulent Armour");
                        EMERALDARMOURS2.body("Opulent Armor, originally designed more for show than for combat, thrives in the presence of magical experience.\n\n Defeated mobs grant bonus experience\n Levelling up grants damage immunity\n Total Protection : x22\n Avg Durability : 703");
                        EMERALDARMOURS2.button("Close")
                        EMERALDARMOURS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_gilded_glory_armour')) break;
                        let EMERALDARMOURS3 = new ActionFormData();
                        EMERALDARMOURS3.title("Gilded Glory");
                        EMERALDARMOURS3.body("Even death itself has to pause and admire the charms of the legendary Gilded Glory armor.\n\n Defeated mobs grant bonus experience\n Converts levels into health when wounded\n Total Protection : x22\n Avg Durability : 703");
                        EMERALDARMOURS3.button("Close")
                        EMERALDARMOURS3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 4:
                  if (!player.hasTag('dungeons:collected_piglin_armour')) break;
                  let PIGLINARMOURS = new ActionFormData();
                  PIGLINARMOURS.title("Piglin Armours");
                  PIGLINARMOURS.body("These armours were worn by ancient savages of the Nether tribes.\n\n");
                  if (player.hasTag('dungeons:collected_piglin_armour')) {
                    PIGLINARMOURS.button("Piglin Gear", "textures/items/armor/helmet_piglin")
                  } else {
                    PIGLINARMOURS.button("Piglin Gear", "textures/ui/form/locked_armour")
                  }
                  if (player.hasTag('dungeons:collected_golden_piglin_armour')) {
                    PIGLINARMOURS.button("Golden Piglin Armour", "textures/items/armor/helmet_golden_piglin")
                  } else {
                    PIGLINARMOURS.button("Golden Piglin Armour", "textures/ui/form/locked_armour")
                  }
                  PIGLINARMOURS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_piglin_armour')) break;
                        let PIGLINARMOURS1 = new ActionFormData();
                        PIGLINARMOURS1.title("Piglin Armour");
                        PIGLINARMOURS1.body("Wearing the Piglin Armor is almost enough to make one feel at home in the Nether. Almost.\n\n Total Protection : \n Avg Durability : 138");
                        PIGLINARMOURS1.button("Close")
                        PIGLINARMOURS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_golden_piglin_armour')) break;
                        let PIGLINARMOURS2 = new ActionFormData();
                        PIGLINARMOURS2.title("Golden Piglin Armour");
                        PIGLINARMOURS2.body("The Golden Piglin Armor combines a piglin's two favorite things: not dying and gold.\n\n Replenishes health from (non-soul) artefact use\n Total Protection : x20\n Avg Durability : 288");
                        PIGLINARMOURS2.button("Close")
                        PIGLINARMOURS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 5:
                  if (!player.hasTag('dungeons:collected_thief_armour')) break;
                  let THIEFARMOURS = new ActionFormData();
                  THIEFARMOURS.title("Thief Armours");
                  THIEFARMOURS.body("These armours have long seen use by crooks and outcasts.\n\n -25%% Attack Cooldown Duration");
                  if (player.hasTag('dungeons:collected_thief_armour')) {
                    THIEFARMOURS.button("Thief Armour", "textures/items/armor/helmet_thief")
                  } else {
                    THIEFARMOURS.button("Thief Armour", "textures/ui/form/locked_armour")
                  }
                  if (player.hasTag('dungeons:collected_spider_armour')) {
                    THIEFARMOURS.button("Spider Armour", "textures/items/armor/helmet_spider")
                  } else {
                    THIEFARMOURS.button("Spider Armour", "textures/ui/form/locked_armour")
                  }
                  THIEFARMOURS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_thief_armour')) break;
                        let THIEFARMOURS1 = new ActionFormData();
                        THIEFARMOURS1.title("Thief Armour");
                        THIEFARMOURS1.body("This armour is light, nimble, and smells faintly of sulfur.\n\n -25%% Weapon Cooldown Duration\n Total Protection : \n Avg Durability : 186");
                        THIEFARMOURS1.button("Close")
                        THIEFARMOURS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_spider_armour')) break;
                        let THIEFARMOURS2 = new ActionFormData();
                        THIEFARMOURS2.title("Spider Armour");
                        THIEFARMOURS2.body("Spider Armour, created by master thieves, is inspired by the agile talents of the spider.\n\n -25%% Weapon Cooldown Duration\n Steals 7% of health you damage from mobs\n\n Total Protection : x17\n Avg Durability : 409");
                        THIEFARMOURS2.button("Close")
                        THIEFARMOURS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 6:
                  if (!player.hasTag('dungeons:collected_evocation_armour')) break;
                  let EVOCATIONARMOURS = new ActionFormData();
                  EVOCATIONARMOURS.title("Evocation Robes");
                  EVOCATIONARMOURS.body("Brave soul-channellers once wore these fine robes.\n\n -30%% Artefact Cooldown Duration");
                  if (player.hasTag('dungeons:collected_evocation_armour')) {
                    EVOCATIONARMOURS.button("Evocation Robes", "textures/items/armor/helmet_evocation")
                  } else {
                    EVOCATIONARMOURS.button("Evocation Robes", "textures/ui/form/locked_armour")
                  }
                  if (player.hasTag('dungeons:collected_ember_armour')) {
                    EVOCATIONARMOURS.button("Ember Robes", "textures/items/armor/helmet_ember")
                  } else {
                    EVOCATIONARMOURS.button("Ember Robes", "textures/ui/form/locked_armour")
                  }
                  if (player.hasTag('dungeons:collected_verdant_armour')) {
                    EVOCATIONARMOURS.button("Verdant Robes", "textures/items/armor/helmet_verdant")
                  } else {
                    EVOCATIONARMOURS.button("Verdant Robes", "textures/ui/form/locked_armour")
                  }
                  EVOCATIONARMOURS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_evocation_armour')) break;
                        let EVOCATIONARMOURS1 = new ActionFormData();
                        EVOCATIONARMOURS1.title("Evocation Robes");
                        EVOCATIONARMOURS1.body("Potent magical runes are weaved into the fabric of these robes, their origins and powers are shrouded in mystery.\n\n -30%% Artefact Cooldown Duration\n Total Protection : \n Avg Durability : 71");
                        EVOCATIONARMOURS1.button("Close")
                        EVOCATIONARMOURS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_ember_armour')) break;
                        let EVOCATIONARMOURS2 = new ActionFormData();
                        EVOCATIONARMOURS2.title("Ember Robes");
                        EVOCATIONARMOURS2.body("The Ember Robe was created by Illager Evokers to distinguish themselves from the common guard.\n\n -30%% Artefact Cooldown Duration\n Ignites monsters that attack you\n\n Total Protection : x17\n Avg Durability : 371");
                        EVOCATIONARMOURS2.button("Close")
                        EVOCATIONARMOURS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_verdant_armour')) break;
                        let EVOCATIONARMOURS3 = new ActionFormData();
                        EVOCATIONARMOURS3.title("Verdant Robes");
                        EVOCATIONARMOURS3.body("Those who don the Verdant Robe soon find that they can commune with souls more than ever before.\n\n -30%% Artefact Cooldown Duration\n Doubles all collected \n\n Total Protection : x17\n Avg Durability : 371");
                        EVOCATIONARMOURS3.button("Close")
                        EVOCATIONARMOURS3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 7:
                  if (!player.hasTag('dungeons:collected_sprout_armour')) break;
                  let SPROUTARMOURS = new ActionFormData();
                  SPROUTARMOURS.title("Sprout Armours");
                  SPROUTARMOURS.body("This disgusting armour is coated in powerful poisonous spores.\n\n Poisons nearby foes as you sprint");
                  if (player.hasTag('dungeons:collected_sprout_armour')) {
                    SPROUTARMOURS.button("Sprout Armour", "textures/items/armor/helmet_sprout")
                  } else {
                    SPROUTARMOURS.button("Sprout Armour", "textures/ui/form/locked_armour")
                  }
                  if (player.hasTag('dungeons:collected_living_vines_armour')) {
                    SPROUTARMOURS.button("Living Vines Armour", "textures/items/armor/helmet_living_vines")
                  } else {
                    SPROUTARMOURS.button("Living Vines Armour", "textures/ui/form/locked_armour")
                  }
                  SPROUTARMOURS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_sprout_armour')) break;
                        let SPROUTARMOURS1 = new ActionFormData();
                        SPROUTARMOURS1.title("Sprout Armour");
                        SPROUTARMOURS1.body("The dark vines of the Sprout Armour continue to grow even in complete darkness.\n\n Poisons nearby foes as you sprint\n Total Protection : \n Avg Durability : 136");
                        SPROUTARMOURS1.button("Close")
                        SPROUTARMOURS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_living_vines_armour')) break;
                        let SPROUTARMOURS2 = new ActionFormData();
                        SPROUTARMOURS2.title("Living Vines Armour");
                        SPROUTARMOURS2.body("This armour is made from the living vines of a plant which grows only on the battlefield.\n\n Poisons nearby foes as you sprint\n Steals 50%% of health from mobs taking poison damage\n\n Total Protection : x16\n Avg Durability : 445");
                        SPROUTARMOURS2.button("Close")
                        SPROUTARMOURS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 8:
                  if (!player.hasTag('dungeons:collected_root_rot_armour')) break;
                  let ROOTARMOURS = new ActionFormData();
                  ROOTARMOURS.title("Root Rot Armours");
                  ROOTARMOURS.body("Armour like this was formed by roots and plants overtaking the armour of fallen worries.\n\n Replenishes hunger from artefact use");
                  if (player.hasTag('dungeons:collected_root_rot_armour')) {
                    ROOTARMOURS.button("Root Rot Armour", "textures/items/armor/helmet_root_rot")
                  } else {
                    ROOTARMOURS.button("Root Rot Armour", "textures/ui/form/locked_armour")
                  }
                  if (player.hasTag('dungeons:collected_black_spot_armour')) {
                    ROOTARMOURS.button("Black Spot Armour", "textures/items/armor/helmet_black_spot")
                  } else {
                    ROOTARMOURS.button("Black Spot Armour", "textures/ui/form/locked_armour")
                  }
                  ROOTARMOURS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_root_rot_armour')) break;
                        let ROOTARMOURS1 = new ActionFormData();
                        ROOTARMOURS1.title("Root Rot Armour");
                        ROOTARMOURS1.body("Twisted roots form this aberrant armour, it's malevolent nature evident.\n\n Replenishes hunger from (non-soul) artefact use\n\n Total Protection : \n Avg Durability : 237");
                        ROOTARMOURS1.button("Close")
                        ROOTARMOURS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_black_spot_armour')) break;
                        let ROOTARMOURS2 = new ActionFormData();
                        ROOTARMOURS2.title("Black Spot Armour");
                        ROOTARMOURS2.body("This decaying armour has an unsettling presence, as if it's watching you.\n\n Replenishes hunger from (non-soul) artefact use\n Replenishes health from (non-soul) artefact use\n\n Total Protection : x19\n Avg Durability : 633");
                        ROOTARMOURS2.button("Close")
                        ROOTARMOURS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 9:
                  if (!player.hasTag('dungeons:collected_wolf_armour')) break;
                  let WOLFARMOURS = new ActionFormData();
                  WOLFARMOURS.title("Wolf Armours");
                  WOLFARMOURS.body("These barbaric sets of armour were invented by a fierce tribe from ancient times.\n\n");
                  if (player.hasTag('dungeons:collected_wolf_armour')) {
                    WOLFARMOURS.button("Wolf Armour", "textures/items/armor/helmet_wolf")
                  } else {
                    WOLFARMOURS.button("Wolf Armour", "textures/ui/form/locked_armour")
                  }
                  if (player.hasTag('dungeons:collected_black_wolf_armour')) {
                    WOLFARMOURS.button("Black Wolf Armour", "textures/items/armor/helmet_black_wolf")
                  } else {
                    WOLFARMOURS.button("Black Wolf Armour", "textures/ui/form/locked_armour")
                  }
                  if (player.hasTag('dungeons:collected_fox_armour')) {
                    WOLFARMOURS.button("Fox Armour", "textures/items/armor/helmet_fox")
                  } else {
                    WOLFARMOURS.button("Fox Armour", "textures/ui/form/locked_armour")
                  }
                  WOLFARMOURS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_wolf_armour')) break;
                        let WOLFARMOURS1 = new ActionFormData();
                        WOLFARMOURS1.title("Wolf Armour");
                        WOLFARMOURS1.body("Many warriors wear the heads of wolves into battle to strike fear into the hearts of their enemies.\n\n Total Protection : \n Avg Durability : 101");
                        WOLFARMOURS1.button("Close")
                        WOLFARMOURS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_black_wolf_armour')) break;
                        let WOLFARMOURS2 = new ActionFormData();
                        WOLFARMOURS2.title("Black Wolf Armour");
                        WOLFARMOURS2.body("The wolf who strikes from the shadows lives to tell the tale.\n\n Boosts attack power\n\n Total Protection : x16\n Avg Durability : 502");
                        WOLFARMOURS2.button("Close")
                        WOLFARMOURS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 2:
                        if (!player.hasTag('dungeons:collected_fox_armour')) break;
                        let WOLFARMOURS3 = new ActionFormData();
                        WOLFARMOURS3.title("Fox Armour");
                        WOLFARMOURS3.body("Ancient Villager tribes created this armour to honor the fox, who is a great and agile warrior.\n\n +20%% Speed while sprinting\n\n Total Protection : x16\n Avg Durability : 502");
                        WOLFARMOURS3.button("Close")
                        WOLFARMOURS3.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 10:
                  if (!player.hasTag('dungeons:collected_ocelot_armour')) break;
                  let OCELOTARMOURS = new ActionFormData();
                  OCELOTARMOURS.title("Ocelot Armours");
                  OCELOTARMOURS.body("These garments are said to be some of the oldest sets of armour discovered.\n\n");
                  if (player.hasTag('dungeons:collected_ocelot_armour')) {
                    OCELOTARMOURS.button("Ocelot Armour", "textures/items/armor/helmet_ocelot")
                  } else {
                    OCELOTARMOURS.button("Ocelot Armour", "textures/ui/form/locked_armour")
                  }
                  if (player.hasTag('dungeons:collected_shadow_walker_armour')) {
                    OCELOTARMOURS.button("Shadow Walker", "textures/items/armor/helmet_shadow_walker")
                  } else {
                    OCELOTARMOURS.button("Shadow Walker", "textures/ui/form/locked_armour")
                  }
                  OCELOTARMOURS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_ocelot_armour')) break;
                        let OCELOTARMOURS1 = new ActionFormData();
                        OCELOTARMOURS1.title("Ocelot Armour");
                        OCELOTARMOURS1.body("You feel a rush of pure adrenaline surge through your body when you wear this Ocelot's pelt.\n\n Total Protection : \n Avg Durability : 138");
                        OCELOTARMOURS1.button("Close")
                        OCELOTARMOURS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_shadow_walker_armour')) break;
                        let OCELOTARMOURS2 = new ActionFormData();
                        OCELOTARMOURS2.title("Shadow Walker");
                        OCELOTARMOURS2.body("The legendary black Ocelot was as graceful as it was deadly. When you wear its pelt, you feel like your enemies are left chasing your shadow.\n\n +60%% Damage Reduction while sprinting\n\n Total Protection : x18\n Avg Durability : 413");
                        OCELOTARMOURS2.button("Close")
                        OCELOTARMOURS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;

                case 11:
                  if (!player.hasTag('dungeons:collected_turtle_armour')) break;
                  let TURTLEARMOURS = new ActionFormData();
                  TURTLEARMOURS.title("Turtle Armours");
                  TURTLEARMOURS.body("Who doesn't want to look like a turtle? The sturdy shell definitely adds to any look\n\n +33%% Healing Aura");
                  if (player.hasTag('dungeons:collected_turtle_armour')) {
                    TURTLEARMOURS.button("Turtle Armour", "textures/items/armor/helmet_turtle")
                  } else {
                    TURTLEARMOURS.button("Turtle Armour", "textures/ui/form/locked_armour")
                  }
                  if (player.hasTag('dungeons:collected_nimble_turtle_armour')) {
                    TURTLEARMOURS.button("Nimble Turtle Armour", "textures/items/armor/helmet_nimble_turtle")
                  } else {
                    TURTLEARMOURS.button("Nimble Turtle Armour", "textures/ui/form/locked_armour")
                  }
                  TURTLEARMOURS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_turtle_armour')) break;
                        let TURTLEARMOURS1 = new ActionFormData();
                        TURTLEARMOURS1.title("Turtle Armour");
                        TURTLEARMOURS1.body("The Turtle Armor is inspired by the hardy and protective shell of the humble turtle.\n\n +33%% Healing Aura\n\n Total Protection : \n Avg Durability : 414");
                        TURTLEARMOURS1.button("Close")
                        TURTLEARMOURS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_nimble_turtle_armour')) break;
                        let TURTLEARMOURS2 = new ActionFormData();
                        TURTLEARMOURS2.title("Nimble Turtle Armour");
                        TURTLEARMOURS2.body("This armor is made from the dense (but surprisingly light) shells of turtles who lived at crushing depths.\n\n +33%% Healing Aura\n +60%% speed after being injured\n\n Total Protection : x20\n Avg Durability : 655");
                        TURTLEARMOURS2.button("Close")
                        TURTLEARMOURS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 12:
                  if (!player.hasTag('dungeons:collected_squid_armour')) break;
                  let SQUIDARMOURS = new ActionFormData();
                  SQUIDARMOURS.title("Squid Armours");
                  SQUIDARMOURS.body("Outfits like these, made from the slippery skin of a squid, are perfect for ocean encounters \n\n Spews ink to blind attackers");
                  if (player.hasTag('dungeons:collected_squid_armour')) {
                    SQUIDARMOURS.button("Squid Armour", "textures/items/armor/helmet_squid")
                  } else {
                    SQUIDARMOURS.button("Squid Armour", "textures/ui/form/locked_armour")
                  }
                  if (player.hasTag('dungeons:collected_glow_squid_armour')) {
                    SQUIDARMOURS.button("Glow Squid Armour", "textures/items/armor/helmet_glow_squid")
                  } else {
                    SQUIDARMOURS.button("Glow Squid Armour", "textures/ui/form/locked_armour")
                  }
                  SQUIDARMOURS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                    switch (r.selection) {
                      case 0:
                        if (!player.hasTag('dungeons:collected_squid_armour')) break;
                        let SQUIDARMOURS1 = new ActionFormData();
                        SQUIDARMOURS1.title("Squid Armour");
                        SQUIDARMOURS1.body("It was easy to make this jet black armour look cool. The hard part was securing the ink sacs.\n\n Spews ink to blind attackers\n\n Total Protection : \n Avg Durability : 180");
                        SQUIDARMOURS1.button("Close")
                        SQUIDARMOURS1.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      case 1:
                        if (!player.hasTag('dungeons:collected_glow_squid_armour')) break;
                        let SQUIDARMOURS2 = new ActionFormData();
                        SQUIDARMOURS2.title("Glow Squid Armour");
                        SQUIDARMOURS2.body("Those who hunt elusive glow squids wear this armour to blend in with their beautiful prey.\n\n Spews ink to blind attackers\n +50%% Damage Immunity time\n\n Total Protection : x17\n Avg Durability : 477");
                        SQUIDARMOURS2.button("Close")
                        SQUIDARMOURS2.show(player).then(r => {
                          player.playSound('item.book.page_turn');
                          if (r.canceled) return;
                        }).catch(e => {
                          console.error(e, e.stack);
                        });
                        break;
                      default:
                    }
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                default:
              }
            }).catch(e => {
              console.error(e, e.stack);
            });
            break;
          case 3:
            let ARTEFACT = new ActionFormData();
            ARTEFACT.title("Artefacts");
            ARTEFACT.body("A mastery of artefacts can be the turn the tide in any battle.");
            if (player.hasTag('dungeons:collected_harvester')) {
              ARTEFACT.button("Harvester", "textures/items/artifact/harvester")
            } else {
              ARTEFACT.button("Harvester", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_satchel_of_elements')) {
              ARTEFACT.button("Satchel of Elements", "textures/items/artifact/satchel_of_elements")
            } else {
              ARTEFACT.button("Satchel of Elements", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_ice_wand')) {
              ARTEFACT.button("Ice Wand", "textures/items/artifact/ice_wand")
            } else {
              ARTEFACT.button("Ice Wand", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_lightning_rod')) {
              ARTEFACT.button("Lightning Wand", "textures/items/artifact/lightning_rod")
            } else {
              ARTEFACT.button("Lightning Wand", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_scatter_mines')) {
              ARTEFACT.button("Scatter Mines", "textures/items/artifact/scatter_mines")
            } else {
              ARTEFACT.button("Scatter Mines", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_blast_fungus')) {
              ARTEFACT.button("Blast Fungus", "textures/items/artifact/blast_fungus")
            } else {
              ARTEFACT.button("Blast Fungus", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_eye_of_the_guardian')) {
              ARTEFACT.button("Eye of the Guardian", "textures/items/artifact/eye_of_the_guardian")
            } else {
              ARTEFACT.button("Eye of the Guardian", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_updraft_tome')) {
              ARTEFACT.button("Updraft Tome", "textures/items/artifact/updraft_tome")
            } else {
              ARTEFACT.button("Updraft Tome", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_soul_healer')) {
              ARTEFACT.button("Soul Healer", "textures/items/artifact/soul_healer")
            } else {
              ARTEFACT.button("Soul Healer", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_totem_of_regeneration')) {
              ARTEFACT.button("Totem of Regeneration", "textures/items/artifact/totem_regen")
            } else {
              ARTEFACT.button("Totem of Regeneration", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_iron_hide_amulet')) {
              ARTEFACT.button("Iron Hide Amulet", "textures/items/artifact/iron_hide")
            } else {
              ARTEFACT.button("Iron Hide Amulet", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_death_cap_mushroom')) {
              ARTEFACT.button("Death Cap Mushroom", "textures/items/artifact/death_cap")
            } else {
              ARTEFACT.button("Death Cap Mushroom", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_boots_of_swiftness')) {
              ARTEFACT.button("Boots of Swiftness", "textures/items/artifact/boots_swiftness")
            } else {
              ARTEFACT.button("Boots of Swiftness", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_light_feather')) {
              ARTEFACT.button("Light Feather", "textures/items/artifact/light_feather")
            } else {
              ARTEFACT.button("Light Feather", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_totem_of_shielding')) {
              ARTEFACT.button("Totem of Shielding", "textures/items/artifact/totem_shield")
            } else {
              ARTEFACT.button("Totem of Shielding", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_totem_of_casting')) {
              ARTEFACT.button("Totem of Casting", "textures/items/artifact/totem_casting")
            } else {
              ARTEFACT.button("Totem of Casting", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_satchel_of_snacks')) {
              ARTEFACT.button("Satchel of Snacks", "textures/items/artifact/satchel_of_snacks")
            } else {
              ARTEFACT.button("Satchel of Snacks", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_satchel_of_elixirs')) {
              ARTEFACT.button("Satchel of Elixirs", "textures/items/artifact/satchel_of_elixirs")
            } else {
              ARTEFACT.button("Satchel of Elixirs", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_powershaker')) {
              ARTEFACT.button("Powershaker", "textures/items/artifact/powershaker")
            } else {
              ARTEFACT.button("Powershaker", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_shadow_shifter')) {
              ARTEFACT.button("Shadow Shifter", "textures/items/artifact/shadow_shifter")
            } else {
              ARTEFACT.button("Shadow Shifter", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_shock_powder')) {
              ARTEFACT.button("Shock Powder", "textures/items/artifact/shock_powder")
            } else {
              ARTEFACT.button("Shock Powder", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_gong_of_weakening')) {
              ARTEFACT.button("Gong of Weakening", "textures/items/artifact/gong_weakening")
            } else {
              ARTEFACT.button("Gong of Weakening", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_wind_horn')) {
              ARTEFACT.button("Wind Horn", "textures/items/artifact/wind_horn")
            } else {
              ARTEFACT.button("Wind Horn", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_corrupted_seeds')) {
              ARTEFACT.button("Corrupted Seeds", "textures/items/artifact/corrupted_seeds")
            } else {
              ARTEFACT.button("Corrupted Seeds", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_enchanters_tome')) {
              ARTEFACT.button("Enchanters Tome", "textures/items/artifact/enchanters_tome")
            } else {
              ARTEFACT.button("Enchanters Tome", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_enchanted_grass')) {
              ARTEFACT.button("Enchanted Grass", "textures/items/artifact/enchanted_grass")
            } else {
              ARTEFACT.button("Enchanted Grass", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_buzzy_nest')) {
              ARTEFACT.button("Buzzy Nest", "textures/items/artifact/buzzy_nest")
            } else {
              ARTEFACT.button("Buzzy Nest", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_golem_kit')) {
              ARTEFACT.button("Golem Kit", "textures/items/artifact/golem_kit")
            } else {
              ARTEFACT.button("Golem Kit", "textures/ui/form/locked_artefact")
            }
            if (player.hasTag('dungeons:collected_vexing_chant')) {
              ARTEFACT.button("Vexing Chant", "textures/items/artifact/vexing_chant")
            } else {
              ARTEFACT.button("Vexing Chant", "textures/ui/form/locked_artefact")
            }
            ARTEFACT.show(player).then(r => {
              player.playSound('item.book.page_turn');
              if (r.canceled) return;
              switch (r.selection) {
                case 0:
                  if (!player.hasTag('dungeons:collected_harvester')) break;
                  let HARVESTER = new ActionFormData();
                  HARVESTER.title("Harvester");
                  HARVESTER.body("The Harvester siphons the souls of the dead, before releasing them into a cluster hex of power.\n\n Creates a huge magical explosion\n Consumes 15 \n Cooldown : 4s\n\n Damage : \n Rare Damage : ");
                  HARVESTER.button("Close")
                  HARVESTER.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 1:
                  if (!player.hasTag('dungeons:collected_satchel_of_elements')) break;
                  let SATCHELELEMENTS = new ActionFormData();
                  SATCHELELEMENTS.title("Satchel of Elements");
                  SATCHELELEMENTS.body("Mysteries surround this primordial satchel. Will it unleash fire, ice, or something a lot less nice?\n\n Will either slow down, catch fire to, or strike lightning damage onto 7 nearby foes\n\n Cooldown : 12s\n Rare Cooldown : 9s");
                  SATCHELELEMENTS.button("Close")
                  SATCHELELEMENTS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 2:
                  if (!player.hasTag('dungeons:collected_ice_wand')) break;
                  let ICEWAND = new ActionFormData();
                  ICEWAND.title("Ice Wand");
                  ICEWAND.body("The Ice Wand was trapped in a tomb of ice for ages, sealed away by those who feared its power.\n\n Creates large ice blocks that can crush your foe.\n Damage : \n Stun Duration : 1s\n\n Cooldown : 15s\n Rare Cooldown : 10s");
                  ICEWAND.button("Close")
                  ICEWAND.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 3:
                  if (!player.hasTag('dungeons:collected_lightning_rod')) break;
                  let LIGHTNINGROD = new ActionFormData();
                  LIGHTNINGROD.title("Lightning Wand");
                  LIGHTNINGROD.body("Crafted by Illager Geomancers, this item is enchanted with the power of a storming sky.\n\n Strikes arcane lightning around a nearby foe\n Consumes 8 \n Cooldown : 2s\n\n Damage : \n Rare Damage : ");
                  LIGHTNINGROD.button("Close")
                  LIGHTNINGROD.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 4:
                  if (!player.hasTag('dungeons:collected_scatter_mines')) break;
                  let SCATTERMINES = new ActionFormData();
                  SCATTERMINES.title("Scatter Mines");
                  SCATTERMINES.body("Set your enemies up for a surprise of a lifetime with the explosive power of Scatter Mines.\n\n Places 3 explosive mines that deal huge damage when stepped on\n Damage : \n Cooldown : 40s\n Rare Cooldown : 32s");
                  SCATTERMINES.button("Close")
                  SCATTERMINES.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 5:
                  if (!player.hasTag('dungeons:collected_blast_fungus')) break;
                  let BLASTFUNGUS = new ActionFormData();
                  BLASTFUNGUS.title("Blast Fungus");
                  BLASTFUNGUS.body("Only the bravest of warriors carry the Blast Fungus. Not just because of its toxic spores, but because it smells awful.\n\n Launches 3 rolling fungi that explode shortly after tossing them\n Damage : \n Cooldown : 18s\n Rare Cooldown : 14s");
                  BLASTFUNGUS.button("Close")
                  BLASTFUNGUS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 6:
                  if (!player.hasTag('dungeons:collected_eye_of_the_guardian')) break;
                  let GUARDIANEYE = new ActionFormData();
                  GUARDIANEYE.title("Eye of the Guardian");
                  GUARDIANEYE.body("The Eye of the Guardian holds a power that awakens in the hands of a worthy hero.\n\n Fires a continuous laser beam\n Cooldown : 15s\n Duration : 3.5s\n Rare Duration : 6s");
                  GUARDIANEYE.button("Close")
                  GUARDIANEYE.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 7:
                  if (!player.hasTag('dungeons:collected_updraft_tome')) break;
                  let UPDRAFTTOME = new ActionFormData();
                  UPDRAFTTOME.title("Updraft Tome");
                  UPDRAFTTOME.body("An ancient book filled with illegible glyphs, you feel a strange breeze as you flip the pages.\n\n Damages up to 7 nearby foes, launching them into the air\n Damage : \n Cooldown : 15s\n Rare Cooldown : 10s");
                  UPDRAFTTOME.button("Close")
                  UPDRAFTTOME.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 8:
                  if (!player.hasTag('dungeons:collected_soul_healer')) break;
                  let SOULHEALER = new ActionFormData();
                  SOULHEALER.title("Soul Healer");
                  SOULHEALER.body("The Soul Healer amulet is cold to the touch and trembles with the power of souls.\n\n Restores health\n Consumes 10 \n Cooldown : 6s\n\n Health Restored : \n Rare Health Restored : ");
                  SOULHEALER.button("Close")
                  SOULHEALER.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 9:
                  if (!player.hasTag('dungeons:collected_totem_of_regeneration')) break;
                  let TOTEMREGEN = new ActionFormData();
                  TOTEMREGEN.title("Totem of Regeneration");
                  TOTEMREGEN.body("This hand-crafted wooden figurine radiates a warmth like that of a crackling campfire, healing those who gather around it.\n\n Places a totem that restores health to those nearby\n Duration : 8s\n\n Cooldown : 30s\n Rare Cooldown : 22s");
                  TOTEMREGEN.button("Close")
                  TOTEMREGEN.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 10:
                  if (!player.hasTag('dungeons:collected_iron_hide_amulet')) break;
                  let IRONHIDE = new ActionFormData();
                  IRONHIDE.title("Iron Hide Amulet");
                  IRONHIDE.body("The Iron Hide Amulet is both ancient and timeless. Sand mysteriously and endlessly slips through the cracks in the iron.\n\n Reduces damage taken by 60%% for a short period\n Cooldown : 25s\n\n Duration : 6s\n Rare Duration : 8s");
                  IRONHIDE.button("Close")
                  IRONHIDE.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 11:
                  if (!player.hasTag('dungeons:collected_death_cap_mushroom')) break;
                  let DEATHCAP = new ActionFormData();
                  DEATHCAP.title("Death Cap Mushroom");
                  DEATHCAP.body("Eaten by daring warriors before battle, the Death Cap Mushroom drives fighters into a frenzy.\n\n Boosts movement speed and attack power\n Cooldown : 40s\n\n Duration : 9s\n Rare Duration : 12s");
                  DEATHCAP.button("Close")
                  DEATHCAP.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 12:
                  if (!player.hasTag('dungeons:collected_boots_of_swiftness')) break;
                  let BOOTSSWIFTNESS = new ActionFormData();
                  BOOTSSWIFTNESS.title("Boots of Swiftness");
                  BOOTSSWIFTNESS.body("Boots blessed with enchantments to allow for swift movements. Useful in uncertain times such as these.\n\n Boosts movement speed\n Cooldown : 5s\n\n Duration : 3.25s\n Rare Duration : 4.5s");
                  BOOTSSWIFTNESS.button("Close")
                  BOOTSSWIFTNESS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 13:
                  if (!player.hasTag('dungeons:collected_light_feather')) break;
                  let LIGHTFEATHER = new ActionFormData();
                  LIGHTFEATHER.title("Light Feather");
                  LIGHTFEATHER.body("No one knows what mysterious creature this feather came from, but it is as beautiful and powerful.\n\n Launches you forward and slows down nearby mobs\n Slowness duration : 1.25s\n\n Cooldown : 5s\n Rare Cooldown : 4s");
                  LIGHTFEATHER.button("Close")
                  LIGHTFEATHER.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 14:
                  if (!player.hasTag('dungeons:collected_totem_of_shielding')) break;
                  let TOTEMSHEILD = new ActionFormData();
                  TOTEMSHEILD.title("Totem of Shielding");
                  TOTEMSHEILD.body("This totem radiates powerful energy that bursts forth as a protective shield around those near it.\n\n Places a totem that reduces damage taken by 80%% for those nearby\n Duration : 7s\n\n Cooldown : 33s\n Rare Cooldown : 25s");
                  TOTEMSHEILD.button("Close")
                  TOTEMSHEILD.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 15:
                  if (!player.hasTag('dungeons:collected_totem_of_casting')) break;
                  let TOTEMCAST = new ActionFormData();
                  TOTEMCAST.title("Totem of Casting");
                  TOTEMCAST.body("All who are near this totem feel an invigorating aura around their artefacts.\n\n Places a totem that reduces artefact cooldown lengths by 70%% for those nearby\n Consumes 15 \n Duration : 7.5s\n\n Cooldown : 15s\n Rare Cooldown : 12s");
                  TOTEMCAST.button("Close")
                  TOTEMCAST.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 16:
                  if (!player.hasTag('dungeons:collected_satchel_of_snacks')) break;
                  let SATCHELSNACKS = new ActionFormData();
                  SATCHELSNACKS.title("Satchel of Snacks");
                  SATCHELSNACKS.body("The Satchel of Snacks provides a treat when you need it the most!\n\n Restores health and hunger on use\n Cooldown : 25s\n\n Health Restored :  - \n Rare Health Restored :  - ");
                  SATCHELSNACKS.button("Close")
                  SATCHELSNACKS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 17:
                  if (!player.hasTag('dungeons:collected_satchel_of_elixirs')) break;
                  let SATCHELELIXIRS = new ActionFormData();
                  SATCHELELIXIRS.title("Satchel of Elixirs");
                  SATCHELELIXIRS.body("The Satchel of Elixirs always contains the exact potions you need! (Well, atleast, the exact potions it thinks you need, which is still pretty helpful.)\n\n Grants a random potion effect on use\n Speed Duration : 25s\n Strength Duration : 20s\n Shadow Form Duration : 10s\n\n Cooldown : 30s\n Rare Cooldown : 22s");
                  SATCHELELIXIRS.button("Close")
                  SATCHELELIXIRS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 18:
                  if (!player.hasTag('dungeons:collected_powershaker')) break;
                  let POWERSHAKER = new ActionFormData();
                  POWERSHAKER.title("Powershaker");
                  POWERSHAKER.body("The Powershaker is a smashing good time, though it may not be as fun for your enemies.\n\n Grants a powerful area damage to up to 5 attacks\n Area Damage : 66%% of melee\n Cooldown : 30s\n\n Duration : 10s\n Rare Duration : 15s");
                  POWERSHAKER.button("Close")
                  POWERSHAKER.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 19:
                  if (!player.hasTag('dungeons:collected_shadow_shifter')) break;
                  let SHADOWSHIFTER = new ActionFormData();
                  SHADOWSHIFTER.title("Shadow Shifter");
                  SHADOWSHIFTER.body("The Shadow Shifter grants you Shadow Form, which allows you to stay out of sight.\n\n Grants shadow form, making you invisible and extremely powerful until your next strike\n Consumes 4 \n Cooldown : 15s\n\n Duration : 14s\n Rare Duration : 19s");
                  SHADOWSHIFTER.button("Close")
                  SHADOWSHIFTER.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 20:
                  if (!player.hasTag('dungeons:collected_shock_powder')) break;
                  let SHOCKPOWDER = new ActionFormData();
                  SHOCKPOWDER.title("Shock Powder");
                  SHOCKPOWDER.body("Shock Powder is a reliable tool for those who wish to make a swift exit.\n\n Prevents nearby foes from moving on the ground\n Cooldown : 15s\n\n Duration : 4s\n Rare Duration : 6s");
                  SHOCKPOWDER.button("Close")
                  SHOCKPOWDER.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 21:
                  if (!player.hasTag('dungeons:collected_gong_of_weakening')) break;
                  let GONGWEAKENING = new ActionFormData();
                  GONGWEAKENING.title("Gong of Weakening");
                  GONGWEAKENING.body("This ancient gong, marked with the symbols of a nameless kingdom, feels safe in your hands but emits a menacing hum to those nearby.\n\n Reduces enemy attack strength\n Cooldown : 25s\n\n Duration : 7s\n Rare Duration : 10s");
                  GONGWEAKENING.button("Close")
                  GONGWEAKENING.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 22:
                  if (!player.hasTag('dungeons:collected_wind_horn')) break;
                  let WINDHORN = new ActionFormData();
                  WINDHORN.title("Wind Horn");
                  WINDHORN.body("When the Wind Horn echoes throughout the forests of the Overworld the creatures of the night tremble with fear.\n\n Launches those nearby away from you and inflicts slowness\n Cooldown : 10s\n\n Launch Strength : 1.6\n Rare Launch Strength : 2");
                  WINDHORN.button("Close")
                  WINDHORN.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 23:
                  if (!player.hasTag('dungeons:collected_corrupted_seeds')) break;
                  let CORRUPTEDSEEDS = new ActionFormData();
                  CORRUPTEDSEEDS.title("Corrupted Seeds");
                  CORRUPTEDSEEDS.body("A pouch of poisonous, corrupted seeds which grow into spiky grapple vines, entangling and slowly draining the life from its victims.\n\n Stuns and poisons nearby foes\n Stuns for : 2s\n Poisons for : 4s\n\n Cooldown : 15s\n Rare Cooldown : 12s");
                  CORRUPTEDSEEDS.button("Close")
                  CORRUPTEDSEEDS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 24:
                  if (!player.hasTag('dungeons:collected_enchanters_tome')) break;
                  let ENCHANTERSTOME = new ActionFormData();
                  ENCHANTERSTOME.title("Enchanters Tome");
                  ENCHANTERSTOME.body("Meant only to be wielded by Enchanters, the magic of this artifact can summon powerful enchantments.\n\n Enchants nearby mobs you have summoned\n Health & Attack Modifier : 2x\n Speed Modifier : 1.2x\n\n Cooldown : 25s\n Rare Cooldown : 10s");
                  ENCHANTERSTOME.button("Close")
                  ENCHANTERSTOME.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 25:
                  if (!player.hasTag('dungeons:collected_enchanted_grass')) break;
                  let ENCHANTEDGRASS = new ActionFormData();
                  ENCHANTEDGRASS.title("Enchanted Grass");
                  ENCHANTEDGRASS.body("Just as there are powerful heroes who answer the call to fight, there are powerful enchanted sheep who will join the fight when summoned.\n\n Summons a tamed sheep to burn, poison or slow enemies\n Summon Duration : 32s\n Cooldown : 60s\n\n Rare Cooldown : 45s");
                  ENCHANTEDGRASS.button("Close")
                  ENCHANTEDGRASS.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 26:
                  if (!player.hasTag('dungeons:collected_buzzy_nest')) break;
                  let BUZZYNEST = new ActionFormData();
                  BUZZYNEST.title("Buzzy Nest");
                  BUZZYNEST.body("Bee lovers and the bee-loved alike are fans of the Buzzy Nest, but don't be fooled by the cute bees within - they pack a powerful sting!\n\n Places a nest that slowly spawns in tamed bees to the fight\n Summon Duration : 30s\n Cooldown : 50s\n\n Rare Cooldown : 35s");
                  BUZZYNEST.button("Close")
                  BUZZYNEST.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 27:
                  if (!player.hasTag('dungeons:collected_golem_kit')) break;
                  let GOLEMKIT = new ActionFormData();
                  GOLEMKIT.title("Golem Kit");
                  GOLEMKIT.body("Iron Golems have always protected the Villagers of the Overworld. Their numbers are dwindling as a result of the Illager's war.\n\n Summons an iron golem that fights for you\n Summon Duration : 50s\n\n Cooldown : 120s\n Rare Cooldown : 100s");
                  GOLEMKIT.button("Close")
                  GOLEMKIT.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;
                case 28:
                  if (!player.hasTag('dungeons:collected_vexing_chant')) break;
                  let VEXINGCHANT = new ActionFormData();
                  VEXINGCHANT.title("Vexing Chant");
                  VEXINGCHANT.body("Summon Guardian Vexes who will fight by your side for a short while.\n\n Summons 3 friendly vexes to fight enemies\n Summon Duration : 32s\n\n Cooldown : 90s\n Rare Cooldown : 60s");
                  VEXINGCHANT.button("Close")
                  VEXINGCHANT.show(player).then(r => {
                    player.playSound('item.book.page_turn');
                    if (r.canceled) return;
                  }).catch(e => {
                    console.error(e, e.stack);
                  });
                  break;




                default:
                  break;
              }
            }).catch(e => {
              console.error(e, e.stack);
            });
          default:
            break;
        }
      }).catch((e) => {
        console.error(e, e.stack);
      });
    }
  }),
  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:bottle_of_souls', {
    onConsume(e) {
      const player = e.source;

      player.dimension.playSound('ominous_bottle.end_use', player.location);
      let soulGauge = world.scoreboard.getObjective('soulGauge')
      if(soulGauge.getScore(player) >= 100) return;
      soulGauge.setScore(player, 100)
      // player.onScreenDisplay.setActionBar(`§b${soulGauge.getScore(player)}§s Souls `)
        player.dimension.spawnParticle('dungeons:soul2', player.location);
        player.dimension.spawnParticle('dungeons:soul2', player.location);
        player.dimension.spawnParticle('dungeons:soul2', player.location);
        player.dimension.spawnParticle('dungeons:soul2', player.location);
    }
  }),
  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:dynamic_cooldown', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;
      let cd = item.getComponent('cooldown');
      var mult = 1;

      if (player.hasTag('dungeons:evocation_armour') || player.hasTag('dungeons:ember_armour') || player.hasTag('dungeons:verdant_armour')) {
        mult = mult*0.7;
      }

      const totemCasting = player.dimension.getEntities({
        location: player.location,
        maxDistance: 3,
        families: ['totem_casting']
      });

      if (totemCasting.length >= 1) {
        mult = mult*0.3;
      }

      if(mult < 0.1) {
        mult = 0.1;
      }


      player.startItemCooldown(cd.cooldownCategory, Math.floor(cd.cooldownTicks * mult));

      if(!item.hasTag('dungeons:soul_artefact')) {
        if(player.hasTag('dungeons:root_rot_armour')) {
          player.dimension.playSound('random.eat', player.location, {volume: 0.3});
          player.addEffect('saturation', 1, {showParticles: false});
        } else if (player.hasTag('dungeons:black_spot_armour')) {
          player.dimension.playSound('random.eat', player.location, {volume: 0.3});
          let hp = player.getComponent('minecraft:health');
          hp.setCurrentValue(hp.currentValue + 1)
          player.addEffect('saturation', 1, {showParticles: false});
        } else if (player.hasTag('dungeons:golden_piglin_armour')) {
          player.dimension.playSound('random.eat', player.location, {volume: 0.3});
          let hp = player.getComponent('minecraft:health');
          hp.setCurrentValue(hp.currentValue + 1)
        } 
      }

      if (player.hasTag('dungeons:debug')) {
        player.sendMessage(`You have used the ${item.typeId}`);
        player.sendMessage(`Cooldown :§e${cd.cooldownTicks/20}s`);
        if (mult !== 1) {
          player.sendMessage(`Modified Cooldown :§e${Math.floor(cd.cooldownTicks*mult)/20}s`);
          player.sendMessage(`Cooldown Modifier :§b${mult}x`);
        }
      }
    }
  }),
  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:eye_of_the_guardian', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;

      let guardianEye = world.scoreboard.getObjective('guardianEye')

      if(guardianEye.getScore(player) > 0) {
        player.runCommandAsync('function artifact/eye_guardian_fail')
        return;
      }

      guardianEye.setScore(player, 70);
    }
  }),
  initEvent.blockComponentRegistry.registerCustomComponent('connected_glasses:connectedGlassComp', connectedGlassComp),
  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:buzzy_nest', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;

      player.dimension.playSound('jump.stone', player.location, {
        pitch: 0.75
      });

      const nest = player.dimension.spawnEntity('dungeons:buzzy_nest', player.location);

      let tameable = nest.getComponent('minecraft:tameable')
      tameable.tame(player);
    }
  }),
  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:enchanters_tome', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;
      player.dimension.playSound('block.enchanting_table.use', player.location);
      const targets = player.dimension.getEntities({
        location: player.location,
        maxDistance: 16,
        families: ['enchantable_pet']
      });
      for (const mob of targets) {
        const owner = mob.getComponent('minecraft:tameable').tamedToPlayer;
        if (!owner) continue;
        if (owner !== player) continue;
        mob.triggerEvent('dungeons:pet_become_enchanted');
        mob.dimension.spawnParticle('dungeons:enchanted_tome', mob.location);
mob.addEffect('regeneration', 5, {amplifier: 4, showParticles: false});
      }
    }
  }),
  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:rare_eye_of_the_guardian', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;

      item.getComponent('cooldown').startCooldown(player);

      let guardianEye = world.scoreboard.getObjective('guardianEye')

      if(guardianEye.getScore(player) > 0) {
        player.runCommandAsync('function artifact/eye_guardian_fail')
        return;
      }

      guardianEye.setScore(player, 120);
    }
  }),
  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:golem_kit', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;

      player.dimension.playSound('random.anvil_use', player.location, {
        pitch: 0.75
      });

      const nest = player.dimension.spawnEntity('dungeons:pet_iron_golem', player.location);

      let tameable = nest.getComponent('minecraft:tameable')
      tameable.tame(player);
    }
  }),
  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:common_harvester', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;
      const dim = player.dimension;

      let soulGauge = world.scoreboard.getObjective('soulGauge').getScore(player)

      if (soulGauge < 15) {
        player.runCommandAsync('function artifact/harvester_fail')
        return;
      } else {
        player.runCommandAsync('function artifact/harvester_vfx')
      }

      dim.playSound('beacon.activate', player.location, {
        volume: 0.5,
        pitch: 1.8
      });

      dim.spawnParticle('dungeons:harvester_blast', player.location);
      dim.spawnParticle('dungeons:harvester_blast2', player.location);
      system.runTimeout(() => {
        dim.spawnParticle('dungeons:harvester_flames', player.location);

        dim.playSound('shriek.sculk.shrieker', player.location, {
          volume: 0.9,
          pitch: 0.8
        });

        dim.playSound('random.explode', player.location, {
          volume: 1.1,
          pitch: 0.7
        });

        const damageRange = dim.getEntities({
          location: player.location,
          maxDistance: 5,
          excludeFamilies: ['ignore']
        });

        for (const target of damageRange) {
          if (target === player) continue;

          if(target.typeId === 'minecraft:player') {
            target.applyDamage(10, {
              cause: EntityDamageCause.entityExplosion,
              damagingEntity: player
            });
            target.applyDamage(5, {
              cause: EntityDamageCause.magic,
              damagingEntity: player
            });
          } else {
            target.applyDamage(15, {
              cause: EntityDamageCause.magic,
              damagingEntity: player
            });
          }

        }

      }, 6)
    }
  }),

  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:rare_harvester', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;
      const dim = player.dimension;

      let soulGauge = world.scoreboard.getObjective('soulGauge').getScore(player)

      if (soulGauge < 15) {
        player.runCommandAsync('function artifact/harvester_fail')
        return;
      } else {
        player.runCommandAsync('function artifact/harvester_vfx')
      }

      dim.playSound('beacon.activate', player.location, {
        volume: 0.5,
        pitch: 1.8
      });

      dim.spawnParticle('dungeons:harvester_blast', player.location);
      dim.spawnParticle('dungeons:harvester_blast2', player.location);
      system.runTimeout(() => {
        dim.spawnParticle('dungeons:harvester_flames', player.location);

        dim.playSound('shriek.sculk.shrieker', player.location, {
          volume: 0.9,
          pitch: 0.8
        });

        dim.playSound('random.explode', player.location, {
          volume: 1.1,
          pitch: 0.7
        });

        const damageRange = dim.getEntities({
          location: player.location,
          maxDistance: 5.5,
          excludeFamilies: ['ignore']
        });

        for (const target of damageRange) {
          if (target === player) continue;

          if(target.typeId === 'minecraft:player') {
            target.applyDamage(13, {
              cause: EntityDamageCause.entityExplosion,
              damagingEntity: player
            });
            target.applyDamage(7, {
              cause: EntityDamageCause.magic,
              damagingEntity: player
            });
          } else {
            target.applyDamage(20, {
              cause: EntityDamageCause.magic,
              damagingEntity: player
            });
          }

        }

      }, 6)
    }
  }),
  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:common_iron_hide_amulet', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;
      player.dimension.spawnParticle('dungeons:daggers_strike', player.location)
      player.dimension.playSound('random.anvil_land', player.location, {
        volume: 0.7,
        pitch: 0.5
      });
      player.addEffect('resistance', 120, {
        amplifier: 1
      });
    }
  }),
  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:rare_iron_hide_amulet', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;
      player.dimension.spawnParticle('dungeons:daggers_strike', player.location)
      player.dimension.playSound('random.anvil_land', player.location, {
        volume: 0.7,
        pitch: 0.5
      });
      player.addEffect('resistance', 160, {
        amplifier: 1
      });
    }
  }),
  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:light_feather', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;

      player.dimension.playSound('wind_charge.burst', player.location, {
        pitch: 1.5
      });
      if(world.scoreboard.getObjective('shadowTime').getScore(player) == 0) {
       player.playAnimation('animation.player.roll', {
          blendOutTime: 2,
          nextState: 'lightFeather'
        });
      }
      player.dimension.spawnParticle('minecraft:wind_explosion_emitter', player.location);

      const targets = player.dimension.getEntities({
        location: player.location,
        maxDistance: 3.5,
        excludeFamilies: ['ignore']
      });

      for (const target of targets) {
        if (target === player) continue;

        target.addEffect('slowness', 25, {
          amplifier: 4
        });

      }
      player.addEffect('resistance', 25, {
        amplifier: 5,
        showParticles: false
      });

      const velocity = player.getViewDirection();

      if(player.isGliding) {
        player.applyKnockback(velocity.x, velocity.z, 2.5, 0.25);
      } else {
        player.applyKnockback(velocity.x, velocity.z, 5, 0.5);
      }

    }
  }),
  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:common_lightning_rod', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;

      let soulGauge = world.scoreboard.getObjective('soulGauge').getScore(player)

      if (soulGauge < 8) {
        player.runCommandAsync('function artifact/lightning_rod_fail')
        return;
      } else {
        player.runCommandAsync('function artifact/lightning_rod_vfx')
      }

      const entities = player.dimension.getEntities({
        location: player.location,
        maxDistance: 18,
        closest: 16,
        minDistance: 2,
        excludeFamilies: ['ignore']
      });

      if (!entities) return;

      for (const entity of entities) {
        if (!entity.matches({
            families: ['monster']
          }) && !entity.matches({
            families: ['player']
          })) continue;

        const loc = entity.location;
        entity.dimension.spawnParticle('dungeons:lightning_rod_circle_large', loc);
        entity.dimension.playSound('weapon.enchant.thundering', loc, {
          volume: 0.25
        });
        system.runTimeout(() => {
          entity.dimension.playSound('weapon.enchant.thundering', loc, {
            volume: 0.5
          });
        }, 10)
        system.runTimeout(() => {
          entity.dimension.playSound('weapon.enchant.thundering', loc, {
            volume: 1.0,
            pitch: 1.2
          });

          entity.dimension.spawnEntity('minecraft:lightning_bolt', {
            x: loc.x,
            y: loc.y + 1.33,
            z: loc.z
          });

          const damageRange = entity.dimension.getEntities({
            location: loc,
            maxDistance: 2.6,
            excludeFamilies: ['ignore']
          });

          for (const target of damageRange) {
            const damage = 20 - (Math.abs(target.location.x - loc.x) + Math.abs(target.location.y - loc.y) + Math.abs(target.location.z - loc.z));

            target.applyDamage(damage, {
              cause: EntityDamageCause.lightning,
              damagingEntity: player
            });

          }
        }, 20);
        return;
      }
    }
  }),

initEvent.itemComponentRegistry.registerCustomComponent('dungeons:rare_lightning_rod', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;

      let soulGauge = world.scoreboard.getObjective('soulGauge').getScore(player)

      if (soulGauge < 8) {
        player.runCommandAsync('function artifact/lightning_rod_fail')
        return;
      } else {
        player.runCommandAsync('function artifact/lightning_rod_vfx')
      }

      const entities = player.dimension.getEntities({
        location: player.location,
        maxDistance: 16,
        closest: 16,
        minDistance: 2,
        excludeFamilies: ['ignore']
      });

      if (!entities) return;

      for (const entity of entities) {
        if (!entity.matches({
            families: ['monster']
          }) && !entity.matches({
            families: ['player']
          })) continue;

        const loc = entity.location;
        entity.dimension.spawnParticle('dungeons:lightning_rod_circle', loc);
        entity.dimension.playSound('weapon.enchant.thundering', loc, {
          volume: 0.25
        });
        system.runTimeout(() => {
          entity.dimension.playSound('weapon.enchant.thundering', loc, {
            volume: 0.5
          });
        }, 8)
        system.runTimeout(() => {
          entity.dimension.playSound('weapon.enchant.thundering', loc, {
            volume: 1.0,
            pitch: 1.2
          });

          entity.dimension.spawnEntity('minecraft:lightning_bolt', {
            x: loc.x,
            y: loc.y + 1.33,
            z: loc.z
          });

          const damageRange = entity.dimension.getEntities({
            location: loc,
            maxDistance: 2.3,
            excludeFamilies: ['ignore']
          });

          for (const target of damageRange) {
            const damage = 24 - (Math.abs(target.location.x - loc.x) + Math.abs(target.location.y - loc.y) + Math.abs(target.location.z - loc.z));

            target.applyDamage(damage, {
              cause: EntityDamageCause.lightning,
              damagingEntity: player
            });

          }
        }, 16);
        return;
      }
    }
  }),
  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:satchel_of_elixirs', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;

      const potion = Math.ceil(Math.random()*3);

      player.dimension.playSound('bottle.fill', player.location);

      if(potion <= 1) {
        player.dimension.spawnParticle('dungeons:elixir_strength', player.location);
        player.addEffect('strength', 400);
      }
      if(potion == 2) {
        player.dimension.spawnParticle('dungeons:elixir_speed', player.location);
        player.addEffect('speed', 550);
      }
      if(potion == 3) {
        player.dimension.spawnParticle('dungeons:elixir_shadow', player.location);
        player.runCommandAsync('function artifact/shadow_elixir')
      }
    }
  }),
  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:common_satchel_of_snacks', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;

      const healthRand = 3+Math.ceil(Math.random()*3);
      const foodRand = Math.ceil(Math.random()*3);

      player.dimension.playSound('random.eat', player.location);

      let hp = player.getComponent('minecraft:health');
      hp.setCurrentValue(hp.currentValue + healthRand)
      player.addEffect('saturation', foodRand, {showParticles: false});
    }
  }),

  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:rare_satchel_of_snacks', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;

      const healthRand = 4+ Math.ceil(Math.random()*6);
      const foodRand = 3 + Math.ceil(Math.random()*3);

      player.dimension.playSound('random.eat', player.location);

      let hp = player.getComponent('minecraft:health');
      hp.setCurrentValue(hp.currentValue + healthRand)
      player.addEffect('saturation', foodRand, {showParticles: false});
    }
  }),
  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:scatter_mines', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;

      player.dimension.playSound('weapon.enchant.exploding', player.location, {
        pitch: 1.5
      });

      const loc1 = player.dimension.getTopmostBlock({x: player.location.x+1.5, z: player.location.z}, player.location.y).bottomCenter();
      const loc2 = player.dimension.getTopmostBlock({x: player.location.x-1.5, z: player.location.z-1.5}, player.location.y).bottomCenter();
      const loc3 = player.dimension.getTopmostBlock({x: player.location.x-1.5, z: player.location.z+1.5}, player.location.y).bottomCenter();

      if(loc1.y - player.location.y <= 5 && loc1.y - player.location.y >= -5) {
        const mine1 = player.dimension.spawnEntity('dungeons:player_scatter_mine', {x:loc1.x, y:loc1.y+1, z:loc1.z});
        let tameable1 = mine1.getComponent('minecraft:tameable')
        tameable1.tame(player);
      }
      if(loc2.y - player.location.y <= 5 && loc2.y - player.location.y >= -5) {
        const mine2 = player.dimension.spawnEntity('dungeons:player_scatter_mine', {x:loc2.x, y:loc2.y+1, z:loc2.z});
        let tameable2 = mine2.getComponent('minecraft:tameable')
        tameable2.tame(player);
      }
      if(loc3.y - player.location.y <= 5 && loc3.y - player.location.y >= -5) {
        const mine3 = player.dimension.spawnEntity('dungeons:player_scatter_mine', {x:loc3.x, y:loc3.y+1, z:loc3.z});
        let tameable3 = mine3.getComponent('minecraft:tameable')
        tameable3.tame(player);
      }

    }
  }),
  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:common_soul_healer', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;

      let soulGauge = world.scoreboard.getObjective('soulGauge').getScore(player);

      if (soulGauge < 10) {
        player.runCommandAsync('function artifact/soul_healer_fail')
        return;
      } else {
        player.runCommandAsync('function artifact/soul_healer_vfx')
      }

      let hp = player.getComponent('minecraft:health');
      hp.setCurrentValue(hp.currentValue + 8)
    }
  }),

  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:rare_soul_healer', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;

      let soulGauge = world.scoreboard.getObjective('soulGauge').getScore(player);

      if (soulGauge < 10) {
        player.runCommandAsync('function artifact/soul_healer_fail')
        return;
      } else {
        player.runCommandAsync('function artifact/soul_healer_vfx')
      }

      let hp = player.getComponent('minecraft:health');
      hp.setCurrentValue(hp.currentValue + 12)
    }
  }),
  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:common_boots_of_swiftness', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;

          player.dimension.spawnParticle('dungeons:swiftness', player.location)
          player.dimension.playSound('armor.equip_leather', player.location, {
            pitch: 1.5
          });

          player.addEffect('speed', 65, {
            amplifier: 1
          });
    }
  }),

  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:rare_boots_of_swiftness', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;

          player.dimension.spawnParticle('dungeons:swiftness', player.location)
          player.dimension.playSound('armor.equip_leather', player.location, {
            pitch: 1.5
          });

          player.addEffect('speed', 90, {
            amplifier: 1
          });
    }
  }),
  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:totem_casting', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;

      let soulGauge = world.scoreboard.getObjective('soulGauge').getScore(player)

      if (soulGauge < 15) {
        player.runCommandAsync('function artifact/totem_casting_fail')
        return;
      } else {
        player.runCommandAsync('function artifact/totem_casting_vfx')
      }

      player.dimension.playSound('beacon.ambient', player.location, {
        pitch: 0.8
      });

      const nest = player.dimension.spawnEntity('dungeons:totem_of_casting', player.location);
    }
  }),
  initEvent.itemComponentRegistry.registerCustomComponent('dungeons:updraft_tome', {
    onUse(e) {
      const player = e.source;
      const item = e.itemStack;
      const dim = player.dimension;

      dim.playSound('beacon.activate', player.location, {
        volume: 0.5,
        pitch: 1.8
      });
      system.runTimeout(() => {
        dim.playSound('wind_charge.burst', player.location, {
          volume: 0.9,
          pitch: 0.5
        });
        const damageRange = dim.getEntities({
          location: player.location,
          minDistance: 0.5,
          maxDistance: 10,
          closest: 7,
          excludeFamilies: ['inanimate', 'ignore']
        });
        for (const target of damageRange) {
          if (target === player) continue;
          if (!target.matches({
              families: ['monster']
            }) && !target.matches({
              families: ['player']
            })) return;
            target.dimension.spawnParticle('minecraft:wind_explosion_emitter', {x: target.location.x, y: target.location.y+1, z: target.location.z});
          dim.playSound('wind_charge.burst', {x: target.location.x, y: target.location.y+1, z: target.location.z}, {
            volume: 0.9,
            pitch: 1
          });
          target.applyDamage(5, {
            cause: EntityDamageCause.entityExplosion,
            damagingEntity: player
          });
          target.applyKnockback(0, 0, 0, 1.3);
        }
      }, 10)
    }
  }),
  initEvent.itemComponentRegistry.registerCustomComponent(
    "dungeons:rare_powershaker",
    {
      onUse(e) {
        const player = e.source;
        const item = e.itemStack;
        player.dimension.spawnParticle("dungeons:party_flair", player.location);
        player.dimension.playSound("random.fuse", player.location, {
          volume: 0.7,
          pitch: 2.5,
        });
        let timeLeft = world.scoreboard.getObjective("powershaker_t");
        let usesLeft = world.scoreboard.getObjective("powershaker_u");

        if (timeLeft.getScore(player) > 0) {
          player.runCommandAsync("function artifact/powershaker_fail");
          return;
        }

        usesLeft.setScore(player, 5);
        timeLeft.setScore(player, 300);
      },
    }
  )


});