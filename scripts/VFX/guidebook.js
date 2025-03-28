// get all guidebook entities
import { system, world } from "@minecraft/server";
// if they have the spark:waiting_for_process = true property
// get players near and do the ray cast
// if the player is looking at the entity, do the test
// the test
// vec = player.location - book.location
// get a point a few blocks in the players viewing direction
// cross = cross(vec, player.getViewDirection());
export var Guidebook;
(function (Guidebook) {
    const overworld = world.getDimension("overworld");
    const nether = world.getDimension("nether");
    const end = world.getDimension("the_end");
    const guideBookQuery = { type: "spark_vfx:guide_book" };
    const bookSpawnActionBarRange = 8;
    let bookItemId, joinLocalizationString;
    let additionalItemsList = [];
    // FIXME: initial spawn isnt correctly set on 1.20.50, using tag for now
    let playerJoinTag;
    var queuedSpawns = [];
    function init({ entityId, itemId, tag, joinString, additionalItems }) {
        guideBookQuery.type = entityId;
        bookItemId = itemId;
        playerJoinTag = tag;
        joinLocalizationString = joinString;
        if (additionalItems)
            additionalItemsList = additionalItems;
        system.run(tick);
    }
    Guidebook.init = init;
    // TODO: once we get entity interact events we can switch to those.
    // FIXME: this also needs to handle nether and end
    function tick() {
        system.run(tick);
        for (const book of overworld.getEntities(guideBookQuery)) {
            checkForSpawn(book);
            checkInteraction(book);
        }
        for (const book of nether.getEntities(guideBookQuery)) {
            checkForSpawn(book);
            checkInteraction(book);
        }
        for (const book of end.getEntities(guideBookQuery)) {
            checkForSpawn(book);
            checkInteraction(book);
        }
        // extra spawns
        for (let i = queuedSpawns.length - 1; i > -1; i--) {
            let q = queuedSpawns[i];
            let dim = q.player.dimension;
            let entity = dim.spawnEntity(guideBookQuery.type, q.location);
            entity.teleport(entity.location, { facingLocation: q.player.location });
            // remove item from player inventory
            if (q.item.amount > 1) {
                let inventory = q.player.getComponent("minecraft:inventory");
                let container = inventory.container;
                for (let i = 0; i < 10; i++) {
                    let item = container.getItem(i);
                    if (item == undefined)
                        continue;
                    if (item.typeId === q.item.typeId) {
                        let cloned = q.item.clone();
                        cloned.amount = cloned.amount - 1;
                        // remove
                        container.setItem(i, cloned);
                        break;
                    }
                }
            }
            if (q.item.amount == 1) {
                let inventory = q.player.getComponent("minecraft:inventory");
                let container = inventory.container;
                for (let i = 0; i < 10; i++) {
                    let item = container.getItem(i);
                    if (item == undefined)
                        continue;
                    if (item.typeId === q.item.typeId) {
                        // remove
                        container.setItem(i, undefined);
                        break;
                    }
                }
            }
            queuedSpawns.splice(i, 1);
        }
    }
    function checkForSpawn(book) {
        if (book.hasTag("spark_vfx:action_bar_sent"))
            return;
        // get all players within 8 blocks of the book
        // for (const player of book.dimension.getPlayers({ location: book.location, maxDistance: bookSpawnActionBarRange })) {
        //     player.onScreenDisplay.setActionBar({
        //         rawtext: [
        //             {
        //                 translate: "spark_vfx.book.open"
        //             }
        //         ]
        //     });
        // }
        book.addTag("spark_vfx:action_bar_sent");
    }
    function checkInteraction(book) {
        // if we have the correct property
        const prop = book.getProperty("spark:waiting_for_process");
        if (prop === undefined)
            return;
        // prop is a boolean
        let isWaiting = prop;
        if (isWaiting) {
            // we have been interacted with, need to process :D
            processInteraction(book);
        }
    }
    function processInteraction(book) {
        // this works for single player        
        for (const player of book.dimension.getPlayers()) {
            // if we are > 6 away, ignore as we are too far away
            // if slightly faster :D
            if (distanceSquared(book.location, player.location) > 34)
                continue;
            // make sure we are looking roughtly at the book;
            if (!bookWithinFov(book, player))
                return;
            let plyLoc = player.location;
            let globY = plyLoc.y;
            let bk = book.location;
            bk.y = globY;
            let dist = distance(plyLoc, bk);
            // get a point a few blocks in the players direction
            let normal = normalized(player.getViewDirection());
            let scaled = scale(normal, dist); // its a point a few blocks away or something
            let point = add(plyLoc, scaled);
            point.y = globY;
            // work
            let vec = subtract(plyLoc, bk);
            let dir = subtract(plyLoc, point);
            let angle = angleToSigned(vec, dir, bk);
            // left
            if (angle > 0) {
                book.triggerEvent("spark:trigger_back_animation");
                book.setProperty("spark:waiting_for_process", false);
                system.runTimeout(() => {
                    book.triggerEvent("spark:guide_book_back");
                }, 7);
                continue;
            }
            book.triggerEvent("spark:trigger_forward_animation");
            book.setProperty("spark:waiting_for_process", false);
            system.runTimeout(() => {
                book.triggerEvent("spark:guide_book_forward");
            }, 7);
            continue;
        }
    }
    // if we are within a .5 of viewing, we are looking at the book or something
    function bookWithinFov(book, player) {
        // this might not be correct
        let EP = normalized(subtract(player.getHeadLocation(), book.location));
        let pdot = dot(EP, player.getViewDirection());
        if (pdot < -0.5) {
            return true;
        }
        return false;
    }
    // this is kind of dumb... but it works :D
    function angleToSigned(a, b, n) {
        let pcross = cross(a, b);
        let dot1 = dot(n, pcross);
        let dot2 = dot(a, b);
        let atan2 = Math.atan2(dot1, dot2);
        return atan2;
    }
    world.afterEvents.playerSpawn.subscribe((event) => {
        if (event.initialSpawn) {
            // FIXME: initial spawn isnt correctly set on 1.20.50, using tag for now
            if (event.player.hasTag(playerJoinTag))
                return;
            event.player.addTag(playerJoinTag);
            event.player.runCommandAsync("gamerule sendcommandfeedback false");
            event.player.runCommandAsync(`give @s ${bookItemId}`);
            for (let item of additionalItemsList) {
                event.player.runCommandAsync(`give @s ${item}`);
            }
            event.player.runCommandAsync("gamerule sendcommandfeedback true");
            // announce that the addon is working
            system.runTimeout(() => {
                event.player.sendMessage({
                    rawtext: [
                        {
                            translate: joinLocalizationString,
                        },
                    ],
                });
            }, 100);
        }
    });
    world.beforeEvents.itemUse.subscribe((event) => {
        if (event.itemStack.typeId != bookItemId)
            return;
        let player = event.source;
        let dir = player.getViewDirection();
        dir.y = 0;
        // need to raycast 2 blocks, and summon a guidebook if on empty space
        // var blockRaycastResult: BlockRaycastHit = event.source.getBlockFromViewDirection({maxDistance: 2});
        var blockRaycastResult = event.source.dimension.getBlockFromRay(player.location, player.getViewDirection(), { maxDistance: 2 });
        // if we didnt hit anything :D
        if (blockRaycastResult == undefined) {
            // summon the entity and stop the event!
            let pos = player.location;
            let dist = scale(dir, 2);
            let newPos = add(pos, dist);
            queuedSpawns.push({
                location: newPos,
                player: event.source,
                item: event.itemStack
            });
            event.cancel = true;
        }
    });
    function distance(a, b) {
        return Math.sqrt(distanceSquared(a, b));
    }
    function distanceSquared(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        return dx * dx + dy * dy + dz * dz;
    }
    function length(a) {
        return Math.sqrt(lengthSquared(a));
    }
    function lengthSquared(a) {
        return a.x * a.x + a.y * a.y + a.z * a.z;
    }
    function normalized(a) {
        return scale(a, 1 / (length(a) || 1));
    }
    function scale(a, b) {
        return {
            x: a.x * b,
            y: a.y * b,
            z: a.z * b
        };
    }
    function add(a, b) {
        return {
            x: a.x + b.x,
            y: a.y + b.y,
            z: a.z + b.z
        };
    }
    function subtract(a, b) {
        return {
            x: a.x - b.x,
            y: a.y - b.y,
            z: a.z - b.z
        };
    }
    function dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }
    function cross(a, b) {
        const ax = a.x, ay = a.y, az = a.z;
        const bx = b.x, by = b.y, bz = b.z;
        return { x: ay * bz - az * by, y: az * bx - ax * bz, z: ax * by - ay * bx };
    }
})(Guidebook || (Guidebook = {}));
//# sourceMappingURL=guidebook.js.map