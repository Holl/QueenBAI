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
	var creeps = filterWarcreeps(flag, warCreeps);
	console.log(checkIfAlreadySpawning(creepName));
	if (creeps < 1 && !checkIfAlreadySpawning(creepName)){
	    var index = returnHighestEnergySpawnIndex(scanData['localData']);
	    scanData['localData'][index]['KQSpawns']['name'] = creepName;
	    scanData['localData'][index]['KQSpawns']['flag'] = flag;
	    scanData['localData'][index]['KQSpawns']['level'] = KQlevel;
	}

	for (var i = 0; i < creeps.length; i++){
		var creep = Game.creeps[creep[i]];
	}
}
function steady(scanData, flag, warCreeps, KQlevel){

}

function drain(scanData, flag, warCreeps, KQlevel){

}

function filterWarcreeps(flag, warCreeps){
	var ourCreeps = []
	for (var i = 0; i < warCreeps.length; i++){
		if (Game.creeps[warCreeps[i]].flag == flag){
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
        if (Game.spawns[spawn].Spawning){
            if (Game.spawns[spawn].Spawning.name.includes(creepName)){
                return true;
            }
        }
    }
    return false;
}