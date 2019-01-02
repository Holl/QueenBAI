var roleHauler = {
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
            if(!target){
                creep.moveTo(Game.getObjectById(targetSourceName).pos);
            }
        }
        
        else {
            var dropOff = Game.spawns[creep.memory.spawn].room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_STORAGE }
            })[0];
            
            if(creep.transfer(dropOff, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(dropOff, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            else {
                creep.transfer(dropOff, RESOURCE_ENERGY);
            }
            
        }
	}
};

module.exports = roleHauler;