import { world ,system,BlockPermutation} from "@minecraft/server"
import {updateStairsAround} from "../blocks/block_components"

world.afterEvents.playerPlaceBlock.subscribe(ev => {
    var block = ev.block
    if(block.hasTag("stairs"))
        updateStairsAround(block)
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
    if(block.typeId == 'edx:redwood_leaves')
        block.setPermutation(BlockPermutation.resolve(block.typeId, {"edx:can_despawn": "false","edx:decay_tier": 8 }));
})