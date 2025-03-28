import { world ,system} from "@minecraft/server"

function getScore(player, objective) {
    try {
      const s = world.scoreboard.getObjective(objective);
      if (!s) world.scoreboard.addObjective(objective, objective);
      return s.getScore(player.scoreboardIdentity);
    } catch {
      return 0;
    }
   }
   
const logType = ["minecraft:oak_log","minecraft:birch_log","minecraft:cherry_log","minecraft:jungle_log","minecraft:acacia_log","minecraft:dark_oak_log","minecraft:mangrove_log","minecraft:crimson_stem","minecraft:warped_stem","minecraft:spruce_log","edx:redwood_log"]

function reworked_break(ev){
    const { block,player,itemStackBeforeBreak } = ev;
    const { x, y, z } = block.location;


    // Check if the block above or below the destroyed block is also edx:redwood_door_b
    const aboveBlock = block.above();
    const belowBlock = block.below();
    if (belowBlock.typeId === 'edx:redwood_door_b') {
        belowBlock.setType('minecraft:air');
    } else if (aboveBlock.typeId === 'edx:redwood_door_b') {
        aboveBlock.setType('minecraft:air');
    }
    var location = { x: ev.block.location.x, y: ev.block.location.y, z: ev.block.location.z };
        var Nblock = world.getDimension(ev.player.dimension.id).getBlock({x:location.x+1,y:location.y,z:location.z})
        if (Nblock.hasTag('update')){
            Nblock.setPermutation(Nblock.permutation.withState('edx:update', true));
        } 
        var Nblock = world.getDimension(ev.player.dimension.id).getBlock({x:location.x-1,y:location.y,z:location.z})
        if (Nblock.hasTag('update')){
            Nblock.setPermutation(Nblock.permutation.withState('edx:update', true));
        }
        var Nblock = world.getDimension(ev.player.dimension.id).getBlock({x:location.x,y:location.y,z:location.z+1})
        if (Nblock.hasTag('update')){
            Nblock.setPermutation(Nblock.permutation.withState('edx:update', true));
        }
        var Nblock = world.getDimension(ev.player.dimension.id).getBlock({x:location.x,y:location.y,z:location.z-1})
        if (Nblock.hasTag('update')){
            Nblock.setPermutation(Nblock.permutation.withState('edx:update', true));
        }
    if(itemStackBeforeBreak?.getTags()?.includes('axe_tier1'))
    {
        if(getScore(player,'mode')>=1)
            for(let i=1;i<5;i++)
            {
                if(logType.includes(block.above(i).typeId))
                {
                    block.dimension.spawnItem(block.above(i).getItemStack(1),block.location)
                    block.above(i).setType('air')
                }
            }
    }
    if(itemStackBeforeBreak?.getTags()?.includes('axe_tier2'))
        {
            if(getScore(player,'mode')==1)
                for(let i=1;i<5;i++)
                {
                    if(logType.includes(block.above(i).typeId))
                    {
                        block.dimension.spawnItem(block.above(i).getItemStack(1),block.location)
                        block.above(i).setType('air')
                    }
                }
            if(getScore(player,'mode')>=2)
                for(let i=1;i<15;i++)
                {
                    if(logType.includes(block.above(i).typeId))
                    {
                        block.dimension.spawnItem(block.above(i).getItemStack(1),block.location)
                        block.above(i).setType('air')
                    }
                }
        }
    if(itemStackBeforeBreak?.getTags()?.includes('axe_tier3'))
    {
        if(getScore(player,'mode')==1)
            for(let i=1;i<5;i++)
            {
                if(logType.includes(block.above(i).typeId))
                {
                    block.dimension.spawnItem(block.above(i).getItemStack(1),block.location)
                    block.above(i).setType('air')
                }
            }
        if(getScore(player,'mode')==2)
            for(let i=1;i<15;i++)
            {
                if(logType.includes(block.above(i).typeId))
                {
                    block.dimension.spawnItem(block.above(i).getItemStack(1),block.location)
                    block.above(i).setType('air')
                }
            }
        if(getScore(player,'mode')>=3 && ((itemStackBeforeBreak?.typeId == "edx:void_axe3" && getScore(player,'light')!=1) || (itemStackBeforeBreak?.typeId == "edx:light_axe3" && getScore(player,'void')!=1)))
            for(let i=1;i<30;i++)
            {
                if(logType.includes(block.above(i).typeId))
                {
                    block.dimension.spawnItem(block.above(i).getItemStack(1),block.locationv)
                    block.above(i).setType('air')
                }
            }
    }
}

world.afterEvents.playerBreakBlock.subscribe(ev => {

    reworked_break(ev);
    
})