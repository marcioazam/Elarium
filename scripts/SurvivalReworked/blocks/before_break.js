import { world ,system,GameMode,ItemStack} from "@minecraft/server"

function getScore(player, objective) {
    try {
      const s = world.scoreboard.getObjective(objective);
      if (!s) world.scoreboard.addObjective(objective, objective);
      return s.getScore(player.scoreboardIdentity);
    } catch {
      return 0;
    }
   }
    function hard_survival_blocks(event){
       try {
           const blockType = event.block.getItemStack().typeId;
           const player = event.player;
           const dimension = player.dimension;
           const mainhandItem = player.getComponent("equippable")?.getEquipment("Mainhand");
           if (player.getGameMode() === 'creative') return
   
   
           const reduceMainhandItem = (item) => {
               const newAmount = item.amount > 1 ? item.amount - 1 : 0;
               const command = newAmount > 0
                   ? `replaceitem entity @s slot.weapon.mainhand 0 ${item.typeId} ${newAmount}`
                   : `replaceitem entity @s slot.weapon.mainhand 0 air`;
               player.runCommandAsync(command);
           };
   
           if (event.block.hasTag("iron") || event.block.hasTag("stone") || event.block.hasTag("metal") || event.block.hasTag("diamond_pick_diggable")) {
               if (!mainhandItem) {
   
                   player.runCommandAsync("effect @s mining_fatigue 60 3");
                   player.runCommandAsync("effect @s weakness 20 3");
                   player.runCommandAsync("damage @s 5");
                   event.cancel = true;
               } else if (!mainhandItem.hasComponent("durability")) {
   
                   reduceMainhandItem(mainhandItem);
                   event.cancel = true;
               }
           }
   
       
   
           if (blockType === "minecraft:stone" || blockType === "minecraft:deepslate") {
               if (mainhandItem.typeId.includes("pickaxe") == false || mainhandItem.typeId.includes("wood") == true) return;
   
               system.runTimeout(() => {
   
                   let newItem = damage_item(mainhandItem)
                   player.getComponent("equippable").setEquipment(EquipmentSlot.Mainhand, newItem)
                   if (!newItem) {
                       if (player instanceof Player) {
                           player.playSound("random.break")
                       }
                   }
               })
           }
   
       } catch (error) {
   
       }
      }

      function reworked_break(ev){
        const item = ev.itemStack
        const block = ev.block;
        const dimension = ev.dimension
        const player = ev.player
        TallPlantDestroy(block)
        oozeshroomFullDestroy(block)
        if (block.hasTag('no_silktouch') && !player.matches({ gameMode: GameMode.creative }) && player?.getComponent('equippable')?.getEquipment('Mainhand')?.getComponent('enchantable')?.getEnchantment("silk_touch")?.level==1){
            ev.cancel = true
            var location = { x: ev.block.location.x, y: ev.block.location.y, z: ev.block.location.z };
            system.runTimeout(() => {
                ev.dimension.runCommandAsync(`setblock ${location.x} ${location.y} ${location.z} air destroy`)
            })
        }
        if (item != undefined){
            if (block.typeId === 'minecraft:mob_spawner' && !player.matches({ gameMode: GameMode.creative }))
            {
           var location = { x: ev.block.location.x, y: ev.block.location.y, z: ev.block.location.z };
           system.runTimeout(() => {
               ev.dimension.runCommandAsync(`structure load spawner_loot ${location.x} ${location.y} ${location.z}`)
           }
        )
        }
        if(block.typeId == "edx:spotter")
        {
            if(player.matches({ gameMode: GameMode.creative })) return;
            var itemdrop = ""
                const type = block.permutation.getState("edx:type");
                    if(type == "fire_opal")
                    {    
                        itemdrop = 'edx:fire_opal'
                        
                    }
                    else if(type == "lapis")
                    {    
                        itemdrop = 'minecraft:lapis_lazuli'
                        
                    }
                    else if(type == "diamond")
                    {    
                        itemdrop = 'minecraft:diamond'
                        
                    }
                    else if(type == "amethyst")
                    {    
                        itemdrop = 'minecraft:amethyst_shard'
                        
                    }
                    else if(type == "ruby")
                    {    
                        itemdrop = 'edx:ruby'
                        
                    }
                    else if(type == "emerald")
                    {    
                        itemdrop = 'minecraft:emerald'
                        
                    }
                    else if(type == "quartz")
                    {    
                        itemdrop = 'minecraft:quartz'
                        
                    }
                if(itemdrop!="")
                {
                    system.runTimeout(() => {
                        dimension.spawnItem(new ItemStack(itemdrop,1), block.location);
                    })
                    
                }
        }
    
    
    
    
    
    
    
    
    
        if(item?.getTags()?.includes('pickaxe_tier1'))
        {
            if(getScore(player,'mode')>=1)
                if(!UnbreakListId.includes(block.below().typeId) || block.below().hasTag('edx:stone'))
                    system.runTimeout(() => {
                        dimension.runCommandAsync(`setblock ${block.below().location.x} ${block.below().location.y} ${block.below().location.z} air destroy`)
                    })
        }
        else if(item?.getTags()?.includes('pickaxe_tier2'))
            {
                if(getScore(player,'mode')==1)
                    if(!UnbreakListId.includes(block.below().typeId) || block.below().hasTag('edx:stone'))
                        system.runTimeout(() => {
                            dimension.runCommandAsync(`setblock ${block.below().location.x} ${block.below().location.y} ${block.below().location.z} air destroy`)
                        })
    
                if(getScore(player,'mode')>=2)
                {
                    const face = player.getBlockFromViewDirection().face
                    system.runTimeout(() => {
                        if(face=='Down'|| face=='Up')
                            {
                                if(!UnbreakListId.includes(block.north().typeId) || block.north().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.north().location.x} ${block.north().location.y} ${block.north().location.z} air destroy`)
                                if(!UnbreakListId.includes(block.east().typeId) || block.east().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.east().location.x} ${block.east().location.y} ${block.east().location.z} air destroy`)
                                if(!UnbreakListId.includes(block.south().typeId) || block.south().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.south().location.x} ${block.south().location.y} ${block.south().location.z} air destroy`)
                                if(!UnbreakListId.includes(block.west().typeId) || block.west().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.west().location.x} ${block.west().location.y} ${block.west().location.z} air destroy`)
                            }
                        else if(face=='West'|| face=='East')
                            {
                                if(!UnbreakListId.includes(block.above().typeId) || block.above().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.above().location.x} ${block.above().location.y} ${block.above().location.z} air destroy`)
                                if(!UnbreakListId.includes(block.north().typeId) || block.north().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.north().location.x} ${block.north().location.y} ${block.north().location.z} air destroy`)
                                if(!UnbreakListId.includes(block.below().typeId) || block.below().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.below().location.x} ${block.below().location.y} ${block.below().location.z} air destroy`)
                                if(!UnbreakListId.includes(block.south().typeId) || block.south().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.south().location.x} ${block.south().location.y} ${block.south().location.z} air destroy`)
                            }
                        else if(face=='North'|| face=='South')
                            {
                                if(!UnbreakListId.includes(block.above().typeId) || block.above().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.above().location.x} ${block.above().location.y} ${block.above().location.z} air destroy`)
                                if(!UnbreakListId.includes(block.east().typeId) || block.east().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.east().location.x} ${block.east().location.y} ${block.east().location.z} air destroy`)
                                if(!UnbreakListId.includes(block.below().typeId) || block.below().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.below().location.x} ${block.below().location.y} ${block.below().location.z} air destroy`)
                                if(!UnbreakListId.includes(block.west().typeId) || block.west().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.west().location.x} ${block.west().location.y} ${block.west().location.z} air destroy`)
                            }
        
                    })
                    
                }
            }
        else if(item?.getTags()?.includes('pickaxe_tier3'))
            {
                if(getScore(player,'mode')==1)
                    if(!UnbreakListId.includes(block.below().typeId) || block.below().hasTag('edx:stone'))
                    system.runTimeout(() => {
                        dimension.runCommandAsync(`setblock ${block.below().location.x} ${block.below().location.y} ${block.below().location.z} air destroy`)
                    })
                if(getScore(player,'mode')==2)
                {
                    const face = player.getBlockFromViewDirection().face;
                    system.runTimeout(() => {
                        if(face==='Down'|| face==='Up')
                            {
                                if(!UnbreakListId.includes(block.north().typeId) || block.north().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.north().location.x} ${block.north().location.y} ${block.north().location.z} air destroy`)
                                if(!UnbreakListId.includes(block.east().typeId) || block.east().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.east().location.x} ${block.east().location.y} ${block.east().location.z} air destroy`)
                                if(!UnbreakListId.includes(block.south().typeId) || block.south().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.south().location.x} ${block.south().location.y} ${block.south().location.z} air destroy`)
                                if(!UnbreakListId.includes(block.west().typeId) || block.west().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.west().location.x} ${block.west().location.y} ${block.west().location.z} air destroy`)
                            }
                        else if(face==='West'|| face==='East')
                            {
                                if(!UnbreakListId.includes(block.above().typeId) || block.above().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.above().location.x} ${block.above().location.y} ${block.above().location.z} air destroy`)
                                if(!UnbreakListId.includes(block.north().typeId) || block.north().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.north().location.x} ${block.north().location.y} ${block.north().location.z} air destroy`)
                                if(!UnbreakListId.includes(block.below().typeId) || block.below().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.below().location.x} ${block.below().location.y} ${block.below().location.z} air destroy`)
                                if(!UnbreakListId.includes(block.south().typeId) || block.south().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.south().location.x} ${block.south().location.y} ${block.south().location.z} air destroy`)
                            }
                        else if(face==='North'|| face==='South')
                            {
                                if(!UnbreakListId.includes(block.above().typeId) || block.above().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.above().location.x} ${block.above().location.y} ${block.above().location.z} air destroy`)
                                if(!UnbreakListId.includes(block.east().typeId) || block.east().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.east().location.x} ${block.east().location.y} ${block.east().location.z} air destroy`)
                                if(!UnbreakListId.includes(block.below().typeId) || block.below().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.below().location.x} ${block.below().location.y} ${block.below().location.z} air destroy`)
                                if(!UnbreakListId.includes(block.west().typeId) || block.west().hasTag('edx:stone'))
                                    dimension.runCommandAsync(`setblock ${block.west().location.x} ${block.west().location.y} ${block.west().location.z} air destroy`)
                            }
        
                    })
    
                }
                if(getScore(player,'mode')>=3)
                    {
                        const face = player?.getBlockFromViewDirection().face;
                        system.runTimeout(() => {
                            if(face=='Down'|| face=='Up')
                                {
                                    if(!UnbreakListId.includes(block.north().typeId) || block.north().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.north().location.x} ${block.north().location.y} ${block.north().location.z} air destroy`)
                                    if(!UnbreakListId.includes(block.east().typeId) || block.east().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.east().location.x} ${block.east().location.y} ${block.east().location.z} air destroy`)
                                    if(!UnbreakListId.includes(block.south().typeId) || block.south().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.south().location.x} ${block.south().location.y} ${block.south().location.z} air destroy`)
                                    if(!UnbreakListId.includes(block.west().typeId) || block.west().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.west().location.x} ${block.west().location.y} ${block.west().location.z} air destroy`)
        
                                    if(!UnbreakListId.includes(block.north().east().typeId) || block.north().east().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.north().east().location.x} ${block.north().east().location.y} ${block.north().east().location.z} air destroy`)
                                    if(!UnbreakListId.includes(block.north().west().typeId) || block.north().west().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.north().west().location.x} ${block.north().west().location.y} ${block.north().west().location.z} air destroy`)
                                    if(!UnbreakListId.includes(block.south().east().typeId) || block.south().east().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.south().east().location.x} ${block.south().east().location.y} ${block.south().east().location.z} air destroy`)
                                    if(!UnbreakListId.includes(block.south().west().typeId) || block.south().west().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.south().west().location.x} ${block.south().west().location.y} ${block.south().west().location.z} air destroy`)
                                }
                            if(face=='West'|| face=='East')
                                {
                                    if(!UnbreakListId.includes(block.above().typeId) || block.above().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.above().location.x} ${block.above().location.y} ${block.above().location.z} air destroy`)
                                    if(!UnbreakListId.includes(block.north().typeId) || block.north().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.north().location.x} ${block.north().location.y} ${block.north().location.z} air destroy`)
                                    if(!UnbreakListId.includes(block.below().typeId) || block.below().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.below().location.x} ${block.below().location.y} ${block.below().location.z} air destroy`)
                                    if(!UnbreakListId.includes(block.south().typeId) || block.south().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.south().location.x} ${block.south().location.y} ${block.south().location.z} air destroy`)
        
                                    if(!UnbreakListId.includes(block.north().above().typeId) || block.north().above().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.north().above().location.x} ${block.north().above().location.y} ${block.north().above().location.z} air destroy`)
                                    if(!UnbreakListId.includes(block.north().below().typeId) || block.north().below().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.north().below().location.x} ${block.north().below().location.y} ${block.north().below().location.z} air destroy`)
                                    if(!UnbreakListId.includes(block.south().above().typeId) || block.south().above().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.south().above().location.x} ${block.south().above().location.y} ${block.south().above().location.z} air destroy`)
                                    if(!UnbreakListId.includes(block.south().below().typeId) || block.south().below().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.south().below().location.x} ${block.south().below().location.y} ${block.south().below().location.z} air destroy`)
                                }
                            if(face=='North'|| face=='South')
                                {
                                    if(!UnbreakListId.includes(block.above().typeId) || block.above().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.above().location.x} ${block.above().location.y} ${block.above().location.z} air destroy`)
                                    if(!UnbreakListId.includes(block.east().typeId) || block.east().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.east().location.x} ${block.east().location.y} ${block.east().location.z} air destroy`)
                                    if(!UnbreakListId.includes(block.below().typeId) || block.below().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.below().location.x} ${block.below().location.y} ${block.below().location.z} air destroy`)
                                    if(!UnbreakListId.includes(block.west().typeId) || block.west().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.west().location.x} ${block.west().location.y} ${block.west().location.z} air destroy`)
        
                                    if(!UnbreakListId.includes(block.east().above().typeId) || block.east().above().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.east().above().location.x} ${block.east().above().location.y} ${block.east().above().location.z} air destroy`)
                                    if(!UnbreakListId.includes(block.east().below().typeId) || block.east().below().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.east().below().location.x} ${block.east().below().location.y} ${block.east().below().location.z} air destroy`)
                                    if(!UnbreakListId.includes(block.west().above().typeId) || block.west().above().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.west().above().location.x} ${block.west().above().location.y} ${block.west().above().location.z} air destroy`)
                                    if(!UnbreakListId.includes(block.west().below().typeId) || block.west().below().hasTag('edx:stone'))
                                        dimension.runCommandAsync(`setblock ${block.west().below().location.x} ${block.west().below().location.y} ${block.west().below().location.z} air destroy`)
                                }
                        })
                        
        
                    }
            }
    
            if(item?.getTags()?.includes('shovel_tier1'))
            {
                if(getScore(player,'mode')>=1)
                    if(shovelBreak.includes(block.below().typeId) || block.below().hasTag('edx:shovel'))
                        system.runTimeout(() => {
                            dimension.runCommandAsync(`setblock ${block.below().location.x} ${block.below().location.y} ${block.below().location.z} air destroy`)
                        })
            }
            else if(item?.getTags()?.includes('shovel_tier2'))
                {
                    if(getScore(player,'mode')==1)
                        if(shovelBreak.includes(block.below().typeId) || block.below().hasTag('edx:shovel'))
                            system.runTimeout(() => {
                                dimension.runCommandAsync(`setblock ${block.below().location.x} ${block.below().location.y} ${block.below().location.z} air destroy`)
                            })
        
                    if(getScore(player,'mode')>=2)
                    {
                        const face = player?.getBlockFromViewDirection().face;
                        system.runTimeout(() => {
                            if(face=='Down'|| face=='Up')
                                {
                                    if(shovelBreak.includes(block.north().typeId) || block.north().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.north().location.x} ${block.north().location.y} ${block.north().location.z} air destroy`)
                                    if(shovelBreak.includes(block.east().typeId) || block.east().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.east().location.x} ${block.east().location.y} ${block.east().location.z} air destroy`)
                                    if(shovelBreak.includes(block.south().typeId) || block.south().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.south().location.x} ${block.south().location.y} ${block.south().location.z} air destroy`)
                                    if(shovelBreak.includes(block.west().typeId) || block.west().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.west().location.x} ${block.west().location.y} ${block.west().location.z} air destroy`)
                                }
                            else if(face=='West'|| face=='East')
                                {
                                    if(shovelBreak.includes(block.above().typeId) || block.above().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.above().location.x} ${block.above().location.y} ${block.above().location.z} air destroy`)
                                    if(shovelBreak.includes(block.north().typeId) || block.north().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.north().location.x} ${block.north().location.y} ${block.north().location.z} air destroy`)
                                    if(shovelBreak.includes(block.below().typeId) || block.below().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.below().location.x} ${block.below().location.y} ${block.below().location.z} air destroy`)
                                    if(shovelBreak.includes(block.south().typeId) || block.south().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.south().location.x} ${block.south().location.y} ${block.south().location.z} air destroy`)
                                }
                            else if(face=='North'|| face=='South')
                                {
                                    if(shovelBreak.includes(block.above().typeId) || block.above().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.above().location.x} ${block.above().location.y} ${block.above().location.z} air destroy`)
                                    if(shovelBreak.includes(block.east().typeId) || block.east().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.east().location.x} ${block.east().location.y} ${block.east().location.z} air destroy`)
                                    if(shovelBreak.includes(block.below().typeId) || block.below().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.below().location.x} ${block.below().location.y} ${block.below().location.z} air destroy`)
                                    if(shovelBreak.includes(block.west().typeId) || block.west().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.west().location.x} ${block.west().location.y} ${block.west().location.z} air destroy`)
                                }
            
                        })
                        
                    }
                }
            else if(item?.getTags()?.includes('shovel_tier3'))
                {
                    if(getScore(player,'mode')==1)
                        if(shovelBreak.includes(block.below()))
                        system.runTimeout(() => {
                            dimension.runCommandAsync(`setblock ${block.below().location.x} ${block.below().location.y} ${block.below().location.z} air destroy`)
                        })
                    if(getScore(player,'mode')==2)
                    {
                        const face = player?.getBlockFromViewDirection().face;
                        system.runTimeout(() => {
                            if(face=='Down'|| face=='Up')
                                {
                                    if(shovelBreak.includes(block.north().typeId) || block.north().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.north().location.x} ${block.north().location.y} ${block.north().location.z} air destroy`)
                                    if(shovelBreak.includes(block.east().typeId) || block.east().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.east().location.x} ${block.east().location.y} ${block.east().location.z} air destroy`)
                                    if(shovelBreak.includes(block.south().typeId) || block.south().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.south().location.x} ${block.south().location.y} ${block.south().location.z} air destroy`)
                                    if(shovelBreak.includes(block.west().typeId) || block.west().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.west().location.x} ${block.west().location.y} ${block.west().location.z} air destroy`)
                                }
                            else if(face=='West'|| face=='East')
                                {
                                    if(shovelBreak.includes(block.above().typeId) || block.above().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.above().location.x} ${block.above().location.y} ${block.above().location.z} air destroy`)
                                    if(shovelBreak.includes(block.north().typeId) || block.north().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.north().location.x} ${block.north().location.y} ${block.north().location.z} air destroy`)
                                    if(shovelBreak.includes(block.below().typeId) || block.below().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.below().location.x} ${block.below().location.y} ${block.below().location.z} air destroy`)
                                    if(shovelBreak.includes(block.south().typeId) || block.south().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.south().location.x} ${block.south().location.y} ${block.south().location.z} air destroy`)
                                }
                            else if(face=='North'|| face=='South')
                                {
                                    if(shovelBreak.includes(block.above().typeId) || block.above().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.above().location.x} ${block.above().location.y} ${block.above().location.z} air destroy`)
                                    if(shovelBreak.includes(block.east().typeId) || block.east().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.east().location.x} ${block.east().location.y} ${block.east().location.z} air destroy`)
                                    if(shovelBreak.includes(block.below().typeId) || block.below().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.below().location.x} ${block.below().location.y} ${block.below().location.z} air destroy`)
                                    if(shovelBreak.includes(block.west().typeId) || block.west().hasTag('edx:shovel'))
                                        dimension.runCommandAsync(`setblock ${block.west().location.x} ${block.west().location.y} ${block.west().location.z} air destroy`)
                                }
            
                        })
        
                    }
                    if(getScore(player,'mode')>=3)
                        {
                            const face = player?.getBlockFromViewDirection().face;
                            system.runTimeout(() => {
                                if(face=='Down'|| face=='Up')
                                    {
                                        if(shovelBreak.includes(block.north().typeId) || block.north().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.north().location.x} ${block.north().location.y} ${block.north().location.z} air destroy`)
                                        if(shovelBreak.includes(block.east().typeId) || block.east().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.east().location.x} ${block.east().location.y} ${block.east().location.z} air destroy`)
                                        if(shovelBreak.includes(block.south().typeId) || block.south().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.south().location.x} ${block.south().location.y} ${block.south().location.z} air destroy`)
                                        if(shovelBreak.includes(block.west().typeId) || block.west().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.west().location.x} ${block.west().location.y} ${block.west().location.z} air destroy`)
            
                                        if(shovelBreak.includes(block.north().east().typeId) || block.north().east().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.north().east().location.x} ${block.north().east().location.y} ${block.north().east().location.z} air destroy`)
                                        if(shovelBreak.includes(block.north().west().typeId) || block.north().west().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.north().west().location.x} ${block.north().west().location.y} ${block.north().west().location.z} air destroy`)
                                        if(shovelBreak.includes(block.south().east().typeId) || block.south().east().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.south().east().location.x} ${block.south().east().location.y} ${block.south().east().location.z} air destroy`)
                                        if(shovelBreak.includes(block.south().west().typeId) || block.south().west().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.south().west().location.x} ${block.south().west().location.y} ${block.south().west().location.z} air destroy`)
                                    }
                                if(face=='West'|| face=='East')
                                    {
                                        if(shovelBreak.includes(block.above().typeId) || block.above().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.above().location.x} ${block.above().location.y} ${block.above().location.z} air destroy`)
                                        if(shovelBreak.includes(block.north().typeId) || block.north().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.north().location.x} ${block.north().location.y} ${block.north().location.z} air destroy`)
                                        if(shovelBreak.includes(block.below().typeId) || block.below().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.below().location.x} ${block.below().location.y} ${block.below().location.z} air destroy`)
                                        if(shovelBreak.includes(block.south().typeId) || block.south().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.south().location.x} ${block.south().location.y} ${block.south().location.z} air destroy`)
            
                                        if(shovelBreak.includes(block.north().above().typeId) || block.north().above().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.north().above().location.x} ${block.north().above().location.y} ${block.north().above().location.z} air destroy`)
                                        if(shovelBreak.includes(block.north().below().typeId) || block.north().below().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.north().below().location.x} ${block.north().below().location.y} ${block.north().below().location.z} air destroy`)
                                        if(shovelBreak.includes(block.south().above().typeId) || block.south().above().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.south().above().location.x} ${block.south().above().location.y} ${block.south().above().location.z} air destroy`)
                                        if(shovelBreak.includes(block.south().below().typeId) || block.south().below().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.south().below().location.x} ${block.south().below().location.y} ${block.south().below().location.z} air destroy`)
                                    }
                                if(face=='North'|| face=='South')
                                    {
                                        if(shovelBreak.includes(block.above().typeId) || block.above().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.above().location.x} ${block.above().location.y} ${block.above().location.z} air destroy`)
                                        if(shovelBreak.includes(block.east().typeId) || block.east().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.east().location.x} ${block.east().location.y} ${block.east().location.z} air destroy`)
                                        if(shovelBreak.includes(block.below().typeId) || block.below().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.below().location.x} ${block.below().location.y} ${block.below().location.z} air destroy`)
                                        if(shovelBreak.includes(block.west().typeId) || block.west().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.west().location.x} ${block.west().location.y} ${block.west().location.z} air destroy`)
            
                                        if(shovelBreak.includes(block.east().above().typeId) || block.east().above().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.east().above().location.x} ${block.east().above().location.y} ${block.east().above().location.z} air destroy`)
                                        if(shovelBreak.includes(block.east().below().typeId) || block.east().below().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.east().below().location.x} ${block.east().below().location.y} ${block.east().below().location.z} air destroy`)
                                        if(shovelBreak.includes(block.west().above().typeId) || block.west().above().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.west().above().location.x} ${block.west().above().location.y} ${block.west().above().location.z} air destroy`)
                                        if(shovelBreak.includes(block.west().below().typeId) || block.west().below().hasTag('edx:shovel'))
                                            dimension.runCommandAsync(`setblock ${block.west().below().location.x} ${block.west().below().location.y} ${block.west().below().location.z} air destroy`)
                                    }
                            })
                            
            
                        }
                }
        }
      }

const UnbreakListId = ["air","bedrock","end_portal_frame","reinforced_deepslate","edx:runic_chest"]
world.beforeEvents.playerBreakBlock.subscribe(ev => {

    hard_survival_blocks(ev);
    reworked_break(ev);
    
})

function oozeshroomFullDestroy(block)
{
    if(block?.permutation?.getState("edx:type")==="top" && block?.permutation?.getState("edx:juice")==="full") 
        system.runTimeout(() => {
        block.dimension.spawnParticle('edx:oozeshroom_full_destroy',block.below().center());
        },2)
    else if(block?.permutation?.getState("edx:juice")==="full")
        system.runTimeout(() => {
            block.dimension.spawnParticle('edx:oozeshroom_full_destroy',block.center());
            },2)
}
function TallPlantDestroy(block)
{
    const type = block.permutation.getState("edx:type")
    if(type==="top" && block.below()?.permutation?.getState("edx:type")=='bottom')
    {
        system.runTimeout(() => {
            block.below().setType('minecraft:air');
        })
    }
    else if(type==="bottom" && block.above()?.permutation?.getState("edx:type")=='top')
    {
        system.runTimeout(() => {
            block.above().setType('minecraft:air');
        })
       
    }
}

const shovelBreak = [
    "minecraft:clay",
    "minecraft:dirt",
    "minecraft:dirt_with_roots",
    "minecraft:coarse_dirt",
    "minecraft:black_concrete_powder",
    "minecraft:white_concrete_powder",
    "minecraft:gray_concrete_powder",
    "minecraft:light_gray_concrete_powder",
    "minecraft:blue_concrete_powder",
    "minecraft:brown_concrete_powder",
    "minecraft:cyan_concrete_powder",
    "minecraft:green_concrete_powder",
    "minecraft:light_blue_concrete_powder",
    "minecraft:lime_concrete_powder",
    "minecraft:magenta_concrete_powder",
    "minecraft:orange_concrete_powder",
    "minecraft:pink_concrete_powder",
    "minecraft:powder_snow",
    "minecraft:purple_concrete_powder",
    "minecraft:red_concrete_powder",
    "minecraft:yellow_concrete_powder",
    "minecraft:farmland",
    "minecraft:grass_block",
    "minecraft:grass_path",
    "minecraft:gravel",
    "minecraft:mud",
    "minecraft:mycelium",
    "minecraft:podzol",
    "minecraft:sand",
    "minecraft:red_sand",
    "minecraft:soul_sand",
    "minecraft:soul_soil",
    "minecraft:snow",
    "minecraft:snow_layer"
]
