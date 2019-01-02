var roleWorker = {
    run: function(creep) {
        if(creep.carry.energy == 0){
            var targetSourceName = creep.memory.source;
            var target = Game.getObjectById(targetSourceName).pos.findInRange(
                FIND_DROPPED_RESOURCES,
                1
            )[0];
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            if(creep.room.energyAvailable == creep.room.energyCapacityAvailable){
                var towers = creep.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
                var refillingTowersBool = false;
                for (var i = 0; i < towers.length; i++){
                    if (towers[i].energy < towers[i].energyCapacity){
                        if(creep.transfer(towers[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                            creep.moveTo(towers[i], {visualizePathStyle: {stroke: '#ffffff'}});
                            refillingTowersBool = true;
                        }
                        else {
                            creep.transfer(towers[i], RESOURCE_ENERGY);
                        }
                    }
                }
                if (refillingTowersBool == false){
                    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                    if(targets.length) {
                        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                    else if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    else{
                        // creep.signController(creep.room.controller, "Rebuilding scripts from scratch after an absence, so expect weird behavior as I test. I’m harmless.")
                        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                        creep.upgradeController(creep.room.controller);
                    }
                }
            
            }
            else{
                var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                                structure.energy < structure.energyCapacity;
                        }
                });
                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: 'white'}});
                    }
                }
            }
        }
	}
};

module.exports = roleWorker;