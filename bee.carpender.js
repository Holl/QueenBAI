var roleBuilder = {

    run: function(creep) {
        if(creep.carry.energy == 0 ){
            var targetSourceName = creep.memory.source;
            var target = Game.getObjectById(targetSourceName).pos.findInRange(
                FIND_DROPPED_RESOURCES,
                1
            )[0];
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            creep.memory.target = false;
        }
        else if (creep.carry.energy > 0 && (creep.memory.target == false)){
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < (object.hitsMax*.8)
            });
            
            targets.sort((a,b) => a.hits - b.hits);
            creep.memory.target = targets[0].id;
        }
        else if (creep.memory.target){
            var target = Game.getObjectById(creep.memory.target);
            if (creep.repair(target) == ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }
            else if (target.hits == target.hitsMax){
                creep.say("Retarget");
                const targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < (object.hitsMax*.8)
                });
                
                targets.sort((a,b) => a.hits - b.hits);
                creep.memory.target = targets[0].id;
            }
            else{
                creep.repair(target)
            }
        } 
    }
};

module.exports = roleBuilder;