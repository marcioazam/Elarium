const dateien = [
    "scripts/blocks/after_break.js",
    "scripts/blocks/after_place.js",
    "scripts/blocks/before_break.js",
    "scripts/blocks/block_components.js",
    "scripts/entity/after_entitydie.js",
    "scripts/entity/after_hit_entity.js",
    "scripts/entity/after_hurt.js",
    "scripts/entity/after_spawn.js",
    "scripts/items/after_item_use.js",
    "scripts/items/item_components.js",
    "scripts/items/on_complete_use.js",
    "scripts/items/releaseUse.js",
    "scripts/items/spears.js",
    "scripts/items/startuse.js",
    "scripts/main.js",
    "scripts/meus-scripts/complementos.js",
    "scripts/meus-scripts/hard-survival.js",
    "scripts/meus-scripts/mensagens.js",
    "scripts/nether.js",
    "scripts/scriptevent.js",
    "scripts/tick.js",
    "scripts/wiki.js",
    "wiki.js"
];

dateien.forEach(async (datei) => {
    try {
        await import(`./${datei}`);
    } catch (error) {
        console.error('Fehler beim Importieren der Datei:', datei, error+error.stack);
    }
});