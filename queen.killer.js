module.exports = function(scanData, warCreeps){
	for (flag in Game.flags){
		var KQMemory = Game.flags[flag].memory.KQ;
		if (KQMemory){
		    switch (KQMemory){
		        case "swarm": return swarm(scanData, flag, warCreeps);
		        case "steady": return steady(scanData, flag, warCreeps);
		        case "drain": return drain(scanData, flag, warCreeps);
		    }
		}
	}
}

function swarm(scanData, flag, warCreeps){
	var creeps = filterWarcreeps(flag, warCreeps);
	if (creeps < 1){
		console.log(scanData['localData'][0]);
	}
}

function steady(scanData, flag, warCreeps){

}

function drain(scanData, flag, warCreeps){

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