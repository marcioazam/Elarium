import {
  world, system
} from "@minecraft/server";
import {ActionFormData} from "@minecraft/server-ui"
  





// Ouvrir UI
   



                  function final_socks(player) {
                  var form = new ActionFormData()
                    .title("§dInterdimensionals socks")
                    .body("§6+20/Percent movement speed(this effect can be combined with speed potions)\n§6You'll no longer take fall damage\n§6If you fall from at least 6 blocks, you'll create a shockwave on the ground\nYou are faster when you walk on netherrack, nylium,void dust, shulk grass and chorus grass\nSmelt powder snow on your feet\nJump on a chorus cap to be teleported on the one above it\nSneak on a chorus cap to be teleported on the one below it\nSneak and jump to levitate, sneak one more time to fall down\nBoost the dash effect of the dashing stick and divide his cooldown by 2")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                     if (result.selection === 0) {
                     }
                     })}


                function ore_progression(player) {
                  var form = new ActionFormData()
                    .title("Ore progression")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        wiki(player);
                      }
                     })}


                  






                function wiki(player) {
             let form = new ActionFormData()
               .title(" Wiki ")
               .body("Here is the wiki to help you if you're lost in the addon (you'll be lost one day or another)")
               .button("Ore progression", "textures/items/pickaxe/tin_pickaxe")
               .button("Blocks", "textures/ui/blocks") 
               .button("Entities", "textures/ui/entities") 
               .button("Items", "textures/items/netherite_plate") 
               .button("Boss", "textures/ui/abomination_icon")
               .button("Generation", "textures/ui/overworld_icon")
               .button("Bugs", "textures/ui/endermite") 
               .button("Discord", "textures/ui/discord") 
               .button("Add-on informations", "textures/ui/patch_note") 
               form.show(player).then(result => {
                 
                if (result.selection === 0) {
                  ore_progression(player);
                }
                if (result.selection === 1) {
                  blocks(player);
                }
                if (result.selection === 2) {
                  entities(player);
                }
                if (result.selection === 3) {
                  items(player);
                }
                  if (result.selection === 4) {
                  Boss(player);
                }
                if (result.selection === 5) {
                  generation(player);
                }
                if (result.selection === 6) {
                  bugs(player);
                }
                if (result.selection === 7) {
                  discord(player);
                }
                if (result.selection === 8) {
                  credits(player);
                }
                })}

                

                function artifacts(player) {
                  var form = new ActionFormData()
                    .title(" Artifacts  ")
                    .body("§6Modes:\n\n§2Normal mode:§rAfter spawning in the world\n§4Hell mode:§rAfter killing the Abomination\n§5Void mode:§rAfter killing the Ender Dragon\n§4Combined artifacts are not shown here, to see them and their recipes, craft an artifacts assembler")
                    .button("How it works?", "textures/ui/g_cases")
                    .button("§2Normal mode", "textures/ui/normal")
                    .button("§4Hell mode", "textures/ui/hell")
                    .button("§5Void mode", "textures/ui/void")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                       if (result.selection === 0) {
                        how_it_works(player);
                      }
                      if (result.selection === 1) {
                        normalmode(player);
                      }
                      if (result.selection === 2) {
                        hellmode(player);
                     }
                     if (result.selection === 3) {
                      voidmode(player);
                     }
                     if (result.selection === 4) {
                      items(player);
                     }
                     })}

                      function how_it_works(player) {
                  var form = new ActionFormData()
                    .title("  Artifacts  ")
                    .body("For artifacts to works, you need to put them in the golden slots of your inventory\n§4WARNING: Pocket ui isn't supported!! Please activate classic ui")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                     if (result.selection === 0) {
                      artifacts(player);
                     }
                     })}

                function credits(player) {
                  var form = new ActionFormData()
                    .title("Informations")
                    .body("Creators: Enedyx and Efosi\n\nThis add-on is not an add-on pack, almost everything was made from scratch\n\nThis addon use free templates made by the bedrock.dev community \n\n§bIf you're doing a video about the add-on, first thanks :), and please do not create your own link and put a link to the mcpedl page in the description")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                     if (result.selection === 0) {
                      wiki(player);
                     }
                     })}

                function normalmode(player) {
                  var form = new ActionFormData()
                    .title(" Artifacts ")
                    .body("Here is the list of artifacts obtainable in normal mode")
                    .button("Ancient shield", "textures/items/artifacts/ancient_shield")
                    .button("Crystal of bravery", "textures/items/artifacts/crystal_of_bravery")
                    .button("Crystal of youth", "textures/items/artifacts/crystal_of_youth")
                    .button("Crystal of fear", "textures/items/artifacts/crystal_of_fear")
                    .button("Crystal of rage", "textures/items/artifacts/crystal_of_rage")
                    .button("Enchanted socks", "textures/items/artifacts/enchanted_socks")
                    .button("Cloud socks", "textures/items/artifacts/cloud_socks")
                    .button("Heavy socks", "textures/items/artifacts/heavy_socks")
                    .button("Dreamlike pendant", "textures/items/artifacts/insomnia_pendant")
                    .button("The undying flower", "textures/items/artifacts/the_undying_flower")
                    .button("Xp orb", "textures/items/artifacts/xp_core")
                    .button("Sharp spear scroll", "textures/items/artifacts/sharp_spear")
                    .button("Explosive spear scroll", "textures/items/artifacts/explosive_spear")
                    .button("Electrik spear scroll", "textures/items/artifacts/lightning_spear")
                    .button("Long distance spear scroll", "textures/items/artifacts/long_distance_spear")
                    .button("Magic axe", "textures/items/artifacts/magic_axe")
                    .button("Poison absorber", "textures/items/artifacts/poisonous_mucus")
                    .button("Heart in a bottle", "textures/items/artifacts/heart_in_a_bottle")
                    .button("Heavy quiver", "textures/items/artifacts/heavy_quiver")
                    .button("Sculk quiver", "textures/items/artifacts/sculk_quiver")
                    .button("Ring of atlantis", "textures/items/artifacts/ring_of_atlantis")
                    .button("Bewitched firework", "textures/items/artifacts/magnetic_firework")
                    .button("Magnet", "textures/items/artifacts/magnet")
                    .button("Supersonic arrow", "textures/items/artifacts/supersonic_arrow")
                    .button("Sculk portal", "textures/items/artifacts/sculk_portal")
                    .button("Flesh totem", "textures/items/artifacts/bloody_totem")
                    .button("Blood vial", "textures/items/artifacts/blood_vial")
                    .button("Chaining scroll", "textures/items/artifacts/chaining_scroll")
                    .button("Crushing scroll", "textures/items/artifacts/gravity")
                    .button("Upper-cut scroll", "textures/items/artifacts/impulse")
                    .button("Charged hit scroll", "textures/items/artifacts/recoil_scroll")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       ancient(player);
                      }
                      if (result.selection === 1) {
                        brave(player);
                     }
                     if (result.selection === 2) {
                      youth(player);
                   }
                   if (result.selection === 3) {
                    fear(player);
                 }
                       if (result.selection === 4) {
                        rage(player);
                       }
                       if (result.selection === 5) {
                        socks1(player);
                       }
                       if (result.selection === 6) {
                        socks2(player);
                       }
                       if (result.selection === 7) {
                        socks3(player);
                       }
                       if (result.selection === 8) {
                        insomn(player);
                       }
                       if (result.selection === 9) {
                        undying(player);
                       }
                       if (result.selection === 10) {
                        xp(player);
                       }
                       if (result.selection === 11) {
                        sharp(player);
                       }
                       if (result.selection === 12) {
                        explos(player);
                       }
                       if (result.selection === 13) {
                        lightning(player);
                       }
                       if (result.selection === 14) {
                        long(player);
                       }
                       if (result.selection === 15) {
                        magic(player);
                       }
                       if (result.selection === 16) {
                        mucus(player);
                       }
                       if (result.selection === 17) {
                        heart(player);
                       }
                       if (result.selection === 18) {
                        heavy(player);
                       }
                       if (result.selection === 19) {
                        sculk(player);
                       }
                       if (result.selection === 20) {
                       atlantis(player);
                       }
                       if (result.selection === 21) {
                        firework(player);
                        }
                       if (result.selection === 22) {
                        magnet(player);
                       }
                       if (result.selection === 23) {
                        supersonic(player);
                       }
                       if (result.selection === 24) {
                        sculk_portal(player);
                       }
                       if (result.selection === 25) {
                        flesh_totem(player);
                       }
                       if (result.selection === 26) {
                        blood_vial(player);
                       }
                       if (result.selection === 27) {
                        bottle_soul(player);
                       }
                       if (result.selection === 28) {
                        chaining_scroll(player);
                       }
                       if (result.selection === 29) {
                        crushing_scroll(player);
                       }
                       if (result.selection === 30) {
                        uppercut_scroll(player);
                       }
                       if (result.selection === 31) {
                        charged_scroll(player);
                       }
                       if (result.selection === 32) {
                        artifacts(player);
                       }
                     })}
                     
                     function hellmode(player) {
                      var form = new ActionFormData()
                        .title(" Artifacts ")
                        .body("Here is the list of artifacts obtainable in hell mode")
                        .button("Blaze heart", "textures/items/artifacts/blaze_heart")
                        .button("Deadly ruby", "textures/items/artifacts/bloody_ruby")
                        .button("Corrupted star", "textures/items/artifacts/corrupted_star")
                        .button("Golden ring", "textures/items/artifacts/golden_ring")
                        .button("Blue eye", "textures/items/nether/blue_eye_globe")
                        .button("Golden heart in a bottle", "textures/items/artifacts/golden_heart_bottle")
                        .button("Magma socks", "textures/items/artifacts/magma_socks")
                        .button("Molten ingot", "textures/items/artifacts/molten_ingot")
                        .button("Wither bramble", "textures/items/artifacts/bloody_bramble")
                        .button("Back", "textures/ui/close")
    
                        form.show(player).then(result => {
                          if (result.selection === 0) {
                           blaze(player);
                          }
                          if (result.selection === 1) {
                            deadlyr(player);
                         }
                         if (result.selection === 2) {
                          corrupt(player);
                       }
                       if (result.selection === 3) {
                        ring(player);
                     }
                           if (result.selection === 4) {
                            eye(player);
                           }
                           if (result.selection === 5) {
                            gheart(player);
                           }
                           if (result.selection === 6) {
                           magma(player);
                           }
                           if (result.selection === 7) {
                            molten(player);
                           }
                           if (result.selection === 8) {
                            bloody_bramble(player);
                           }
                           if (result.selection === 9) {
                            artifacts(player);
                           }
                         })}

                         function voidmode(player) {
                          var form = new ActionFormData()
                            .title(" Artifacts ")
                            .body("Here is the list of artifacts obtainable in void mode")
                            .button("Dragon heart", "textures/items/artifacts/dragon_heart")
                            .button("Battle cry orb", "textures/items/artifacts/battle_cry_orb")
                            .button("Chorus socks", "textures/items/artifacts/chorus_socks")
                            .button("Purpur socks", "textures/items/artifacts/purpur_socks")
                            .button("Void socks", "textures/items/artifacts/void_socks")
                            .button("Void cloak", "textures/items/artifacts/void_cloak")
                            .button("Back", "textures/ui/close")
        
                            form.show(player).then(result => {
                              if (result.selection === 0) {
                              dragonheart(player);
                              }
                              if (result.selection === 1) {
                                battlecry(player);
                             }
                             if (result.selection === 2) {
                              chorus_socks(player);
                             }
                             if (result.selection === 3) {
                              purpur_socks(player);
                             }
                             if (result.selection === 4) {
                              void_socks(player);
                             }
                             if (result.selection === 5) {
                              voidcloak(player);
                             }
                            
                               
                               if (result.selection === 6) {
                                artifacts(player);
                               }
                             })}







         function coins(player) {
             var form = new ActionFormData()
               .title(" Coins ")
               .body("Coins are usefull to buy things to villagers, with coins, villager's prices are more fair.\nHere's how you can get coins:\n-Killing monsters\n-Trading with villagers\n-Killing bosses\n\nYou can convert coins by using them:\n-10 copper coins -> 1 tin coin\n-10 tin coins -> 1 iron coin\nWell... I think you understood\n\nYou can convert in the other way by sneaking + using the coin")
               .button("Back", "textures/ui/close")
               form.show(player).then(result => {
                 if (result.selection === 0) {
                  items(player);
                  
                 }})} 


                 function chaining_scroll(player) {
                  var form = new ActionFormData()
                    .title("Chaining scroll")
                    .body("§5Artifact\n§6Chaining sweep attack on mobs without taking damage increase sweep attack damage (up to 60%)\n\n§rCan be found by:\n-trading with artifact trader\n-trading with a weapon smith (last tier, 1/2 chance)")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 
                 function charged_scroll(player) {
                  var form = new ActionFormData()
                    .title("Charged scroll")
                    .body("§5Artifact\n§6Increase sweep attack damage but makes you recoil\n\n§rCan be found by:\n-trading with artifact trader\n-trading with a weapon smith (last tier, 1/2 chance)")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 
                 function uppercut_scroll(player) {
                  var form = new ActionFormData()
                    .title("Upper-cut scroll")
                    .body("§5Artifact\n§6Hitting a mob with a sweep attack throw it in the air\n\n§rCan be found in:\n-Trial chambers normal vaults")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 
                 function crushing_scroll(player) {
                  var form = new ActionFormData()
                    .title("Crushing scroll")
                    .body("§5Artifact\n§6Hitting a mob in the air with a sword do more damage and throw it to the ground\n\n§rCan be found in:\n-Trial chambers ominous vaults")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function ancient(player) {
                  var form = new ActionFormData()
                    .title("Ancient shield")
                    .body("§5Artifact\n§6+40%% knockback resistance\n\n§rCan be found in:\n-Desert temple\n-Stronghold")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function brave(player) {
                  var form = new ActionFormData()
                    .title("Crystal of bravery")
                    .body("§5Artifact\n§6Grant resistance 1 when you have less than 3 hearts\n\n§rCan be found in:\n-Desert temple\n-Igloo\n-Jungle temple\n-Dungeon\n-Stronghold\n-Underwater ruin\n-Underground cabin\n-Sus sand/gravel")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})}  

                 function youth(player) {
                  var form = new ActionFormData()
                    .title("Crystal of youth")
                    .body("§5Artifact\n§6Grant regeneration 1 when you have less than 3 hearts\n\n§rCan be found in:\n-Desert temple\n-Igloo\n-Jungle temple\n-Dungeon\n-Stronghold\n-Underwater ruin\n-Underground cabin\n-Sus sand/gravel")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function rage(player) {
                  var form = new ActionFormData()
                    .title("Crystal of rage")
                    .body("§5Artifact\n§6Grant strength 1 when you have less than 3 hearts\n\n§rCan be found in:\n-Desert temple\n-Igloo\n-Jungle temple\n-Dungeon\n-Stronghold\n-Underwater ruin\n-Underground cabin\n-Sus sand/gravel")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function fear(player) {
                  var form = new ActionFormData()
                    .title("Crystal of fear")
                    .body("§5Artifact\n§6Grant fear 1 when you have less than 3 hearts\n\n§rCan be found in:\n-Desert temple\n-Igloo\n-Jungle temple\n-Dungeon\n-Stronghold\n-Underwater ruin\n-Underground cabin\n-Sus sand/gravel")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function socks1(player) {
                  var form = new ActionFormData()
                    .title("Enchanted socks")
                    .body("§5Artifact\n§6+20%% movement speed(this effect can be combined with speed potions)\n\n§rCan be found in:\n-Desert temple\n-Igloo\n-Jungle temple\n-Dungeon\n-Stronghold\n-Underwater ruin\n-Underground cabin\n-Sus sand/gravel")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function socks2(player) {
                  var form = new ActionFormData()
                    .title("Cloud socks")
                    .body("§5Artifact\n§6You'll no longer take fall damage\n\n§rCan be found in:\n-Floating island")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function socks3(player) {
                  var form = new ActionFormData()
                    .title("Heavy socks")
                    .body("§5Artifact\n§6If you fall from at least 6 blocks,you'll create a shockwave on the ground\n\n§rCan be found in:\n-Pillager outpost")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function insomn(player) {
                  var form = new ActionFormData()
                    .title("Dreamlike pendant")
                    .body("§dDreamlike pendant \n§5Artifact\n§6You can skip the night by being the only one to sleep in a multiplayer world\nGrant +2 max hearts when you wake up (last 5 minutes)\n\n§rCan be found by:\n-Killing a cursed spirit (mini boss)")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player); 
                       
                 }})} 

                 function undying(player) {
                  var form = new ActionFormData()
                    .title("The undying flower")
                    .body("§5Artifact\n§6Slowly regenerate you health on daytime (work even underground, but only in the overworld)\nThis regen effect is stackable with regeneration potions\n\n§rCan be found in:\n-Jungle temple\n-Underground jungle/lush cave cabin")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function xp(player) {
                  var form = new ActionFormData()
                    .title("Xp orb")
                    .body("§5Artifact\n§5Artifact\n§6Generates xp over time\n\n§rCan be found by:\n-Killing §4The Abomination§6 (BOSS)")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function magic(player) {
                  var form = new ActionFormData()
                    .title("Magic axe")
                    .body("§5Artifact\n§6Summon a flying axe that attacks monsters\n\n§rCan be found by:\n-Killing §4The Abomination§6 (BOSS)")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function sharp(player) {
                  var form = new ActionFormData()
                    .title("Sharpening knowledge scroll")
                    .body("§5Artifact\n§610\u0025 of spears damage ignores armor\n\n§rCan be found in:\n-Jungle temple\n-Desert temple")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function explos(player) {
                  var form = new ActionFormData()
                    .title("Spartan knowledge scroll")
                    .body("§5Artifact\n§6When sneaking with a shield, the cooldown of spears are reduced by half\n\n§rCan be found in:\n-Jungle temple\n-Desert temple")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function long(player) {
                  var form = new ActionFormData()
                    .title("Hussars knowledge scroll")
                    .body("§5Artifact\n§6Increase your spears reach by 1.5 blocks while on mount\n\n§rCan be found in:\n-Jungle temple\n-Desert temple")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function lightning(player) {
                  var form = new ActionFormData()
                    .title("Hunter knowledge scroll")
                    .body("§5Artifact\n§6You do more damage with spears while running\n\n§rCan be found in:\n-Jungle temple\n-Desert temple")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function mucus(player) {
                  var form = new ActionFormData()
                    .title("Poison absorber")
                    .body("§5Artifact\n§6Grant immunity to poison and fatal poison\n\n§rCan be found in:\n-Abandoned mineshaft")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function heart(player) {
                  var form = new ActionFormData()
                    .title("Heart in a bottle")
                    .body("§5Artifact\n§6Grant +2 HP\n\n§rCan be found in:\n-Desert temple\n-Igloo\n-Jungle temple\n-Dungeon\n-Stronghold\n-Underwater ruin\n-Underground cabin\n-Sus sand/gravel")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 
                 function heavy(player) {
                  var form = new ActionFormData()
                    .title("Heavy quiver")
                    .body("§5Artifact\n§6Your arrows do more damage (+2) but they are slower\n§4Do not equip any other quiver\n\n§rCan be found in:\n-Pillagers outpost\n-Small plain towers\n-Fletcher villager's house")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 
                 function sculk(player) {
                  var form = new ActionFormData()
                    .title("Sculk quiver")
                    .body("§5Artifact\n§6Your arrows are faster and go through blocks but it does -2 damage and doesn't deal damage if you're too close to your target\n§4Do not equip any other quiver\n\n§rCan be found in:\n-Ancient cities\n-Underground sculk cabin")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function atlantis(player) {
                  var form = new ActionFormData()
                    .title("Ring of atlantis")
                    .body("§5Artifact\n§6You can breath underwater but you're weaker when you're underwater\n\n§rCan be found in:\n-Shipwrecks\n-Treasure chests")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function firework(player) {
                  var form = new ActionFormData()
                    .title("Magnetic firework")
                    .body("§5Artifact\n§6Fireworks shoot with a crossbow attract monsters on their way\n\n§rCan be found in:\n-Desert temple\n-Igloo\n-Jungle temple\n-Dungeon\n-Stronghold\n-Underwater ruin\n-Underground cabin\n-Sus sand/gravel")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function magnet(player) {
                  var form = new ActionFormData()
                    .title("Magnet")
                    .body("§5Artifact\n§6You attract dropped items\n\n§rCan be found in:\n-Underground cabins\n-Buried tresures")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 
                 function supersonic(player) {
                  var form = new ActionFormData()
                    .title("Supersonic arrow")
                    .body("§5Artifact\n§6Arrows shot with a §4crossbow§6 are superfast and create a shockwave on impact\n\n§rCan be found in:\n-Floating islands")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 
                 function sculk_portal(player) {
                  var form = new ActionFormData()
                    .title("Sculk portal")
                    .body("§5Artifact\n§6Summon 2 sculklings when a monster is near you\nSculklings last 5 minutes\n\n§rCan be found by:\n-Killing sculklings")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function flesh_totem(player) {
                  var form = new ActionFormData()
                    .title("Flesh totem")
                    .body("§5Artifact\n§6§6Grants strength and speed to all players within a 6 block radius\n§6Grants resistance and regeneration to all players within a 2 block radius\n§4Only other players receive these effect, not you\n\n§rCan be found by:\n-Killing necromancers during blood moon")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function blood_vial(player) {
                  var form = new ActionFormData()
                    .title("Blood vial")
                    .body("§5Artifact\n§6Attacking mobs will heal you a little\n\n§rCan be found by:\n-Killing blood zombies and fat blood zombies during blood moon")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 

                 function bottle_soul(player) {
                  var form = new ActionFormData()
                    .title("Bottle of undead souls")
                    .body("§5Artifact\n§6Most of undead mobs will be neutral\n§4Natural iron golems will attack you\n\n§rCan be found by:\n-Killing Flying skeleton at night")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          normalmode(player);
                       
                 }})} 










                 function blaze(player) {
                  var form = new ActionFormData()
                    .title("Blaze heart")
                    .body("§5Artifact\n§6Grant fire resistance\n\n§rCan be found in:\n-Nether fortress")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          hellmode(player);
                       
                 }})} 

                 function deadlyr(player) {
                  var form = new ActionFormData()
                    .title("Deadly ruby")
                    .body("§5Artifact\n§6Grant strength 1 when you're in the Nether\n\n§rCan be found by:\n-Mining ruby ore (Nether ore)")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                         hellmode(player);
                       
                 }})} 

                 function corrupt(player) {
                  var form = new ActionFormData()
                    .title("Corrupted star")
                    .body("§5Artifact\n§6Inflict wither to any monsters around you\n\n§rCan be found by:\n-Killing §4The Wither§6 (BOSS)")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                         hellmode(player);
                       
                 }})} 

                 function ring(player) {
                  var form = new ActionFormData()
                    .title("Golden ring")
                    .body("§5Artifact\n§6Piglins will be passive to you (it's like you're wearing a golden armor)\n\n§rCan be found by:\n-trading with piglins")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          hellmode(player);
                       
                 }})} 

                 function eye(player) {
                  var form = new ActionFormData()
                    .title("Blue eye")
                    .body("§5Artifact\n§6Grant night vision\n\n§rCan be found by:\n-Harvesting eye bulb (Nether plant)")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          hellmode(player);
                       
                 }})} 

                 function magma(player) {
                  var form = new ActionFormData()
                    .title("Magma socks")
                    .body("§5Artifact\n§6You are faster when you walk on netherrack and nylium\nSmelt powder snow on your feet\n\n§rCan be found in:\n-Nether fortress")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          hellmode(player);
                       
                 }})} 

                 function gheart(player) {
                  var form = new ActionFormData()
                    .title("Golden heart in a bottle")
                    .body("§5Artifact\n§6Grant +4HP\n\n§rCan be found in:\n-Bastions\n-Piglin outposts")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          hellmode(player);
                       
                 }})} 

                 function molten(player) {
                  var form = new ActionFormData()
                    .title("Molten ingot")
                    .body("§5Artifact\n§6Auto smelt ores in your inventory\n\n§rCan be found by:\n-Killing magma cubes")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          hellmode(player);
                       
                 }})}

                 function bloody_bramble(player) {
                  var form = new ActionFormData()
                    .title("Wither bramble")
                    .body("§5Artifact\n§6Immobilise and inflict wither for 15 seconds to the nearest monster\n\n§rCan be found by:\n-Killing wither skeleton")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          hellmode(player);
                       
                 }})} 
                 function explosive_blaze_rod(player) {
                  var form = new ActionFormData()
                    .title("Explosive Blaze Rod")
                    .body("§5Artifact\n§6Burning enemies you hit explode\n\n§rCan be found by:\n-Killing §4The Blazeblade§6 (BOSS)")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          hellmode(player);
                       
                 }})} 

               




                 function dragonheart(player) {
                  var form = new ActionFormData()
                    .title("Dragon heart")
                    .body("§5Artifact\n§6You emit small dragon breath trails that attack monsters\n\n§rCan be found by:\n-Killing §5The Ender dragon§6 (BOSS)")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          voidmode(player);
                       
                 }})} 

                function battlecry(player) {
                  var form = new ActionFormData()
                    .title("Battle cry orb")
                    .body("§5Artifact\n§6You emit a shockwave when you reach 3 hearts or less\nInflict 10 damage to monsters\n§410 seconds cooldown\n\n§rCan be found by:\n-Killing The Shulker king §6 (mini boss)")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          voidmode(player);
                       
                }})} 

                function chorus_socks(player) {
                  var form = new ActionFormData()
                    .title("Chorus socks")
                    .body("\n§5Artifact\n§6You run faster on chorus grass \nJump on a chorus cap to be teleported on the one above it\nSneak on a chorus cap to be teleported on the one below it\n\n§rCan be found by:\n-Killing Chorus hearts / Eaten endermen\n§rCan be found in:\n-Medium end ships (in chorus forests biomes)")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          voidmode(player);
                       
                }})} 

                function purpur_socks(player) {
                  var form = new ActionFormData()
                    .title("Purpur socks")
                    .body("\n§5Artifact\n§6You run faster on shulk grass\nSneak and jump to levitate, sneak one more time to fall down\n\n§rCan be found in:\n-End metropolies (in luminescents meadows biomes)")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          voidmode(player);
                       
                }})} 

                function void_socks(player) {
                  var form = new ActionFormData()
                    .title("Void socks")
                    .body("\n§5Artifact\n§6You run faster on void dust\nBoost the dash effect of the dashing stick and divide his cooldown by 2\n\n§rCan be found in:\n-Void laboratories\n-Large end ships (in desolate void biomes)")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          voidmode(player);
                       
                }})} 

                function voidcloak(player) {
                  var form = new ActionFormData()
                    .title("Void cloak")
                    .body("\n§5Artifact\n§6Destroy non-player arrow around you\n\n§rCan be found by killing:\n-Shadow endermen\n-Guard endermen")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          voidmode(player);
                       
                }})} 



                //-generation
                function generation(player) {
                  var form = new ActionFormData()
                    .title("Generation")
                    .body("Here you can find things about biomes, structures")
                    .button("Biomes", "textures/ui/void")
                    .button("Structures", "textures/ui/overworld_icon")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        biomes(player);
                       }
                       if (result.selection === 1) {
                        structures(player);
                       }
                       if (result.selection === 2) {
                        wiki(player);
                       }
                })}

                //-biomes
                function biomes(player) {
                  var form = new ActionFormData()
                    .title("Biomes")
                    .body("Here you can find things about biomes")
                    .button("§2Overworld", "textures/ui/normal")
                    .button("§4Nether", "textures/ui/hell")
                    .button("§5End", "textures/ui/void")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        biomes_overworld(player);
                       }
                       if (result.selection === 1) {
                        biomes_nether(player);
                       }
                       if (result.selection === 2) {
                        biomes_end(player);
                       }
                       if (result.selection === 3) {
                        generation(player);
                       }
                })}
                function biomes_end(player) {
                  var form = new ActionFormData()
                    .title("End Biomes")
                    .button("Void biome", "textures/blocks/end/void_stone")
                    .button("Chorus forest", "textures/blocks/end/end_grass_side")
                    .button("Shulk meadows", "textures/blocks/end/shulk_grass_side")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                       if (result.selection === 0) {
                        void_biome(player);
                       }
                       if (result.selection === 1) {
                        chorus_forest(player);
                       }
                       if (result.selection === 2) {
                        shulk_meadows(player);
                       }
                       if (result.selection === 3) {
                        biomes(player);
                       }
                })}
                function void_biome(player) {
                  var form = new ActionFormData()
                    .title("Void Biome")
                    .button("Void biome mobs", "textures/ui/void_biome")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        void_biome_mobs(player);
                       }
                       if (result.selection === 1) {
                        biomes_end(player);
                       }
                })}
                function chorus_forest(player) {
                  var form = new ActionFormData()
                    .title("Chorus Forests")
                    .button("Chorus mobs", "textures/ui/chorus_mobs")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                       if (result.selection === 0) {
                        chorus_mobs(player);
                       }
                       if (result.selection === 1) {
                        biomes_end(player);
                       }
                })}
                function shulk_meadows(player) {
                  var form = new ActionFormData()
                    .title("Shulk Meadows")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                       if (result.selection === 0) {
                        biomes_end(player);
                       }
                })}
                function biomes_overworld(player) {
                  var form = new ActionFormData()
                    .title("Overworld Biomes")
                    .button("Redwood forests", "textures/blocks/redwood_sapling")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        redwood_forests(player);
                       }
                       if (result.selection === 1) {
                        biomes(player);
                       }
                })}
                function redwood_forests(player) {
                  var form = new ActionFormData()
                    .title("Redwood Forests")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                       if (result.selection === 0) {
                        biomes_overworld(player);
                       }
                })}
                function biomes_nether(player) {
                  var form = new ActionFormData()
                    .title("Nether Biomes")
                    .button("Magma chambers", "textures/blocks/volcanic_stone")
                    .button("Sulfur wastes", "textures/blocks/nether/yellowstone")
                    .button("Crimson forests", "textures/items/crimsonspire_cap")
                    .button("Warped forests", "textures/items/oozeshroom_juice")
                    .button("Soulsand Valleys", "textures/blocks/nether/soul_plant")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                       if (result.selection === 0) {
                        magma_chamber(player);
                       }
                       if (result.selection === 1) {
                        sulfurWastes(player);
                       }
                       if (result.selection === 2) {
                        crimson_forest(player);
                       }
                       if (result.selection === 3) {
                        warped_forest(player);
                       }
                       if (result.selection === 4) {
                        soulsand_valleys(player);
                       }
                       if (result.selection === 5) {
                        biomes(player);
                       }
                })}
                function magma_chamber(player) {
                  var form = new ActionFormData()
                    .title("Magma Chambers")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                       if (result.selection === 0) {
                        biomes_nether(player);
                       }
                })}
                function sulfurWastes(player) {
                  var form = new ActionFormData()
                    .title("Sulfur Wastes")
                    .button("Sulfur Ore", "textures/blocks/nether/sulfur_ore")
                    .button("Mobs", "textures/ui/gloopine")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        sulfur_ore(player);
                       }
                      if (result.selection === 1) {
                        sulfurMobs(player);
                       }
                       if (result.selection === 2) {
                        biomes_nether(player);
                       }
                })}
                function sulfurMobs(player) {
                  var form = new ActionFormData()
                    .title("Sulfur Wastes Mobs")
                    .button("Gloopine", "textures/ui/gloopine")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        gloopine(player);
                       }
                       if (result.selection === 1) {
                        sulfurWastes(player);
                       }
                })} 
                function warped_forest(player) {
                  var form = new ActionFormData()
                    .title("Warped Forests")
                    .button("Oozeshroom", "textures/items/oozeshroom_juice")
                    .button("Mobs", "textures/items/warped_gecko_skin")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        oozeshroom(player);
                       }
                      if (result.selection === 1) {
                        warped_mobs(player);
                       }
                       if (result.selection === 2) {
                        biomes_nether(player);
                       }
                })}
                function warped_mobs(player) {
                  var form = new ActionFormData()
                    .title("Warped Forests Mobs")
                    .button("Warped Gecko", "textures/items/warped_gecko_skin")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        warped_gecko(player);
                       }
                       if (result.selection === 1) {
                        warped_forest(player);
                       }
                })}
                function crimson_forest(player) {
                  var form = new ActionFormData()
                    .title("Crimson Forests")
                    .button("Crimsonspire", "textures/items/crimsonspire_cap")
                    .button("Mobs", "textures/ui/magmroll")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        crimsonspire(player);
                       }
                      if (result.selection === 1) {
                        crimson_mobs(player);
                       }
                       if (result.selection === 2) {
                        biomes_nether(player);
                       }
                })}
                function crimson_mobs(player) {
                  var form = new ActionFormData()
                    .title("Crimson Forests Mobs")
                    .button("Magmroll", "textures/ui/magmroll")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        magmroll(player);
                       }
                       if (result.selection === 1) {
                        crimson_forest(player);
                       }
                })}
                function soulsand_valleys(player) {
                  var form = new ActionFormData()
                    .title("Soulsand Valleys")
                    .button("Soul plants", "textures/blocks/nether/soul_plant")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        soul_plants(player);
                       }
                       if (result.selection === 1) {
                        biomes_nether(player);
                       }
                })}
                function soul_plants(player) {
                  var form = new ActionFormData()
                    .title("Soul pLants")
                    .body("On break, soul plants drop xp")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                       if (result.selection === 0) {
                        soulsand_valleys(player);
                       }
                })}

                //-structures
                  function structures(player) {
                  var form = new ActionFormData()
                    .title("Structures")
                    .body("THIS PAGE ISN'T FINISHED AND NOT EVERY STUCTURES ARE LISTED")
                    .button("Overworld", "textures/ui/overworld_icon")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                       if (result.selection === 0) {
                        overworld_structures(player);
                       }
                       if (result.selection === 1) {
                        generation(player);
                       }
                })}
                //-overworld_structures
                function overworld_structures(player) {
                  var form = new ActionFormData()
                    .title("Overworld structures")
                    .button("Small pillagers mansion", "textures/ui/mansion_icon")
                    .button("Pillagers desert jail", "textures/ui/jail_icon")
                    .button("Pillagers mesa outpost", "textures/ui/mesa_icon")
                    .button("Jungle labyrinth", "textures/ui/labyrinth_icon")
                    .button("Forest bunker", "textures/ui/bunker_icon")
                    .button("Frozen haven", "textures/ui/frozen_haven_icon")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                       if (result.selection === 0) {
                        pill_mansion(player);
                       }
                       if (result.selection === 1) {
                        pill_jail(player);
                       }
                       if (result.selection === 2) {
                        mesa_outpost(player);
                       }
                      if (result.selection === 3) { 
                        labyrinth(player);
                       }
                       if (result.selection === 4) {
                        bunker(player);
                       }
                       if (result.selection === 5) {
                        haven(player);
                       }
                       if (result.selection === 6) {
                        structures(player);
                       }
                })}
                function haven(player) {
                  var form = new ActionFormData()
                    .title("Frozen haven")
                    .body("§6Biomes:§r\n- Every snowy ones (except mountains)\n\n§6Runic chest:§r yes\n\n§6Protected by a shield:§r yes\n\n§6Artifacts (not in the main hall) (percents are per chest):§r\n- Magnetic firework 0.96%%\n- Crystal of fear 0.96%%\n- Crystal of rage 0.96%%\n- Crystal of youth 0.96%%\n- Crystal of bravery 0.96%%\n- Enchanted socks 0.96%%\n- Heart in a bottle 0.96%%")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        overworld_structures(player);
                       }
                })}
                function bunker(player) {
                  var form = new ActionFormData()
                    .title("Forest bunker")
                    .body("§6Biomes:§r\n- Every forests (Jungles aren't forests)\n\n§6Runic chest:§r yes\n\n§6Protected by a shield:§r yes\n\n§6Artifacts (only in the storage room):§r\n- Magnetic firework 0.96%%\n- Crystal of fear 0.96%%\n- Crystal of rage 0.96%%\n- Crystal of youth 0.96%%\n- Crystal of bravery 0.96%%\n- Enchanted socks 0.96%%\n- Heart in a bottle 0.96%%")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        overworld_structures(player);
                       }
                })}
                function labyrinth(player) {
                  var form = new ActionFormData()
                    .title("Labyrinth")
                    .body("§6Biomes:§r\n- Jungles (even bamboo ones)\n\n§6Runic chest:§r no\n\n§6Protected by a shield:§r yes\n\n§6Artifacts (only in locked rooms) (percents are per chest):§r\n- Magnetic firework 1.2%%\n- Crystal of fear 1.2%%\n- Crystal of rage 1.2%%\n- Crystal of youth 1.2%%\n- Crystal of bravery 1.2%%\n- Enchanted socks 1.2%%\n- Heart in a bottle 1.2%%\n- Any spear scroll 1.2%%\n- Undying flower 1.2%%")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        overworld_structures(player);
                       }
                })}
                function pill_mansion(player) {
                  var form = new ActionFormData()
                    .title("Small pillagers mansion")
                    .body("§6Biomes:§r\n- Plains\n- Forests\n- Ice plains\n- Savannas\n\n§6Specific loots:§r\n- Strange totem 100%%\n\n§6Runic chest:§r yes\n\n§6Protected by a shield:§r no\n\n§6Artifacts :§r none")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        overworld_structures(player);
                       }
                })}
                function pill_jail(player) {
                  var form = new ActionFormData()
                    .title("Pillagers desert jail")
                    .body("§6Biomes:§r\n- Deserts\n\n§6Specificities:§r this pillager tower has crates in it and a BIG basement with a jail \n\n§6Specific loots:§r\n- Strange totem 100%%\n\n§6Runic chest:§r no\n\n§6Protected by a shield:§r no\n\n§6Artifacts (only in the chests in the tower):§r\n- Heavy socks 20%%\n- Heavy quiver 20%%")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        overworld_structures(player);
                       }
                })}
                function mesa_outpost(player) {
                  var form = new ActionFormData()
                    .title("Pillagers mesa outpost")
                    .body("§6Biomes:§r\n- Mesa\n\n§6Specific loots:§r\n- Strange totem 100%%\n\n§6Runic chest:§r no\n\n§6Protected by a shield:§r no\n\n§6Artifacts:§r none")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        overworld_structures(player);
                       }
                })}


                //-blocks
                function blocks(player) {
                  var form = new ActionFormData()
                    .title(" Blocks ")
                    .button("Crates/vases", "textures/blocks/crate/wooden_crate")
                    .button("Decoration", "textures/blocks/decoration/diorite_brick")
                    .button("Ores", "textures/blocks/nether/ruby_ore")
                    .button("Plants/crops", "textures/blocks/hibiscus")
                    .button("Crafting stations", "textures/ui/workbench")
                    .button("Functional blocks", "textures/ui/spotter")
                    .button("Spawners", "textures/blocks/spawners/spawner")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       crates(player);
                      }
                      if (result.selection === 1) {
                        deco(player);
                     }
                     if (result.selection === 2) {
                      ore(player);
                   }
                   if (result.selection === 3) {
                   plant(player);
                 }
                       if (result.selection === 4) {
                        crafting(player);
                       }
                       if (result.selection === 5) {
                        functional(player);
                       }
                       if (result.selection === 6) {
                        spawners(player);
                       }
                       if (result.selection === 7) {
                        wiki(player);
                       }
                })}

                //-plant
                function plant(player) {
                  var form = new ActionFormData()
                    .title("Plants/crops")
                    .button("Crops", "textures/items/nether/eye_globe")
                    .button("Decorative plants", "textures/blocks/hibiscus")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       crops(player);
                      }
                      if (result.selection === 1) {
                       plants(player);
                     }
                    
                       if (result.selection === 2) {
                        blocks(player);
                       }
                })}
                //-deco
                function deco(player) {
                  var form = new ActionFormData()
                    .title("Decorative blocks")
                    .body("Here is the list of decorative blocks")
                    .button("Back", "textures/ui/close")
                    .button("Dry dirt", "textures/blocks/dry_dirt")
                    .button("Small andesite bricks", "textures/blocks/decoration/small_andesitebrick")
                    .button("Diorite bricks", "textures/blocks/decoration/diorite_brick")
                    .button("Small diorite bricks", "textures/blocks/decoration/small_dioritebrick")
                    .button("Granite bricks", "textures/blocks/decoration/granite_brick")
                    .button("Small granite bricks", "textures/blocks/decoration/small_granitebrick")
                    .button("Sandstone bricks", "textures/blocks/decoration/sandstone_brick")
                    .button("Fire blackstone bricks", "textures/ui/fire_bricks")
                    .button("Chiseled fire blackstone bricks", "textures/ui/fire_polished_bricks")
                    .button("Diamond inlaid deepslate bricks", "textures/blocks/decoration/diamond_bricks")
                    .button("Ruby inlaid deepslate bricks", "textures/blocks/decoration/ruby_bricks")
                    .button("Amethyst inlaid deepslate bricks", "textures/blocks/decoration/amethyst_bricks")
                    .button("Emerald inlaid deepslate bricks", "textures/blocks/decoration/emerald_bricks")
                    .button("Sculk inlaid deepslate bricks", "textures/blocks/decoration/sculk_bricks2")
                    .button("Nickel plate blocks", "textures/blocks/nickel_plate_block")
                    .button("Nickel block", "textures/blocks/nickel_block")
                    .button("Platinum plate", "textures/blocks/platinum_plate_block")
                    .button("Platinum block", "textures/blocks/platinum_block")
                    .button("Tin plate", "textures/blocks/tin_plate_block")
                    .button("Tin block", "textures/blocks/tin_block")
                    

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       blocks(player);
                      }
                })}
                //-plants
                function plants(player) {
                  var form = new ActionFormData()
                    .title("Decorative plants")
                    .body("Here is the list of decorative plants")
                    .button("Back", "textures/ui/close")
                    .button("Hibiscus", "textures/blocks/hibiscus")
                    .button("Hyssop", "textures/blocks/hyssop")
                    .button("Crocus", "textures/blocks/crocus")
                    .button("Agave", "textures/blocks/agave")
                    .button("Daffodils", "textures/blocks/daffodils")
                    .button("Dead plant", "textures/blocks/dead_plant")
                    .button("Fire agave", "textures/blocks/fire_agave")
                    .button("Mini cactus", "textures/blocks/mini_cactus")
                    .button("Blue flax", "textures/items/blue_flax_flower_it")
                    .button("Purple coneflower", "textures/items/purple_coneflower_it")
                    .button("Shata daisy", "textures/items/shata_daisy_it")
                    .button("Yellow daisy", "textures/items/Yellow_daisy_it")
                    

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       blocks(player);
                      }
                })}
                //-crafting stations
                function crafting(player) {
                  var form = new ActionFormData()
                    .title("Crafting stations")
                    .button("Heavy Workbench", "textures/ui/workbench")
                    .button("Artifacts assembler", "textures/ui/artiassembler")
                    .button("Spawner table", "textures/ui/spawner_table")
                    .button("End catalyst", "textures/ui/end_catalyst")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       workbench(player);
                      }
                      if (result.selection === 1) {
                       artassemb(player);
                     }
                     if (result.selection === 2) {
                      spawnertable(player);
                    }
                     if (result.selection === 3) {
                      catalyst(player);
                    }
                       if (result.selection === 4) {
                        blocks(player);
                       }
                })}

                function workbench(player) {
                  var form = new ActionFormData()
                    .title("Heavy Workbench")
                    .body("An upgrade version of the crafting table able to craft better items\n\n§3Craftable in :§r Crafting table")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        crafting(player);
                       
                 }})} 

                 function artassemb(player) {
                  var form = new ActionFormData()
                    .title("Artifact assembler")
                    .body("A crafting station able to combine artifacts by using fusion powder\n\n§3Craftable in :§r Crafting table")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        crafting(player);
                       
                 }})} 

                 function spawnertable(player) {
                  var form = new ActionFormData()
                    .title("Spawner table")
                    .body("A crafting station able to concentrate soul into cage to make mob spawners\n\n§3Craftable in :§r Heavy Workbench")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        crafting(player);
                       
                 }})} 

                 function catalyst(player) {
                  var form = new ActionFormData()
                    .title("End catalyst")
                    .body("A crafting station that can be infused with void or light to then infused tools with it\n\n§3Craftable in :§r Heavy Workbench\n\n§3Void catalyst:§r place a void fossils block under an end catalyst\n§3Light catalyst:§r place a beacon under an end catalyst")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        crafting(player);
                      }
                })} 
                //-functional
                function functional(player) {
                  var form = new ActionFormData()
                    .title("Funtional")
                    .button("Spotter", "textures/ui/spotter")
                    .button("Block Breaker", "textures/ui/block_breaker")
                    .button("Fume fan", "textures/ui/fume_fan")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       spotter(player);
                      }
                      if (result.selection === 1) {
                       block_breaker(player);
                     }
                     if (result.selection === 2) {
                      fume_fan(player);
                    }
                       if (result.selection === 3 ) {
                        blocks(player);
                       }
                })}
                function spotter(player) {
                  var form = new ActionFormData()
                    .title("Spotter")
                    .body("Spotters are able to detect player going in front of them, to emit a redstone signal, place an observer block on them.\nYou can also put a gem in a spotter, each gem will change the behaviour of the spotter:\n\n§bDiamond:§r Take away the armor equiped by the player\n§aEmerald:§r Take away the item hold by the player\n§fQuartz:§r Remove every effects from the player\n§cRuby:§r Take away every items in the artifacts slots\n§6Fire opal:§r Put the player on fire\n§tLapis:§r Take away and store xp from teh player, click on it to take back your xp\n§dAmethyst:§rIncreased detection range\n\n§vNote:§r for every spotter type that take away items, you can place a container behind the spotter for it to place the items in it instead of dropping them")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        functional(player);
                      }
                })}
                function block_breaker(player) {
                  var form = new ActionFormData()
                    .title("Block Breaker")
                    .body("It breaks blocks in front of it, that's it\nIt can also be moved by pistons if you want to make missiles.")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        functional(player);
                      }
                })} 
                function fume_fan(player) {
                  var form = new ActionFormData()
                    .title("Fume Fan")
                    .body("Fume fans push mobs/items in front of them, you can click on it to change the intensity. Clicking on it with a fire opal will prevent players from changing its intensity.")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        functional(player);
                      }
                })} 
                function crops(player) {
                  var form = new ActionFormData()
                    .title("Crops")
                    .button("Eye bulb", "textures/items/nether/eye_globe")
                    .button("Cattails", "textures/ui/cattails")
                    .button("Oozeshroom", "textures/items/oozeshroom_juice")
                    .button("Crimsonspire", "textures/items/crimsonspire_cap")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       Eyebulb(player);
                      }
                      if (result.selection === 1) {
                        cattails(player);
                       }
                       if (result.selection === 2) {
                        oozeshroom(player);
                       }
                       if (result.selection === 3) {
                        crimsonspire(player);
                       }
                       if (result.selection === 4) {
                        plant(player);
                       }
                })}

                function crates(player) {
                  var form = new ActionFormData()
                    .title("Crates")
                    .button("Wooden crate", "textures/blocks/crate/wooden_crate")
                    .button("Copper crate", "textures/blocks/crate/copper_crate")
                    .button("Iron crate", "textures/blocks/crate/iron_crate")
                    .button("Golden crate", "textures/blocks/crate/golden_crate")
                    .button("Runic chest", "textures/ui/runic")
                    .button("Plain vase", "textures/ui/plain")
                    .button("Frozen vase", "textures/ui/frozen")
                    .button("Desert vase", "textures/ui/desert")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       wooden(player);
                      }
                      if (result.selection === 1) {
                        copper(player);
                     }
                     if (result.selection === 2) {
                      iron(player);
                   }
                   if (result.selection === 3) {
                   golden(player);
                 }
                       if (result.selection === 4) {
                        runic(player);
                       }
                       if (result.selection === 5) {
                       plainv(player);
                       }
                       if (result.selection === 6) {
                        frozenv(player);
                       }
                       if (result.selection === 7) {
                        desertv(player)
                       }
                       if (result.selection === 8) {
                        blocks(player);
                       }
                })}


                function runic(player) {
                  var form = new ActionFormData()
                    .title("Runic chest")
                    .body("§3Can be opened with:§r Runestone\n\n§3Can be found:§r Below deepslate\n\n§3Loots:§r\n-Notch apple\n-Golden apple\n-Runestone\n-Enchanted bow\n-Nickel shovel\n-Nickel axe\n-Nickel helmet\n-Xp bottle\n-Enchanted book")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          crates(player);
                       
                }})} 

                function frozenv(player) {
                  var form = new ActionFormData()
                    .title("Frozen vases")
                    .body("§3Can be found in:§r Frozen biomes\n\n§3Loots:§r\n-Gold nugget\n-Snowball\n-Diamond\n-Bone\n-Copper coin\n-Bomb\n-Emerald\n-Raw copper\n-Platinum shovel")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          crates(player);
                       
                }})} 

                function plainv(player) {
                  var form = new ActionFormData()
                    .title("Plain vases")
                    .body("§3Can be found in:§r Lukewarm biomes(plains, forests...)\n\n§3Loots:§r\n-Gold nugget\n-Gravel\n-Diamond\n-Bone\n-Copper coin\n-Bomb\n-Rotten flesh\n-Emerald\n-Raw copper\n-Platinum axe")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          crates(player);
                       
                }})} 

                function desertv(player) {
                  var form = new ActionFormData()
                    .title("Desert vases")
                    .body("§3Can be found in:§r Deserts\n\n§3Loots:§r\n-Gold nugget\n-Sand\n-Diamond\n-Bone\n-Copper coin\n-Bomb\n-Gunpowder\n-Emerald\n-Raw tin\n-Raw nickel\n-Redstone\n-Lapis-lazuli\n-Platinum sword")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          crates(player);
                       
                }})} 


                function wooden(player) {
                  var form = new ActionFormData()
                    .title("Wooden crate")
                    .body("§3Can be opened by:§r Breaking it\n\n§3Can be found in:§r Structures\n\n§3Loots:§r\n-Apple\n-Coal\n-Arrow\n-Tin ingot\n-Gold ingot\n-Slime ball")
                    .button("Back", "textures/ui/close") 
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          crates(player);
                       
                }})} 

                function copper(player) {
                  var form = new ActionFormData()
                    .title("Copper crate")
                    .body("§3Can be opened by:§r Breaking it\n\n§3Can be found in:§r Structures\n\n§3Loots:§r\n-Iron ingot\n-Coal\n-Enchanted book\n-Tin ingot\n-Gold ingot\n-Diamond\n-Emerald")
                    .button("Back", "textures/ui/close") 
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          crates(player);
                       
                }})} 

                function iron(player) {
                  var form = new ActionFormData()
                    .title("Iron crate")
                    .body("§3Can be opened by:§r Breaking it\n\n§3Can be found in:§r Structures\n\n§3Loots:§r\n-Platinum ingot\n-Golden carrot\n-Enchanted book\n-Tin ingot\n-Gold ingot\n-Diamond\n-Emerald")
                    .button("Back", "textures/ui/close") 
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          crates(player);
                       
                }})} 

                function golden(player) {
                  var form = new ActionFormData()
                    .title("Golden crate")
                    .body("§3Can be opened by:§r Breaking it\n\n§3Can be found in:§r Structures\n\n§3Loots:§r\n-Platinum ingot\n-Iron ingot\n-Raw nickel\n-Golden carrot\n-Enchanted book\n-Runestone\n-Diamond\n-Golden apple\n-Notch apple\n-Emerald")
                    .button("Back", "textures/ui/close") 
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          crates(player);
                       
                }})} 






        

                //-ore
                function ore(player) {
                  var form = new ActionFormData()
                    .title("Ores")
                    .button("Coal ore", "textures/blocks/coal_ore")
                    .button("Tin ore", "textures/blocks/tin")
                    .button("Iron ore", "textures/blocks/iron_ore")
                    .button("Platinum ore", "textures/blocks/platinum")
                    .button("Nickel ore", "textures/blocks/nickel")
                    .button("Sulfur ore", "textures/blocks/nether/sulfur_ore")
                    .button("Ruby ore", "textures/blocks/nether/ruby_ore")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                     
                      if (result.selection === 0) {
                        coal_ore(player);
                       }
                       if (result.selection === 2) {
                        iron_ore(player);
                       }
                      if (result.selection === 1) {
                       tin_ore(player);
                      }
                      if (result.selection === 3) {
                        platinum_ore(player);
                     }
                     if (result.selection === 4) {
                      nickel_ore(player);
                   }
                   if (result.selection === 5) {
                   sulfur_ore(player);
                 }
                       if (result.selection === 6) {
                        ruby_ore(player);
                       }
                       if (result.selection === 7) {
                        blocks(player);
                       }
                })}






                
                function coal_ore(player) {
                  var form = new ActionFormData()
                    .title("Coal ore")
                    .body("§3Minimum pickaxe:§r Wooden pickaxe \n\n§3Ore abundant biomes:§r- Jungles\n- Lush caves")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          ore(player);
                       
                }})} 


                function iron_ore(player) {
                  var form = new ActionFormData()
                    .title("Iron ore")
                    .body("§3Minimum pickaxe:§r Tin pickaxe \n\n§3Ore abundant biome:§r Frozen/snowy biomes")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          ore(player);
                       
                }})} 

                function tin_ore(player) {
                  var form = new ActionFormData()
                    .title("Tin ore")
                    .body("§3Y-level:§r Y8 => Y68 \n\n§3Minimum pickaxe:§r Copper pickaxe \n\n§3Ores per veins:§r 7 \n\n§3Ores obtained once destroyed:§r 1 \n\n§3Fortune works:§r yes \n\n§3Biomes:§r Overworld \n\n§3Ore abundant biome:§r Deserts")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          ore(player);
                       
                }})} 

                function platinum_ore(player) {
                  var form = new ActionFormData()
                    .title("Platinum ore")
                    .body("§3Y-level:§r Y-50 => Y0 \n\n§3Minimum pickaxe:§r Iron pickaxe \n\n§3Ores per veins:§r 5 \n\n§3Ores obtained once destroyed:§r 1 \n\n§3Fortune works:§r no \n\n§3Biomes:§r Overworld \n\n§3Ore abundant biome:§r none")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          ore(player);
                       
                }})} 

                function nickel_ore(player) {
                  var form = new ActionFormData()
                    .title("Platinum ore")
                    .body("§3Y-level:§r Y-64 => Y-15 \n\n§3Minimum pickaxe:§r Platinum pickaxe \n\n§3Ores per veins:§r 4 \n\n§3Ores obtained once destroyed:§r 1 \n\n§3Fortune works:§r no \n\n§3Biomes:§r Overworld \n\n§3Ore abundant biome:§r none")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          ore(player);
                       
                }})} 

                function sulfur_ore(player) {
                  var form = new ActionFormData()
                    .title("Sulfur ore")
                    .body("§3Y-level:§r Y20 => Y150 \n\n§3Minimum pickaxe:§r Wooden pickaxe \n\n§3Ores per veins:§r 3 \n\n§3Ores obtained once destroyed:§r 1-2 \n\n§3Fortune works:§r yes \n\n§3Biomes:§r Sulfur biome (Nether) \n\n§3Ore abundant biome:§r none")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          ore(player);
                       
                }})} 

                function ruby_ore(player) {
                  var form = new ActionFormData()
                    .title("Ruby ore")
                    .body("§3Y-level:§r Y0 => Y150 \n\n§3Minimum pickaxe:§r Platinum pickaxe \n\n§3Ores per veins:§r 4 \n\n§3Ores obtained once destroyed:§r 1 \n\n§3Fortune works:§r no \n\n§3Biomes:§r Nether \n\n§3Ore abundant biome:§r none")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          ore(player);
                       
                }})} 




                function Eyebulb(player) {
                  var form = new ActionFormData()
                    .title("Eye bulb")
                    .body("§3Seeds can be found in:§r Soulsand valley\n\n§3Grow on:§r Soulsand\n\n§3Stages:§r 4\n\n§3Grow speed per stage:§r 1.3min => 7min\n\n§3Once fully grown drops:§r\n-Eye bulb\n- 1-3 eye bulb seeds\n\n\n§2This plant has a chance to transform into a blue eye bulb when passing from stage 3 to 4\n\n§3§3Once the blue eye is fully grown, it drops:§r\n-Blue eye §d(Artifact)\n§r- 1-3 eye bulb seeds")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          crops(player);
                       
                }})} 
                function crimsonspire(player) {
                  var form = new ActionFormData()
                    .title("Crimsonspire")
                    .body("§3Can be found in:§rCrimson Forests\n\n§3Grow on:§r Crimson nylium\n\n§3Max height:§r 2-30 blocks\n\n§3Grow speed per block:§r 1min => 10min\n\n§3Once break drops:§r\n-Crimsonspire cap (top block)\n-Crimsonspire slices (stem)\n\n\n§2When the cap starts emitting particles, it means that the plants reach its final stage and will no longer grow")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          crops(player);
                       
                }})} 
                function oozeshroom(player) {
                  var form = new ActionFormData()
                    .title("Oozeshroom")
                    .body("§3Can be found in:§r Warped Forests\n\n§3Grow on:§r Warped nylium\n\n§3Once Pink:§r\n-Right click on it with a glass bottle to get oozeshroom juice")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          crops(player);
                       
                }})} 

                function cattails(player) {
                  var form = new ActionFormData()
                    .title("Cattails")
                    .body("§3Cattails can be found in:§r Swamps\n\n§3Grow on:§r dirt, near water\n\n§3Stages:§r 5\n\n§3Grow speed per stage:§r 1.3min => 7min\n\n§3Once fully grown drops:§r\n-11 Cattails\n\nCattails doesn't have seeds and can directly be planted on ground (need a water source like sugarcanes)")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                          crops(player);
                       
                }})} 


                function spawners(player) {
                  var form = new ActionFormData()
                    .title("Spawners")
                    .body("Spawners can be crafted in the spawners table with ruby, spawners fragments (obtained by breaking blank spawners) and the soul of a mob\n\n§3Delay time for mobs to spawn:§r\n-Creepers: 50s\n-Enderman: 60s\n-Ghasts: 120s\n-Pigs: 30s\n-Sheeps: 40s\n-Skeleton: 50s\n-Slimes: 50s\n-Spiders: 40s\n-Vindicators: 50s\n-Wither skeleton: 120s\n-Zombies: 30s")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       blocks(player);
                      }
                })}



                //-items
                function items(player) {
                  var form = new ActionFormData()
                    .title("Items")
                    .button("Coins", "textures/items/coins/iron_coin")
                    .button("Food", "textures/items/bird_cooked")
                    .button("Armors and tools", "textures/items/armor/nickel_chestplate")
                    .button("Artifacts", "textures/items/artifacts/golden_ring")
                    .button("Spears", "textures/items/spear/crimson_nickel_spear")
                    .button("Light and void items", "textures/items/fossilized_light_seed")
                    .button("Other", "textures/items/abomination_totem")
                    
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        coins(player);
                    }
                     if (result.selection === 1) {
                      food(player); 
                     }
                     if (result.selection === 2) {
                      armors_tools(player);
                     }
                     if (result.selection === 3) {
                      artifacts(player);
                    }
                     if (result.selection === 4) {
                     spears(player);
                     }
                     if (result.selection === 5) {
                      lightvoid(player);
                      }
                     if (result.selection === 6) {
                      otheritems(player);
                     }
                     if (result.selection === 7) {
                      wiki(player);
                     }
                     })}

                     
                
                  function food(player) {
                  var form = new ActionFormData()
                    .title("Food")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                       if (result.selection === 0) {
                        items(player);
                       }
                })}

                function spears(player) {
                  var form = new ActionFormData()
                    .title("Spears")
                    .body("Spears are contact weapon with a better reach than swords, they're enchantables like swords and even have unique artifacts.")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                       if (result.selection === 0) {
                        items(player);
                       }
                })}
                

                function armors_tools(player) {
                  var form = new ActionFormData()
                    .title("Armors and tools")
                    .button("Armors stats", "textures/items/armor/copper_chestplate")
                    .button("Light/void items", "textures/items/liquid_light")
                    .button("Light/void armors differences", "textures/items/armor/void_chestplate")
                    .button("Ancient tools", "textures/items/ancient_armor_plan")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        armors(player);
                      }
                      if (result.selection === 1) {
                        lightvoid(player);
                      }
                       if (result.selection === 2) {
                        light_void_armor(player);
                       }
                       if (result.selection === 3) {
                        aarmoritems(player);
                       }
                       if (result.selection === 4) {
                         items(player);
                       }
                              

                })}

                function armors(player) {
                  var form = new ActionFormData()
                    .title("Armors")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                       if (result.selection === 0) {
                        armors_tools(player);
                       }
                })}


                //-otheritems
               function otheritems(player) {
                  var form = new ActionFormData()
                    .title("Other items")
                    .button("Plates", "textures/ui/plates")
                    .button("Tree bark", "textures/items/tree_bark")
                    .button("Allays in a bottle", "textures/items/allay_bottle")
                    .button("Souls container", "textures/items/souls_container")
                    .button("Runestone", "textures/items/runestone")
                    .button("Nether sticks", "textures/items/warped_stick")
                    .button("Diamond book", "textures/items/diamond_book")
                    .button("Netherite hammer", "textures/items/netherite_hammer")
                    .button("Star dust", "textures/items/star_dust")
                    .button("Souls", "textures/items/souls/skeleton_soul")
                    .button("Strange totem", "textures/items/abomination_totem")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       plates(player);
                      }
                      if (result.selection === 1) {
                        bark(player);
                      }
                      if (result.selection === 2) {
                        allays_bottle(player);
                       }
                       if (result.selection === 3) {
                         souls_contain(player);
                       }
                       if (result.selection === 4) {
                        runestone(player);
                       }
                       if (result.selection === 5) {
                         nsticks(player);
                       }
                       if (result.selection === 6) {
                        dbooks(player);
                       }
                       if (result.selection === 7) {
                         nhammer(player);
                       }
                       if (result.selection === 8) {
                       stardust(player);
                       }
                       if (result.selection === 9) {
                         souls(player);
                       }
                       if (result.selection === 10) {
                        strange_totem(player);
                       }
                       if (result.selection === 11) {
                         items(player);
                       }
                              

                })}

                function plates(player) {
                  var form = new ActionFormData()
                    .title("Plates")
                    .body("Plates can be crafted on a Heavy Workbench and can be used to upgrade platinum, nickel and netherite tools, or to make decorative blocks")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       otheritems(player);
                      }
                })}

                function bark(player) {
                  var form = new ActionFormData()
                    .title("Tree barks")
                    .body("Tree barks can be crafted with a log. Barks can be used to make wooden armor or it can be used as fuel\nClick on a stripped log with a tree bark to unstrip it")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       otheritems(player);
                      }
                })}

                function allays_bottle(player) {
                  var form = new ActionFormData()
                    .title("Allays in a bottle")
                    .body("Allays can now be taken with a glass bottle.If you sneak + right click with an allay in a bottle the allay will automatically follow you")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       otheritems(player);
                      }
                })}

                function souls_contain(player) {
                  var form = new ActionFormData()
                    .title("Souls container")
                    .body("The souls container is a new drop from the Warden. It can be used to create a spawner table.")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       otheritems(player);
                      }
                })}

                function runestone(player) {
                  var form = new ActionFormData()
                    .title("Runestones")
                    .body("Runestones can be obtained by breaking golden crates or in structures chest (Nether fortress, end cities,...)")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       otheritems(player);
                      }
                })}

                function nsticks(player) {
                  var form = new ActionFormData()
                    .title("Nether sticks")
                    .body("Crimson/warped sticks are used to craft nickel tools/weapons. Warped and crimson tools have the same stats and the difference is purely visual.")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       otheritems(player);
                      }
                })}

                function dbooks(player) {
                  var form = new ActionFormData()
                    .title("Diamond books")
                    .body("Diamond books can be crafted with 4 diamond, 1 ruby and a book. They are used to craft and enchant table and to buy enchanted books to villagers")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       otheritems(player);
                      }
                })}

                function lightvoid(player) {
                  var form = new ActionFormData()
                    .title("Light and void items")
                    .body("Void tools are crafted on a void catalyst. They require void crystals, liquid void and a dragon essence.\n\nDragon essences are obtained by killing the Ender dragon\nLiquid void are crafted with a void fossil and a dragon breath in a brewing stand\nVoid fossils are obtained in the void biome in the End (see the ore secion in the wiki) \n\nLight tools are crafted on a light catalyst. They require light crystals, liquid light and a nether star.\n\nLiquid light are crafted with a Fossilized light seed in a bottle and a dragon breath in a brewing stand\n\nFossilized light seed and void fossils are new §bores§r in the end. Void foosils are found in void biome and fossilized light seed in the shulker meadows one (the biome wih a lot of flowers)")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       armors_tools(player);
                      
                      }
                      })} 
                      function light_void_armor(player) {
                        var form = new ActionFormData()
                          .title("Light and void armors")
                          .body("Light and void armors are slightly different:\n\nLight armor provide 4 more protections points than the void armor and provide a +1 max heart when fully equiped \nWhen fully equiped, Void armor provide a +2 damage bonus (1 heart) on contact attack and normal/heavy arrows that you shoot \n\nWhen you equip a full void armor, the 3x3 mode durabiity cost of the pure void tools is divided by 2 ( it's the same when you equip a full light armor and use pure light tools)")
                          .button("Back", "textures/ui/close")
      
                          form.show(player).then(result => {
                            if (result.selection === 0) {
                             items(player);
                            
                            }
                      })} 
                       function aarmoritems(player) {
                        var form = new ActionFormData()
                          .title("Ancient armor/tools")
                          .body("Ancient armors and tools are crafted with ancient ore and an ancient plan.The ancient plan is not consumed during the craft.\nAncient ores are obtained by smelting ancient broken armors in a furnace.\nAncient broken armors and the ancient plan are obtained in the void laboratory, a new structure in the void biome in the End")
                          .button("Back", "textures/ui/close")
      
                          form.show(player).then(result => {
                            if (result.selection === 0) {
                             armor_tools(player);
                            }
                      })}

                 function nhammer(player) {
                        var form = new ActionFormData()
                          .title("Netherite hammer")
                          .body("Netherite hammers are crafted on the Heavy Workbench with a netherite scrap, 2 gold ingot and 2 sticks and are used to repair netherite items for much cheaper.\n 2 netherite hammers can fully repair any netherite item.")
                          .button("Back", "textures/ui/close")
      
                          form.show(player).then(result => {
                            if (result.selection === 0) {
                             otheritems(player);
                            }
                  })}

                  function stardust(player) {
                    var form = new ActionFormData()
                      .title("Star dust")
                      .body("Star dust is crafted with a nether star ( 1 Nether star -> 16 star dust) and are used to craft ender eyes")
                      .button("Back", "textures/ui/close")
  
                      form.show(player).then(result => {
                        if (result.selection === 0) {
                         otheritems(player);
                        }
                  })}

                  function souls(player) {
                    var form = new ActionFormData()
                      .title("Souls")
                      .body("Certain mobs can rarely drop souls that can be used to craft spawners in a spawner table")
                      .button("Back", "textures/ui/close")
  
                      form.show(player).then(result => {
                        if (result.selection === 0) {
                         otheritems(player);
                        }
                  })}

                  function strange_totem(player) {
                    var form = new ActionFormData()
                      .title("Strange totem")
                      .body("The Strange totem is an item found in the mini mansions (in plains), in the Desert pillager jail ( in... deserts) and in the Mesa pillagers outpost (in... well... I forgot).\n\nOnce dropped on a gold block, the strange totem will disapear and the Abomintion will spawn (BOSS).\n\n§4NOTE: Bosses can only be summmoned at night and despawn on day.\nBosses can spawn kill you or kill you villagers or destroy you house so don't spawn them near your bsae and prepare an arena for them.")
                      .button("Structures with the totem", "textures/items/abomination_totem")
                      .button("Back", "textures/ui/close")
  
                      form.show(player).then(result => {
                        if (result.selection === 0) {
                          overworld_structures(player);
                         }
                        if (result.selection === 1) {
                         otheritems(player);
                        }
                  })}
                  //-entities
                function entities(player) {
                  var form = new ActionFormData()
                    .title("Entities")
                    .body("§4Of course, not every entity are listed here.There only the ones who has mechanics that can be hard to understand (or impossible to guess)")
                    .button("Nether mobs", "textures/items/ghast_saddle")
                    .button("Chorus mobs", "textures/ui/chorus_mobs")
                    .button("Void biome mobs", "textures/ui/void_biome")
                    .button("Blood moon", "textures/ui/blood_moon")
                    .button("Back", "textures/ui/close")
                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        nether_mobs(player);
                      }
                      if (result.selection === 1) {
                        chorus_mobs(player);
                     }
                     if (result.selection === 2) {
                      void_biome_mobs(player);
                     }
                     if (result.selection === 3) {
                      blood_moon(player);
                     }
                     if (result.selection === 4) {
                      wiki(player);
                     }
                     })}

                function nether_mobs(player) {
                  var form = new ActionFormData()
                    .title("Nether mobs")
                    .button("Gloopine", "textures/ui/gloopine")
                    .button("Warped Gecko", "textures/items/warped_gecko_skin")
                    .button("Magmroll", "textures/ui/magmroll")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                       if (result.selection === 0) {
                        gloopine(player);
                       }
                       if (result.selection === 1) {
                        warped_gecko(player);
                       }
                       if (result.selection === 2) {
                        magmroll(player);
                       }
                      if (result.selection === 3) {
                       entities(player);
                      }
                })}
                function magmroll(player) {
                  var form = new ActionFormData()
                    .title("Magmroll")
                    .body("Mamg... Magrmo... MAGMROLLS are very hostile, once they spot you they'll enter in their shell and charge at you. Be warned, they can do up to 30 damage and can one shot someone without armor!!\n on death they drop their shell, you can place it and when you click on it it'll roll in the direction you placed it")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       nether_mobs(player);
                      }
                })}
                function gloopine(player) {
                  var form = new ActionFormData()
                    .title("Gloopine")
                    .body("Gloop Gloop, look at it, it's so cute, but don't attack it or he'll explode!!\nGloopines drop gloopballs on death, they can be thrown and when you hit them with an another projectile they'll inflate and explode. Gloopballs can also be used to craft bouncing boots to boing boing like an inflated gloopine and no longer take fall damages")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       nether_mobs(player);
                      }
                })}
                function warped_gecko(player) {
                  var form = new ActionFormData()
                    .title("Warped Gecko")
                    .body("Another cute mob! Warped geckos are passive and love to jump on trees. However, like any animals, the best part in it is it's meat, warped geckos can drop meat that can also be cooked. they also can drop warped gecko skin that can be used to craft bouncing boots\nWarpde gecko can be reproduced with oozeshroom juice")
                    .button("Oozeshrooms", "textures/items/oozeshroom_juice")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        oozeshroom(player);
                       }
                      if (result.selection === 1) {
                       nether_mobs(player);
                      }
                })}

                function chorus_mobs(player) {
                  var form = new ActionFormData()
                    .title("Chorus endermans")
                    .body("The chorus is a shroom that can infect endermans.\nWhen an endermite kill an enderman, the enderman will became infected and attack other endermans\nIn the chorus forest biome,Infected enderman, eaten enderman and chorus hearts can naturally spawn. They can infect other endermans and they are very deadly")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       entities(player);
                      }
                })}


                function void_biome_mobs(player) {
                  var form = new ActionFormData()
                    .title("Void biome mobs")
                    .body("In the void biome, almost anything will atack you if you don't wear a pumpkin.\n In this biome you can find a lot of endermans and even void phantoms.\n Some endermans are specials like the shadow enderman who's invisible if he's not exposed to light.")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       entities(player);
                      }
                })}



                function blood_moon(player) {
                  var form = new ActionFormData()
                    .title("Blood moon")
                    .body("Blood moon is an event that occur each 8 nights, you can skip it by sleeping while wearing the §aDreamlike pendant§6 artifact§r\n\n§6Mobs:§r\n-§aBlood zombie and Fat blood zombie:§r\nBlood zombies are the most common mob during blood moons, they drop muscle fiber that ca be eaten to gain strength, or brewed to make strength 2 potion last longer. They can also drop the §aBlood vial§6 artifact§r\nBlood zombies can see you through block\n§aNecromancer:§r\nThe necromancer boost mobs around him, he grant them resistance, regeneration, strength and speed. Necromancers can drop the §aFlesh totem§6 artifact§r\nNecromancers can also summon mobs like baby bloody skeletons or hemoglobin spirit to attack you.\n§aNeoplasm spider:§r\nNeoplasm spiders attack every non blood moon mobs. when a neoplasm spider kill a mob, this one transform into a small neoplasm spider. They can drop a spider mandibule that make entity bleed when you hit them with it")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       entities(player);
                      }
                })}




                //-boss
                function Boss(player) {
                  var form = new ActionFormData()
                    .title("Boss")
                    .body("Who you're gonna kill next?")
                    .button("Main bosses", "textures/ui/wither_icon")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                      mainbosses(player);
                      }
                       if (result.selection === 1) {
                        wiki(player);
                       }
                })}

                //-mainbosses
                function mainbosses(player) {
                  var form = new ActionFormData()
                    .title("Main bosses")
                    .body("You need to kill them to progress in the add-on")
                    .button("The Abomination", "textures/ui/abomination_icon")
                    .button("The Wither", "textures/ui/wither_icon")
                    .button("The Ender dragon", "textures/ui/dragon_icon")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                      abomination(player);
                      }
                      if (result.selection === 1) {
                        wither(player);
                     }
                     if (result.selection === 2) {
                      dragon(player);
                     }
                       if (result.selection === 3) {
                        Boss(player);
                       }
                })} 
                function secondarybosses(player) {
                  var form = new ActionFormData()
                    .title("Secondary bosses")
                    .body("You're not forced to fight them")
                    .button("The Blazeblade", "textures/ui/blazeblade_icon")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                      blazeblade(player);
                      }
                       if (result.selection === 1) {
                        Boss(player);
                       }
                })} 

                function abomination(player) {
                  var form = new ActionFormData()
                    .title("Abomination")
                    .body("First main boss to kill, the abomination need to be summoned\nA failed experiment, He cursed a lot of creature in the world, including you.\nThe only way to uncurse everyone is to kill him, but who's gonna try to kill such a creature?\n\n§6Loots:§r\n-Weakened totem §a100%%§r\n\n-Xp orb(§6Artifact§r) (§bShared§r) §a50%%§r\n-Magic axe(§6Artifact§r) (§bShared§r) §a50%%§r\n-Abomination head §a10%%")
                    .button("Summoning it", "textures/items/abomination_totem")
                    .button("Stats", "textures/ui/stats")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       summon_abo(player);
                      }
                      if (result.selection === 1) {
                        stats_abo(player);
                      }
                      if (result.selection === 2) {
                        mainbosses(player);
                       }
                })}
                

                
                function summon_abo(player) {
                  var form = new ActionFormData()
                    .title("Summoning the Abomination")
                    .body("First you need to find a Strange totem, it can be found in Desert pillagers jail, Small pilager mansion and mesa pillagers outpost\n\nOnce you get a strange totem, you just need to throw it on a gold block on night (the boss despawn on day)")
                    .button("Structures with the totem", "textures/items/abomination_totem")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        overworld_structures(player);
                      }
                      if (result.selection === 1) {
                        abomination(player);
                       }
                })}

                function stats_abo(player) {
                  var form = new ActionFormData()
                    .title("Stats")
                    .body("§6Notable features:§r\n- He can destroy boats/minecarts around him\n- He can fly\n- despawn on day\n- regain health if you're too far from him\n\nMain attacks:§r\n- Contact attack\n- Shooting arrows\n- Summoning evocations fang and vex\n\n§6Easy:§r\n- §4250HP§r in first phase\n- §4150HP§r in second phase§r\n\n§6Normal:§r\n- §4400HP§r in first phase\n- §4300HP§r in second phase\n- Can teleport\n\n§6Hard:§r\n- §4600HP§r in first phase\n- §4450HP§r in second phase\n- Can teleport\n- Can convert horses into zombie horses")
                    .button("Structures with the totem", "textures/items/abomination_totem")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        overworld_structures(player);
                      }
                      if (result.selection === 1) {
                        abomination(player);
                       }
                })}
                function blazeblade(player) {
                  var form = new ActionFormData()
                    .title("Blazeblade")
                    .body("§6Loots:§r\n\n-Explosive blaze rod (§6Artifact§r) (§bShared§r) §a100%%§r\n- Blaze blade (§bShared§r)")
                    .button("Summoning it", "textures/items/artifacts/blaze_heart")
                    .button("Stats", "textures/ui/stats")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       summon_blazeblade(player);
                      }
                      if (result.selection === 1) {
                        stats_blazeblade(player);
                      }
                      if (result.selection === 2) {
                        secondarybosses(player);
                       }
                })}
                function summon_blazeblade(player) {
                  var form = new ActionFormData()
                    .title("Summoning the Blazeblade")
                    .body("First you need to find the blazeblade arena, it can be found on Nether lakes\n\nThe blazebalde will be on it. Click on it with a Blaze heart(§6Artifact§r) to enable it and start the fight ")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        blazeblade(player);
                       }
                })}
                function stats_blazeblade(player) {
                  var form = new ActionFormData()
                    .title("Stats")
                    .body("§6Notable features:§r\n- Being too near of him will damage you (it has blades spinning around it)\n- The solar flare attack disable fire resistance effect\n\nMain attacks:§r\n- Dash attack\n- Summoning fire tornados\n- Solar flare\n- Fire fireballs around itself\n- Slam attack (phase 2)\n\n§6Easy:§r\n- §4200HP§r in first phase\n- §4200HP§r in second phase§r\n\n§6Normal:§r\n- §4300HP§r in first phase\n- §4300HP§r in second phase\n\n§6Hard:§r\n- §4500HP§r in first phase\n- §4500HP§r in second phase")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        blazeblade(player);
                       }
                })}


                function wither(player) {
                  var form = new ActionFormData()
                    .title("Wither")
                    .body("Second main boss to kill, the Wither is a cluster of souls that try to survive in a single being\nThis cluster is very unstable and souls tend to separate from the wither, creating other weird creatures\nBut because of this, this creature is an incredible source of energy that can be used to create beacons, or open a portal to the end...\n\n§6Loots:§r\n-Corrupted star(§6Artifact§r) (§bShared§r) §a100%%§r\n-Mending book §a100%%§r\n-Nether star §a100%%")
                    .button("Stats", "textures/ui/stats")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        stats_wither(player);
                      }
                      if (result.selection === 1) {
                        mainbosses(player);
                       }
                })}
                function stats_wither(player) {
                  var form = new ActionFormData()
                    .title("Stats")
                    .body("§6Notable features:§r\n- He destroy everything around him\n- He can fly\n- despawn on day\n- can only be summoned in the overworld\n\nMain attacks:§r\n- Throw explosives wither heads\n- 'Summoning' small withers on you that attack you\n\n§6Easy:§r\n- §4500HP§r\n\n§6Normal:§r\n- §4900HP§r\n\n§6Hard:§r\n- §41300HP§r")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                    
                      if (result.selection === 0) {
                        wither(player);
                       }
                })}




                function dragon(player) {
                  var form = new ActionFormData()
                    .title("Ender dragon")
                    .body("Third main boss to kill, the Ender dragon is a creature that was summoned by the shulkers to seal the end from any intruder, and to contains the infection in the End\nHer name is Jean\n\n§6Loots:§r\n-Dragon heart(§6Artifact§r) (§bShared§r) §a100%%§r\n-Dragon essence §a100%%§r")
                    .button("Stats", "textures/ui/stats")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        stats_dragon(player);
                      }
                      if (result.selection === 1) {
                        mainbosses(player);
                       }
                })}
                function stats_dragon(player) {
                  var form = new ActionFormData()
                    .title("Stats")
                    .body("§6Notable features:§r\n- Some heretic shulkers will come to attack you\n- There's 3 pillars with cages (2 in vanilla)\n- She summon endermens that hold end crystals\n\nMain attacks:§r\n- shoot dragon balls\n\n§6Easy:§r\n- §4600HP§r\n\n§6Normal:§r\n- §41100HP§r\n- summons endermen that hold end crystals\n\n§6Hard:§r\n- §41700HP§r\n- summons endermen that hold end crystals\n- summons flying endermen that attack you")
                    
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                        dragon(player);
                       }
                })}





                function discord(player) {
                  var form = new ActionFormData()
                    .title("Discord")
                    .body("§adiscord.gg/vtu7baJbRA \n\n§rIn the discord you can submit suggestions, ask questions, having updates sooner than on mcpedl or modbay ( even have betas) and you can report bugs")
                    
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       wiki(player);
                       }
                })}


                function bugs(player) {
                  var form = new ActionFormData()
                    .title("Bugs")
                    .body("§aIf you found a bug you can report it on the discord\n\n§rHere you can found known bugs and how to patch them ( when it's possible")
                    .button("Pickaxes don't mine (mobile)", "textures/items/iron_pickaxe")
                    .button("Ui doesn't work", "textures/ui/workbench")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                      if (result.selection === 0) {
                       pickaxes_bug(player);
                      }
                      if (result.selection === 1) {
                        ui_bug(player);
                       }
                       if (result.selection === 2) {
                        wiki(player);
                       }
                })}

                function ui_bug(player) {
                  var form = new ActionFormData()
                    .title("Ui bug")
                    .body("You need to activate §bClassic ui§r in your setting")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                       if (result.selection === 0) {
                        bugs(player);
                       }
                })}

                function pickaxes_bug(player) {
                  var form = new ActionFormData()
                    .title("Pickaxes bug")
                    .body("You need to change your controls to have a §bdifferent button for mining and placing block")
                    .button("Back", "textures/ui/close")

                    form.show(player).then(result => {
                       if (result.selection === 0) {
                        bugs(player);
                       }
                })}











































                  