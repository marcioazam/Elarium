import { world,ItemStack,BlockPermutation,GameMode} from "@minecraft/server";


const wood = ["edx:redwood_log","edx:redwood_wood"]
const strippedWood = ["edx:redwood_stripped_log","edx:redwood_stripped_wood"]

function getScore(player, objective) {
    try {
      const s = world.scoreboard.getObjective(objective);
      if (!s) world.scoreboard.addObjective(objective, objective);
      return s.getScore(player.scoreboardIdentity);
    } catch {
      return 0;
    }
   }

  
//rebel459 template <3
export function Damage(player,itemUsed)
{
    if (!itemUsed || player.matches({ gameMode: GameMode.creative })) return;

        // This retrieves the player's equippable component.
        const playerEquippableComp = player.getComponent("equippable");

        // This returns if playerEquippableComp is undefined.
        if (!playerEquippableComp) return;

        // This retrieves the enchantable component of the item.
        const itemEnchantmentComp = itemUsed.getComponent("minecraft:enchantable");
        const unbreakingLevel = itemEnchantmentComp?.getEnchantment("unbreaking")?.level ?? 0;

        // Calculates the chance of an item breaking based on its unbreaking level. This is the vanilla unbreaking formula.
        const breakChance = 100 / (unbreakingLevel + 1);
        // Generates a random chance value between 0 and 100.
        const randomizeChance = Math.random() * 100;

        // This returns if breakChance is less than randomizeChance.
        if (breakChance < randomizeChance) return;

        // This retrieves the durability component of the item.
        const itemUsedDurabilityComp = itemUsed.getComponent("durability");

        // This returns if itemUsedDurabilityComp is undefined.
        if (!itemUsedDurabilityComp) return;

        let durabilityModifier = 0;
        if (itemUsed.hasTag('minecraft:is_sword')) {
            // If the item is a tool, then it will set the durability modifier to 1.
            durabilityModifier = 2;
        } else {
            // If the item is a weapon, then it will set the durability modifier to 2.
            durabilityModifier = 1;
        }

        // This will set the new durability value.
        itemUsedDurabilityComp.damage += durabilityModifier;

        // Declares and checks if the item is out of durability
        const maxDurability = itemUsedDurabilityComp.maxDurability
        const currentDamage = itemUsedDurabilityComp.damage
        if (currentDamage >= maxDurability) {

            // If the item is out of durability, plays the item breaking sound and removes the item
            player.playSound('random.break', { pitch: 1, location: player.location, volume: 1 })
            playerEquippableComp.setEquipment("Mainhand", new ItemStack('minecraft:air', 1));
        }
        else if (currentDamage < maxDurability) {

            // This sets the item in the player's selected slot.
            playerEquippableComp.setEquipment("Mainhand", itemUsed);
        }
    
}

 world.beforeEvents.worldInitialize.subscribe(async (event) => {
   const { itemComponentRegistry, blockComponentRegistry } = event;

  
    itemComponentRegistry.registerCustomComponent('edx:training_dummy', {
        onUseOn: ({source,itemStack,block,blockFace}) => {
            const rotation = source.getRotation();
            const equipment = source.getComponent('equippable');
            var trueBlock=blockFace=='Down'?block.below():blockFace=='Up'?block.above():blockFace=='East'?block.east():blockFace=='West'?block.west():blockFace=='North'?block.north():block.south()
            let entity = world.getDimension(block.dimension.id).spawnEntity("edx:training_dummy",trueBlock.bottomCenter());
            entity.setRotation({x:Math.round(rotation.x/ 45)*45,y:Math.round(rotation.y/ 45)*45})
            decreaseItemStack(source,equipment,itemStack)
        }
    }),

	
	itemComponentRegistry.registerCustomComponent('edx:durability', {
        onMineBlock: ({source,itemStack}) => {
            Damage(source,itemStack)
        }
    }),
    itemComponentRegistry.registerCustomComponent('edx:axe_stripping', {
        onUseOn: ({source,itemStack,block}) => {
            if(wood.includes(block.typeId))
            {
                const permutations = block.permutation.getAllStates()
                block.setType(strippedWood[wood.indexOf(block.typeId)])
                block.setPermutation(BlockPermutation.resolve(block.typeId,{...permutations}))
                Damage(source,itemStack)
                source.playSound('step.wood');
            }
        }
    }),
    itemComponentRegistry.registerCustomComponent('edx:pickaxe_tier1', {
        onUse: ({source}) => {
            if(source.isSneaking)
            source.runCommandAsync(`function change_mode1`)
        }
    }),

    itemComponentRegistry.registerCustomComponent('edx:hoe_use', {
        onUseOn: ({source,itemStack}) => {
                    Damage(source,itemStack)
        }
    }),
    itemComponentRegistry.registerCustomComponent('edx:use_durability', {
        onUse: ({source,itemStack}) => {
                    Damage(source,itemStack)
        }
    }),


    itemComponentRegistry.registerCustomComponent('edx:axe_tier1', {
        onUse: ({source}) => {
            if(source.isSneaking)
            source.runCommandAsync(`function change_mode1_axe`)
        }
    }),


  
    itemComponentRegistry.registerCustomComponent('edx:tree_bark', {
        onUseOn: ({source,itemStack,block}) => {
            if(strippedWood.includes(block.typeId))
            {
                const permutations = block.permutation.getAllStates()
                block.setType(wood[strippedWood.indexOf(block.typeId)])
                block.setPermutation(BlockPermutation.resolve(block.typeId,{...permutations}))
                source.playSound('step.wood');
            }
            
        }
    }),
    itemComponentRegistry.registerCustomComponent('edx:allay_bottle', {
        onUse: ({source}) => {
            const equipment = source.getComponent('equippable'); 
            if(source.isSneaking)
            {
                source.runCommandAsync(`event entity @s allay`)
            }
            else
            {
                world.getDimension(source.dimension.id).spawnEntity("allay",source.location);
            }
            if (source.matches({ gameMode: GameMode.creative })) return;
            equipment.setEquipment('Mainhand', new ItemStack('glass_bottle', 1))
            
        }
    }),
    itemComponentRegistry.registerCustomComponent('edx:void_allay_bottle', {
        onUse: ({source}) => {
            const equipment = source.getComponent('equippable'); 
            if(source.isSneaking)
            {
                source.runCommandAsync(`event entity @s void_allay`)
            }
            else
            {
                world.getDimension(source.dimension.id).spawnEntity("edx:void_allay",source.location);
            }
            if (source.matches({ gameMode: GameMode.creative })) return;
                equipment.setEquipment('Mainhand', new ItemStack('glass_bottle', 1))
            
        }
    }),
    itemComponentRegistry.registerCustomComponent('edx:light_allay_bottle', {
        onUse: ({source}) => {
            const equipment = source.getComponent('equippable'); 
            if(source.isSneaking)
            {
                source.runCommandAsync(`event entity @s light_allay`)
            }
            else
            {
                world.getDimension(source.dimension.id).spawnEntity("edx:light_allay",source.location);
            }
            if (source.matches({ gameMode: GameMode.creative })) return;
                equipment.setEquipment('Mainhand', new ItemStack('glass_bottle', 1))
            
        }
    }),
    itemComponentRegistry.registerCustomComponent('edx:light1', {
        onUse: ({source,itemStack}) => {
            if (getScore(source,'void')==1) return;
            itemStack.getComponent('cooldown').startCooldown(source);
            source.addEffect('regeneration', 300, {amplifier: 0})
            world.getDimension(source.dimension.id).spawnParticle('edx:light_particle',source.getHeadLocation());
            Damage(source,itemStack)
        }
    }),
    itemComponentRegistry.registerCustomComponent('edx:light2', {
        onUse: ({source,itemStack}) => {
            if (getScore(source,'void')==1) return;
            itemStack.getComponent('cooldown').startCooldown(source);
            if (!source.isSneaking) {
                const entityOptions = {
                    location: source.location, 
                    families: [ "player" ],
                    maxDistance: 15
                }
                const entities = source.dimension.getEntities(entityOptions);
                for (let i = 0; i < entities.length ; i++) {
                    entities[i]?.addEffect('regeneration', 200, {amplifier: 0})
                }
                world.getDimension(source.dimension.id).spawnParticle('edx:light_particle',source.getHeadLocation());
            }
            else {
                source.addEffect('regeneration', 300, {amplifier: 1})
                world.getDimension(source.dimension.id).spawnParticle('edx:light_particle',source.getHeadLocation());
            }
            Damage(source,itemStack)
            
            
            
        }
    }),
    itemComponentRegistry.registerCustomComponent('edx:light3', {
        onUse: ({source,itemStack}) => {
            if (getScore(source,'void')==1) return;
            itemStack.getComponent('cooldown').startCooldown(source);
            if ( !source.isSneaking) {
                const entityOptions = {
                    location: source.location,
                    families: [ "player" ],
                    maxDistance: 15
                }
                const entities = source.dimension.getEntities(entityOptions);
                for (let i = 0; i < entities.length ; i++) {
                    entities[i]?.addEffect('regeneration', 200, {amplifier: 2})
                }
                world.getDimension(source.dimension.id).spawnParticle('edx:light_particle',source.getHeadLocation());
            }
            else {
                source.addEffect('regeneration', 300, {amplifier: 3})
                world.getDimension(source.dimension.id).spawnParticle('edx:light_particle',source.getHeadLocation());
            }
            Damage(source,itemStack)
            
            
        }
    }),
    itemComponentRegistry.registerCustomComponent('edx:void1', {
        onUse: ({source,itemStack}) => {
            if (getScore(source,'light')==1) return;
            itemStack.getComponent('cooldown').startCooldown(source);
            if ( !source.isSneaking) {
                const entityOptions = {
                    location: source.location,
                    families: [ "monster" ],
                    maxDistance: 10
                }
                const entities = source.dimension.getEntities(entityOptions);
                for (let i = 0; i < entities.length ; i++) {
                    entities[i]?.applyDamage(20,{cause: "magic"})
                }
                world.getDimension(source.dimension.id).spawnParticle('edx:void_particle',source.getHeadLocation());
            }
            else {
                const entityOptions = {
                    location: source.location,
                    families: [ "player" ],
                    maxDistance: 10
                }
                const entities = source.dimension.getEntities(entityOptions);
                for (let i = 0; i < entities.length ; i++) {
                    if(entities[i]!=source)
                        entities[i]?.applyDamage(5,{cause: "magic"})
                }
                world.getDimension(source.dimension.id).spawnParticle('edx:void_particle',source.getHeadLocation());
            }
            Damage(source,itemStack)
        }
    }),
    itemComponentRegistry.registerCustomComponent('edx:void2', {
        onUse: ({source,itemStack}) => {
            if (getScore(source,'light')==1) return;
            itemStack.getComponent('cooldown').startCooldown(source);
            if ( !source.isSneaking) {
                const entityOptions = {
                    location: source.location,
                    families: [ "monster" ],
                    maxDistance: 10
                }
                const entities = source.dimension.getEntities(entityOptions);
                for (let i = 0; i < entities.length ; i++) {
                    entities[i]?.applyDamage(35,{cause: "magic"})
                }
                world.getDimension(source.dimension.id).spawnParticle('edx:void_particle',source.getHeadLocation());
            }
            else {
                const entityOptions = {
                    location: source.location,
                    families: [ "player" ],
                    maxDistance: 10
                }
                const entities = source.dimension.getEntities(entityOptions);
                for (let i = 0; i < entities.length ; i++) {
                    if(entities[i]!=source)
                        entities[i].applyDamage(10,{cause: "magic"})
                }
                world.getDimension(source.dimension.id).spawnParticle('edx:void_particle',source.getHeadLocation());
            }
            Damage(source,itemStack)
        }
    }),
    itemComponentRegistry.registerCustomComponent('edx:void3', {
        onUse: ({source,itemStack}) => {
            if (getScore(source,'light')==1) return;
            itemStack.getComponent('cooldown').startCooldown(source);
            if ( !source.isSneaking) {
                const entityOptions = {
                    location: source.location,
                    families: [ "monster" ],
                    maxDistance: 10
                }
                const entities = source.dimension.getEntities(entityOptions);
                for (let i = 0; i < entities.length ; i++) {
                    entities[i]?.applyDamage(50,{cause: "magic"})
                }
                world.getDimension(source.dimension.id).spawnParticle('edx:void_particle',source.getHeadLocation());
            }
            else {
                const entityOptions = {
                    location: source.location,
                    families: [ "player" ],
                    maxDistance: 10
                }
                const entities = dimension.getEntities(entityOptions);
                for (let i = 0; i < entities.length ; i++) {
                    if(entities[i]!=source)
                        entities[i]?.applyDamage(15,{cause: "magic"})
                }
                world.getDimension(source.dimension.id).spawnParticle('edx:void_particle',source.getHeadLocation());
            }
            Damage(source,itemStack)
        }
    }),
    itemComponentRegistry.registerCustomComponent('edx:yellow_spore_bag', {
        onUseOn: ({source,itemStack,block}) => {
            const equipment = source.getComponent('equippable');
            if(block.typeId=="minecraft:stone")
            {
                world.getDimension(block.dimension.id).spawnParticle('edx:yellow_spore_particles',block.below().location);
                source.dimension.playSound('item.bone_meal.use', block.location)
                block.setType("edx:cave_mycelium")
                decreaseItemStack(source,equipment,itemStack)
            }
            else if(block.typeId == "edx:cave_mycelium")
            {
                world.getDimension(block.dimension.id).spawnParticle('edx:yellow_spore_particles',block.below().location);
                source.dimension.playSound('item.bone_meal.use', block.location)
                spreadCaveMycelium(block)
                spreadYellowSporeBag(block)
                decreaseItemStack(source,equipment,itemStack)
            }
            else if(block.typeId == "edx:mycelium_vine" && block.below().isAir)
            {
                world.getDimension(block.dimension.id).spawnParticle('edx:yellow_spore_particles',block.location);
                source.dimension.playSound('item.bone_meal.use', block.location)
                block.below().setType("edx:mycelium_vine")
                decreaseItemStack(source,equipment,itemStack)
            }
        }
    }),
    itemComponentRegistry.registerCustomComponent('edx:blue_spore_bag', {
        onUseOn: ({source,itemStack,block}) => {
            const equipment = source.getComponent('equippable');
            if(block.typeId=="minecraft:stone")
            {
                world.getDimension(block.dimension.id).spawnParticle('edx:blue_spore_particles',block.above().location);
                source.dimension.playSound('item.bone_meal.use', block.location)
                block.setType("edx:cave_mycelium")
                decreaseItemStack(source,equipment,itemStack)
            }
            else if(block.typeId == "edx:cave_mycelium")
            {
                world.getDimension(block.dimension.id).spawnParticle('edx:blue_spore_particles',block.above().location);
                source.dimension.playSound('item.bone_meal.use', block.location)
                spreadCaveMycelium(block)
                spreadBlueSporeBag(block)
                decreaseItemStack(source,equipment,itemStack)
            }
            else if(block.typeId == "edx:mycelium_vine" && block.above().isAir)
            {
                world.getDimension(block.dimension.id).spawnParticle('edx:blue_spore_particles',block.location);
                source.dimension.playSound('item.bone_meal.use', block.location)
                block.above().setType("edx:mycelium_vine")
                decreaseItemStack(source,equipment,itemStack)
            }
        }
    }),
  
    itemComponentRegistry.registerCustomComponent('edx:treasure_chest', {
        onUse: ({source,itemStack}) => {
            const equipment = source.getComponent('equippable');
            decreaseItemStack(source,equipment,itemStack)
            source.runCommandAsync(`loot give @s loot "chests/treasure_chest"`)
        }
    }),
    itemComponentRegistry.registerCustomComponent('edx:coin', {
        onUse: ({source,itemStack}) => {
            const equipment = source.getComponent('equippable');
            if(!source.isSneaking && itemStack.amount > 9)
            {
                const inventory = source.getComponent('inventory').container;
                if(coins.indexOf(itemStack.typeId)<6)
                {
                    var nextCoin = new ItemStack(coins[coins.indexOf(itemStack.typeId)+1],1)
                    inventory.addItem(nextCoin)
                    if (itemStack.amount > 10) {
                        itemStack.amount -= 10;
                        equipment.setEquipment('Mainhand',itemStack);
                    } else if (itemStack.amount == 10) {
                        equipment.setEquipment('Mainhand', undefined);
                    }
                }
            }
            else if(source.isSneaking)
            {
                const inventory = source.getComponent('inventory').container;
                if(coins.indexOf(itemStack.typeId)>0)
                {
                    var nextCoin = new ItemStack(coins[coins.indexOf(itemStack.typeId)-1],10)
                    inventory.addItem(nextCoin)
                    if (itemStack.amount > 1) {
                        itemStack.amount -= 1;
                        equipment.setEquipment('Mainhand', itemStack);
                    } else if (itemStack.amount === 1) {
                        equipment.setEquipment('Mainhand', undefined);
                    }

                }
            }

        }
    })





})

const coins = ["edx:copper_coin","edx:tin_coin","edx:iron_coin","edx:platinium_coin","edx:nickel_coin","edx:netherite_coin","edx:void_coin"]







function getPreciseRotation(playerYRotation) {
    // Transform player's head Y rotation to a positive
    if (playerYRotation < 0) playerYRotation += 360;
    // How many 16ths of 360 is the head rotation? - rounded
    const rotation = Math.round(playerYRotation / 45);
  
    // 0 and 16 represent duplicate rotations (0 degrees and 360 degrees), so 0 is returned if the value of `rotation` is 16
    return rotation !== 8 ? rotation : 0;
  }

function decreaseItemStack(source,equipment,itemStack)
{
    if (source.matches({ gameMode: GameMode.creative })) return;
    if (itemStack.amount > 1) {
        itemStack.amount -= 1;
        equipment.setEquipment('Mainhand', itemStack);
    } else if (itemStack.amount === 1) {
        equipment.setEquipment('Mainhand', undefined);
    }
    
}
function spreadCaveMycelium(block)
{
    for (var i=0; i<2;i++)
    {
        const x= Math.round(Math.random()*2)-1
        const z= Math.round(Math.random()*2)-1
        var newBlock = world.getDimension(block.dimension.id).getBlock({x:block.location.x+x,y:block.location.y,z:block.location.z+z})
        if(newBlock.typeId == "minecraft:stone")
        {
            newBlock.setType("edx:cave_mycelium")
        }
    }
}
const yellowSporelist = ["edx:mycelium_grass","edx:mycelium_vine","edx:yellow_mushroom","edx:yellow_spore_bag"]
function spreadYellowSporeBag(block)
{
    for (var i=0; i<30;i++)
    {
        const x= Math.random()<=0.5?-1:1 * Math.round(Math.random()*7)
        const z= Math.random()<=0.5?-1:1 * Math.round(Math.random()*7)
        var newBlock = block.dimension.getBlock({x:block.location.x+x,y:block.location.y,z:block.location.z+z})
        if(newBlock.typeId=="edx:cave_mycelium" && newBlock.below().isAir)
        {
            const plantIndex= Math.round(Math.random()*3)
            newBlock.below().setType(yellowSporelist[plantIndex])
            
        }
    }
    
}
const blueSporelist = ["edx:mycelium_grass","edx:mycelium_vine","edx:blue_mushroom","edx:blue_spore_bag"]

function spreadBlueSporeBag(block)
{
    for (var i=0; i<30;i++)
    {
        const x= Math.random()<=0.5?-1:1 * Math.round(Math.random()*7)
        const z= Math.random()<=0.5?-1:1 * Math.round(Math.random()*7)
        var newBlock = block.dimension.getBlock({x:block.location.x+x,y:block.location.y,z:block.location.z+z})
        if(newBlock.typeId=="edx:cave_mycelium" && newBlock.above().isAir)
        {
            const plantIndex= Math.round(Math.random()*3)
            newBlock.above().setType(blueSporelist[plantIndex])
            
        }
    }
    
}