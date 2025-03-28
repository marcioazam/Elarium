import { system,world} from "@minecraft/server"


system.afterEvents.scriptEventReceive.subscribe((data) => {
  if(data.sourceEntity==undefined)return;
    let entity=data.sourceEntity;
    let location=entity.location;
    if(data.id==="edx:true_wither" && entity ){
        entity.dimension.spawnEntity("edx:true_wither",location);
        entity.remove()
    }
    if(data.id==="edx:true_wither_fail" && entity ){
        entity.runCommand(`tellraw @a[r=50] { "rawtext": [ { "text": "You can't summon the Wither in the Nether before killing the Ender Dragon because in the Nether you'll summon a harder version of the Wither \nSo do it in the overworld. sorry, I don't want you to die because you summoned a way too hard boss" } ] }`)
        entity.runCommand(`give @p[r=30] skull 3 1`)
        entity.runCommand(`give @p[r=30] soul_sand 4`)
        entity.remove()
    }
    if(data.id==="edx:gloopine_jump" && entity ){
        entity.applyKnockback(entity.getViewDirection().x, entity.getViewDirection().z, Math.sqrt(entity.getViewDirection().x ** 2 + entity.getViewDirection().z ** 2)*2, 1)
        entity.setRotation({x:Math.random()*360,y:Math.random()*360})
    } 
    if(data.id==="edx:gloop_ball_jump" && entity ){
      entity.applyKnockback(entity.getViewDirection().x, entity.getViewDirection().z, Math.sqrt(entity.getViewDirection().x ** 2 + entity.getViewDirection().z ** 2)*2, 1)
      entity.setRotation({x:Math.random()*360,y:Math.random()*360})
  } 
    if(data.id==="edx:player_fall" && entity ){
        entity.runCommand(`scoreboard players set @s Height ${Math.round(entity.location.y)}`)
    }
    
    if(data.id==="edx:magmroll_jump" && entity ){
      entity.applyKnockback(entity.getViewDirection().x, entity.getViewDirection().z, Math.sqrt(entity.getViewDirection().x ** 2 + entity.getViewDirection().z ** 2)*4.5, 0.6)
    }
    if(data.id==="edx:skeleton_piranha" && entity){
      entity.applyKnockback(entity.getViewDirection().x, entity.getViewDirection().z, Math.sqrt(entity.getViewDirection().x ** 2 + entity.getViewDirection().z ** 2)*2, 4.2)
    }
    if(data.id==="edx:incendiary_throwing_potion" && entity){
      var entities = world.getDimension("Nether").getEntities({
        location: { x: entity.location.x, y: entity.location.y, z: entity.location.z },
        maxDistance: 2,
      });
      for (let entity of entities) {
        entity.setOnFire(10);
      }  
    }
    //blazeblade
    if(data.id==="edx:blazeblade_sun" && entity){
      entity.dimension.playSound('mob.blazeblade.sun',entity.location,{volume: 4.0,});
      var players = entity.dimension.getPlayers({
        location: { x: entity.location.x, y: entity.location.y, z: entity.location.z },
        maxDistance: 5,
    });
    for (let player of players) {
        if (player.hasTag("easy") ) {
            player.setOnFire(3, false);
            player.applyKnockback(0,0,0,1);
            player.applyDamage(8,{
                cause: "fire" ,
            },)
        }
        else if (player.hasTag("normal") ) {
            player.setOnFire(5, false);
            player.applyKnockback(0,0,0,1);
            player.applyDamage(14,{
                cause: "fire" ,
            },)
        }
        else if (player.hasTag("hard") ) {
            player.setOnFire(7, false);
            player.applyKnockback(0,0,0,1);
            player.applyDamage(20,{
                cause: "fire" ,
            })
        }
     }
    }
    if(data.id==="edx:blazeblade_solar_flare" && entity){
      entity.dimension.playSound('mob.blazeblade.solar_wave',entity.location,{volume: 3.0,});
      var players = entity.dimension.getPlayers({
        location: { x: entity.location.x, y: entity.location.y, z: entity.location.z },
        maxDistance: 64,
      });
      for (let player of players) {
        player.setOnFire(1, false);
      }
    }
    if(data.id==="edx:blazeblade_dig" && entity){
      entity.dimension.playSound('mob.blazeblade.dig_out',entity.location,{volume: 3.0,});
      var players = entity.dimension.getPlayers({
        location: { x: entity.location.x, y: entity.location.y, z: entity.location.z },
        maxDistance: 1.5,
      });
      for (let player of players) {
          if (player.hasTag("easy") ) {
              player.setOnFire(6, false);
              player.applyKnockback(0,0,0,1);
              player.applyDamage(8,{
                  cause: "fire" ,
              },)
          }
          else if (player.hasTag("normal") ) {
              player.setOnFire(8, false);
              player.applyKnockback(0,0,0,1);
              player.applyDamage(10,{
                  cause: "fire" ,
              },)
          }
          else if (player.hasTag("hard") ) {
              player.setOnFire(10, false);
              player.applyKnockback(0,0,0,1);
              player.applyDamage(12,{
                  cause: "fire" ,
              })
          }
      }
    }
    if(data.id==="edx:blazeblade_dash_1" && entity){
        var direction=entity.getViewDirection()
        entity.applyImpulse({ x:direction.x*4 , y: direction.y, z: direction.z*4 }) 
        entity.dimension.playSound('mob.blazeblade.dash',entity.location,{volume: 3.0,});
    }
    if(data.id==="edx:blazeblade_dash_2" && entity){
      var direction=entity.getViewDirection()
      entity.applyImpulse({ x:direction.x*6 , y: direction.y, z: direction.z*6 }) 
      entity.dimension.playSound('mob.blazeblade.dash',entity.location,{volume: 3.0,});
  }

});