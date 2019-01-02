var roleScout = {
    run: function(creep) {
        var flag= Game.flags[creep.memory.flag];
        if (flag){
            if (flag.pos.roomName != creep.pos.roomName){
                creep.moveTo(flag);
            }
            else{
                creep.moveTo(flag);
            }   
        }
        else{
            console.log("I was made for a flag that doesn't exist.  Something is terribly wrong!");
            creep.suicide();
        }
	}
};

module.exports = roleScout;