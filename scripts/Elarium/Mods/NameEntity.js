import { world, system } from "@minecraft/server";

world.afterEvents.entitySpawn.subscribe((event) => {
  SetNameEntity(event.entity);
  SpawnEntityEdx(event);
});

function SetNameEntity(entity) {
  // Garante que a entidade é válida antes de continuar
  if (!entity || typeof entity !== "object" || !entity.typeId || !entity.isValid()) return;

  // Ignora jogadores e entidades sem suporte para nameTag
  if (["minecraft:player", "wesl3y:backpack", "minecraft:item", "minecraft:xp_orb"].includes(entity.typeId)) return;

  try {
    // Formata o nome do mob
    const mobName = entity.typeId
      .split(":")[1] // Pega a parte após o ":"
      .replace(/_/g, " ") // Substitui "_" por espaço
      .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitaliza cada palavra

    // Define o nameTag com o nome formatado
    entity.nameTag = mobName;
  } catch (error) {
    console.warn(`❌ Falha ao definir nameTag para ${entity.typeId}: ${error}`);
  }
}


world.afterEvents.worldInitialize.subscribe(() => {
  for (const entity of world.getDimension("overworld").getEntities({
    excludeFamilies: ["inanimate"],
    excludeTypes: ["wesl3y:backpack", "item", "xp_orb"],
  })) {
    SetNameEntity(entity);
  }
}
);

function SpawnEntityEdx(entityEvent) {
  const entity=entityEvent.entity

  // Ignora jogadores
  if (entity.typeId === "minecraft:player") return;
 
  if (entity.typeId == "edx:blazeblade_fire_charge" ) {
      entity.applyImpulse({ x:entity.getViewDirection().x/2 , y: entity.getViewDirection().y/2, z: entity.getViewDirection().z/2 })
  }
  else if (entity.typeId == "minecraft:wither" ) {
      const night_time = world.getTimeOfDay() > 12000 && world.getTimeOfDay() < 24000;
      if(!night_time && entity.dimension.id == "minecraft:overworld") 
      {
          entity.runCommand(`tellraw @a[r=20] {"rawtext":[{"text":"§cYou can't summon the Wither on day"}]}`)
          entity.runCommand(`give @p[r=30] skull 3 1`)
          entity.runCommand(`give @p[r=30] soul_sand 4`)
          entity.remove()
      }
      else if (entity.dimension.id == "minecraft:overworld" || entity.dimension.id == "minecraft:the_end")
      {
          
          entity.dimension.spawnEntity("edx:wither",entity.location);
          entity.remove()
      }
  }
  }

