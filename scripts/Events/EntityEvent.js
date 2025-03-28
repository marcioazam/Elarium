import { world, system } from "@minecraft/server";
import { initialize } from '../SweepSlash/main/handler.js';

const allScores = [
  'cooldownMax',
  'cooldownTime',
  'hammerCD',
  'obsidianCD',
  'shadowTime',
  'shockwaveCD',
  'soulGauge',
  'sweepCD',
  'swirlCD',
  'anchorCD',
  'spongeStrikerCharge',
  'guardianEye',
  'sawbladeCharge',
  'sawbladeCD',
  'powershaker_t',
  'powershaker_u'
];



world.afterEvents.worldInitialize.subscribe(e => {

  for (const score of allScores) {
    if (!world.scoreboard.getObjective(score)) {
      world.scoreboard.addObjective(score)
    }
  }
});

world.afterEvents.playerSpawn.subscribe(e => {
    SpawnDungeons(e);
    Saturation(e);
    ConfigCombat(e);
  });

  function SpawnDungeons(e) {
    e.player.removeTag('dungeons:tempest_warn');
    e.player.removeTag('dungeons:guardian_warn');
    e.player.removeTag('dungeons:sword_block');
    for (const score of allScores) {
      world.scoreboard.getObjective(score).addScore(e.player, 0);
    }
  }

  function Saturation(e){
    var player = e.player;
    if (!player.hasTag("jc:saturation_spawned")) {
        player.setDynamicProperty("jc:saturation", 5);
        player.addTag("jc:saturation_spawned");
    }
  }

function ConfigCombat(e)  {
    var player = e.player;
    var initialSpawn = e.initialSpawn;
	const dpArray = [
		"excludePetFromSweep",
		"enchantedHit",
		"damageIndicator",
		"criticalHit",
		"sweep",
		"critSound",
		"bowHitSound"
	];
	if (initialSpawn) {
		
		for (const dp of dpArray) {
			initialize(player, dp);
		}
	}
}