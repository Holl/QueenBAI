var roleDefender = {
    run: function(creep) {
        var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(creep.rangedAttack(closestHostile) == ERR_NOT_IN_RANGE) {
            creep.moveTo(closestHostile);
        }
        else{
            creep.rangedAttack(closestHostile);
        }
	}
};

module.exports = roleDefender;