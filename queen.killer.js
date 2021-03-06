var roleSwarm = require("bee.swarm");

module.exports = function(scanData, warCreeps){
	for (flag in Game.flags){
	    var flagMemory = Game.flags[flag].memory;
		var KQMemory = flagMemory.KQ;
		if (KQMemory){
		    var KQlevel = flagMemory.level;
		    switch (KQMemory){
		        case "swarm": return swarm(scanData, flag, warCreeps, KQlevel);
		        case "steady": return steady(scanData, flag, warCreeps, KQlevel);
		        case "drain": return drain(scanData, flag, warCreeps, KQlevel);
		    }
		}
	}
}

function swarm(scanData, flag, warCreeps, KQlevel){
    creepName = "swarm";
    creepMax = KQlevel*2;
	var creeps = filterWarcreeps(flag, warCreeps);
	if (creeps.length < creepMax && !checkIfAlreadySpawning(creepName)){
	    var index = returnHighestEnergySpawnIndex(scanData['localData']);
	    var warCreepData = {
	        'name': creepName,
	        'flag': flag,
	        'level': KQlevel
	    }
	    scanData['localData'][index]['KQSpawns']= warCreepData;
	}

	for (var i = 0; i < creeps.length; i++){
		var creep = Game.creeps[creeps[i]];
		if (creep.memory.state == "prep"){
			roleSwarm.prep(creep);
		}
		else{
			roleSwarm.attackMovement(creep); 
		}

	}
}
function steady(scanData, flag, warCreeps, KQlevel){

}

function drain(scanData, flag, warCreeps, KQlevel){

}

function filterWarcreeps(flag, warCreeps){
	var ourCreeps = []
	for (var i = 0; i < warCreeps.length; i++){
		if (Game.creeps[warCreeps[i]].memory.flag == flag){
			ourCreeps.push(warCreeps[i]); 
		}
	}
	return ourCreeps;
}

function returnHighestEnergySpawnIndex(localScanData){
    var indexOfHighestEnergy = 0;
    var highestEnergy = 0;
    for (var i=0; i<localScanData.length; i++){
       if (localScanData[i]['energyNow'] > highestEnergy){
           highestEnergy = localScanData[i]['energyNow'];
           indexOfHighestEnergy = i;
       }
    }
    return indexOfHighestEnergy;
}

function checkIfAlreadySpawning(creepName){
    for (spawn in Game.spawns){
        if (Game.spawns[spawn].spawning){
            if (Game.spawns[spawn].spawning.name.includes(creepName)){
                return true;
            }
        }
    }
    return false;
}