import {EquipmentSlot, world, BlockPermutation,system,ItemStack,BlockVolume,GameMode,MolangVariableMap} from '@minecraft/server';

const rotation = ["None","Rotate180","Rotate90","Rotate270"]
const armorSlots = [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet, EquipmentSlot.Offhand];

world.beforeEvents.worldInitialize.subscribe(async eventData => {
    
    
    eventData.blockComponentRegistry.registerCustomComponent('edx:oozeshroom_full_particle', {
        onTick({block,dimension}) {
            if (block.above().typeId !="minecraft:air" && block?.above()?.permutation?.getState("edx:type")!="top"  && block?.permutation?.getState("edx:type")=="bottom" ) {
                block.setType('minecraft:air');
            }
            dimension.spawnParticle('edx:oozeshroom_full_particle',block.bottomCenter());
            
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:oozeshroom_full_interact', {
        onPlayerInteract({ block, player}) {
                const equipment = player.getComponent('equippable'); 
                const selectedItem = equipment.getEquipment('Mainhand');
                if (selectedItem && (selectedItem.typeId === 'minecraft:glass_bottle')) {
                    player.getComponent("inventory").container.addItem(new ItemStack('edx:oozeshroom_juice', 1))
                    block.setPermutation(BlockPermutation.resolve(block.typeId, {...block.permutation.getAllStates(),'edx:juice': "empty"}));
                    if(block?.permutation?.getState("edx:type")=="top")
                        block.below().setPermutation(BlockPermutation.resolve(block.typeId, {...block.below().permutation.getAllStates(),'edx:juice': "empty"}));
                    else
                        block.above().setPermutation(BlockPermutation.resolve(block.typeId, {...block.above().permutation.getAllStates(),'edx:juice': "empty"}));
                        block.dimension.playSound('bottle.fill',block.location);
                        if (!player.matches({ gameMode: GameMode.creative })) {
                            if (selectedItem.amount > 1) {
                                selectedItem.amount -= 1;
                                equipment.setEquipment('Mainhand', selectedItem);
                            } else {
                                equipment.setEquipment('Mainhand', undefined); // Clear the slot if only 1 item left
                            }
                            
                        }
                    
                }
            
            
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:oozeshroom_grow', {
        onRandomTick({block,dimension}) {
            try {
                if (block.above().typeId !="minecraft:air" && block?.above()?.permutation?.getState("edx:type")!="top" && block?.permutation?.getState("edx:type")=="bottom" ) {
                    block.setType('minecraft:air');
                }
                if(block.above().typeId == "edx:oozeshroom" && block.below().typeId == "minecraft:warped_nylium" && Math.random()<0.1)
                {
                    block.setPermutation(BlockPermutation.resolve(block.typeId, {...block.permutation.getAllStates(),'edx:juice': "full"}));
                    block.above().setPermutation(BlockPermutation.resolve(block.typeId, {...block.above().permutation.getAllStates(),'edx:juice': "full",'edx:type': "top"}));
                }
              } catch(e) {}
            
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:crimsonspire_stem_random', {
        onTick({block}) {
            try {
                if(block?.permutation?.getState("edx:placed")==false) 
                {
                    const heightExist = block?.permutation?.getState("edx:random_height")
                    const rotation = Math.random()<0.25?"north":Math.random()>=0.25 && Math.random()<0.5?"south":Math.random()>=0.5 && Math.random()<0.75?"east":"west"
                    if(heightExist!=undefined)
                    {
                        const height = Math.random()<0.5? 1 : 2
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {...block.permutation.getAllStates(),'minecraft:cardinal_direction': rotation,'edx:random_height': height,'edx:placed': true}));

                        
                    }
                    else
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {...block.permutation.getAllStates(),'minecraft:cardinal_direction': rotation,'edx:placed': true}));

                }
                
                
              } catch(e) {}
            
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:crimsonspire_stem_break', {
        onPlayerDestroy({block}) {
            crimsonspireStemBreak(block)
            
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:crimsonspire_cap_spores', {
        onTick({block,dimension}) {
            dimension.spawnParticle('edx:crimsonspire_spores',block.bottomCenter());
            
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:shroom_fruit_tick', {
        onRandomTick({block}) {
            const direction = block.permutation.getState("minecraft:block_face")
            let randomTick = Math.random() <= 1/6;
            if(block.permutation?.getState('edx:stage') < 2)
            { 
                if(randomTick )
                block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:block_face": direction,"edx:stage": block.permutation.getState("edx:stage")+1}));
            }
        } 
    }),
    
    eventData.blockComponentRegistry.registerCustomComponent('edx:crimsonspire_cap_grow', {
        onRandomTick({block,dimension}) {
            try {
                if(block.above().isAir && Math.random()<0.2)
                {
                    const stillGrow = Math.random()<0.2?false:true
                    block.setType('edx:crimsonspire_stem')
                    block.above().setPermutation(BlockPermutation.resolve('edx:crimsonspire_cap', {'edx:grow': stillGrow}));
                }
              } catch(e) {}
            
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:crimsonspire_seed', {
        onRandomTick({block,dimension}) {
            try {
                if(block.above().isAir && Math.random()<0.2)
                {
                    block.setType('edx:crimsonspire_stem')
                    block.above().setPermutation(BlockPermutation.resolve('edx:crimsonspire_cap', {'edx:grow': true}));
                }
              } catch(e) {}
            
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:tall_plant', {
        beforeOnPlayerPlace: e => {
            const {block,player} = e;
            if (block.above().typeId !="minecraft:air" ) {
                e.cancel = true;
            }
            else
            {
                const equipment = player.getComponent('equippable');
                const selectedItem = equipment.getEquipment('Mainhand');
                block.above().setPermutation(BlockPermutation.resolve(selectedItem.typeId, {...block.permutation.getAllStates(),'edx:type': 'top'}));
            }
        }
    
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:lapis_spotter_interact', {
       onPlayerInteract({player,block}){
        var xp = block.permutation.getState("edx:xp")
        var ten_xp = block.permutation.getState("edx:ten_xp")
        player.addExperience(xp+ten_xp*10)
        block.setPermutation(BlockPermutation.resolve(block.typeId, {...block.permutation.getAllStates(),'edx:xp': 0,'edx:ten_xp': 0}));
       },
       onTick: ({ block,dimension }) => {
        var xp = block.permutation.getState("edx:xp")
        var ten_xp = block.permutation.getState("edx:ten_xp")
        const x =(xp+ten_xp*10)/10
        if(Math.random()<(1/(-(x+1))+1))
            dimension.spawnParticle('edx:xp_amount_spotter',block.center());
       }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:spotter_interact', {
        onPlayerInteract({player,block,dimension}){
            var type = ""
            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment('Mainhand');
            if(selectedItem!=undefined)
                if(selectedItem.typeId == 'edx:fire_opal')
                {    
                    type = "fire_opal"
                }
                else if(selectedItem.typeId == 'minecraft:lapis_lazuli')
                {    
                    type = "lapis"
                }
                else if(selectedItem.typeId == 'minecraft:diamond')
                {    
                    type = "diamond"
                }
                else if(selectedItem.typeId == 'minecraft:amethyst_shard')
                {    
                    type = "amethyst"
                }
                else if(selectedItem.typeId == 'edx:ruby')
                {    
                    type = "ruby"
                }
                else if(selectedItem.typeId == 'minecraft:emerald')
                {    
                    type = "emerald"
                }
                else if(selectedItem.typeId == 'minecraft:quartz')
                {    
                    type = "quartz"
                }
            if(type!="")
            {
                if (!player.matches({ gameMode: GameMode.creative }) ) {
                    if (selectedItem.amount > 1) {
                        selectedItem.amount -= 1;
                        equipment.setEquipment('Mainhand', selectedItem);
                    } else {
                        equipment.setEquipment('Mainhand', undefined); 
                    }
                }
                const direction = block.permutation.getState("minecraft:facing_direction")
                const enabled = block.permutation.getState("edx:enabled")
                dimension.playSound('lodestone_compass.link_compass_to_lodestone',block.location);
                block.setPermutation(BlockPermutation.resolve(block.typeId, {...block.permutation.getAllStates(),"minecraft:facing_direction": direction,"edx:type": type,"edx:enabled": enabled}));
            }
            
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:spotter_off', {
        onTick: ({ block,dimension }) => {
            const type = block.permutation.getState("edx:type")
            const direction = block.permutation.getState("minecraft:facing_direction")
            var dir = {x:0,y:1,z:0}
            if(direction=='up')
                dir = {x:0,y:1,z:0}
            else if(direction=='down')
                dir = {x:0,y:-1,z:0}
            else if(direction=='north')
                dir = {x:0,y:0,z:-1}
            else if(direction=='south')
                dir = {x:0,y:0,z:1}
            else if(direction=='west')
                dir = {x:-1,y:0,z:0}
            else if(direction=='east')
                dir = {x:1,y:0,z:0}
            try {
                var distance = 4
                var options = { maxDistance: 4}
                if(type==='amethyst')
                {
                    distance = 12
                    options = { maxDistance: 12}
                }
                const rayBlock = dimension.getBlockFromRay({x:block.center().x+dir.x,y:block.center().y+dir.y,z:block.center().z+dir.z},dir,options)?.block
                if(rayBlock!=undefined)
                {
                    distance = Math.sqrt(
                        Math.pow(block.x - rayBlock.x, 2) +
                        Math.pow(block.y - rayBlock.y, 2) +
                        Math.pow(block.z - rayBlock.z, 2)
                    )-1;
                }
                let entities = dimension.getEntities({location:{x:block.x+dir.x,y:block.y+dir.y,z:block.z+dir.z},volume:{x:dir.x*distance,y:dir.y*distance,z:dir.z*distance}});
                for (let i = 0; i < entities.length ; i++) {
                        if(entities[i].typeId == "minecraft:player") 
                        {
                            const direction = block.permutation.getState("minecraft:facing_direction")
                            dimension.playSound('crafter.craft',block.location);
                            block.setPermutation(BlockPermutation.resolve(block.typeId, {...block.permutation.getAllStates(),"minecraft:facing_direction": direction,"edx:type": type,"edx:enabled": true}));
                        }
                    
                }
              } catch(e) {}
       }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:spotter_on', {
        onTick: ({ block,dimension }) => {
            dimension.playSound('particle.soul_escape',block.location);
            const type = block.permutation.getState("edx:type")
            const direction = block.permutation.getState("minecraft:facing_direction")
            var dir = {x:0,y:1,z:0}
            var pardir = {x:0,y:1,z:0}
            if(direction=='up'){
                dir = {x:0,y:1,z:0}
                pardir = {x:0,y:1,z:-0.5}
            }
            else if(direction=='down'){
                dir = {x:0,y:-1,z:0}
                pardir = {x:0,y:-1,z:0.5}
            } 
            else if(direction=='north'){
                dir = {x:0,y:0,z:-1}
                pardir = {x:0,y:-0.5,z:-1}
            }
            else if(direction=='south'){
                dir = {x:0,y:0,z:1}
                pardir = {x:0,y:-0.5,z:1}
            }
            else if(direction=='west'){
                dir = {x:-1,y:0,z:0}
                pardir = {x:-1,y:-0.5,z:0}
            }
            else if(direction=='east'){
                dir = {x:1,y:0,z:0}
                pardir = {x:1,y:-0.5,z:0}
            }
               
            try {
                var options = { maxDistance:  4}
                const vmap = new MolangVariableMap();
                vmap.setVector3('variable.direction', {x:dir.x,y:dir.y,z:dir.z});
                
                var distance = 4
                const rayBlock = dimension.getBlockFromRay({x:block.center().x+dir.x,y:block.center().y+dir.y,z:block.center().z+dir.z},dir,options)?.block
                if(rayBlock!=undefined)
                {
                    distance = Math.sqrt(
                        Math.pow(block.x - rayBlock.x, 2) +
                        Math.pow(block.y - rayBlock.y, 2) +
                        Math.pow(block.z - rayBlock.z, 2)
                    )-1;
                }
                var enable=false;
                let entities = dimension.getEntities({location:{x:block.x+dir.x,y:block.y+dir.y,z:block.z+dir.z},volume:{x:dir.x*distance,y:dir.y*distance,z:dir.z*distance}});
                for (let i = 0; i < entities.length ; i++) {
                    if(entities[i].typeId == "minecraft:player") 
                    {
                        enable=true
                    }
                }
                if(type == 'none')
                    dimension.spawnParticle('edx:souls_spotter',{x:block.center().x+pardir.x/2,y:block.center().y+pardir.y/2,z:block.center().z+pardir.z/2},vmap);
                else if(type == 'amethyst')
                {
                    distance = 12
                    options = { maxDistance: 12}
                    let entities = dimension.getEntities({location:{x:block.x+dir.x,y:block.y+dir.y,z:block.z+dir.z},volume:{x:dir.x*distance,y:dir.y*distance,z:dir.z*distance}});
                    for (let i = 0; i < entities.length ; i++) {
                        if(entities[i].typeId == "minecraft:player") 
                        {
                            enable=true
                        }
                    }
                    dimension.spawnParticle('edx:souls_spotter',{x:block.center().x+pardir.x/2,y:block.center().y+pardir.y/2,z:block.center().z+pardir.z/2},vmap);
                }
                else if(type == 'quartz')
                {
                    
                    dimension.spawnParticle('edx:quartz_spotter',{x:block.center().x+dir.x*distance*1.2,y:block.center().y+dir.y*distance*1.2,z:block.center().z+dir.z*distance*1.2},vmap);
                    let entities = dimension.getEntities({location:{x:block.x+dir.x,y:block.y+dir.y,z:block.z+dir.z},volume:{x:dir.x*distance,y:dir.y*distance,z:dir.z*distance}});
                    for (let i = 0; i < entities.length ; i++) {
                        if(entities[i].typeId == "minecraft:player") 
                        {
                            dimension.spawnParticle('edx:souls_spotter',{x:entities[i].location.x,y:entities[i].location.y+1,z:entities[i].location.z});
                            dimension.playSound('particle.soul_escape',entities[i].location);
                            entities[i].runCommand('effect @s clear')
                        }
                    }
                } 
                else if(type == 'emerald')
                {
                    dimension.spawnParticle('edx:emerald_spotter',{x:block.center().x+dir.x*distance*1.2,y:block.center().y+dir.y*distance*1.2,z:block.center().z+dir.z*distance*1.2},vmap);
                    let entities = dimension.getEntities({location:{x:block.x+dir.x,y:block.y+dir.y,z:block.z+dir.z},volume:{x:dir.x*distance,y:dir.y*distance,z:dir.z*distance}});
                    for (let i = 0; i < entities.length ; i++) {
                        if(entities[i].typeId == "minecraft:player") 
                        {
                            const equipment = entities[i].getComponent('equippable');
                            spotterDropItem(block,equipment,'Mainhand',dir,entities[i])
                        }
                    }
                } 
                else if(type == 'ruby')
                    {
                        dimension.spawnParticle('edx:ruby_spotter',{x:block.center().x+dir.x*distance*1.2,y:block.center().y+dir.y*distance*1.2,z:block.center().z+dir.z*distance*1.2},vmap);
                        let entities = dimension.getEntities({location:{x:block.x+dir.x,y:block.y+dir.y,z:block.z+dir.z},volume:{x:dir.x*distance,y:dir.y*distance,z:dir.z*distance}});
                        for (let i = 0; i < entities.length ; i++) {
                            if(entities[i].typeId == "minecraft:player") 
                            {
                                let playerInv = entities[i].getComponent("inventory").container
                                var slotList = [9,18,27]
                                const dimension = block.dimension
                                for (const slot of slotList)
                                {
                                    var item = playerInv.getItem(slot)  
                                    if(item!=undefined)
                                    {
                                        dimension.spawnParticle('edx:souls_spotter',{x:entities[i].location.x,y:entities[i].location.y+1,z:entities[i].location.z});
                                        dimension.playSound('random.pop',entities[i].location);
                                        dimension.playSound('particle.soul_escape',entities[i].location);
                                        var blockBehind = dimension.getBlock({x:block.location.x-dir.x,y:block.location.y-dir.y,z:block.location.z-dir.z})
                                        var inventory = blockBehind?.getComponent("inventory")?.container;
                                        playerInv.setItem(slot, undefined);                                          
                                        try{
                                            if(inventory.emptySlotsCount!=0)
                                            {
                                                inventory.addItem(item);
                                            }
                                            else{
                                                dimension.spawnItem(item, {x:block.center().x-dir.x/2,y:block.center().y-dir.y/2,z:block.center().z-dir.z/2});
                                                dimension.playSound('mob.sniffer.drop_seed',block.location);
                                            }
                                        }
                                        catch(e)
                                        {
                                            dimension.spawnItem(item, {x:block.center().x-dir.x/2,y:block.center().y-dir.y/2,z:block.center().z-dir.z/2});
                                            dimension.playSound('mob.sniffer.drop_seed',block.location);
                                        }
                                    }
                                }
                                
                            }
                        }
                    } 
                else if(type == 'fire_opal')
                {
                    dimension.playSound('fire.fire',block.location);
                    dimension.spawnParticle('edx:fire_opal_spotter',{x:block.center().x+pardir.x/2,y:block.center().y+pardir.y/2,z:block.center().z+pardir.z/2},vmap);
                    let entities = dimension.getEntities({location:{x:block.x+dir.x,y:block.y+dir.y,z:block.z+dir.z},volume:{x:dir.x*distance,y:dir.y*distance,z:dir.z*distance}});
                    for (let i = 0; i < entities.length ; i++) {
                            if(entities[i].typeId == "minecraft:player") 
                            {
                                entities[i].setOnFire(4)
                            }
                    }
                }
                else if(type == 'lapis')
                {
                    var xp = block.permutation.getState("edx:xp")
                    var ten_xp = block.permutation.getState("edx:ten_xp")
                    dimension.spawnParticle('edx:lapis_spotter',{x:block.center().x+dir.x*distance*1.2,y:block.center().y+dir.y*distance*1.2,z:block.center().z+dir.z*distance*1.2},vmap);
                    let entities = dimension.getEntities({location:{x:block.x+dir.x,y:block.y+dir.y,z:block.z+dir.z},volume:{x:dir.x*distance,y:dir.y*distance,z:dir.z*distance}});
                    var xp_value = 0
                    if(xp!=10 || ten_xp!=15)
                    {
                        for (let i = 0; i < entities.length ; i++) {
                            if(entities[i].typeId == "minecraft:player") 
                            {
                                    if(entities[i].level!=0 || entities[i].xpEarnedAtCurrentLevel!=0 )
                                    {
                                        
                                        if(entities[i].xpEarnedAtCurrentLevel==0)
                                        {
                                            entities[i].addLevels(-1)
                                            entities[i].addExperience(entities[i].totalXpNeededForNextLevel-1)
                                            xp_value +=1
                                        }
                                        else if(entities[i].xpEarnedAtCurrentLevel>0){
                                            entities[i].addExperience(-1);
                                            xp_value +=1
                                        } 
                                    }
                            }
                        }
                    }
                    if(xp_value!=0)
                        {
                            xp=xp+xp_value
                            if(xp>10 && ten_xp!=15)
                            {
                                xp-=10
                                ten_xp+=1
                            }
                            else if(xp>10 && ten_xp>=15)
                            {
                                xp=10
                                ten_xp=15
                            }
                            dimension.spawnParticle('edx:xp_orb_spotter',{x:block.center().x+pardir.x/1.9,y:block.center().y+pardir.y/1.9,z:block.center().z+pardir.z/1.9},vmap);
                            block.setPermutation(BlockPermutation.resolve(block.typeId, {...block.permutation.getAllStates(),'edx:xp': xp,'edx:ten_xp': ten_xp}));
                        }
                }
                else if(type == 'diamond')
                {
                    
                    dimension.spawnParticle('edx:diamond_spotter',{x:block.center().x+dir.x*distance*1.2,y:block.center().y+dir.y*distance*1.2,z:block.center().z+dir.z*distance*1.2},vmap);
                    let entities = dimension.getEntities({location:{x:block.x+dir.x,y:block.y+dir.y,z:block.z+dir.z},volume:{x:dir.x*distance,y:dir.y*distance,z:dir.z*distance}});
                    for (let i = 0; i < entities.length ; i++) {
                            if(entities[i].typeId == "minecraft:player") 
                            {
                                    const equipment = entities[i].getComponent('equippable');
                                    for (const slot of armorSlots) 
                                        {
                                            spotterDropItem(block,equipment,slot,dir,entities[i])
                                        } 
                            }
                    }
                }
                if(enable ==false)
                    {
                        const direction = block.permutation.getState("minecraft:facing_direction")
                        dimension.playSound('break.calcite',block.location);
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {...block.permutation.getAllStates(),"minecraft:facing_direction": direction,"edx:type": type,"edx:enabled": false}));
                    }
                
              } catch(e) {}
       }
    }),
    
    eventData.blockComponentRegistry.registerCustomComponent('soul_plant:on_destroy', {
        onPlayerDestroy: ({ block,dimension }) => {
            if(Math.random() <= 1/4) {
                    dimension.spawnEntity("xp_orb",block.center());
            }
         } 
    }),
    
    eventData.blockComponentRegistry.registerCustomComponent('soul_torchflower:on_destroy', {
        onPlayerDestroy: ({ block,dimension }) => {
            if(Math.random() <= 1/4){
                    dimension.spawnEntity("xp_orb",block.center());
                    dimension.spawnEntity("xp_orb",block.center());
                    dimension.spawnEntity("xp_orb",block.center());
            }
         } ,
         onTick({block,dimension}) {
            try {
            dimension.spawnParticle('edx:soul_torchflower',block.center());
            } catch(e) {}
            
        }
    }),

    eventData.blockComponentRegistry.registerCustomComponent('soul_vines:on_destroy', {
        onPlayerDestroy: e => {
            const { block } = e;
            const {x,y,z} = block.location;
            var location = { x: e.block.location.x, y: e.block.location.y, z: e.block.location.z };
            system.runTimeout(() => { 
                e.dimension.runCommand(`fill ${location.x} ${location.y+1} ${location.z} ${location.x} ${location.y+1} ${location.z} edx:soul_vines_head replace edx:soul_vines`)
                 }
             )
             if(Math.random() <= 1/4) {
                     dimension.spawnEntity("xp_orb",block.center());
             }
         } 
    }),
    eventData.blockComponentRegistry.registerCustomComponent('soul_vines:on_place', {
        onPlace: e => {
            const { block } = e;
            const belowBlock = block.below();
            const {x,y,z} = block.location;
            var location = { x: e.block.location.x, y: e.block.location.y, z: e.block.location.z };
            if (belowBlock.typeId === 'minecraft:air') {
                system.runTimeout(() => { 
                    e.dimension.runCommand(`fill ${location.x} ${location.y} ${location.z} ${location.x} ${location.y} ${location.z} edx:soul_vines_head`)
                     }
                 )
            }
            system.runTimeout(() => { 
                e.dimension.runCommand(`fill ${location.x} ${location.y+1} ${location.z} ${location.x} ${location.y+1} ${location.z} edx:soul_vines replace edx:soul_vines_head`)
                 }
             )
        },
    }),
eventData.blockComponentRegistry.registerCustomComponent('soul_vines:on_tick', {
    onRandomTick: e => {
        try {
        let randomTick = Math.random() <= 1/6;
            const { block } = e;
            const belowBlock = block.below();
            const {x,y,z} = block.location;
            var location = { x: e.block.location.x, y: e.block.location.y, z: e.block.location.z };
            if (randomTick && belowBlock.typeId === 'minecraft:air') {
                system.runTimeout(() => { 
                    e.dimension.runCommand(`fill ${location.x} ${location.y-1} ${location.z} ${location.x} ${location.y-1} ${location.z} edx:soul_vines_head`)
                    e.dimension.runCommand(`fill ${location.x} ${location.y} ${location.z} ${location.x} ${location.y} ${location.z} edx:soul_vines replace edx:soul_vines_head`)
                     }
                 )
            }
        } catch(e) {}
        }
        
    }),
eventData.blockComponentRegistry.registerCustomComponent('edx:eye_tick', {
    onRandomTick({block}) {
        try {
        let randomTick = Math.random() <= 1/6;
        if(block.permutation?.getState('edx:stage')<2)
        { 
            if(randomTick )
                block.setPermutation(BlockPermutation.resolve(block.typeId).withState("edx:stage", block.permutation.getState("edx:stage")+1))
        }  
        else if(block.permutation?.getState('edx:stage')==2)
        { 
            let randomBlueEye =  Math.random() < 1/200
            if(randomTick &&  randomBlueEye) 
                block.setPermutation(BlockPermutation.resolve(block.typeId).withState("edx:stage", 4))
            else if(randomTick &&  !randomBlueEye)
                block.setPermutation(BlockPermutation.resolve(block.typeId).withState("edx:stage", 3))
        } 
    } catch(e) {}

    }
}),
eventData.blockComponentRegistry.registerCustomComponent('edx:organic_vase_tick', {
    onRandomTick({block}) {
        try {
        let randomTick = Math.random() <= 1/5;
        if(block.permutation?.getState('edx:stage')<4)
        { 
            if(randomTick )
                block.setPermutation(BlockPermutation.resolve(block.typeId).withState("edx:stage", block.permutation.getState("edx:stage")+1))
        }
    } catch(e) {}
    }
}),
eventData.blockComponentRegistry.registerCustomComponent('edx:organic_vase_destroy', {
    onPlayerDestroy: ({ block,dimension }) => {
            system.runTimeout(() => { 
                dimension.spawnEntity("xp_orb",block.bottomCenter());
                dimension.spawnEntity("xp_orb",block.bottomCenter());
                dimension.spawnEntity("xp_orb",block.bottomCenter());
                dimension.spawnEntity("xp_orb",block.bottomCenter());
                 }
             )
     } 
}),
    eventData.blockComponentRegistry.registerCustomComponent('edx:stairs_update', {
        onPlayerDestroy: ({ block}) => {
            updateStairsAround(block)
        }
        
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:slab_interact', {
        // Define the behavior when a player interacts with the slab
        beforeOnPlayerPlace(event) {
            const { block, player, face,dimension} = event
            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment('Mainhand');
            var slab = undefined
            if(face=='Up') 
                slab=block.below()
            if(face=='Down')
                slab=block.above()
            if (selectedItem?.typeId === slab?.typeId && !slab.permutation.getState('edx:double')) {
                const verticalHalf = slab.permutation.getState('minecraft:vertical_half');
                const isBottomUp = verticalHalf === 'bottom' && face === 'Up';
                const isTopDown = verticalHalf === 'top' && face === 'Down';
                if (isBottomUp || isTopDown) {
                    if (!player.matches({ gameMode: GameMode.creative })) {
                        if (selectedItem.amount > 1) {
                            selectedItem.amount -= 1;
                            equipment.setEquipment('Mainhand', selectedItem);
                        } else if (selectedItem.amount === 1) {
                            equipment.setEquipment('Mainhand', undefined);
                        }
                    }
                    slab.setPermutation(slab.permutation.withState('edx:double', true));
                    dimension.playSound('use.stone',block.location);
                    event.cancel=true
                }
            }
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:slab_destroy', {
        // Define behavior when a player destroys the slab
        onPlayerDestroy(e) {
            // Destructure event data for easier access
            const { player, dimension } = e;

            // Extract destroyed block permutation from event data
            const { destroyedBlockPermutation: perm } = e;

            // Check if player and equipment are valid
            if (!player || !player.getComponent('equippable')) {
                return;
            }

            // Get the item in the player's main hand
            const selectedItem = player.getComponent('equippable').getEquipment('Mainhand');

            // Check if the selected item is a pickaxe
            if (!selectedItem || !selectedItem.hasTag('minecraft:is_pickaxe')) {
                return;
            }

            // Use destroyedBlockPermutation to get the ItemStack directly
            const slabItem = perm.getItemStack(1);
            if (slabItem) {
                // Spawn the item at the destroyed block location
                dimension.spawnItem(slabItem, e.block.location);
            }
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:fake_geyser', {
        onRandomTick({block,dimension}) {
            try {
                block.setType('edx:geyser')
                dimension.spawnParticle('minecraft:campfire_smoke_particle',block.above().bottomCenter());
                system.runTimeout(() => {
                dimension.spawnParticle('minecraft:lava_particle',block.above().bottomCenter());
            }, 23)
              } catch(e) {}
            
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:geyser', {
        onStepOn({entity}) {
            entity.applyKnockback(0,0,0,0.6);
            entity.setOnFire(2)

        },
        onTick({block,dimension}) {
            try {
                dimension.spawnParticle('minecraft:campfire_smoke_particle',block.above().bottomCenter());
                system.runTimeout(() => {
                    try {
                    dimension.spawnParticle('minecraft:lava_particle',block.above().bottomCenter());
                } catch(e) {}
                }, 23)
                let randomTick = Math.random() <= 1/100;
                if( randomTick)
                {
                    block.setPermutation(BlockPermutation.resolve(block.typeId).withState("edx:discharge", true))
                }  
              } catch(e) {
              }
            
        }
    }),
    
   
    eventData.blockComponentRegistry.registerCustomComponent('edx:geyser_discharge', {
        onTick({block,dimension}) {
            try {
                dimension.spawnParticle('edx:geyser_particle',{x:block.bottomCenter().x,y:block.location.y+1,z:block.bottomCenter().z});
                dimension.spawnParticle('edx:geyser_lava_particle',{x:block.bottomCenter().x,y:block.location.y+1.1,z:block.bottomCenter().z});

                const options = { maxDistance: 8}
                let entities = dimension.getEntitiesFromRay({x:block.bottomCenter().x,y:block.location.y+1,z:block.bottomCenter().z} /*Position de départ*/ , {x:0,y:1,z:0} /*Direction sale pute*/, options);
                for (let i = 0; i < entities.length ; i++) {
                    entities[i].entity.applyKnockback(0,0,0,1.2);
                    entities[i].entity.setOnFire(8)
                }
                let randomTick = Math.random() <= 1/200;
                if(randomTick)
                {
                    block.setPermutation(BlockPermutation.resolve(block.typeId).withState("edx:discharge", false))
                }  
              } catch(e) {}
            
            
        } 
    }),
    
    eventData.blockComponentRegistry.registerCustomComponent('edx:blast_shroom', {
        onPlayerDestroy({block,dimension}) {
            dimension.createExplosion(block.location, 3, { breaksBlocks: true, causesFire: true })
            if(Math.random() <= 1/4)
                dimension.spawnItem(new ItemStack("edx:sulfur",1), block.location);
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:sculk_jaw_open', {
        onStepOn({block,dimension,entity}) {
            block.setType("edx:sculk_jaw_summon");
            const blockVolume = new BlockVolume({x:block.location.x-15,y:block.location.y-5,z:block.location.z-15}, {x:block.location.x+15,y:block.location.y+5,z:block.location.z+15});
            entity.addEffect('slowness', 200, {amplifier: 4})
            entity.applyDamage(5,{cause: "contact"})
            if(entity.typeId=="player")
            {
                dimension.fillBlocks(blockVolume, "edx:sculk_jaw_summon", { blockFilter: { includeTypes: ["edx:sculk_jaw_open"]} })
            }
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:sculk_jaw_summon', {
        onTick({block,dimension}) {
            try {
            dimension.spawnEntity("edx:sculkling",block.above().bottomCenter());
            block.setType("edx:sculk_jaw_closed");
        } catch(e) {}
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:sculk_jaw_closed', {
        onTick({block,dimension}) {
            try {
            let randomTick = Math.random() <= 1/20;
            if( randomTick)
            {
                block.setType("edx:sculk_jaw_open");
            }
            const entityOptions = {
                location: block.above().location,
                families: [ "player" ],
                maxDistance: 1
            }
            const entities = dimension.getEntities(entityOptions);
            for (let i = 0; i < entities.length ; i++) {
                entities[i].addEffect('slowness', 200, {amplifier: 4})
                entities[i].applyDamage(5,{cause: "contact"})
            }
        } catch(e) {}
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:spider_egg', {
        onPlayerDestroy({block,dimension}) {
            dimension.spawnEntity("edx:baby_spider",block.bottomCenter());
            dimension.spawnEntity("edx:baby_spider",block.bottomCenter());
            dimension.spawnEntity("edx:baby_spider",block.bottomCenter());
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:spawner', {
        onTick({block,dimension}) {
            try {
            if(block.typeId==="edx:blaze_spawner")
                dimension.spawnEntity("blaze",block.above().location);
            if(block.typeId==="edx:creeper_spawner")
                dimension.spawnEntity("creeper",block.above().location);
            if(block.typeId==="edx:enderman_spawner")
                dimension.spawnEntity("enderman",block.above().location);
            if(block.typeId==="edx:ghast_spawner")
                dimension.spawnEntity("ghast",block.above().location);
            if(block.typeId==="edx:pig_spawner")
                dimension.spawnEntity("pig",block.above().location);
            if(block.typeId==="edx:sheep_spawner")
                dimension.spawnEntity("sheep",block.above().location);
            if(block.typeId==="edx:skeleton_spawner")
                dimension.spawnEntity("skeleton",block.above().location);
            if(block.typeId==="edx:slime_spawner")
                dimension.spawnEntity("slime",block.above().location);
            if(block.typeId==="edx:spider_spawner")
                dimension.spawnEntity("spider",block.above().location);
            if(block.typeId==="edx:vindicator_spawner")
                dimension.spawnEntity("vindicator",block.above().location);
            if(block.typeId==="edx:wither_spawner")
                dimension.spawnEntity("wither_skeleton",block.above().location);
            if(block.typeId==="edx:zombie_spawner")
                dimension.spawnEntity("zombie",block.above().location);
        } catch(e) {}
        }
    }),
    
    eventData.blockComponentRegistry.registerCustomComponent('edx:runic_chest_on_interact', {
        // Define the behavior when a player interacts with the block
        onPlayerInteract(e) {
            const { block, player ,dimension} = e;
            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment('Mainhand');
            if (selectedItem?.typeId!='edx:runestone') return;
            block.setType("air");
            dimension.spawnEntity("edx:open_chest",block.bottomCenter())
            if(selectedItem.amount>1)
                selectedItem.amount-=1
            else
                equipment.setEquipment('Mainhand', new ItemStack('minecraft:air', 1));

        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:void_catalyst', {
        // Define the behavior when a player interacts with the block
        onTick({block}) {
            try {
            if(block.below().typeId!='edx:void_fossil_block')
                block.setType("edx:end_catalyst");
        } catch(e) {}
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:light_catalyst', {
        // Define the behavior when a player interacts with the block
        onTick({block}) {
            try {
            if(block.below().typeId!='minecraft:beacon')
                block.setType("edx:end_catalyst");
        } catch(e) {}
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:end_catalyst', {
        // Define the behavior when a player interacts with the block
        onTick({block}) {
            try {
            if(block.below().typeId=='edx:void_fossil_block')
                block.setType("edx:void_catalyst");
            else if(block.below().typeId=='minecraft:beacon')
                block.setType("edx:light_catalyst");
        } catch(e) {}
        },
        onPlayerInteract({player}){
            player.sendMessage(`You need to put a void fossil block under the end catalyst to turn it into a void catalyst or you need to put a beacon under it to turn the end catalyst into a light catalyst`);
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:active_shield', {
        onTick({block,dimension}) {
            try {
            var entityOptions = {
                location: block.location,
                families: ["player" ],
                maxDistance: 50
            }
            var entities = dimension.getEntities(entityOptions);
            for (const entity of entities) {
                    if(!entity.matches({ gameMode: GameMode.spectator }) && !entity.matches({ gameMode: GameMode.creative }))
                    {
                        entity.runCommand(`scoreboard players set @s shield 20`)
                    }
            }
            entityOptions = {
                location: block.location,
                families: ["creeper" ],
                maxDistance: 50
            }
            entities = dimension.getEntities(entityOptions);
            for (const entity of entities) {
                    entity.addTag('no_grief')
            }
        } catch(e) {}
        },
        onPlayerInteract({block}){
            block.setType("edx:unactive_shield");
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:unactive_shield', {
        onPlayerInteract({block}){
            block.setType("edx:active_shield");
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:trapdoor_on_interact', {
        onPlayerInteract({ block, player }) {
            const currentState = block.permutation.getState('edx:open');
            const newOpenState = !currentState;
            const newPermutation = BlockPermutation.resolve(block.typeId, {...block.permutation.getAllStates(),'edx:open': newOpenState});
            block.setPermutation(newPermutation);
            const sound = currentState ? 'open.wooden_trapdoor' : 'close.wooden_trapdoor';
            player.playSound(sound);
            
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:block_breaker', {
        onTick({block,dimension}) {
            try {
            const UnbreakListId = ["air","bedrock","end_portal_frame","reinforced_deepslate","edx:runic_chest"]
            const direction = block.permutation.getState("minecraft:block_face")
            var blockBreak = undefined
            if(direction=='up')
                blockBreak = block.above()
            else if(direction=='down')
                blockBreak = block.below()
            else if(direction=='north')
                blockBreak = block.north()
            else if(direction=='south')
                blockBreak = block.south()
            else if(direction=='west')
                blockBreak = block.west()
            else if(direction=='east')
                blockBreak = block.east()
            if(!UnbreakListId.includes(blockBreak?.typeId))
                dimension.runCommand(`setblock ${blockBreak.location.x} ${blockBreak.location.y} ${blockBreak.location.z} air destroy`)
        } catch(e) {}
        }
        
    }),
   

    eventData.blockComponentRegistry.registerCustomComponent("edx:precise_rotation", {
        beforeOnPlayerPlace(event) {
          const { player } = event;
          if (!player) return; // Exit if the player is undefined 
    
          const blockFace = event.permutationToPlace.getState("minecraft:block_face");
          if (blockFace !== "up") return; // Exit if the block hasn't been placed on the top of another block
    
          // Get the rotation using the function from earlier
          const playerYRotation = player.getRotation().y;
          const rotation = getPreciseRotation(playerYRotation);
    
          // Tell Minecraft to place the correct `wiki:rotation` value
          event.permutationToPlace = event.permutationToPlace.withState("wiki:rotation", rotation);
        }
      }),
      eventData.blockComponentRegistry.registerCustomComponent("edx:precise_rotation_sign", {
        beforeOnPlayerPlace(event) {
          const { player } = event;
          if (!player) return; // Exit if the player is undefined 
    
    
          // Get the rotation using the function from earlier
          const playerYRotation = player.getRotation().y;
          const rotation = getPreciseRotation(playerYRotation);
    
          // Tell Minecraft to place the correct `wiki:rotation` value
          event.permutationToPlace = event.permutationToPlace.withState("wiki:rotation", rotation);
        }
      }),
      eventData.blockComponentRegistry.registerCustomComponent("edx:sign_interact",{
        onPlayerInteract({ block, player }) {
            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment('Mainhand');
            if(selectedItem!=undefined)
                if(selectedItem.typeId == 'minecraft:stick')
                {    
                    const tilt = block.permutation.getState('wiki:tilt');
                    if(tilt==0)
                        BlockPermutation.resolve(block.typeId, {...block.permutation.getAllStates(),'wiki:tilt': 1});
                    if(tilt==1)
                        BlockPermutation.resolve(block.typeId, {...block.permutation.getAllStates(),'wiki:tilt': 2});
                    if(tilt==2)
                        BlockPermutation.resolve(block.typeId, {...block.permutation.getAllStates(),'wiki:tilt': 3});
                    if(tilt==3)
                        BlockPermutation.resolve(block.typeId, {...block.permutation.getAllStates(),'wiki:tilt': 0});
                    
                }
            else
            {
                const direction = block.permutation.getState('wiki:direction');
                if(direction == 1)
                    BlockPermutation.resolve(block.typeId, {...block.permutation.getAllStates(),'wiki:direction': 2});
                else if(direction == 2 )
                    BlockPermutation.resolve(block.typeId, {...block.permutation.getAllStates(),'wiki:direction': 1});


            }

        }
      }),
      //copper



      eventData.blockComponentRegistry.registerCustomComponent('edx:charged_copper_lock', {
        onTick: ({ block,dimension }) => {
            try {
            const entityOptions = {
                location: block.location,
                families: [ "copper_golem" ],
                maxDistance: 10
            }
            const entities = dimension.getEntities(entityOptions);
            if(entities!=undefined && entities.length>0)
            {
                const dir = "_"+block.permutation.getState("minecraft:facing_direction")
                block.setType("edx:charged_copper"+dir)
                block.setPermutation(BlockPermutation.resolve(block.typeId).withState("edx:locked", true))
            }
        } catch(e) {}
        },
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:convert_to_charged_copper_block', {
        onTick: ({ block }) => {
            try {
            const dir = "_" + block.permutation.getState("minecraft:facing_direction")
            block.setType("edx:charged_copper"+dir)
        } catch(e) {}
        },
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:charged_copper_unlock', {
        onTick: ({ block,dimension }) => {
            try {
            const entityOptions = {
                location: block.location,
                families: [ "copper_golem" ],
                maxDistance: 10
            }
            const entities = dimension.getEntities(entityOptions);
            if(entities==undefined || entities.length==0)
            {
                var dir="down"
                if(block.typeId.endsWith("up"))
                    dir="up"
                else if(block.typeId.endsWith("east"))
                    dir="east"
                else if(block.typeId.endsWith("west"))
                    dir="west"
                else if(block.typeId.endsWith("north"))
                    dir="north"
                else if(block.typeId.endsWith("south"))
                    dir="south"
                block.setType("edx:charged_copper_rotatable")
                block.setPermutation(BlockPermutation.resolve(block.typeId).withState("minecraft:facing_direction", dir))
            }
        } catch(e) {}
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('edx:rotate_charged_copper', {
        onPlayerInteract: ({ block }) => {
            var dir="up"
            if(block.permutation.getState("minecraft:facing_direction")=="up")
                dir="north"
            else if(block.permutation.getState("minecraft:facing_direction")=="east")
                dir="down"
            else if(block.permutation.getState("minecraft:facing_direction")=="west")
                dir="south"
            else if(block.permutation.getState("minecraft:facing_direction")=="north")
                dir="west"
            else if(block.permutation.getState("minecraft:facing_direction")=="south")
                dir="east"
            block.setType("edx:charged_copper_rotatable")
            block.setPermutation(BlockPermutation.resolve(block.typeId).withState("minecraft:facing_direction", dir))
        }
       }),
       
       eventData.blockComponentRegistry.registerCustomComponent('edx:copper_particle', {
        onStepOn: ({dimension,block}) => {
            dimension.spawnParticle('edx:unwax',{x:block.bottomCenter().x,y:block.location.y,z:block.bottomCenter().z});
         } 
       }),
       eventData.blockComponentRegistry.registerCustomComponent('edx:copper_dropper_unlock', {
        onTick: ({block}) => {
            try {
            if(block.typeId.startsWith("edx:copper"))
                block.setType("edx:copper_dropper");
            if(block.typeId.startsWith("edx:exposed"))
            {
                block.setType("edx:exposed_copper_dropper");
            }
            else if(block.typeId.startsWith("edx:weathered"))
            {
                block.setType("edx:weathered_copper_dropper");
            }
        } catch(e) {}
        }
       }),
       eventData.blockComponentRegistry.registerCustomComponent('edx:copper_dropper_lock', {
        onPlayerInteract: ({ block, player ,dimension}) => {
            const equipment = player.getComponent('equippable'); 
            const selectedItem = equipment.getEquipment('Mainhand');
            if (selectedItem && (selectedItem.typeId === 'minecraft:copper_ingot')) {
                var state= ""
                if(block.typeId.startsWith("edx:copper"))
                    dimension.spawnEntity("edx:copper_golem",{ x: block.bottomCenter().x, y: block.location.y-1.5, z: block.bottomCenter().z });
                if(block.typeId.startsWith("edx:exposed"))
                {
                    state="exposed_"
                    dimension.spawnEntity("edx:copper_golem<stage2>",{ x: block.bottomCenter().x, y: block.location.y-1.5, z: block.bottomCenter().z });
                }
                else if(block.typeId.startsWith("edx:weathered"))
                {
                    state="weathered_"
                    dimension.spawnEntity("edx:copper_golem<stage3>",{ x: block.bottomCenter().x, y: block.location.y-1.5, z: block.bottomCenter().z });
                }
                block.setType("edx:"+state+"copper_dropper_locked");
                if (!player.matches({ gameMode: GameMode.creative })) {
                    if (selectedItem.amount > 1) {
                        selectedItem.amount -= 1;
                        equipment.setEquipment('Mainhand', selectedItem);
                    } else {
                        equipment.setEquipment('Mainhand', undefined); // Clear the slot if only 1 item left
                    }
                    e.cancel = true;
                }
            }
        }
       }),
       eventData.blockComponentRegistry.registerCustomComponent('edx:yellow_detector_off', {
        onTick: ({ block }) => {
            try {
            block.setType("edx:charged_copper_yellow_detector_off"); 
        } catch(e) {}
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('edx:blue_detector_off', {
        onTick: ({ block }) => {
            try {
            block.setType("edx:charged_copper_blue_detector_off");
        } catch(e) {}
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('edx:red_detector_off', {
        onTick: ({ block }) => {
            try {
            block.setType("edx:charged_copper_red_detector_off"); 
        } catch(e) {}
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('edx:green_detector_off', {
        onTick: ({ block }) => {
            try {
            block.setType("edx:charged_copper_green_detector_off"); 
        } catch(e) {}
        }
       }   
    ),



    //mushroom! mushroom! mushroom! mushroom!
    eventData.blockComponentRegistry.registerCustomComponent('cordyceps:interact', {
        onPlayerInteract: e => {
            const { block, player,dimension } = e;
            const {x,y,z} = block.location;
            const equipment = player.getComponent('equippable'); 
            const selectedItem = equipment.getEquipment('Mainhand');
            if (selectedItem && (selectedItem.typeId === 'minecraft:bone_meal')) {
                
                    player.playSound('item.bone_meal.use');
                    dimension.spawnParticle('minecraft:crop_growth_emitter',{x:block.bottomCenter().x,y:block.location.y,z:block.bottomCenter().z});
                    if(Math.random()<1/5)
                    {
                        if(treeSpaceCheck({x:0,y:1,z:0},14,dimension,block))
                        {
                            const randomRot = Math.round(Math.random()*3)
                            const randomStruct = Math.round(Math.random()*2+1)
                            const structName = 'mystructure:big_cordyceps'+randomStruct.toString()
                            world.structureManager.place(structName, dimension, { x:x-2, y:y, z:z-2 },{rotation: rotation[randomRot]}); 
                        }
                            
                    }
                    if (!player.matches({ gameMode: GameMode.creative })) {
                        if (selectedItem.amount > 1) {
                            selectedItem.amount -= 1;
                            equipment.setEquipment('Mainhand', selectedItem);
                        } else {
                            equipment.setEquipment('Mainhand', undefined); 
                        }
                }
                
                
            }
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:yellow_mushroom', {
        onPlayerInteract: e => {
            const { block, player,dimension } = e;
            const {x,y,z} = block.location;
            const equipment = player.getComponent('equippable'); 
            const selectedItem = equipment.getEquipment('Mainhand');
            if (selectedItem && (selectedItem.typeId === 'edx:yellow_spore_bag_it')) {
                
                    player.playSound('item.bone_meal.use');
                    dimension.spawnParticle('minecraft:crop_growth_emitter',{x:block.bottomCenter().x,y:block.location.y,z:block.bottomCenter().z});
                    if(Math.random()<1/5)
                    {
                        if(treeSpaceCheck({x:0,y:-1,z:0},9,dimension,block))
                        {
                            const randomRot = Math.round(Math.random()*3)
                            const randomStruct = Math.round(Math.random()*2+1)
                            const structName = 'mystructure:big_yellow_mush'+randomStruct.toString()
                            world.structureManager.place(structName, dimension, { x:x-2, y:y-8, z:z-2 },{rotation: rotation[randomRot]}); 
                        }
                            
                    }
                    if (!player.matches({ gameMode: GameMode.creative })) {
                        if (selectedItem.amount > 1) {
                            selectedItem.amount -= 1;
                            equipment.setEquipment('Mainhand', selectedItem);
                        } else {
                            equipment.setEquipment('Mainhand', undefined); 
                        }
                }
                
                
            }
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:blue_mushroom', {
        onPlayerInteract: e => {
            const { block, player,dimension } = e;
            const {x,y,z} = block.location;
            const equipment = player.getComponent('equippable'); 
            const selectedItem = equipment.getEquipment('Mainhand');
            if (selectedItem && (selectedItem.typeId === 'edx:blue_spore_bag_it')) {
                
                    player.playSound('item.bone_meal.use');
                    dimension.spawnParticle('minecraft:crop_growth_emitter',{x:block.bottomCenter().x,y:block.location.y,z:block.bottomCenter().z});
                    if(Math.random()<1/5)
                    {
                        if(treeSpaceCheck({x:0,y:1,z:0},14,dimension,block))
                        {
                            const randomRot = Math.round(Math.random()*3)
                            const randomStruct = Math.round(Math.random()*2+1)
                            const structName = 'mystructure:big_blue_mush'+randomStruct.toString()
                            world.structureManager.place(structName, dimension, { x:x-2, y:y, z:z-2 },{rotation: rotation[randomRot]}); 
                        }
                            
                    }
                    if (!player.matches({ gameMode: GameMode.creative })) {
                        if (selectedItem.amount > 1) {
                            selectedItem.amount -= 1;
                            equipment.setEquipment('Mainhand', selectedItem);
                        } else {
                            equipment.setEquipment('Mainhand', undefined); 
                        }
                }
                
                
            }
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:white_mushroom', {
        onPlayerInteract: e => {
            const { block, player,dimension } = e;
            const {x,y,z} = block.location;
            const equipment = player.getComponent('equippable'); 
            const selectedItem = equipment.getEquipment('Mainhand');
            if (selectedItem && (selectedItem.typeId === 'minecraft:bone_meal')) {
                
                    player.playSound('item.bone_meal.use');
                    dimension.spawnParticle('minecraft:crop_growth_emitter',{x:block.bottomCenter().x,y:block.location.y,z:block.bottomCenter().z});
                    if(Math.random()<1/5)
                    {
                        if(treeSpaceCheck({x:0,y:1,z:0},14,dimension,block))
                        {
                            const randomRot = Math.round(Math.random()*3)
                            const randomStruct = Math.round(Math.random()*2+1)
                            const structName = 'mystructure:big_white'+randomStruct.toString()
                            world.structureManager.place(structName, dimension, { x:x-3, y:y, z:z-3 },{rotation: rotation[randomRot]}); 
                        }
                            
                    }
                    if (!player.matches({ gameMode: GameMode.creative })) {
                        if (selectedItem.amount > 1) {
                            selectedItem.amount -= 1;
                            equipment.setEquipment('Mainhand', selectedItem);
                        } else {
                            equipment.setEquipment('Mainhand', undefined); 
                        }
                    }
                
                
            }
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:green_mushroom', {
        onPlayerInteract: e => {
            const { block, player,dimension } = e;
            const {x,y,z} = block.location;
            const equipment = player.getComponent('equippable'); 
            const selectedItem = equipment.getEquipment('Mainhand');
            if (selectedItem && (selectedItem.typeId === 'minecraft:bone_meal')) {
                
                    player.playSound('item.bone_meal.use');
                    dimension.spawnParticle('minecraft:crop_growth_emitter',{x:block.bottomCenter().x,y:block.location.y,z:block.bottomCenter().z});
                    if(Math.random()<1/5)
                    {
                        if(treeSpaceCheck({x:0,y:1,z:0},14,dimension,block))
                        {
                            const randomRot = Math.round(Math.random()*3)
                            const randomStruct = Math.round(Math.random()*2+1)
                            const structName = 'mystructure:big_green'+randomStruct.toString()
                            world.structureManager.place(structName, dimension, { x:x-4, y:y, z:z-4 },{rotation: rotation[randomRot]}); 
                        }
                            
                    }
                    if (!player.matches({ gameMode: GameMode.creative })) {
                        if (selectedItem.amount > 1) {
                            selectedItem.amount -= 1;
                            equipment.setEquipment('Mainhand', selectedItem);
                        } else {
                            equipment.setEquipment('Mainhand', undefined); 
                        }
                }
                
                
            }
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('blue_spore_bag:destroy', {
        onPlayerDestroy: e => {
            const { block,dimension } = e;
            const entityOptions = {
                location: block.location,
                families: [ "player" ],
                maxDistance: 2.5
            }
            const entities = dimension.getEntities(entityOptions);
            if(entities!=undefined)
            for (let i = 0; i < entities.length ; i++){
                if(entities[i]!=undefined)
                {
                entities[i].addEffect('speed', 200, {amplifier: 0})
                entities[i].addEffect('poison', 200, {amplifier: 0})
                }
            }
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('blue_spore_bag:interact', {
        onPlayerInteract: e => {
            const { block ,player,dimension} = e;
            dimension.runCommand(`loot spawn  ${block.bottomCenter().x} ${block.location.y} ${block.bottomCenter().z} loot blue_spore_bag_it`)
            player.playSound('block.sweet_berry_bush.pick');
            block.setType('edx:empty_blue_spore_bag')
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('edx:yellow_spore_bag', {
        onPlayerDestroy: e => {
            const { block,dimension } = e;
            const entityOptions = {
                location: block.location,
                families: [ "player" ],
                maxDistance: 2.5
            }
            const entities = dimension.getEntities(entityOptions);
            if(entities!=undefined)
            for (let i = 0; i < entities.length ; i++){
                if(entities[i]!=undefined)
                    {
                    entities[i].addEffect('haste', 200, {amplifier: 0})
                    entities[i].addEffect('poison', 200, {amplifier: 0})
                    }
            }
        },
        onPlayerInteract: e => {
            const { block ,player,dimension} = e;
            dimension.runCommand(`loot spawn  ${block.bottomCenter().x} ${block.location.y} ${block.bottomCenter().z} loot yellow_spore_bag_it`)
            player.playSound('block.sweet_berry_bush.pick');
            block.setType('edx:empty_yellow_spore_bag')
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('big_yellow_tree_block:tick', {
        onRandomTick: e => {
            try {
            const { block ,dimension} = e;
            const {x,y,z} = block.location;
            block.setType("air")
                const randomRot = Math.round(Math.random()*3)
                const randomStruct = Math.round(Math.random()*2+1)
                const structName = 'mystructure:big_yellow_mush'+randomStruct.toString()
                world.structureManager.place(structName, dimension, { x:x-2, y:y, z:z-2 },{rotation: rotation[randomRot]});
            } catch(e) {}
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('edx:mushroom_scarecrow', {
        
        onPlayerInteract: e => {
            const { block, player } = e;
            const {x,y,z} = block.location;
            const equipment = player.getComponent('equippable'); 
            const selectedItem = equipment.getEquipment('Mainhand');
            if (selectedItem && (selectedItem.typeId === 'minecraft:bone_meal')) {
                    block.dimension.runCommand('function random_grow')
                    player.playSound('item.bone_meal.use');
                    if (!player.matches({ gameMode: GameMode.creative })) {
                        if (selectedItem.amount > 1) {
                            selectedItem.amount -= 1;
                            equipment.setEquipment('Mainhand', selectedItem);
                        } else {
                            equipment.setEquipment('Mainhand', undefined); 
                        }
                }
            }
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('fungus_vine:on_place', {
        onPlace: e => {
            const { block } = e;
            const belowBlock = block.below();
            if (belowBlock.typeId === 'minecraft:air') {
                block.setPermutation(BlockPermutation.resolve(block.typeId).withState("propertie:connect",1))
            }
            if(block.above().typeId == "edx:fungus_vine" )
                block.above().setPermutation(BlockPermutation.resolve(block.above().typeId).withState("propertie:connect",0))
        },
    }),
    eventData.blockComponentRegistry.registerCustomComponent('fungus_vine:on_destroy', {
        onPlayerDestroy: e => {
            const { block ,dimension} = e;
            if(block.above().typeId == "edx:fungus_vine" )
                block.above().setPermutation(BlockPermutation.resolve(block.above().typeId).withState("propertie:connect",0))
         } 
    }),
    eventData.blockComponentRegistry.registerCustomComponent('endermite_egg:on_destroy', {
        onPlayerDestroy: ({ block,dimension }) => {
            dimension.spawnEntity("endermite",block.bottomCenter());
            dimension.spawnEntity("endermite",block.bottomCenter());
            dimension.spawnEntity("endermite",block.bottomCenter());
         } 
    }),
    eventData.blockComponentRegistry.registerCustomComponent('blue_lycaephytus:on_destroy', {
        onPlayerDestroy: e => {
            const { block ,dimension} = e;
            const entityOptions = {
                location: block.location,
                families: [ "player" ],
                maxDistance: 2.5
            }
            const entities = dimension.getEntities(entityOptions);
            for (let i = 0; i < entities.length ; i++){
                entities[i].addEffect('levitation', 200, {amplifier: 0})
            }
         } 
    }), 
    eventData.blockComponentRegistry.registerCustomComponent('blue_lycaephytus:interact', {
        onPlayerInteract: e => {
            const { block, player} = e;
            const equipment = player.getComponent('equippable'); 
            const selectedItem = equipment.getEquipment('Mainhand');
            if (selectedItem && (selectedItem.typeId === 'minecraft:glass_bottle')) {
                player.getComponent("inventory").container.addItem(new ItemStack('edx:levitation_potion', 1))
                block.setType('edx:blue_lycaephytus_no_ball' )
                if (!player.matches({ gameMode: GameMode.creative })) {
                    if (selectedItem.amount > 1) {
                        selectedItem.amount -= 1;
                        equipment.setEquipment('Mainhand', selectedItem);
                    } else {
                        equipment.setEquipment('Mainhand', undefined); // Clear the slot if only 1 item left
                    }
                    e.cancel = true;
                }
            }
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('structure:red_right', {
        onTick: ({block,dimension}) => {
            const random = Math.round(Math.random()+1)
            const {x,y,z} = block.location
            block.setType("air")
            const structName = "mystructure:R_right"+ random 
            world.structureManager.place(structName, dimension, { x:x-9, y:y-6, z:z-22 });
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('structure:red_left', {
        onTick: ({block,dimension}) => {
            const random = Math.round(Math.random()+1)
            const {x,y,z} = block.location
            block.setType("air")
            const structName = "mystructure:R_left"+ random 
            world.structureManager.place(structName, dimension, { x:x-9, y:y-6, z:z+1 });
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('structure:orange_right', {
        onTick: ({block,dimension}) => {
            const random = Math.round(Math.random()+1)
            const {x,y,z} = block.location
            block.setType("air")
            const structName = "mystructure:O_right"+ random 
            world.structureManager.place(structName, dimension, { x:x-9, y:y-6, z:z-22 });
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('structure:orange_left', {
        onTick: ({block,dimension}) => {
            const random = Math.round(Math.random()+1)
            const {x,y,z} = block.location
            block.setType("air")
            const structName = "mystructure:O_left"+ random 
            world.structureManager.place(structName, dimension, { x:x-9, y:y-6, z:z+1 });
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('structure:green_right', {
        onTick: ({block,dimension}) => {
            const random = Math.round(Math.random()+1)
            const {x,y,z} = block.location
            block.setType("air")
            const structName = "mystructure:G_right"+ random 
            world.structureManager.place(structName, dimension, { x:x-9, y:y-6, z:z-22 });
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('structure:green_left', {
        onTick: ({block,dimension}) => {
            const random = Math.round(Math.random()+1)
            const {x,y,z} = block.location
            block.setType("air")
            const structName = "mystructure:G_left"+ random 
            world.structureManager.place(structName, dimension, { x:x-9, y:y-6, z:z+1 });
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('structure:W_right', {
        onTick: ({block,dimension}) => {
            const random = Math.round(Math.random()*8+1)
            const {x,y,z} = block.location
            block.setType("air")
            const structName = "mystructure:W"+ random + "_right"
            world.structureManager.place(structName, dimension, { x:x-9, y:y, z:z-9 });
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('structure:W_middle', {
        onTick: ({block,dimension}) => {
            const random = Math.round(Math.random()*8+1)
            const {x,y,z} = block.location
            block.setType("air")
            const structName = "mystructure:W"+ random + "_middle"
            world.structureManager.place(structName, dimension, { x:x-9, y:y, z:z-9 });
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('structure:W_left', {
        onTick: ({block,dimension}) => {
            const random = Math.round(Math.random()*8+1)
            const {x,y,z} = block.location
            block.setType("air")
            const structName = "mystructure:W"+ random + "_left"
            world.structureManager.place(structName, dimension, { x:x-9, y:y, z:z-9 });
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('structure:U_middle', {
        onTick: ({block,dimension}) => {
            const random = Math.round(Math.random()*8+1)
            const {x,y,z} = block.location
            block.setType("air")
            const structName = "mystructure:U"+ random + "_right"
            world.structureManager.place(structName, dimension, { x:x-9, y:y, z:z-9 });
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('structure:U_right', {
        onTick: ({block,dimension}) => {
            const random = Math.round(Math.random()*8+1)
            const {x,y,z} = block.location
            block.setType("air")
            const structName = "mystructure:U"+ random + "_middle"
            world.structureManager.place(structName, dimension, { x:x-9, y:y, z:z-9 });
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('structure:U_left', {
        onTick: ({block,dimension}) => {
            const random = Math.round(Math.random()*8+1)
            const {x,y,z} = block.location
            block.setType("air")
            const structName = "mystructure:U"+ random + "_left"
            world.structureManager.place(structName, dimension, { x:x-9, y:y, z:z-9 });
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('structure:L_right', {
        onTick: ({block,dimension}) => {
            const random = Math.round(Math.random()*8+1)
            const {x,y,z} = block.location
            block.setType("air")
            const structName = "mystructure:L"+ random + "_right"
            world.structureManager.place(structName, dimension, { x:x-9, y:y, z:z-9 });
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('structure:L_middle', {
        onTick: ({block,dimension}) => {
            const random = Math.round(Math.random()*8+1)
            const {x,y,z} = block.location
            block.setType("air")
            const structName = "mystructure:L"+ random + "_middle"
            world.structureManager.place(structName, dimension, { x:x-9, y:y, z:z-9 });
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('structure:L_left', {
        onTick: ({block,dimension}) => {
            const random = Math.round(Math.random()*8+1)
            const {x,y,z} = block.location
            block.setType("air")
            const structName = "mystructure:L"+ random + "_left"
            world.structureManager.place(structName, dimension, { x:x-9, y:y, z:z-9 });
        }
       }   
    ),
    eventData.blockComponentRegistry.registerCustomComponent('edx:fume_fan', {
        onPlace: event => {
            const { block } = event;
            system.runTimeout(() => { 
                block.setPermutation(BlockPermutation.resolve(block.typeId, {...block.permutation.getAllStates(),"edx:locked": false}));
                 }
             )
            
        },
        onTick({block,dimension}) {
            const direction = block.permutation.getState("minecraft:facing_direction")
            const intensity = block.permutation.getState("edx:intensity")
            var dir = {x:0,y:1,z:0}
            if(direction=='up')
                dir = {x:0,y:1,z:0}
            else if(direction=='down')
                dir = {x:0,y:-1,z:0}
            else if(direction=='north')
                dir = {x:0,y:0,z:-1}
            else if(direction=='south')
                dir = {x:0,y:0,z:1}
            else if(direction=='west')
                dir = {x:-1,y:0,z:0}
            else if(direction=='east')
                dir = {x:1,y:0,z:0}
            try {
                const vmap = new MolangVariableMap();
                vmap.setVector3('variable.direction', {x:dir.x,y:dir.y,z:dir.z});
                vmap.setFloat('variable.intensity', intensity);
                dimension.spawnParticle('edx:fume_fan_particle',{x:block.center().x+dir.x/2,y:block.center().y+dir.y/2,z:block.center().z+dir.z/2},vmap);
                const options = { maxDistance:  intensity*8-1}
                var distance = intensity*8-1
                const rayBlock = dimension.getBlockFromRay({x:block.center().x+dir.x,y:block.center().y+dir.y,z:block.center().z+dir.z},dir,options)?.block
                if(rayBlock!=undefined)
                {
                    distance = Math.sqrt(
                        Math.pow(block.x - rayBlock.x, 2) +
                        Math.pow(block.y - rayBlock.y, 2) +
                        Math.pow(block.z - rayBlock.z, 2)
                    )-1;
                }
                let entities = dimension.getEntities({location:{x:block.x+dir.x,y:block.y+dir.y,z:block.z+dir.z},volume:{x:dir.x*distance,y:dir.y*distance,z:dir.z*distance}});
                for (let i = 0; i < entities.length ; i++) {
                        if(entities[i].hasComponent('minecraft:item')) {
                            entities[i].applyImpulse({ x: dir.x*intensity*0.2, y: dir.y*intensity*0.2, z: dir.z*intensity*0.2 })
                        }
                        else
                            entities[i].applyKnockback(Math.abs(dir.x),Math.abs(dir.z),(0.5+intensity*0.5)*0.6*dir.z+(0.5+intensity*0.5)*0.6*dir.x, (0.5+intensity*0.5)*0.6*dir.y);
                    
                }
              } catch(e) {}
        },
        onPlayerInteract({ block, player}) {
            const equipment = player.getComponent('equippable');
            const selectedItem = equipment.getEquipment('Mainhand');
            const direction = block.permutation.getState("minecraft:facing_direction")
            const intensity = block.permutation.getState("edx:intensity")
            const locked = block.permutation.getState("edx:locked")
            if(selectedItem?.typeId === "edx:fire_opal" && locked!=true)
            {
                if (!player.matches({ gameMode: GameMode.creative }) ) {
                    if (selectedItem.amount > 1) {
                        selectedItem.amount -= 1;
                        equipment.setEquipment('Mainhand', selectedItem);
                    } else {
                        equipment.setEquipment('Mainhand', undefined); 
                    }
                }
                block.dimension.playSound('lodestone_compass.link_compass_to_lodestone', block.center());
                block.setPermutation(BlockPermutation.resolve(block.typeId, {...block.permutation.getAllStates(),"edx:locked": true}));
            }
            else if(locked!=true)
            {
                block.dimension.playSound('block.click', block.center());
                block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:facing_direction": direction,"edx:locked": locked,"edx:intensity": intensity<3 ? intensity+1 : 0}));
            }
            
        }
    }),
    
   
    eventData.blockComponentRegistry.registerCustomComponent('edx:leaves', {
        onPlayerDestroy({block,player}) {
            const equipment = player.getComponent('equippable'); 
            const selectedItem = equipment.getEquipment('Mainhand');
            if (selectedItem && (selectedItem.typeId === 'minecraft:shears')){
                    const Item = perm.getItemStack(1);
                if (Item) {
                    dimension.spawnItem(Item, block.bottomCenter());
                }
            }
            else if(Math.random()<1/6)
            {
                dimension.spawnItem(new ItemStack('edx:redwood_sapling', 1), block.bottomCenter());
            }
        },
        onRandomTick({block,dimension}) {
            try {
            if(block.permutation.getState('edx:can_despawn') && Math.random()<=1/4)
            {
                const value = GetLeaveValue(block)
                if(value>0)
                    block.setPermutation(BlockPermutation.resolve(block.typeId, {"edx:can_despawn": "true","edx:decay_tier": value-1 }));
                else
                {
                    block.setType("air")
                    if(Math.random()<1/20)
                        {
                            dimension.spawnItem(new ItemStack('edx:redwood_sapling_it', 1), block.bottomCenter());
                        }
                }
                    
            }
        } catch(e) {}
        }


    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:magmroll_shell', {
        onPlayerInteract({block,dimension}) {
            
            var ent = dimension.spawnEntity("edx:magmroll_shell",block.bottomCenter());
            var rot ={x:0,y:180}
            if(block.permutation.getState('minecraft:cardinal_direction')=='south')
            {
                rot ={x:0,y:0}
            }
            if(block.permutation.getState('minecraft:cardinal_direction')=='east')
            {
                rot ={x:0,y:270}
            }
            if(block.permutation.getState('minecraft:cardinal_direction')=='west')
            {
                rot ={x:0,y:90}
            }
            block.setType("air")
            ent.setRotation(rot)
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('edx:redwood_sapling', {
        onRandomTick({block,dimension}) {
            try {
            if(Math.random()<=1/12)
            {
                if(block.south().typeId == 'edx:redwood_sapling' && block.south().east().typeId == 'edx:redwood_sapling' && block.east().typeId == 'edx:redwood_sapling')
                    dimension.runCommand(`execute if blocks ${block.location.x}-9 ${block.location.y}+2 ${block.location.z}-9 ${block.location.x}+14 ${block.location.y}+36 ${block.location.z}+14 ${block.location.x}-9 ${block.location.y}+36 ${block.location.z}-9 masked if block ${block.location.x} ${block.location.y}+1 ${block.location.z} air if block ${block.location.x} ${block.location.y}+3 ${block.location.z}+1 air if block ${block.location.x}-3 ${block.location.y}+40 ${block.location.z}+2 air run structure load Redwood_tree ${block.location.x}-9 ${block.location.y} ${block.location.z}-9`)
            }
        } catch(e) {}
        }


    }),
    eventData.blockComponentRegistry.registerCustomComponent('gate:on_interact', {
        // Define the behavior when a player interacts with the fence gate
        onPlayerInteract(e) {
            // Destructure event data for easier access
            const { block, player, face } = e;

            // Get the equipment component for the player
            const equipment = player.getComponent('equippable');
            // Get the selected item from the player's mainhand
            const selectedItem = equipment.getEquipment('Mainhand');

            // Check if a player tried to place a block on top of the fence gate
            if (selectedItem && face === 'Up' && BlockTypes.get(selectedItem.typeId)) {
                // Calculate the position above the current block
                const aboveBlock = block.above();

                // If the block above is a edx:fence_gate (an equivalent of air)...
                if (aboveBlock.typeId === 'edx:redwood_gate') {
                    // ...place the selected block above the current block
                    aboveBlock.setType(selectedItem.typeId);
                    
                    // Reduce item count if not in creative mode
                    if (!player.matches({ gameMode: GameMode.creative })) {
                        if (selectedItem.amount > 1) {
                            selectedItem.amount -= 1;
                            equipment.setEquipment('Mainhand', selectedItem);
                        } else {
                            equipment.setEquipment('Mainhand', undefined); // Clear the slot if only 1 item left
                        }
                    }
                    return; // Exit the function after placing the block
                }
            }

            // Toggle the 'edx:open' state between false and true and determine the sound effect to play
            const currentState = block.permutation.getState('edx:open');
            const newOpenState = !currentState;
            const sound = newOpenState ? 'open.fence_gate' : 'close.fence_gate';

            // Determine the new cardinal direction based on the player's rotation
            const rotationAngle = player.getRotation().y;
            const newCardinalDirection = getNewCardinalDirection(block.permutation.getState('minecraft:cardinal_direction'), rotationAngle);

            // Update the block's permutation with the new states
            const newPermutation = BlockPermutation.resolve(block.typeId, {
                ...block.permutation.getAllStates(),
                'edx:open': newOpenState,
                'minecraft:cardinal_direction': newCardinalDirection
            });

            // Apply the new permutation and play the sound
            block.setPermutation(newPermutation);
            block.dimension.playSound(sound, block.location);

            // Corrected: Remove redeclaration of aboveBlock
            const aboveBlock = block.above();
            // Checks if the block above our fence gate is an invisible fence gate (equivalent to air)
            if (aboveBlock.typeId === 'edx:redwood_gate' && aboveBlock.permutation.getState('edx:invisible')) {
                const aboveCurrentState = aboveBlock.permutation.getState('edx:open');
                // Update edx:open state of the invisible fence gate above our fence gate
                if (aboveCurrentState !== newOpenState) {
                    const newAbovePermutation = BlockPermutation.resolve(aboveBlock.typeId, {
                        ...aboveBlock.permutation.getAllStates(),
                        'edx:open': newOpenState
                    });
                    aboveBlock.setPermutation(newAbovePermutation);
                }
            }
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('gate:on_player_destroy', {
        // Define behavior when a player destroys the fence
        onPlayerDestroy(e) {
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('gate:on_player_placed', {
        // Define behavior when a player places the fence
        onPlace(e) {
            // Destructure event data for easier access
            const { block } = e;

            // Get all current block states
            const currentStates = block.permutation.getAllStates();

            // Get the current state of the 'minecraft:cardinal_direction' block trait
            const cardinalDirection = currentStates['minecraft:cardinal_direction'];

            // Check if the current cardinal direction is 'south'
            if (cardinalDirection === 'south') {
                // Change the block state 'edx:direction' from false to true (remember this is the actual south rotation for our fence gate)
                const newedxDirection = true;
                currentStates['edx:direction'] = newedxDirection;

                // Update the block's permutation with the new state
                const newPermutation = BlockPermutation.resolve(block.typeId, currentStates);

                // Apply the new permutation to the block
                block.setPermutation(newPermutation);
            }
            const allowedBlocks = ['minecraft:cobblestone_wall', 'minecraft:stone_wall'];
            // Function to check if any adjacent blocks are of allowed types
            const hasAllowedBlock = (blocks) => blocks.some(adjacentBlock => allowedBlocks.includes(adjacentBlock?.typeId));

            // Check if any allowed adjacent blocks exist based on the cardinal direction
            const hasAllowedAdjacentBlock = (cardinalDirection === 'north' || cardinalDirection === 'south')
                ? hasAllowedBlock([adjacentBlocks.east, adjacentBlocks.west])
                : hasAllowedBlock([adjacentBlocks.north, adjacentBlocks.south]);

            // Update edx:in_wall_bit state based on adjacent blocks
            block.setPermutation(block.permutation.withState('edx:in_wall_bit', hasAllowedAdjacentBlock));
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('gate:on_tick', {
        onTick(e) {
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('fence:on_tick', {
        onTick(e) {
            const { block } = e;

            // Get adjacent blocks
            const north = block.north();
            const east = block.east();
            const south = block.south();
            const west = block.west();

            // Define an array of block types to exclude from connections
            const excludeBlocksArray = [
                'minecraft:air',
                'minecraft:wooden_door', 
                'minecraft:iron_door', 
                'minecraft:acacia_door', 
                'minecraft:birch_door', 
                'minecraft:crimson_door', 
                'minecraft:dark_oak_door', 
                'minecraft:jungle_door', 
                'minecraft:oak_door', 
                'minecraft:spruce_door', 
                'minecraft:warped_door', 
                'minecraft:mangrove_door',
                'minecraft:cherry_door',
                'minecraft:bamboo_door',
                'minecraft:iron_trapdoor', 
                'minecraft:acacia_trapdoor', 
                'minecraft:birch_trapdoor', 
                'minecraft:crimson_trapdoor', 
                'minecraft:dark_oak_trapdoor', 
                'minecraft:jungle_trapdoor', 
                'minecraft:oak_trapdoor', 
                'minecraft:spruce_trapdoor', 
                'minecraft:warped_trapdoor',
                'minecraft:mangrove_trapdoor',
                'minecraft:cherry_trapdoor',
                'minecraft:bamboo_trapdoor',
                'minecraft:trapdoor', 
                'minecraft:glass',
                'minecraft:short_grass',
                'minecraft:tall_grass',
                'minecraft:glass_pane'
                // Add other block types you want to exclude
            ];

            // Check if the adjacent block is not in the excludeBlocksArray
            const northConnects = !excludeBlocksArray.includes(north?.typeId);
            const eastConnects = !excludeBlocksArray.includes(east?.typeId);
            const southConnects = !excludeBlocksArray.includes(south?.typeId);
            const westConnects = !excludeBlocksArray.includes(west?.typeId);

            // Update block states based on the presence of adjacent blocks
            block.setPermutation(block.permutation.withState('edx:north_picket', northConnects ? 1 : 0));
            block.setPermutation(block.permutation.withState('edx:south_picket', southConnects ? 1 : 0));
            block.setPermutation(block.permutation.withState('edx:east_picket', eastConnects ? 1 : 0));
            block.setPermutation(block.permutation.withState('edx:west_picket', westConnects ? 1 : 0));
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('fence:on_place', {
        onPlace(e) {
            const { block } = e;

            // Get adjacent blocks
            const north = block.north();
            const east = block.east();
            const south = block.south();
            const west = block.west();

            // Define an array of block types to exclude from connections
            const excludeBlocksArray = [
                'minecraft:air',
                'minecraft:wooden_door', 
                'minecraft:iron_door', 
                'minecraft:acacia_door', 
                'minecraft:birch_door', 
                'minecraft:crimson_door', 
                'minecraft:dark_oak_door', 
                'minecraft:jungle_door', 
                'minecraft:oak_door', 
                'minecraft:spruce_door', 
                'minecraft:warped_door', 
                'minecraft:mangrove_door',
                'minecraft:cherry_door',
                'minecraft:bamboo_door',
                'minecraft:iron_trapdoor', 
                'minecraft:acacia_trapdoor', 
                'minecraft:birch_trapdoor', 
                'minecraft:crimson_trapdoor', 
                'minecraft:dark_oak_trapdoor', 
                'minecraft:jungle_trapdoor', 
                'minecraft:oak_trapdoor', 
                'minecraft:spruce_trapdoor', 
                'minecraft:warped_trapdoor',
                'minecraft:mangrove_trapdoor',
                'minecraft:cherry_trapdoor',
                'minecraft:bamboo_trapdoor',
                'minecraft:trapdoor', 
                'minecraft:glass',
                'minecraft:short_grass',
                'minecraft:tall_grass',
                'minecraft:glass_pane'
                // Add other block types you want to exclude
            ];

            // Check if the adjacent block is not in the excludeBlocksArray
            const northConnects = !excludeBlocksArray.includes(north?.typeId);
            const eastConnects = !excludeBlocksArray.includes(east?.typeId);
            const southConnects = !excludeBlocksArray.includes(south?.typeId);
            const westConnects = !excludeBlocksArray.includes(west?.typeId);

            // Update block states based on the presence of adjacent blocks
            block.setPermutation(block.permutation.withState('edx:north_picket', northConnects ? 1 : 0));
            block.setPermutation(block.permutation.withState('edx:south_picket', southConnects ? 1 : 0));
            block.setPermutation(block.permutation.withState('edx:east_picket', eastConnects ? 1 : 0));
            block.setPermutation(block.permutation.withState('edx:west_picket', westConnects ? 1 : 0));
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('door:on_interact', {
        // Define the behavior when a player interacts with the door block
        onPlayerInteract(e) {
            // Destructure event data for easier access
            const { block, player } = e;
            const isUpperBlock = block.permutation.getState('edx:upper_block_bit');

            // Get the equipment component for the player
            const equipment = player.getComponent('equippable');

            // Get the selected item from the player's mainhand
            const selectedItem = equipment.getEquipment('Mainhand');
            
            // Determine the target block to update
            const targetBlock = isUpperBlock ? block.below() : block.above();

            // Get the current state of the 'edx:open_bit' block trait for both the interacted block and the target block
            const currentOpenState = block.permutation.getState('edx:open_bit');
            const targetOpenState = targetBlock.permutation.getState('edx:open_bit');

            // Determine the new state of the 'edx:open_bit' block trait (toggle between true and false)
            const newOpenState = !currentOpenState;
            const newTargetOpenState = !targetOpenState;

            // Resolve the new block permutation based on the current block type and updated states
            const newBlockPermutation = BlockPermutation.resolve(block.typeId, {
                ...block.permutation.getAllStates(),
                'edx:open_bit': newOpenState
            });

            const newTargetBlockPermutation = BlockPermutation.resolve(targetBlock.typeId, {
                ...targetBlock.permutation.getAllStates(),
                'edx:open_bit': newTargetOpenState
            });

            // Set the block permutations to the newly resolved permutations
            block.setPermutation(newBlockPermutation);
            targetBlock.setPermutation(newTargetBlockPermutation);

            // Determine the sound effect to play based on the current state of the door
            const sound = currentOpenState ? 'close.wooden_door' : 'open.wooden_door';

            // Play the corresponding sound effect for opening or closing the door
            player.playSound(sound);
        }
    }),
    
    eventData.blockComponentRegistry.registerCustomComponent('door:on_place', {
        // Define behavior when a player places the block
        onPlace(e) {
            // Destructure event data for easier access
            const { block } = e;
            const aboveBlock = block.above();
            const northBlock = block.north(); // Get the block to the east
            const southBlock = block.south(); // Get the block to the east
            const eastBlock = block.east(); // Get the block to the east
            const westBlock = block.west(); // Get the block to the east
            const { x, y, z } = block.location;

            // Check if the block has already been processed
            if (processedBlocks.has(`${x},${y},${z}`)) {
                return; // Exit early if block has already been processed
            }

            // Get all current block states
            const currentStates = block.permutation.getAllStates();

            // Get the cardinal direction of the block
            const cardinalDirection = currentStates['minecraft:cardinal_direction'];

            // Check if the block above is air
            if (aboveBlock.typeId === 'minecraft:air' && !block.permutation.getState('edx:upper_block_bit')) {
                // Create a new permutation for the block above with the cardinal direction
                const aboveBlockPermutation = BlockPermutation.resolve('edx:redwood_door_b', {
                    'edx:upper_block_bit': true,
                    'minecraft:cardinal_direction': cardinalDirection
                });
                aboveBlock.setPermutation(aboveBlockPermutation);

                // Update the block's permutation with the new state
                const newPermutation = BlockPermutation.resolve(block.typeId, currentStates);

                // Apply the new permutation to the block
                block.setPermutation(newPermutation);
            } // Check if the block above is not air and the current block is not an upper block
            
            

            // Check if the cardinal direction of the block is south
            if (cardinalDirection === 'south' && eastBlock?.typeId === 'edx:redwood_door_b') {
                const eastBlockStates = eastBlock.permutation.getAllStates();
                // Check if the east block is a edx:redwood_door_b with edx:door_hinge_bit set to false
                if (!eastBlockStates['edx:door_hinge_bit']) {
                    // Change the edx:door_hinge_bit state of the placed block to true
                    const newPermutation = BlockPermutation.resolve(block.typeId, {
                        ...currentStates,
                        'edx:door_hinge_bit': true
                    });
                    block.setPermutation(newPermutation);
                }
                // Also, check if the block above has the same cardinal direction and if the block to the east of the above block is a edx:redwood_door_b
                const aboveBlockCardinalDirection = aboveBlock.permutation.getState('minecraft:cardinal_direction');
                const eastBlockAbove = aboveBlock.east();
                if (
                    aboveBlockCardinalDirection === 'south' &&
                    eastBlockAbove?.typeId === 'edx:redwood_door_b'
                ) {
                    const eastBlockAboveStates = eastBlockAbove.permutation.getAllStates();
                    // Check if the east block above is a edx:redwood_door_b with edx:door_hinge_bit set to false
                    if (!eastBlockAboveStates['edx:door_hinge_bit']) {
                        // Change the edx:door_hinge_bit state of the block above to true
                        const newAbovePermutation = BlockPermutation.resolve(aboveBlock.typeId, {
                            ...eastBlockAboveStates,
                            'edx:door_hinge_bit': true
                        });
                        aboveBlock.setPermutation(newAbovePermutation);
                    }
                }
            }

            // Check if the cardinal direction of the block is east
            if (cardinalDirection === 'east' && northBlock?.typeId === 'edx:redwood_door_b') {
                const northBlockStates = northBlock.permutation.getAllStates();
                // Check if the north block is a edx:redwood_door_b with edx:door_hinge_bit set to false
                if (!northBlockStates['edx:door_hinge_bit']) {
                    // Change the edx:door_hinge_bit state of the placed block to true
                    const newPermutation = BlockPermutation.resolve(block.typeId, {
                        ...currentStates,
                        'edx:door_hinge_bit': true
                    });
                    block.setPermutation(newPermutation);
                }
                // Also, check if the block above has the same cardinal direction and if the block to the north of the above block is a edx:redwood_door_b
                const aboveBlockCardinalDirection = aboveBlock.permutation.getState('minecraft:cardinal_direction');
                const northBlockAbove = aboveBlock.north();
                if (
                    aboveBlockCardinalDirection === 'east' &&
                    northBlockAbove?.typeId === 'edx:redwood_door_b'
                ) {
                    const northBlockAboveStates = northBlockAbove.permutation.getAllStates();
                    // Check if the north block above is a edx:redwood_door_b with edx:door_hinge_bit set to false
                    if (!northBlockAboveStates['edx:door_hinge_bit']) {
                        // Change the edx:door_hinge_bit state of the block above to true
                        const newAbovePermutation = BlockPermutation.resolve(aboveBlock.typeId, {
                            ...northBlockAboveStates,
                            'edx:door_hinge_bit': true
                        });
                        aboveBlock.setPermutation(newAbovePermutation);
                    }
                }
            }

            // Check if the cardinal direction of the block is north
            if (cardinalDirection === 'north' && westBlock?.typeId === 'edx:redwood_door_b') {
                const westBlockStates = westBlock.permutation.getAllStates();
                // Check if the west block is a edx:redwood_door_b with edx:door_hinge_bit set to false
                if (!westBlockStates['edx:door_hinge_bit']) {
                    // Change the edx:door_hinge_bit state of the placed block to true
                    const newPermutation = BlockPermutation.resolve(block.typeId, {
                        ...currentStates,
                        'edx:door_hinge_bit': true
                    });
                    block.setPermutation(newPermutation);
                }
                // Also, check if the block above has the same cardinal direction and if the block to the west of the above block is a edx:redwood_door_b
                const aboveBlockCardinalDirection = aboveBlock.permutation.getState('minecraft:cardinal_direction');
                const westBlockAbove = aboveBlock.west();
                if (
                    aboveBlockCardinalDirection === 'north' &&
                    westBlockAbove?.typeId === 'edx:redwood_door_b'
                ) {
                    const westBlockAboveStates = westBlockAbove.permutation.getAllStates();
                    // Check if the west block above is a edx:redwood_door_b with edx:door_hinge_bit set to false
                    if (!westBlockAboveStates['edx:door_hinge_bit']) {
                        // Change the edx:door_hinge_bit state of the block above to true
                        const newAbovePermutation = BlockPermutation.resolve(aboveBlock.typeId, {
                            ...westBlockAboveStates,
                            'edx:door_hinge_bit': true
                        });
                        aboveBlock.setPermutation(newAbovePermutation);
                    }
                }
            }

            // Check if the cardinal direction of the block is west
            if (cardinalDirection === 'west' && southBlock?.typeId === 'edx:redwood_door_b') {
                const southBlockStates = southBlock.permutation.getAllStates();
                // Check if the south block is a edx:redwood_door_b with edx:door_hinge_bit set to false
                if (!southBlockStates['edx:door_hinge_bit']) {
                    // Change the edx:door_hinge_bit state of the placed block to true
                    const newPermutation = BlockPermutation.resolve(block.typeId, {
                        ...currentStates,
                        'edx:door_hinge_bit': true
                    });
                    block.setPermutation(newPermutation);
                }
                // Also, check if the block above has the same cardinal direction and if the block to the south of the above block is a edx:redwood_door_b
                const aboveBlockCardinalDirection = aboveBlock.permutation.getState('minecraft:cardinal_direction');
                const southBlockAbove = aboveBlock.south();
                if (
                    aboveBlockCardinalDirection === 'west' &&
                    southBlockAbove?.typeId === 'edx:redwood_door_b'
                ) {
                    const southBlockAboveStates = southBlockAbove.permutation.getAllStates();
                    // Check if the south block above is a edx:redwood_door_b with edx:door_hinge_bit set to false
                    if (!southBlockAboveStates['edx:door_hinge_bit']) {
                        // Change the edx:door_hinge_bit state of the block above to true
                        const newAbovePermutation = BlockPermutation.resolve(aboveBlock.typeId, {
                            ...southBlockAboveStates,
                            'edx:door_hinge_bit': true
                        });
                        aboveBlock.setPermutation(newAbovePermutation);
                    }
                }
            }

            // Mark the block as processed
            processedBlocks.set(`${x},${y},${z}`, true);
        }
    }),
    eventData.blockComponentRegistry.registerCustomComponent('door:beforeOnPlayerPlace', {
        beforeOnPlayerPlace: event => {
            const { block } = event;
            const aboveBlock = block.above();
            if (aboveBlock.typeId !== 'minecraft:air') {
                event.cancel = true;
            }
         } 
    })

   
    
});

function crimsonspireStemBreak(block) {
    for(var i=1;i<30;i++)
    {
        if(['edx:crimsonspire_stem_0', 'edx:crimsonspire_stem_1','edx:crimsonspire_stem_2','edx:crimsonspire_cap'].includes(block.above(i).typeId)) 
        {
            block.dimension.runCommand(`setblock ${block.above(i).location.x} ${block.above(i).location.y} ${block.above(i).location.z} air destroy`) 
        }
        else
        {
            return;
        }
    }
}
function getNewCardinalDirection(currentDirection, angle) {
    const direction = directionDisplay(angle);
    if (['north', 'south'].includes(currentDirection)) {
        return direction.includes('south') ? 'south' : 'north';
    } else {
        return direction.includes('west') ? 'west' : 'east';
    }
}
function spotterDropItem(block,equipment,slot,dir,player) {
    const dimension = block.dimension
    const item = equipment.getEquipment(slot);
    if(item!=undefined)
    {
        dimension.spawnParticle('edx:souls_spotter',{x:player.location.x,y:player.location.y+1,z:player.location.z});
        dimension.playSound('random.pop',player.location);
        dimension.playSound('particle.soul_escape',player.location);                             
        var blockBehind = dimension.getBlock({x:block.location.x-dir.x,y:block.location.y-dir.y,z:block.location.z-dir.z})
        var inventory = blockBehind?.getComponent("inventory")?.container;
        equipment.setEquipment(slot, undefined);                                          
        try{
            if(inventory.emptySlotsCount!=0)
            {
                inventory.addItem(item);
            }
            else{
                dimension.spawnItem(item, {x:block.center().x-dir.x/2,y:block.center().y-dir.y/2,z:block.center().z-dir.z/2});
                dimension.playSound('mob.sniffer.drop_seed',block.location);
            }
        }
        catch(e)
        {
            dimension.spawnItem(item, {x:block.center().x-dir.x/2,y:block.center().y-dir.y/2,z:block.center().z-dir.z/2});
            dimension.playSound('mob.sniffer.drop_seed',block.location);
        }
    }
}

// Function to calculate the direction a player is looking at
function directionDisplay(angle) {
    if (Math.abs(angle) > 112.5) return 'north';
    if (Math.abs(angle) < 67.5) return 'south';
    if (angle < 157.5 && angle > 22.5) return 'west';
    if (angle > -157.5 && angle < -22.5) return 'east';
    return '';
}
export function updateStairsAround(block)
{
    updateStair(block)
    if(block.west().hasTag('stairs'))
        updateStair(block.west(1))
    if(block.east().hasTag('stairs'))
    updateStair(block.east(1))
    if(block.north().hasTag('stairs'))
    updateStair(block.north(1))
    if(block.south().hasTag('stairs'))
    updateStair(block.south(1))
}

function updateStair(block)
{
    const west = block.west(1)//-1 0 0
    const east = block.east(1)//1 0 0
    const north = block.north(1)//0 0 -1
    const south = block.south(1)//0 0 1
    if(block.permutation?.getState('minecraft:vertical_half')=='top')
    {
        if( block.permutation?.getState('minecraft:cardinal_direction')=='west')
            {
                //west top corner
                if ( (east.hasTag('south_stairs') && east.hasTag('top_stairs')) && !(west.hasTag('south_stairs') && west.hasTag('top_stairs')) )
                {
                    block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "top" , "minecraft:cardinal_direction": "west"}).withState("edx:position", "inner_south"))
                }
                    
                else if ( (east.hasTag('north_stairs') && east.hasTag('top_stairs')) && !(west.hasTag('north_stairs') && west.hasTag('top_stairs')) )
                    {
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "top" , "minecraft:cardinal_direction": "west"}).withState("edx:position", "inner_north"))
                    }

                else if( west.hasTag('south_stairs') && west.hasTag('top_stairs') )
                    {
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "top" , "minecraft:cardinal_direction": "west"}).withState("edx:position", "outer_south"))
                    }
                    
                else if( west.hasTag('north_stairs') && west.hasTag('top_stairs') )
                    {
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "top" , "minecraft:cardinal_direction": "west"}).withState("edx:position", "outer_north"))
                    }
                    
                //west top straight
                else
                    {
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "top" , "minecraft:cardinal_direction": "west"}).withState("edx:position", "normal"))
                    }
                        

            }
        else if(block.permutation?.getState('minecraft:cardinal_direction')=='east')
            {
                //east top corner
                if ( !(east.hasTag('south_stairs') && east.hasTag('top_stairs')) && (west.hasTag('south_stairs') && west.hasTag('top_stairs')) )
                {
                    block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "top" , "minecraft:cardinal_direction": "east"}).withState("edx:position", "inner_south"))
                }
                else if ( !(east.hasTag('north_stairs') && east.hasTag('top_stairs')) && (west.hasTag('north_stairs') && west.hasTag('top_stairs')) )
                {
                    block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "top" , "minecraft:cardinal_direction": "east"}).withState("edx:position", "inner_north"))
                }
                    

                else if( east.hasTag('south_stairs')  && east.hasTag('top_stairs') )
                {
                    block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "top" , "minecraft:cardinal_direction": "east"}).withState("edx:position", "outer_south"))
                }
                    
                else if( east.hasTag('north_stairs') && east.hasTag('top_stairs') )
                {
                    block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "top" , "minecraft:cardinal_direction": "east"}).withState("edx:position", "outer_north"))
                }
                    
                //east top straight
                else
                {
                    block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "top" , "minecraft:cardinal_direction": "east"}).withState("edx:position", "normal"))
                }
                    
            }
        else if(block.permutation?.getState('minecraft:cardinal_direction')=='north')
            {
                //north top corner
                if( (south.hasTag('east_stairs') && south.hasTag('top_stairs')) && !(north.hasTag('east_stairs') && north.hasTag('top_stairs')))
                {
                    block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "top" , "minecraft:cardinal_direction": "north"}).withState("edx:position", "inner_east"))
                }
                    
                else if( (south.hasTag('west_stairs') && south.hasTag('top_stairs')) && !(north.hasTag('west_stairs') && north.hasTag('top_stairs')) )
                {
                    block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "top" , "minecraft:cardinal_direction": "north"}).withState("edx:position", "inner_west"))
                }
                
                else if( north.hasTag('east_stairs')  && north.hasTag('top_stairs') )
                {
                    block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "top" , "minecraft:cardinal_direction": "north"}).withState("edx:position", "outer_east"))
                }
                else if(  north.hasTag('west_stairs') && north.hasTag('top_stairs') )
                {
                    block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "top" , "minecraft:cardinal_direction": "north"}).withState("edx:position", "outer_west"))
                }
                //north top straight
                else
                {
                    block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "top" , "minecraft:cardinal_direction": "north"}).withState("edx:position", "normal"))
                }
            }
        else if(block.permutation?.getState('minecraft:cardinal_direction')=='south')
            {
                //south top corner
                if( !(south.hasTag('east_stairs') && south.hasTag('top_stairs')) && (north.hasTag('east_stairs') && north.hasTag('top_stairs')))
                {
                    block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "top" , "minecraft:cardinal_direction": "south"}).withState("edx:position", "inner_east"))
                }
                    
                else if( !(south.hasTag('west_stairs') && south.hasTag('top_stairs')) && (north.hasTag('west_stairs') && north.hasTag('top_stairs')) )
                {
                    block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "top" , "minecraft:cardinal_direction": "south"}).withState("edx:position", "inner_west"))
                }

                else if( south.hasTag('east_stairs')  && south.hasTag('top_stairs') )
                {
                    block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "top" , "minecraft:cardinal_direction": "south"}).withState("edx:position", "outer_east"))
                }
                else if(  south.hasTag('west_stairs') && south.hasTag('top_stairs') )
                {
                    block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "top" , "minecraft:cardinal_direction": "south"}).withState("edx:position", "outer_west"))
                }
                //south top straight
                else
                {
                    block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "top" , "minecraft:cardinal_direction": "south"}).withState("edx:position", "normal"))
                }
            }
    }
    if(block.permutation?.getState('minecraft:vertical_half')=='bottom')
        {
            if( block.permutation?.getState('minecraft:cardinal_direction')=='west')
                {
                    //west bottom corner
                    if ( (east.hasTag('south_stairs') && east.hasTag('bottom_stairs')) && !(west.hasTag('south_stairs') && west.hasTag('bottom_stairs')) )
                    {
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "bottom" , "minecraft:cardinal_direction": "west"}).withState("edx:position", "inner_south"))
                    }
                        
                    else if ( (east.hasTag('north_stairs') && east.hasTag('bottom_stairs')) && !(west.hasTag('north_stairs') && west.hasTag('bottom_stairs')) )
                        {
                            block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "bottom" , "minecraft:cardinal_direction": "west"}).withState("edx:position", "inner_north"))
                        }
    
                    else if( west.hasTag('south_stairs') && west.hasTag('bottom_stairs') )
                        {
                            block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "bottom" , "minecraft:cardinal_direction": "west"}).withState("edx:position", "outer_south"))
                        }
                        
                    else if( west.hasTag('north_stairs') && west.hasTag('bottom_stairs') )
                        {
                            block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "bottom" , "minecraft:cardinal_direction": "west"}).withState("edx:position", "outer_north"))
                        }
                        
                    //west bottom straight
                    else
                        {
                            block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "bottom" , "minecraft:cardinal_direction": "west"}).withState("edx:position", "normal"))
                        }
                            
    
                }
            else if(block.permutation?.getState('minecraft:cardinal_direction')=='east')
                {
                    //east bottom corner
                    if ( !(east.hasTag('south_stairs') && east.hasTag('bottom_stairs')) && (west.hasTag('south_stairs') && west.hasTag('bottom_stairs')) )
                    {
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "bottom" , "minecraft:cardinal_direction": "east"}).withState("edx:position", "inner_south"))
                    }
                    else if ( !(east.hasTag('north_stairs') && east.hasTag('bottom_stairs')) && (west.hasTag('north_stairs') && west.hasTag('bottom_stairs')) )
                    {
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "bottom" , "minecraft:cardinal_direction": "east"}).withState("edx:position", "inner_north"))
                    }
                        
    
                    else if( east.hasTag('south_stairs')  && east.hasTag('bottom_stairs') )
                    {
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "bottom" , "minecraft:cardinal_direction": "east"}).withState("edx:position", "outer_south"))
                    }
                        
                    else if( east.hasTag('north_stairs') && east.hasTag('bottom_stairs') )
                    {
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "bottom" , "minecraft:cardinal_direction": "east"}).withState("edx:position", "outer_north"))
                    }
                        
                    //east bottom straight
                    else
                    {
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "bottom" , "minecraft:cardinal_direction": "east"}).withState("edx:position", "normal"))
                    }
                        
                }
            else if(block.permutation?.getState('minecraft:cardinal_direction')=='north')
                {
                    //north bottom corner
                    if( (south.hasTag('east_stairs') && south.hasTag('bottom_stairs')) && !(north.hasTag('east_stairs') && north.hasTag('bottom_stairs')))
                    {
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "bottom" , "minecraft:cardinal_direction": "north"}).withState("edx:position", "inner_east"))
                    }
                        
                    else if( (south.hasTag('west_stairs') && south.hasTag('bottom_stairs')) && !(north.hasTag('west_stairs') && north.hasTag('bottom_stairs')) )
                    {
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "bottom" , "minecraft:cardinal_direction": "north"}).withState("edx:position", "inner_west"))
                    }
                    
                    else if( north.hasTag('east_stairs')  && north.hasTag('bottom_stairs') )
                    {
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "bottom" , "minecraft:cardinal_direction": "north"}).withState("edx:position", "outer_east"))
                    }
                    else if(  north.hasTag('west_stairs') && north.hasTag('bottom_stairs') )
                    {
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "bottom" , "minecraft:cardinal_direction": "north"}).withState("edx:position", "outer_west"))
                    }
                    //north bottom straight
                    else
                    {
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "bottom" , "minecraft:cardinal_direction": "north"}).withState("edx:position", "normal"))
                    }
                }
            else if(block.permutation?.getState('minecraft:cardinal_direction')=='south')
                {
                    //south bottom corner
                    if( !(south.hasTag('east_stairs') && south.hasTag('bottom_stairs')) && (north.hasTag('east_stairs') && north.hasTag('bottom_stairs')))
                    {
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "bottom" , "minecraft:cardinal_direction": "south"}).withState("edx:position", "inner_east"))
                    }
                        
                    else if( !(south.hasTag('west_stairs') && south.hasTag('bottom_stairs')) && (north.hasTag('west_stairs') && north.hasTag('bottom_stairs')) )
                    {
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "bottom" , "minecraft:cardinal_direction": "south"}).withState("edx:position", "inner_west"))
                    }
    
                    else if( south.hasTag('east_stairs')  && south.hasTag('bottom_stairs') )
                    {
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "bottom" , "minecraft:cardinal_direction": "south"}).withState("edx:position", "outer_east"))
                    }
                    else if(  south.hasTag('west_stairs') && south.hasTag('bottom_stairs') )
                    {
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "bottom" , "minecraft:cardinal_direction": "south"}).withState("edx:position", "outer_west"))
                    }
                    //south bottom straight
                    else
                    {
                        block.setPermutation(BlockPermutation.resolve(block.typeId, {"minecraft:vertical_half": "bottom" , "minecraft:cardinal_direction": "south"}).withState("edx:position", "normal"))
                    }
                }
        }
}
function GetLeaveValue(block)
{
    if(blockAroundHasTag(block,'minecraft:logs')) return 8;
    var value = 0
    const above = block.above()?.typeId=='edx:redwood_leaves'?block.above()?.permutation?.getState('edx:decay_tier'):0
    const below = block.below()?.typeId=='edx:redwood_leaves'?block.below()?.permutation?.getState('edx:decay_tier'):0
    const north = block.north()?.typeId=='edx:redwood_leaves'?block.north()?.permutation?.getState('edx:decay_tier'):0
    const south = block.south()?.typeId=='edx:redwood_leaves'?block.south()?.permutation?.getState('edx:decay_tier'):0
    const east = block.east()?.typeId=='edx:redwood_leaves'?block.east()?.permutation?.getState('edx:decay_tier'):0
    const west = block.west()?.typeId=='edx:redwood_leaves'?block.west()?.permutation?.getState('edx:decay_tier'):0
    const blocks = [above,below,north,south,west,east]
    for(var i=0;i<blocks.length;i++)
    {
        if(blocks[i]!=undefined)
            if(blocks[i]>value)
                value = blocks[i]
    }
    return value

}
function blockAroundHasTag(block,tag)
{
    return block.above()?.hasTag(tag) || block.below()?.hasTag(tag) || block.east()?.hasTag(tag) || block.west()?.hasTag(tag) || block.north()?.hasTag(tag) || block.south()?.hasTag(tag)
}
function treeSpaceCheck(dir,dist,dimension,block)
{
    const options = { maxDistance: dist}
    let blocks3 = dimension.getBlockFromRay({x:block.location.x,y:block.location.y+dir.y,z:block.location.z},dir, options);
    let blocks1 = dimension.getBlockFromRay({x:block.location.x-2,y:block.location.y+dir.y,z:block.location.z-2}, dir, options);
    let blocks2 = dimension.getBlockFromRay({x:block.location.x+2,y:block.location.y+dir.y,z:block.location.z+2}, dir, options);
    let blocks4 = dimension.getBlockFromRay({x:block.location.x+2,y:block.location.y+dir.y,z:block.location.z-2}, dir, options);
    let blocks5 = dimension.getBlockFromRay({x:block.location.x-2,y:block.location.y+dir.y,z:block.location.z+2}, dir, options);
    let blocks6 = dimension.getBlockFromRay({x:block.location.x-1,y:block.location.y+dir.y,z:block.location.z-1}, dir, options);
    let blocks7 = dimension.getBlockFromRay({x:block.location.x+1,y:block.location.y+dir.y,z:block.location.z+1}, dir, options);
    let blocks8 = dimension.getBlockFromRay({x:block.location.x+1,y:block.location.y+dir.y,z:block.location.z-1}, dir, options);
    let blocks9 = dimension.getBlockFromRay({x:block.location.x-1,y:block.location.y+dir.y,z:block.location.z+1}, dir, options);
    let blocks10 = dimension.getBlockFromRay({x:block.location.x-3,y:block.location.y+dir.y,z:block.location.z-3}, dir, options);
    let blocks11 = dimension.getBlockFromRay({x:block.location.x+3,y:block.location.y+dir.y,z:block.location.z+3}, dir, options);
    let blocks12 = dimension.getBlockFromRay({x:block.location.x+3,y:block.location.y+dir.y,z:block.location.z-3}, dir, options);
    let blocks13 = dimension.getBlockFromRay({x:block.location.x-3,y:block.location.y+dir.y,z:block.location.z+3}, dir, options);
    return blocks1==undefined && blocks2==undefined && blocks3==undefined && blocks4==undefined && blocks5==undefined && blocks6==undefined && blocks7==undefined && blocks8==undefined && blocks9==undefined && blocks10==undefined && blocks11==undefined && blocks12==undefined && blocks13==undefined
}
function getPreciseRotation(playerYRotation) {
    // Transform player's head Y rotation to a positive
    if (playerYRotation < 0) playerYRotation += 360;
    // How many 16ths of 360 is the head rotation? - rounded
    const rotation = Math.round(playerYRotation / 22.5);
  
    // 0 and 16 represent duplicate rotations (0 degrees and 360 degrees), so 0 is returned if the value of `rotation` is 16
    return rotation !== 16 ? rotation : 0;
  }

