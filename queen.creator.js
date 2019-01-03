var harvestersMax = 1;
var builderMax = 1;
var bodyCost ={
    "move": 50,
    "work": 100,
    "attack": 80,
    "carry": 50,
    "heal": 250,
    "ranged_attack": 150,
    "tough": 10,
    "claim": 600
}

module.exports = function(scanData){
    
    // Creator Mind is used to create creeps as needed, using hte scan data
    // from Scan.
    
    var spawnName = scanData['spawnName'];
    var energyNow = Game.spawns[spawnName].room.energyAvailable;
    var energyMax = Game.spawns[spawnName].room.energyCapacityAvailable;
    
    // Calculate the level of the creeps based mostly on Max energy capacity,
    // but also check to see if we have 0 of some key creeps.
    
    var creepLevel = calculateLevel(energyNow, energyMax, scanData['harvesterCreeps'], scanData['workerCreeps']);
    console.log("For spawn "+ spawnName + ", Creator Mind calculates creep level to be at " + creepLevel + ".");

    // First and most importantly, local economy.

    var localCreep = false;

    for (var i=0; i < scanData['localSources'].length;  i++){
        var workersMax = calculateCreepMaximums(scanData['localSources'][i], spawnName);
        console.log("For " + spawnName + "'s Source number " + i +", " + workersMax + " workers are needed.");
        if(checkTargetedCreepsAmount(scanData, 'harvesterTargets', harvestersMax, i, 'localSources')){
            console.log(spawnName + " wants to build a harvester for source " + i + '.');
            creepCreator(spawnName, 'harvester', {role:'harvester', 'source':scanData['localSources'][i],'spawn': spawnName}, creepLevel); 
            localCreep = true;
            break;
        }
        else if (checkTargetedCreepsAmount(scanData, 'workerTargets', workersMax, i, 'localSources')){
            creepCreator(spawnName, 'worker', {role:'worker', 'source':scanData['localSources'][i], 'spawn': spawnName}, creepLevel);
            console.log(spawnName + " wants to build a worker for source " + i + '.');
            localCreep = true;
            break;
        }
    }
    
    if (!localCreep){

        // If our calculated hostile power is higher than our defensive power,
        // spin up defensive units.
        
        if (scanData['hostilePower('] > (scanData['defensivePower'] + 100)){
            console.log("Defense spinning up!");
            creepCreator(spawnName, 'defender', {role:'defender'}, creepLevel); 
        }
        
        // Management of local territory.
        // We have a list of flags in rooms we want controlled by this spawn,
        // as well as scans from those territories we don't have.
        
        for (var i=0; i < scanData['mysteryRoomFlags'].length;  i++){
            if (scanData['scoutCreeps'] < 1){
                console.log("We're creating a scout, but in a pretty dumb way.");
                creepCreator(spawnName, 'scout', {role:'scout','spawn': spawnName, 'flag':Game.flags[scanData['mysteryRoomFlags'][i]].name}, 1); 
            }
        }
        
        for (var i=0; i < scanData['knownTerritory'].length;  i++){
            var thisTerritory = scanData['knownTerritory'][i];
            for (var y=0; y < thisTerritory['sources'].length; y++){
                if (scanData['harvesterTargets'][thisTerritory['sources'][y].id] < 1 || !scanData['harvesterTargets'][thisTerritory['sources'][y].id]){
                    console.log(spawnName + " wants to build a harvester for source " + i + ' in a nearby territory.');
                    creepCreator(spawnName, 'harvester', {role:'harvester', 'source':thisTerritory['sources'][y].id,'spawn': spawnName}, creepLevel);     
                }
                if (scanData['haulerTargets'][thisTerritory['sources'][y].id] < 2 || !scanData['haulerTargets'][thisTerritory['sources'][y].id]){
                    console.log(spawnName + " wants to build a hauler for source " + i + ' in a nearby territory.');
                    creepCreator(spawnName, 'hauler', {role:'hauler', 'source':thisTerritory['sources'][y].id,'spawn': spawnName}, creepLevel);     
                }
            }
        }

        for (var i=0; i < scanData['localCaptureFlags'].length; i++){
            var flag = Game.flags[scanData['localCaptureFlags'][i]];
            var kevinNess = flag.room.controller.owner.username == "KEVIN";
            if (scanData['captureCreeps'] < 1 && !kevinNess){
                console.log("Sending a spawn to capture the controller near " + scanData['localCaptureFlags'][i]);
                creepCreator(spawnName, 'capture', {role:'capture', flag: scanData['localCaptureFlags'][i], spawn: spawnName}, creepLevel);
            }
            else{
                var roomCreeps = flag.room.find(FIND_CREEPS);
                var roomSources =  flag.room.find(FIND_SOURCES);
                var newSpawn = flag.memory.newSpawn;
                var harvesterCreeps = 0;
                var workerCreeps = 0;
                for (var y=0; y < roomCreeps.length; y++){
                    if (roomCreeps[y].memory.role == "harvester"){
                        harvesterCreeps++;
                    }
                    if (roomCreeps[y].memory.role == "worker"){
                        workerCreeps++;
                    }
                }
                if (harvesterCreeps < 1){
                    console.log("We're building an capture harvester.");
                    // creepCreator(spawnName, 'harvester', {role:'harvester', 'source':roomSources[0].id, 'spawn': newSpawn}, creepLevel);
                }
                if (workerCreeps < 2){
                    console.log("We're build capture workers.");
                    // creepCreator(spawnName, 'worker', {role:'worker', 'source':roomSources[0].id, 'spawn': newSpawn}, creepLevel);
                }
            }
        }
        
        // Finally, builders.  Builders are pretty static at the moment.
        // If we have walls, and current builders are below appropriate levels, spin one up.
        
        if (scanData['wallCount'] > 0 &&(scanData['builderCreeps'] < builderMax)){
            creepCreator(spawnName, 'builder', {role:'builder', 'source':scanData['localSources'][0], 'spawn': spawnName}, creepLevel);
            console.log(spawnName + " wants to build a builder.");
        }
    }
}

function calculateLevel(energyCurrent, energyMax, harvesterCount, workerCount){
    if (harvesterCount == 0 || workerCount == 0 || energyMax < 550){
        return 1;
    }
    else if (550 <=  energyMax && energyMax < 800){
        return 2;
    }
    else if (800 <= energyMax && energyMax < 1300){
        return 3;
    }
    else if (1300 <= energyMax){
        return 4;
    }
}

function calculateCreepMaximums(localSource, spawnName){
    var targetResources = Game.getObjectById(localSource).pos.findInRange(
        FIND_DROPPED_RESOURCES,
        1
    );
    var sumResources = 0;
    for (var y=0; y< targetResources.length; y++){
        sumResources += targetResources[y].energy;
    }
    var creepsMax = 0;
    return Math.floor((sumResources/500)+1)
}

function creepCreator(spawnName, roleName, metaData, creepLevel){
    Game.spawns[spawnName].spawnCreep(getBody(roleName, creepLevel), roleName + "_lvl" + creepLevel + "_" + 
    Game.time.toString(), { memory: metaData});
}

function checkTargetedCreepsAmount(scanData, targets, max, num, source){
    if (scanData[targets][scanData[source][num]] < max || !(scanData[targets][scanData[source][num]])){
        return true;
    }
    else {return false};
}        


function getBody(role, level){
    switch (role){
        case "starter": return getBody_Starter(level);
        case "worker": return getBody_Worker(level);
        case "harvester": return getBody_Harvester(level);
        case "builder": return getBody_Builder(level);
        case "defender": return getBody_Defender(level);
        case "hauler": return getBody_Hauler(level);
        case "scout": return getBody_Scout(level);
        case "capture": return getBody_Capture(level);
    }
}

function getBody_Scout(level){
    switch (level){
        case 1: return [MOVE];
    }
}

function getBody_Capture(level){
    switch (level){
        case 1: return [CLAIM, MOVE];
        case 2: return [CLAIM, MOVE];
        case 3: return [CLAIM, MOVE];
        case 4: return [CLAIM, MOVE];
    }
}

function getBody_Harvester(level){
    switch (level){
        case 1: return [MOVE, 
                        WORK, WORK];
        case 2: return [MOVE, 
                        WORK, WORK, WORK, WORK];
        case 3: return [MOVE, 
                        WORK, WORK, WORK, WORK, WORK];
        case 4: return [MOVE, MOVE, MOVE, MOVE, MOVE, 
                        WORK, WORK, WORK, WORK, WORK];
    }
}

function getBody_Builder(level){
    switch (level){
        case 1: return [
                        CARRY, 
                        MOVE, 
                        WORK
                        ]
        case 2: return [
                        CARRY, CARRY, CARRY,
                        WORK, WORK, 
                        MOVE, MOVE, MOVE
                        ];
        case 3: return [
                        CARRY, CARRY, CARRY, CARRY, CARRY,
                        WORK, WORK, WORK, WORK,
                        MOVE, MOVE, MOVE
                        ];
        case 4: return [
                        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                        WORK, WORK, WORK, WORK, WORK,
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
                        ];
    }
}

function getBody_Defender(level){
    switch (level){
        case 1: return [
                        ATTACK, MOVE
                        ];
        case 2: return [
                        RANGED_ATTACK, RANGED_ATTACK, 
                        MOVE, MOVE
                        ];
        case 3: return [
                        RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                        MOVE, MOVE, MOVE, MOVE
                        ];
        case 4: return [
                        RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
                        MOVE, MOVE, MOVE, MOVE, MOVE
                        ];
    }
}

function getBody_Worker(level){
    switch (level){
        case 1: return [
                        CARRY, 
                        MOVE, 
                        WORK
                        ]
        case 2: return [
                        CARRY, CARRY, CARRY,
                        WORK, WORK, 
                        MOVE, MOVE, MOVE
                        ];
        case 3: return [
                        CARRY, CARRY, CARRY, CARRY, CARRY,
                        WORK, WORK, WORK, WORK,
                        MOVE, MOVE, MOVE
                        ];
        case 4: return [
                        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                        WORK, WORK, WORK, WORK, WORK,
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
                        ];
    }
    
}

function getBody_Hauler(level){
    switch (level){
        // 550, 800, 1300
        case 1: return [CARRY, MOVE]
        case 2: return [CARRY, CARRY, CARRY, CARRY, 
                        MOVE, MOVE, MOVE, MOVE];
        case 3: return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        case 4: return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
    }
}