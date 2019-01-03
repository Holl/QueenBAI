module.exports = function(creepObject){
	// The function of the scan queen is to gather information for making any choices.
	// The object returned is bits of information used by the other minds
	// to determine actions.

	// The following loop is for scanning each local spawn room, not anything empire-wide.

	var scanData = {"empireData":{}, "localData":[]};

	for(var spawn in Game.spawns){
	    // All the basic info to get and to count as we look around the empire.
		var starterCreeps = 0;
		var harvesterCreeps = 0;
		var upgraderCreeps = 0;
		var harvesterTargets = {};
		var defenderCreeps = 0;
		var workerCreeps = 0;
		var captureCreeps = 0;
		var builderCreeps = 0;
		var defensivePower = 0;
		var haulerCreeps = 0;
		var scoutCreeps = 0;
		var haulerTargets = {};
		var workerCreeps = 0;
		var workerTargets = {};
		var localDefcon = 5;
		var wallCount = 0;
		var knownTerritory = [];
		var territoryCreeps = [];
		var roomEnergy = Game.spawns[spawn].energy;
		var roomEnergyCapcity = Game.spawns[spawn].energyCapacity;
		var hostileCreeps = Game.spawns[spawn].room.find(FIND_HOSTILE_CREEPS);
		var myCreeps = creepObject[spawn];
		for (creep in myCreeps){
		    if (myCreeps[creep].room != Game.spawns[spawn].room){
		        territoryCreeps.push({'creep':myCreeps[creep], 'room':myCreeps[creep].pos.roomName});
		    }
		}
		var localLevel = Game.spawns[spawn].room.controller.level;
		var localSources =[];
		for (var i=0; i < Game.spawns[spawn].room.find(FIND_SOURCES).length;  i++){
		    localSources.push(Game.spawns[spawn].room.find(FIND_SOURCES)[i].id);
		}
		var wallList = Game.spawns[spawn].room.find(FIND_STRUCTURES, { 
            filter: (structure) => { 
                return (structure.structureType == STRUCTURE_WALL)
            }
        });
 
		wallCount = wallList.length;

		// Count up and catigorize our creeps.

		for (var creep in myCreeps){

		    var creepRole = myCreeps[creep].memory.role;
		    var creepLife = myCreeps[creep].ticksToLive;
		    
		    if (creepLife > 40){
		        
		        if (creepRole == 'scout'){
		            scoutCreeps++;
		        }
		    	if (creepRole == 'starter'){
	            	starterCreeps++;
		        }
		        if (creepRole == 'harvester'){
		            harvesterCreeps++;
		          //  TODO: Pull this out into a function
		            if (myCreeps[creep].memory.source){
		                if (harvesterTargets[myCreeps[creep].memory.source] >=1){
		                    harvesterTargets[myCreeps[creep].memory.source]++;
		                }
		                else{
		                    harvesterTargets[myCreeps[creep].memory.source] = 1;
		                }
		            }
		        }
		        if (creepRole == 'hauler'){
		            haulerCreeps++;
		            if (myCreeps[creep].memory.source){
		                if (haulerTargets[myCreeps[creep].memory.source] >=1){
		                    haulerTargets[myCreeps[creep].memory.source]++;
		                }
		                else{
		                    haulerTargets[myCreeps[creep].memory.source] = 1;
		                }
		            }
		        }
		        if (creepRole == 'worker'){
		            workerCreeps++;
		            if (myCreeps[creep].memory.source){
		                if (workerTargets[myCreeps[creep].memory.source] >=1){
		                    workerTargets[myCreeps[creep].memory.source]++;
		                }
		                else{
		                    workerTargets[myCreeps[creep].memory.source] = 1;
		                }
		            }
		        }
		        if (creepRole == 'defender'){
		            defenderCreeps++;
			        defensivePower += getUnitPower(myCreeps[creep]);
			    }
		        if (creepRole == 'builder'){
		            builderCreeps++;
		        }
		        if(creepRole == 'upgrader'){
		            upgraderCreeps++;
		        }
		        if (creepRole == 'capture'){
		        	captureCreeps++;
		        }
		    }
		}

		// Count and size up enemy forces.

		var hostilePower = 0;
		if (hostileCreeps){
			for (var i=0; i< hostileCreeps.length; i++){
		        hostilePower += getUnitPower(hostileCreeps[i]);
	    	}
	    }
	    
	    var outsideSources = {};
	    var localTerritoryFlags = [];
	    var localCaptureFlags = [];
	    var mysteryRoomFlags = [];
	    
	   // Flags are used to identify other territories under our "Control",
	   // know as our territory.  Mining and defending these areas are the resposibility
	   // of the local spawn it's attached to.
	   
	   // Control points to capture are marked in the same way.
	   
	    
	    for (flag in Game.flags){
	        var flagMemory = Game.flags[flag].memory;
	        var completedScans = [];
    	    if (flagMemory.spawn == spawn){
    	        if (flagMemory.action == "mine"){
                    localTerritoryFlags.push(flag);
                    var mysteryRoomBool = true;
                    for (var i =0; i< territoryCreeps.length; i++){
                        if (territoryCreeps[i]['room'] == Game.flags[flag].pos.roomName && 
                        completedScans.indexOf(territoryCreeps[i]['room']) === -1){
                            knownTerritory.push(runTerritoryScan(territoryCreeps[i]['creep']));
                            completedScans.push(territoryCreeps[i]['room']);
                            mysteryRoomBool = false;
                        }
                    }
                    if (mysteryRoomBool){
                        mysteryRoomFlags.push(flag);
                    }
    	        }
    	        if (flagMemory.action == "capture"){
    	        	localCaptureFlags.push(flag);
    	        }
    	    }
    	}
    	
    	
    	
        // Build and return the info.

	    var localDataObject = {
	    	// Main info:
	        "spawnName": spawn,
	    	"localLevel": localLevel,
	        "localTerritoryFlags": localTerritoryFlags,
	        "localCaptureFlags": localCaptureFlags,
	        "mysteryRoomFlags": mysteryRoomFlags,
	        "knownTerritory": knownTerritory,
	        "localSources": localSources,
	    	"outsideSources": outsideSources,
	        // Creeps:
	    	"starterCreeps": starterCreeps,
	    	"workerCreeps": workerCreeps,
	    	"upgraderCreeps": upgraderCreeps,
	    	"harvesterCreeps": harvesterCreeps,
	    	"defenderCreeps": defenderCreeps,
	    	"builderCreeps": builderCreeps,
	    	"haulerCreeps": haulerCreeps,
	    	"scoutCreeps": scoutCreeps,
	    	"captureCreeps": captureCreeps,
	    	// Creep info:
	    	"harvesterTargets":harvesterTargets,
	    	"haulerTargets":haulerTargets,
	    	"workerTargets": workerTargets,
	    	"wallCount": wallCount,
	    	// Military:
	    	"defensivePower": defensivePower,
	    	"hostilePower": hostilePower,
		}
		
	    scanData['localData'].push(localDataObject);
	}
	
	return scanData;
}

function runTerritoryScan(creep){
    // A smaller scan to understand exactly what is in a territory,
    // and and if there are any threats.
    var sources = creep.room.find(FIND_SOURCES);
    var contructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
    var hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
    var roomName =  creep.room.name;
    
    return {
        "roomName": roomName,
        "sources": sources,
        "contructionSites": contructionSites,
        "hostileCreeps": hostileCreeps
    }
}

function getUnitPower(creep){
    
    // Used to assess how powerful a creep is.
    // If it has no attack, it's a scout, and most likely the tower can take care of it,
    // or we just don't care.
    
 	var unitPower = 0;	
    unitPower += creep.getActiveBodyparts(ATTACK) * 80;
    unitPower += creep.getActiveBodyparts(RANGED_ATTACK) * 150;
    unitPower += creep.getActiveBodyparts(TOUGH) * 10;
    return unitPower
}

function updateSourceMemory(creep){
    // Used to determine how many creeps are assigned to a particular
    // SOURCE, rather than the room overall.
    if (myCreeps[creep].memory.source){
        if (harvesterTargets[myCreeps[creep].memory.source] >=1){
            harvesterTargets[myCreeps[creep].memory.source]++;
        }
        else{
            harvesterTargets[myCreeps[creep].memory.source] = 1;
        }
    }
}