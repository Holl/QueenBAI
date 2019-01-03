var roleHarvester = {
    run: function(creep) {
        var targetSourceName = creep.memory.source;
        console.log(targetSourceName)
        var target = Game.getObjectById(targetSourceName);
        if(creep.harvest(target) == ERR_NOT_IN_RANGE){
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}})
        }
        else(creep.harvest(target));
    }
       
};

module.exports = roleHarvester;