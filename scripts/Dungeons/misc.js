import {
  world,
  system,
  EntityDamageCause
} from "@minecraft/server";



world.afterEvents.projectileHitBlock.subscribe(event => {
  const blockHit = event.getBlockHit().block;
  const source = event.source;
  try {
    const block = world.getDimension("overworld").getBlock(blockHit.location);
    if (block && block.typeId === 'dungeons:redstone_core_block') {
    const entities = blockHit.dimension.getEntitiesAtBlockLocation(blockHit.location);
    for (const entity of entities) {
      if (entity.typeId === 'dungeons:redstone_core' && entity.hasTag('core:ready')) {
        entity.triggerEvent('dungeons:activate_core');
        system.runTimeout(() => {
          const nearbyMobs = blockHit.dimension.getEntities({
            location: blockHit.center(),
            maxDistance: 5,
            excludeFamilies: ['ignore']
          });
          for (const mob of nearbyMobs) {
            const xDif = mob.location.x - blockHit.center().x;
            const zDif = mob.location.z - blockHit.center().z;
            mob.applyKnockback(xDif, zDif, 1.2, 0.6);
            if (!source) {
              mob.applyDamage(30, {
                cause: EntityDamageCause.entityExplosion,
                damagingEntity: entity
              });
            } else {
              mob.applyDamage(30, {
                cause: EntityDamageCause.entityExplosion,
                damagingEntity: source
              });
            }
          }
        }, 60) // waits 3 seconds for charge to finish
        return;
      }
      return;
    }
  }

} catch (error) {
  if (error instanceof LocationInUnloadedChunkError) {
    // console.warn("Chunk não está carregado. Ignorando...");
  } else {
    console.error("Erro ao acessar o bloco:", error);
  }
}
});


// TEMPEST SPAWN EGG

// Evento beforeEvents.itemUseOn com switch para chamar as funções apropriadas
world.beforeEvents.itemUseOn.subscribe((event) => {
  const item = event.itemStack;

  if (!item) return;

  switch (item.typeId) {
    case 'dungeons:tempest_golem_resting_spawn_egg':
      handleTempestGolem(event);
      break;
    case 'dungeons:ancient_guardian_resting_spawn_egg':
      handleAncientGuardian(event);
      break;
    default:
      break;
  }
});

// Função para lidar com o uso do spawn egg do Ancient Guardian
function handleAncientGuardian(event) {
  const item = event.itemStack;
  const player = event.source;

  if (!item || !player) return;
  if (player.hasTag('dungeons:guardian_warn')) return;

  if (item.typeId === 'dungeons:ancient_guardian_resting_spawn_egg') {
    player.sendMessage("§7This boss is best suited for underwater locations, if spawned on land it may not work properly!");

    system.run(() => {
      player.addTag('dungeons:guardian_warn');
    });
  }
}

// Função para lidar com o uso do spawn egg do Tempest Golem
function handleTempestGolem(event) {
  const item = event.itemStack;
  const player = event.source;

  if (!item || !player) return;
  if (player.hasTag('dungeons:tempest_warn')) return;

  if (item.typeId === 'dungeons:tempest_golem_resting_spawn_egg') {
    player.sendMessage("§7The Tempest Golem cannot be harmed unless you place the 'wind_totem_left' and 'wind_totem_right' entities nearby");

    system.run(() => {
      player.addTag('dungeons:tempest_warn');
    });
  }
}