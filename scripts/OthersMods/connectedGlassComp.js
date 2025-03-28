// Template made by GST378, I love you

// Used in naming states in blocks: 'connected_glasses:north' , 'connected_glasses:down', ...
const addonNamespace = 'connected_glasses';

/**
 * Maps directions to their opposite directions.
 * Used to get the correct directions of nearby blocks.
 */
const OPPOSITE_DIRECTIONS = {
    'north': 'south',
    'east': 'west',
    'south': 'north',
    'west': 'east',
    'up': 'down',
    'down': 'up',
    'north_east': 'south_west',
    'east_south': 'west_north',
    'south_west': 'north_east',
    'west_north': 'east_south'
};

/**
 * Gets nearby blocks linked to their respective directions.
 *
 * @param {Block} block - The block that was broken or placed.
 * @returns {object} - Returns an object that contains all nearby blocks linked to their respective directions.
 */
function getNearbyBlocks(block) {
    return {
        'up': block.above(),
        'down': block.below(),
        'north': block.north(),
        'east': block.east(),
        'south': block.south(),
        'west': block.west(),
        'north_east': block.north().east(),
        'east_south': block.east().south(),
        'south_west': block.south().west(),
        'west_north': block.west().north()
    }
};

/**
 * Checks the block, nearby blocks and whether they should connect or not.
 *
 * @param {Block} block - The block that was placed or broken.
 * @param {string} blockId - The typeId or type.id of the placed/broken block or permutation.
 * @param {string} [checkType='break'] - Indicates whether the block was placed or broken, possible values: "break" or "placed".
 * @returns {undefined} - Does not return any value.
 */
function updateBlock(block, blockId, checkType = 'break') {
    // Get nearby directions
    const nearbyBlocks = getNearbyBlocks(block);
    
    // Checks whether the blocks should connect or not ('placed' or 'break')
    const stateValue = checkType === 'placed';
    
    // Get all nearby blocks
    for (const direction in nearbyBlocks) {
        const nearbyBlock = nearbyBlocks[direction];
            
        // Checks if they are the same as the current block
        if (nearbyBlock?.typeId === blockId) {
            // Update current block if stateValue is true
            if (stateValue) {
                const newBlockPermutation = block.permutation.withState(`${addonNamespace}:${direction}`, stateValue);
                block.setPermutation(newBlockPermutation);
            }
            
            // Update the nearby block in the opposite direction
            const nearbyBlockPermutation = nearbyBlock.permutation.withState(`${addonNamespace}:${OPPOSITE_DIRECTIONS[direction]}`, stateValue);
            nearbyBlock.setPermutation(nearbyBlockPermutation);
                
        }
    }
}

// Triggers block updates
export const connectedGlassComp = {
    onPlace: ({ block }) => {
        updateBlock(block, block.typeId,'placed');
    },
    onPlayerDestroy: ({ block, destroyedBlockPermutation }) => {
        updateBlock(block, destroyedBlockPermutation.type.id);
    }
}

// Consider using other events to update your block, such as ExplosionAfterEvent and PistonActivateAfterEvent