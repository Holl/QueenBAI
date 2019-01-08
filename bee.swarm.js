var roleSwarm = {
    prep: function(creep) {
        var flags = creep.room.find(FIND_FLAGS);
        creep.moveTo(flags[0]);
    },
    attackMovement: function(creep){
        var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (!closestHostile){
            creep.moveTo(Game.flags[creep.memory.flag]);
        }
        if(creep.attack(closestHostile) == ERR_NOT_IN_RANGE) {
            creep.moveTo(closestHostile);
        }
        else{
            creep.attack(closestHostile);
        }
    }

};

module.exports = roleSwarm;