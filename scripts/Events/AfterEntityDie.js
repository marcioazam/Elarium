import { system, world, EntityDamageCause } from "@minecraft/server";
import { EventQueue } from "../Elarium/System/Core/Queue.js";

function MensagemMorte(event) {
  const entity = event.deadEntity; // Entidade que morreu

  // Verifica se a entidade é válida
  if (!entity) return;

  if (entity.typeId === "minecraft:wither") {
    // Atraso de 7 segundos antes de invocar um novo Wither
    system.runTimeout(() => {
      const players = world.getPlayers();
      if (players.length === 0) return; // Verifica se há jogadores no mundo

      // Escolhe um jogador aleatório
      const randomPlayer = players[Math.floor(Math.random() * players.length)];
      const location = randomPlayer.location; // Posição do jogador aleatório

      // Ajusta a localização do Wither em torno do jogador (por exemplo, 10 blocos aleatórios ao redor)
      const offsetX = Math.floor(Math.random() * 20) - 10; // Deslocamento aleatório entre -10 e +10 no eixo X
      const offsetY = 0; // A mesma altura do jogador
      const offsetZ = Math.floor(Math.random() * 20) - 10; // Deslocamento aleatório entre -10 e +10 no eixo Z

      const spawnLocation = {
        x: location.x + offsetX,
        y: location.y + offsetY,
        z: location.z + offsetZ,
      };

      // Invoca um novo Wither
      const newWither = world
        .getDimension("overworld")
        .spawnEntity("edx:wither", spawnLocation);

      // Gera o comando para criar fogo ao redor do Wither
      const command = `execute at @e[type=minecraft:wither,limit=1,sort=nearest] run fill ${
        witherLocation.x - 15
      } ${witherLocation.y - 15} ${witherLocation.z - 15} ${
        witherLocation.x + 15
      } ${witherLocation.y + 15} ${
        witherLocation.z + 15
      } minecraft:fire replace air`;

      // Executa o comando para preencher a área com fogo
      world.getDimension("overworld").runCommand(command);
      // Mensagem de aviso
      world.sendMessage(
        `§1§lO Wither Fase 2 foi invocado! Prepare-se para o caos!`
      );
    }, 140); // 140 ticks equivalem a 7 segundos
  } else if (entity.typeId === "edx:wither") {
    // Atraso de 7 segundos antes de invocar um novo Wither
    system.runTimeout(() => {
      const players = world.getPlayers();
      if (players.length === 0) return; // Verifica se há jogadores no mundo

      // Escolhe um jogador aleatório
      const randomPlayer = players[Math.floor(Math.random() * players.length)];
      const location = randomPlayer.location; // Posição do jogador aleatório

      // Ajusta a localização do Wither em torno do jogador (por exemplo, 10 blocos aleatórios ao redor)
      const offsetX = Math.floor(Math.random() * 20) - 10; // Deslocamento aleatório entre -10 e +10 no eixo X
      const offsetY = 0; // A mesma altura do jogador
      const offsetZ = Math.floor(Math.random() * 20) - 10; // Deslocamento aleatório entre -10 e +10 no eixo Z

      const spawnLocation = {
        x: location.x + offsetX,
        y: location.y + offsetY,
        z: location.z + offsetZ,
      };

      // Invoca um novo Wither
      const newWither = world
        .getDimension("overworld")
        .spawnEntity("edx:true_wither", spawnLocation);

      // Gera o comando para criar fogo ao redor do Wither
      const command = `execute at ${newWither.id} run fill ~-15 ~-15 ~-15 ~15 ~15 ~15 minecraft:lava replace air`;

      // Executa o comando para preencher a área com fogo
      world.getDimension("overworld").runCommand(command);

      world.getDimension("overworld").runCommand("time set midnight");
      world.getDimension("overworld").runCommand("weather thunder");

      // Mensagem de aviso
      world.sendMessage(
        `§1§lO Wither em sua forma completa foi invocado! Prepare-se para a batalha final!`
      );
    }, 140); // 140 ticks equivalem a 7 segundos
  } else if (entity.typeId === "minecraft:player") {
    const playerName = `"${entity.name}"`; // Escapa o nome do jogador
    // Mensagem inicial de morte
    let deathMessage = `§4§lO noob chamado ${playerName || "alguém"} morreu `;

    // Verifica a causa da morte
    const damageSource = event.damageSource;
    if (damageSource) {
      const cause = damageSource.cause; // Exemplo: "fall", "lava", "entityAttack"
      const killer = damageSource.damagingEntity; // Entidade que causou a morte (se houver)

      if (killer) {
        const killerName =
          killer.typeId === "minecraft:player" ? killer.name : killer.typeId;

        switch (killer.typeId) {
          case "minecraft:creeper":
            deathMessage += `a uma explosão de um Creeper! Você ouviu o "tssss", mas já era tarde demais... mais atento da próxima vez!`;
            break;
          case "minecraft:zombie":
            deathMessage += `a um ataque de um Zombie! Parece que ele não encontrou um cérebro melhor por perto, então escolheu o seu. Infelizmente, acabou mal pra você.`;
            break;
          case "minecraft:spider":
            deathMessage += `a um ataque de uma Aranha! Talvez ela quisesse só um abraço, mas você acabou sendo o lanche dela. Que azar!`;
            break;
          case "minecraft:skeleton":
            deathMessage += `a uma flecha certeira de um Esqueleto! Ele viu você como um alvo perfeito e provou que tem uma ótima pontaria... que pena pra você!`;
            break;
          case "minecraft:enderman":
            deathMessage += `a um ataque de um Enderman, ele não gostou que você encarou os olhos dele... só lamento!`;
            break;
          case "minecraft:slime":
            deathMessage += `a um ataque de um Slime, parabéns, você conseguiu ser derrotado por uma gosma saltitante!`;
            break;
          case "minecraft:wither":
            deathMessage += `a um ataque do Wither, você achou que podia enfrentar isso sozinho? Boa sorte da próxima vez, herói!`;
            break;
          case "minecraft:blaze":
            deathMessage += `a um ataque de um Blaze, parece que você virou churrasco no Nether!`;
            break;
          case "minecraft:witch":
            deathMessage += `a uma poção venenosa de uma Bruxa, ela mandou lembranças e um aviso: "Não mexa com quem tá quieto!"`;
            break;
          case "minecraft:ghast":
            deathMessage += `a um ataque de um Ghast, um fantasminha gigante te explodiu no ar!`;
            break;
          case "minecraft:phantom":
            deathMessage += `a um ataque de um Phantom, isso é o que acontece quando você não dorme direito!`;
            break;
          case "minecraft:magma_cube":
            deathMessage += `a um ataque de um Magma Cube, derreteu com a gosma quente? Que triste... ou engraçado?`;
            break;
          case "minecraft:silverfish":
            deathMessage += `a um ataque de um Silverfish, perdeu para um insetinho? A reputação foi junto!`;
            break;
          case "minecraft:shulker":
            deathMessage += `a um ataque de um Shulker, voou e caiu igual um saco de batatas... que cena!`;
            break;
          case "minecraft:hoglin":
            deathMessage += `a um ataque de um Hoglin, foi atropelado por um porco gigante do Nether!`;
            break;
          case "minecraft:piglin":
            deathMessage += `a um ataque de um Piglin, acho que você esqueceu de usar ouro, não é?`;
            break;
          case "minecraft:zombified_piglin":
            deathMessage += `a um ataque de um Zombified Piglin, você cutucou o porco errado e agora pagou o preço!`;
            break;
          case "minecraft:guardian":
            deathMessage += `a um ataque de um Guardian, você tentou nadar e virou peixe morto!`;
            break;
          case "minecraft:elder_guardian":
            deathMessage += `a um ataque de um Elder Guardian, o peixe velho te mostrou quem manda no oceano!`;
            break;
          case "minecraft:ravager":
            deathMessage += `a um ataque de um Ravager, um tanque de guerra medieval passou por cima de você!`;
            break;
          case "minecraft:ender_dragon":
            deathMessage += `ao poder devastador do Ender Dragon, você achou que ia derrotar o rei do End sozinho? Boa tentativa!`;
            break;
          case "minecraft:vindicator":
            deathMessage += `a um ataque de um Vindicator, o machado dele cortou mais do que apenas seu orgulho!`;
            break;
          case "minecraft:evoker":
            deathMessage += `a um ataque de um Evoker, os dentes mágicos dele te mastigaram todinho!`;
            break;
          case "minecraft:pillager":
            deathMessage += `a um ataque de um Pillager, aquele besteiro fez de você um alvo fácil!`;
            break;
          case "minecraft:illusioner":
            deathMessage += `a um ataque de um Illusioner, você foi enganado até a morte, literalmente!`;
            break;
          case "minecraft:wither_skeleton":
            deathMessage += `a um ataque de um Wither Skeleton, ele te deu um presente: veneno e morte!`;
            break;
          case "minecraft:drowned":
            deathMessage += `a um ataque de um Drowned, você foi abraçado por um zumbi aquático... que romântico!`;
            break;
          case "minecraft:stray":
            deathMessage += `a um ataque de um Stray, você morreu congelado e flechado ao mesmo tempo!`;
            break;
          case "minecraft:husk":
            deathMessage += `a um ataque de um Husk, você foi abraçado por um zumbi desidratado!`;
            break;
          case "minecraft:zombie_villager":
            deathMessage += `a um ataque de um Zombie Villager, você foi mordido por um zumbi com classe!`;
            break;
          case "minecraft:zombie_villager_v2":
            deathMessage += `a um ataque de um Zombie Villager, você foi mordido por um zumbi com classe!`;
            break;
          case "minecraft:endermite":
            deathMessage += `a um ataque de um Endermite, você foi picado por um inseto do End!`;
            break;
          case "minecraft:bee":
            deathMessage += `a um ataque de uma Abelha, você foi picado por uma abelha!`;
            break;
          default:
            deathMessage += `a um ataque de ${killerName}. Você achou que podia enfrentar isso sozinho? Boa sorte da próxima vez!`;
            break;
        }
      } else if (cause) {
        switch (cause) {
          case "fall":
            deathMessage += `de uma queda! Você achou que era um pássaro e tentou voar, mas acabou se esborrachando no chão!`;
            break;
          case "lava":
            deathMessage += `à lava! Você achou que podia nadar nela, mas acabou virando churrasco!`;
            break;
          case "fire":
          case "fire_tick":
          case "inFire":
            deathMessage += `ao fogo! Você brincou com fogo e se queimou!`;
            break;
          case "hot_floor":
            deathMessage += `ao chão quente! Você achou que podia andar descalço, mas acabou se queimando!`;
            break;
          case "cactus":
            deathMessage += `a um cacto! Você achou que podia abraçar um cacto, mas acabou se espetando!`;
            break;
          case "suffocation":
            deathMessage += `à falta de ar! Você achou que podia ficar sem respirar, mas acabou sufocado!`;
            break;
          case "drown":
            deathMessage += `à água! Você achou que podia nadar, mas acabou se afogando!`;
            break;
          case "starve":
            deathMessage += `à fome! Você achou que podia ficar sem comer, mas acabou morrendo de fome!`;
            break;
          case "cramming":
            deathMessage += `ao excesso de entidades! Você achou que podia ficar apertado, mas acabou esmagado!`;
            break;
          case "falling_block":
            deathMessage += `a um bloco caindo! Você achou que podia ficar embaixo, mas acabou esmagado!`;
            break;
          case "fly_into_wall":
            deathMessage += `a uma parede! Você achou que podia voar, mas acabou se chocando!`;
            break;
          case "out_of_world":
            deathMessage += `ao vazio! Você achou que podia voar, mas acabou caindo no vazio!`;
            break;
          case "anvil":
            deathMessage += `a uma bigorna! Você achou que podia passar embaixo, mas acabou esmagado!`;
            break;
          case "thorns":
            deathMessage += `a espinhos! Você achou que podia se aproximar, mas acabou se cortando!`;
            break;
          case "lightning_bolt":
            deathMessage += `a um raio! Você achou que podia desafiar a natureza, mas acabou eletrocutado!`;
            break;
          case "magic":
            deathMessage += `a magia! Você achou que podia desafiar um mago, mas acabou virando sapo!`;
            break;
          case "explosion":
          case "explosion.player":
            deathMessage += `a uma explosão! Você achou que podia sobreviver, mas acabou virando pó!`;
            break;
          default:
            deathMessage += `à ${cause}! Você achou que podia sobreviver, mas acabou morrendo!`;
            break;
        }
      }

      // Envia a mensagem no chat
      world.sendMessage(deathMessage);
    }
  }
}

function Saturation(event) {
  if (event.deadEntity?.typeId !== "minecraft:player") return;
  event.deadEntity.setDynamicProperty("jc:saturation", 5);
}

function wither_armour(event) {
  const deadEntity = event.deadEntity;
  const damageSource = event.damageSource.damagingEntity;
  if (!damageSource) {
    return;
  }
  if (
    damageSource.typeId === "minecraft:player" &&
    damageSource.hasTag("dungeons:wither_armour") &&
    (deadEntity.matches({
      families: ["monster"],
    }) ||
      deadEntity.matches({
        families: ["mob"],
      }))
  ) {
    damageSource.dimension.spawnParticle(
      "dungeons:lifesteal",
      damageSource.location
    );
    let hp = damageSource.getComponent("minecraft:health");
    hp.setCurrentValue(hp.currentValue + 2);
  }
}

function Gourdian(event) {
  const deadEntity = event.deadEntity;
  const damageSource = event.damageSource.damagingEntity;
  if (!damageSource) {
    return;
  }
  if (
    damageSource.typeId === "minecraft:player" &&
    damageSource.hasTag("dungeons:spooky_gourdian_armour") &&
    (deadEntity.matches({
      families: ["monster"],
    }) ||
      deadEntity.matches({
        families: ["mob"],
      }))
  ) {
    damageSource.dimension.spawnParticle(
      "dungeons:spooky_gourdian",
      damageSource.location
    );
    deadEntity.dimension.spawnParticle(
      "dungeons:spooky_gourdian",
      deadEntity.location
    );
    let hp = damageSource.getComponent("minecraft:health");
    hp.setCurrentValue(hp.currentValue + 2);
  }
}

// Exploding

const explodingWeapons = [
  "dungeons:cursed_axe",
  "dungeons:battlestaff_of_terror",
];

function exploding(event) {
  const deadEntity = event.deadEntity;
  const damageSource = event.damageSource.damagingEntity;
  const cause = event.damageSource.cause;

  if (!damageSource) {
    return;
  }
  if (damageSource.typeId !== "minecraft:player") {
    return;
  }
  if (deadEntity == damageSource) {
    return;
  }
  if (cause != "entityAttack") {
    return;
  }
  const heldItem = damageSource
    .getComponent("minecraft:equippable")
    .getEquipment("Mainhand");
  if (!heldItem) return;
  if (!heldItem.hasTag("dungeons:exploding")) {
    return;
  }

  let hp = deadEntity.getComponent("minecraft:health");

  if (!hp) {
    console.warn("Entity does not have health component");
    return;
  }

  const nearbyMobs = deadEntity.dimension.getEntities({
    location: deadEntity.location,
    maxDistance: 5,
    families: ["monster"],
  });

  system.runTimeout(() => {
    for (const mob of nearbyMobs) {
      if (!deadEntity) {
        return;
      }
      if (mob.typeId === "minecraft:item") continue;
      mob.applyDamage(hp.defaultValue * 0.33, {
        cause: EntityDamageCause.entityExplosion,
        damagingEntity: damageSource,
      });
    }
    deadEntity.runCommandAsync("function weapon/exploding_fx");
  }, 18); // waits 0.9 seconds for death to finish
}

// Leeching

const leechingWeapons = ["dungeons:heartstealer"];

function Leeching(event) {
  const deadEntity = event.deadEntity;
  const damageSource = event.damageSource.damagingEntity;
  const cause = event.damageSource.cause;
  if (!damageSource) {
    return;
  }
  if (damageSource.typeId !== "minecraft:player") return;

  if (deadEntity == damageSource) {
    return;
  }
  if (cause != "entityAttack") {
    return;
  }
  const heldItem = damageSource
    .getComponent("minecraft:equippable")
    .getEquipment("Mainhand");
  if (!heldItem) return;
  if (
    damageSource.typeId === "minecraft:player" &&
    heldItem.hasTag("dungeons:leeching") &&
    (deadEntity.matches({
      families: ["monster"],
    }) ||
      deadEntity.matches({
        families: ["mob"],
      }))
  ) {
    deadEntity.dimension.spawnParticle(
      "dungeons:leeching",
      deadEntity.location
    );
    let hp = damageSource.getComponent("minecraft:health");
    hp.setCurrentValue(hp.currentValue + 2);
  }
}

function Rampaging(event) {
  const deadEntity = event.deadEntity;
  const damageSource = event.damageSource.damagingEntity;
  const cause = event.damageSource.cause;
  if (!damageSource) {
    return;
  }
  if (damageSource.typeId !== "minecraft:player") return;

  if (deadEntity == damageSource) {
    return;
  }
  if (cause != "entityAttack") {
    return;
  }
  const heldItem = damageSource
    .getComponent("minecraft:equippable")
    .getEquipment("Mainhand");
  if (!heldItem) return;
  if (
    damageSource.typeId === "minecraft:player" &&
    heldItem.hasTag("dungeons:rampaging") &&
    (deadEntity.matches({
      families: ["monster"],
    }) ||
      deadEntity.matches({
        families: ["mob"],
      }))
  ) {
    damageSource.dimension.spawnParticle(
      "dungeons:death_cap",
      damageSource.location
    );
    damageSource.addEffect("strength", 100);
    damageSource.addEffect("speed", 100);
  }
}

function Rushdown(event) {
  const deadEntity = event.deadEntity;
  const damageSource = event.damageSource.damagingEntity;
  const cause = event.damageSource.cause;
  if (!damageSource) {
    return;
  }
  if (damageSource.typeId !== "minecraft:player") return;

  if (deadEntity == damageSource) {
    return;
  }
  if (cause != "entityAttack") {
    return;
  }
  const heldItem = damageSource
    .getComponent("minecraft:equippable")
    .getEquipment("Mainhand");
  if (!heldItem) return;
  if (
    damageSource.typeId === "minecraft:player" &&
    heldItem.hasTag("dungeons:rushdown") &&
    (deadEntity.matches({
      families: ["monster"],
    }) ||
      deadEntity.matches({
        families: ["mob"],
      }))
  ) {
    damageSource.dimension.spawnParticle(
      "dungeons:swiftness",
      damageSource.location
    );
    damageSource.addEffect("speed", 60, { amplifier: 2 });
  }
}

function soul_collection(event) {
  const deadEntity = event.deadEntity;
  const damageSource = event.damageSource.damagingEntity;
  if (!damageSource) return;
  if (damageSource.typeId !== "minecraft:player") return;

  var soulCount = 0;
  if (world.scoreboard.getObjective("soulGauge").getScore(damageSource) >= 100)
    return;

  if (Math.floor(Math.random() * 5) == 1) {
    soulCount = soulCount + 1;
  }

  if (!damageSource) {
    return;
  }
  if (
    damageSource.typeId === "minecraft:player" &&
    deadEntity.matches({
      families: ["monster"],
    })
  ) {
    const heldItem = damageSource
      .getComponent("minecraft:equippable")
      .getEquipment("Mainhand");
    if (!heldItem) return;
    if (heldItem.hasTag("dungeons:soul_collection")) {
      soulCount = soulCount + 1;
    }
    if (damageSource.hasTag("dungeons:verdant_armour")) {
      soulCount = soulCount * 2;
    }

    if (soulCount < 1) return;

    system.runTimeout(() => {
      for (let i = 0; i < soulCount; i++) {
        deadEntity.dimension.spawnParticle(
          "dungeons:soul2",
          deadEntity.location
        );
      }
      let soulGauge = world.scoreboard.getObjective("soulGauge");

      soulGauge.addScore(damageSource, soulCount);
      let soulGaugePlayer = world.scoreboard
        .getObjective("soulGauge")
        .getScore(damageSource);

      if (soulGaugePlayer > 100) soulGauge.setScore(damageSource, 100);
      if (soulGaugePlayer < 0) soulGauge.setScore(damageSource, 0);
      // damageSource.onScreenDisplay.setActionBar(`§b${soulGaugePlayer}§s Souls `)
    }, 18); // waits 0.9 seconds for death to finish
  }
}

function soulGauge(event) {
  const entity = event.deadEntity;
  if (entity.typeId !== "minecraft:player") return;
  if (world.gameRules.keepInventory === true) return;

  let soulGauge = world.scoreboard.getObjective("soulGauge");
  let soulGaugePlayer = soulGauge.getScore(entity);
  if (soulGaugePlayer < 34) {
    soulGauge.setScore(entity, 0);
  } else {
    soulGauge.addScore(entity, -33);
  }
}

function wretched_wraith(event) {
  const deadEntity = event.deadEntity;
  if (deadEntity.typeId === "dungeons:wretched_wraith") {
    const dead = deadEntity.dimension.spawnEntity(
      "dungeons:wretched_wraith_death",
      deadEntity.location
    );
    dead.setRotation(deadEntity.getRotation());
    deadEntity.addEffect("invisibility", 80, {
      amplifier: 1,
      showParticles: false,
    });
    deadEntity.remove();
    let hp = dead.getComponent("minecraft:health");
    hp.setCurrentValue(1);
  }
}

const bosses = [
    'dungeons:redstone_monstrosity',
    'dungeons:nameless_one',
    'dungeons:mooshroom_monstrosity',
    'dungeons:wretched_wraith',
    'dungeons:corrupted_cauldron',
    'dungeons:jungle_abomination',
    'dungeons:tempest_golem',
    'dungeons:ancient_guardian',
    'dungeons:vengeful_heart_of_ender',
    'dungeons:obsidian_monstrosity'
  ];
  
 function bossDead(event) {
    const entity = event.deadEntity;
    if (entity.typeId !== 'minecraft:player') return;
    const damageSource = event.damageSource.damagingEntity;
    const cause = event.damageSource.cause;
    if(!damageSource) return;
  
    if(bosses.includes(damageSource.typeId)) {
      let hp = damageSource.getComponent('minecraft:health');
      if(hp.currentValue > hp.defaultValue-20) {
        hp.setCurrentValue(hp.defaultValue)
      } else {
        hp.setCurrentValue(hp.currentValue + 20)
      }
  
    }
  
  }
  
function DeadEntitys(event) {

    var deadEntity = event.deadEntity;

    try {
      
    const position = deadEntity.location
    const dimension = deadEntity.dimension
    if (deadEntity.typeId === 'edx:abomination2') {
        dimension.runCommand(`scoreboard players add * difficulty 1`)
        dimension.runCommand(`particle edx:abomination_death ${position.x} ${position.y} ${position.z}`)
        const entityOptions = {
            location: position,
            families: [ "player" ],
            maxDistance: 50
        }
        const entities = dimension.getEntities(entityOptions);
        for (let i = 0; i < entities.length ; i++){
            var chance = Math.random()
            if(chance<0.5)   
                dimension.spawnItem(new ItemStack('edx:xp_orb', 1), entities[i].location);
            else
                dimension.spawnItem(new ItemStack('edx:magic_axe', 1), entities[i].location);
            entities[i].runCommand(`scoreboard players add @s[tag=!abom] max_health 4`)
            entities[i].addTag('abom')

        }
    }
    //wither is in after hit bc of his anim
    if (deadEntity.typeId === 'minecraft:ender_dragon') {
        dimension.runCommand(`scoreboard players add * difficulty2 1`)
        const entityOptions = {
            location: position,
            families: [ "player" ],
            maxDistance: 100
        }
        const entities = dimension.getEntities(entityOptions);
        for (let i = 0; i < entities.length ; i++){
            entities[i].runCommand(`scoreboard players add @s[tag=!dragon] max_health 4`)
            entities[i].addTag('dragon')
            dimension.spawnItem(new ItemStack('edx:dragon_heart', 1), entities[i].location);
            dimension.spawnItem(new ItemStack('edx:dragon_essence', 1), entities[i].location);

        }
    }
    if (deadEntity.typeId === 'edx:true_wither') {
        const entityOptions = {
            location: position,
            families: [ "player" ],
            maxDistance: 50
        }
        const entities = dimension.getEntities(entityOptions);
        for (let i = 0; i < entities.length ; i++){
            entities[i].runCommand(`scoreboard players add @s[tag=!true_wither] max_health 4`)
            entities[i].addTag('true_wither')

        }
    }
    if (deadEntity.typeId === 'edx:blazeblade2') {
        const entityOptions = {
            location: position,
            families: [ "player" ],
            maxDistance: 50
        }
        const entities = dimension.getEntities(entityOptions);
        for (let i = 0; i < entities.length ; i++){
            dimension.spawnItem(new ItemStack('edx:blaze_blade', 1), entities[i].location);
            dimension.spawnItem(new ItemStack('edx:explosive_blaze_rod', 1), entities[i].location);
            entities[i].runCommand(`scoreboard players add @s[tag=!blazeblade] max_health 4`)
            entities[i].addTag('blazeblade')

        }
    }}
    catch(e){}
    

 
}

function Emerald(event) {
  const deadEntity = event.deadEntity;
  const damageSource = event.damageSource.damagingEntity;
  if (!damageSource) {
    return;
  }
  if (damageSource.typeId === "minecraft:player" && (damageSource.hasTag('dungeons:emerald_armour') || damageSource.hasTag('dungeons:opulent_armour') || damageSource.hasTag('dungeons:gilded_glory_armour')) && (deadEntity.matches({
      families: ['monster']
    }) || deadEntity.matches({
      families: ['mob']
    }))) {
    deadEntity.dimension.spawnParticle('dungeons:emerald', deadEntity.location)
    damageSource.playSound('artefact.shadow_break', {
      pitch: 1.5,
      volume: 0.3
    });
    let hp = deadEntity.getComponent('minecraft:health')
    damageSource.addExperience(hp.defaultValue * 0.5);
  }
}

const ENTITY_DIE_HANDLERS = [
  MensagemMorte, Saturation, wither_armour, Gourdian,
  exploding, Rushdown, Rampaging, Leeching,
  soulGauge, soul_collection, wretched_wraith,
  bossDead, DeadEntitys, Emerald
];

// Crie uma instância da fila para entityDie
const entityDieQueue = new EventQueue(7, ENTITY_DIE_HANDLERS);

// // Sobrescreva o método shouldSkipEvent para entityDie
// entityDieQueue.shouldSkipEvent = (event) => {
//   const { deadEntity } = event;
//   if (!deadEntity?.isValid()) return true; // Ignora se a entidade for inválida
//   return false;
// };

// // Assine o evento entityDie
// world.afterEvents.entityDie.subscribe((event) => {
//   entityDieQueue.addEvent(event); // Adiciona o evento à fila
// });

