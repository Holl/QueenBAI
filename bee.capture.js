var roleCaptureBee = {
    run: function(creep) {
        var flag = Game.flags[creep.memory.flag];
        if (flag){
            if (flag.pos.roomName != creep.pos.roomName){
                creep.moveTo(flag);
            }
            else if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.controller);
            }
            else{
                creep.claimController(creep.room.controller);
            }   
        }
        else{
            console.log("I was made for a flag that doesn't exist.  Something is terribly wrong!");
            creep.suicide();
        }
	}
};

module.exports = roleCaptureBee;