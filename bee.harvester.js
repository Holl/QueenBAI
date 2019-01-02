var roleHarvester = {
    run: function(creep) {
        
        if (creep.memory.room != creep.pos.room){
            console.log("We're not in the right place!");
        }
        else{
            var targetSourceName = creep.memory.source;
            var target = Game.getObjectById(targetSourceName);
            if(creep.harvest(target) == ERR_NOT_IN_RANGE){
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}})
            }
            else(creep.harvest(target));
        }
	   
	}
};

module.exports = roleHarvester;