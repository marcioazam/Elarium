import {
  world,
  system,
  ItemStack,
  EntityDamageCause
} from "@minecraft/server";

function Totem(event){
  const mob = event.entity;
  const eventId = event.eventId;

  if (eventId !== 'dungeons:totem_timer') {
    return;
  }
  const hp = mob.getComponent('minecraft:health');
  if (!hp) {
    return;
  }
  if (hp.currentValue < 100) {
    if (!(mob.hasTag('wt_cd')) && Math.floor(Math.random() * 111) == 2) {
      mob.dimension.spawnEntity('dungeons:wind_totem_burst', mob.location);
      if (Math.floor(Math.random() * 8) == 2) {
        mob.dimension.spawnEntity('minecraft:pillager', {
          x: mob.location.x,
          y: mob.location.y,
          z: mob.location.z - 1
        });
      }
      mob.addTag('wt_cd');
      system.runTimeout(() => {
        mob.removeTag('wt_cd')
      }, 100);
      return;
    }
  }
  const nearby = mob.dimension.getPlayers({
    location: mob.location,
    maxDistance: 4
  });
  if (nearby.length == 0) return;
  mob.dimension.spawnParticle('dungeons:wind_totem_power', mob.location);
  hp.setCurrentValue(hp.currentValue - 1);
  const rand1 = Math.floor(Math.random() * 13) + 1;
  const rand2 = Math.floor(Math.random() * 100) + 1;
  const rand3 = Math.floor(Math.random() * 7) + 1;
  if ((!(mob.hasTag('wt_cd')) && rand1 == 1 && (1.15 * hp.currentValue) < rand2) || hp.currentValue == 66 || hp.currentValue == 33) {
    mob.dimension.spawnEntity('dungeons:wind_totem_burst', mob.location);
    if (rand3 == 1) {
      mob.dimension.spawnEntity('minecraft:vindicator', {
        x: mob.location.x,
        y: mob.location.y,
        z: mob.location.z - 1
      });
      mob.addTag('wt_cd');
      system.runTimeout(() => {
        mob.removeTag('wt_cd')
      }, 100);
    }
    if (rand3 == 2) {
      mob.dimension.spawnEntity('minecraft:pillager', {
        x: mob.location.x,
        y: mob.location.y,
        z: mob.location.z - 1
      });
      mob.dimension.spawnEntity('minecraft:pillager', {
        x: mob.location.x + 1,
        y: mob.location.y,
        z: mob.location.z
      });
      mob.addTag('wt_cd');
      system.runTimeout(() => {
        mob.removeTag('wt_cd')
      }, 200);
    }
    if (rand3 == 3) {
      mob.dimension.spawnEntity('minecraft:pillager', {
        x: mob.location.x,
        y: mob.location.y,
        z: mob.location.z - 1
      });
      mob.addTag('wt_cd');
      system.runTimeout(() => {
        mob.removeTag('wt_cd')
      }, 100);
    }
    if (rand3 == 4) {
      mob.dimension.spawnEntity('dungeons:windcaller', {
        x: mob.location.x,
        y: mob.location.y,
        z: mob.location.z - 1
      });
      mob.addTag('wt_cd');
      system.runTimeout(() => {
        mob.removeTag('wt_cd')
      }, 100);
    }
  }
}

function BeeEvent(event){
  const mob = event.entity;
  const eventId = event.eventId;
  if (eventId !== 'dungeons:spawn_bee') {
    return;
  }
  const owner = mob.getComponent('minecraft:tameable').tamedToPlayer;
  if (!owner) return;

  const bee = mob.dimension.spawnEntity('dungeons:pet_bee', {x: mob.location.x, y: mob.location.y+1, z: mob.location.z});

  let tameable = bee.getComponent('minecraft:tameable')
  tameable.tame(owner);


mob.dimension.playSound('block.beehive.exit', mob.location);
mob.playAnimation('animation.buzzy_nest.spawn_bee');
}

world.afterEvents.dataDrivenEntityTrigger.subscribe((event) => {

  Totem(event);
  BeeEvent(event);
  



});