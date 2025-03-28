import { system, world } from "@minecraft/server";
import { Config } from "../../Roll/lib/configuration.js";
import { getResistanceValue } from "../../Roll/resistance_modifier.js";

let configuration = new Config(
    "rns",
    "Roll and Stamina",
    "textures/ui/roll_and_stamina_pack_icon"
  );
  
  configuration.addComponent([
    {
      name: "Enable Stamina",
      identifier: "rns:stamina",
      type: "toggle",
      value: true,
    },
    {
      name: "Speed Up When Sprinting",
      identifier: "rns:speedup",
      type: "toggle",
      value: true,
    },
    {
      name: "Stamina Exhausted Duration",
      identifier: "rns:stamina_exhausted",
      type: "dropdown",
      option: ["Slow", "Normal", "Fast", "Light"],
      value: 1,
    },
    {
      name: "Stamina Cooldown Duration",
      identifier: "rns:stamina_cooldown",
      type: "dropdown",
      option: ["Slow", "Normal", "Fast", "Light"],
      value: 1,
    },
    {
      name: "Stamina Strength",
      identifier: "rns:stamina_strength",
      type: "slider",
      range: [1, 2048],
      value_step: 1,
      value: 512,
    },
    {
      name: "Enable Roll",
      identifier: "rns:roll",
      type: "toggle",
      value: true,
    },
    {
      name: "Immune After Rolling",
      identifier: "rns:immune_roll",
      type: "toggle",
      value: false,
    },
    {
      name: "Allow Mid-air Roll",
      identifier: "rns:mid_air_roll",
      type: "toggle",
      value: true,
    },
    {
      name: "Roll Cooldown Duration",
      identifier: "rns:roll_cooldown",
      type: "dropdown",
      option: ["Slow", "Normal", "Fast", "Light"],
      value: 1,
    },
    {
      name: "Vertical Roll Strength",
      identifier: "rns:roll_vertical_strength",
      type: "slider",
      range: [0, 40],
      value_step: 1,
      value: 10,
    },
    {
      name: "Horizontal Roll Strength",
      identifier: "rns:roll_horizontal_strength",
      type: "slider",
      range: [0, 40],
      value_step: 1,
      value: 10,
    },
    {
      name: "Enable Fatigue",
      identifier: "rns:fatigue",
      type: "toggle",
      value: true,
    },
    {
      name: "Enable Edge Climb",
      identifier: "rns:edge_climb",
      type: "toggle",
      value: true,
    },
    {
      name: "Enable Wall Climbing",
      identifier: "rns:wall_climb",
      type: "toggle",
      value: true,
    },
    {
      name: "Enable Smart Crawling",
      identifier: "rns:smart_crwal",
      type: "toggle",
      value: true,
    },
    {
      name: "Allow Edge Climb Pass Fence and Wall",
      identifier: "rns:edge_climb_fence_gate",
      type: "toggle",
      value: true,
    },
    {
      name: "Aim Assist Grappling Hook",
      identifier: "rns:aim_hook",
      type: "toggle",
      value: true,
    },
    {
      name: "Using Grappling Hook Affects Stamina",
      identifier: "rns:affect_hook",
      type: "toggle",
      value: true,
    },
    {
      name: "Using Rope Affects Stamina",
      identifier: "rns:affect_rope",
      type: "toggle",
      value: true,
    },
    {
      name: "Using Glider Affects Stamina",
      identifier: "rns:affect_paraglider",
      type: "toggle",
      value: true,
    },
    {
      name: "Slow When Damaged",
      identifier: "rns:slow_damage",
      type: "toggle",
      value: true,
    },
    {
      name: "Armor Movement Fix",
      identifier: "rns:movement_fix",
      type: "slider",
      range: [0, 2],
      value_step: 1,
      value: 1,
    },
    {
      name: "\n ---------- UI Settings ----------\n\nStamina UI Style",
      identifier: "rns:stamina_style",
      type: "dropdown",
      option: ["Hide", "Default", "Zelda", "Right Bar"],
      value: 1,
    },
    {
      name: "Roll UI Style",
      identifier: "rns:roll_style",
      type: "dropdown",
      option: ["Hide", "Default", "Dungeon"],
      value: 1,
    },
    {
      name: "Fatigue UI Style",
      identifier: "rns:fatigue_style",
      type: "dropdown",
      option: ["Hide", "Default", "Emoji"],
      value: 1,
    },
    {
      name: "Grappling Hook UI Style",
      identifier: "rns:hook_style",
      type: "dropdown",
      option: ["Hide", "Default", "Text", "Right Bar"],
      value: 1,
    },
  ]);
  
  configuration.send();
  
  export function getConfigValue(value) {
    return configuration.getValue(value);
  }
  
  let rollCooldown = [];
  let rollTime = [];
  
  let stamina_is_cooldown = [];
  var fatigue_data = world.scoreboard.getObjective("rns:fatigue");
  if (fatigue_data == undefined) {
    fatigue_data = world.scoreboard.addObjective("rns:fatigue", "fatigue");
  }
  
  let player_is_climb = {};
  let player_use_item = {};
  
  let ui_data = {};
  
  let roll_style = configuration.getValue("rns:roll_style");
  
  
   /**
 * Exibe a taxa de ticks por segundo (TPS) na tela do jogador.
 * @param {EntityWrapper} entityWrapper
 */
   export function PlayerRoll(entityWrapper) {
    const playerData = entityWrapper.getPlayerObj();
    const playerId = playerData.id;
    const time = system.currentTick;

    if (!ui_data[playerId]) {
        ui_data[playerId] = { stamina: 0, roll: 15, fatigue: 0, climb: 0 };
    }

    // ⚡ Cache de valores da configuração
    const enableRoll = configuration.getValue("rns:roll");
    const enableMidAirRoll = configuration.getValue("rns:mid_air_roll");
    const rollCooldownConfig = configuration.getValue("rns:roll_cooldown");
    const rollStrengthH = configuration.getValue("rns:roll_horizontal_strength");
    const rollStrengthV = configuration.getValue("rns:roll_vertical_strength");
    const immuneAfterRoll = configuration.getValue("rns:immune_roll");

    if (!enableRoll) return;

    // ⚡ Cache de status do jogador
    const isOnCooldown = rollCooldown[playerId] !== -1 && rollCooldown[playerId] !== undefined;
    const isOnGround = playerData.isOnGround;
    const isInWater = playerData.isInWater;
    const isSneaking = playerData.isSneaking;
    const isOnCooldownStamina = stamina_is_cooldown[playerId];

    // ⚡ Cache de velocidade
    const vel = playerData.getVelocity();
    const vel_calc = Math.sqrt(vel.x ** 2 + vel.z ** 2);

    if (isOnCooldown) {
        const cooldownDelta = parseInt(((time - rollCooldown[playerId]) / 6) * (rollCooldownConfig + 1));
        if (cooldownDelta <= 15) {
            if (roll_style !== 0) ui_data[playerId].roll = cooldownDelta;
        } else {
            rollCooldown[playerId] = -1;
        }
        return;
    }

    if (!enableMidAirRoll && !isOnGround) return;
    if (isInWater || isOnCooldownStamina) return;
    if (isSneaking) {
        if (rollTime[playerId] === -1 || rollTime[playerId] === undefined) {
            rollTime[playerId] = time;
        }
    } else {
        if (rollTime[playerId] !== -1 && rollTime[playerId] !== undefined && !player_use_item[playerId]) {
            if (time - rollTime[playerId] < 5 && !player_is_climb[playerId]) {
                const rot = playerData.getRotation();
                let rot_temp = Math.floor((Math.atan2(vel.z, vel.x) * 180) / Math.PI - 90);
                rot_temp = rot_temp < -180 ? rot_temp + 360 : rot_temp;
                const delta_rot = Math.min(Math.abs(rot_temp - Math.floor(rot.y)), 360 - Math.abs(rot_temp - Math.floor(rot.y)));

                // ⚡ Aplicação de Knockback otimizada
                const resistance_value = 1 - getResistanceValue(playerData);
                if (vel_calc > 0.01) {
                    playerData.applyKnockback(
                        vel.x / resistance_value,
                        vel.z / resistance_value,
                        ((delta_rot > 120 ? 1.5 : 1) * 0.2 * rollStrengthH) / resistance_value,
                        ((delta_rot > 120 ? 0.2 : 0.4) * rollStrengthV * 0.05) / resistance_value
                    );
                } else {
                    rot.y = ((rot.y + 45) * Math.PI) / 180;
                    const velocity = {
                        x: (Math.cos(rot.y) - Math.sin(rot.y)) / resistance_value,
                        y: 0,
                        z: (Math.sin(rot.y) + Math.cos(rot.y)) / resistance_value
                    };
                    playerData.applyKnockback(
                        velocity.x,
                        velocity.z,
                        (0.1 * rollStrengthH) / resistance_value,
                        (rollStrengthV * 0.05) / resistance_value
                    );
                }

                // ⚡ Agrupamento de Animações
                playerData.playAnimation("animation.humanoid.roll_steady2", {
                    blendOutTime: 0.3,
                    controller: "roll_steady_controller"
                });
                playerData.playAnimation(delta_rot > 120 ? "animation.humanoid.roll_down" : "animation.humanoid.roll_up", {
                    controller: "roll_controller"
                });
                playerData.playAnimation("animation.humanoid.roll_head", {
                    blendOutTime: 1,
                    controller: "roll_head_controller"
                });

                // ⚡ Aplicação de Imunidade Pós-Rolagem
                if (immuneAfterRoll) {
                    playerData.addEffect("resistance", 10, {
                        amplifier: 16,
                        showParticles: false
                    });
                }

                // ⚡ Spawning de Partículas
                playerData.dimension.spawnParticle("rns:move_smoke", playerData.location);

                // Atualiza cooldown
                rollCooldown[playerId] = time;
            }
            rollTime[playerId] = -1;
        }
    }
}
