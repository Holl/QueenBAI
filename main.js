var roleHarvester = require('bee.harvester');
var roleScout = require('bee.scout');
var roleCarpenderBee = require('bee.builder');
var roleWorker = require("bee.worker");
var roleHauler = require("bee.hauler");
var roleDefender = require("bee.defender");
var roleWorker = require("bee.worker");
var roleTower = require("bee.tower");

var scan = require('queen.scan');
var create = require('queen.creator');

module.exports.loop = function () {
    console.log("~~~~~~~~~~"+ Game.time+"~~~~~~~~~~");
    
    var scanData = scan();
    
    
    for (var i=0; i < scanData['localData'].length;  i++){
        create(scanData['localData'][i]);
        // Room tower orders:
        var towers = Game.spawns[scanData['localData'][i]['spawnName']].room.find(FIND_STRUCTURES,
            {filter: {structureType: STRUCTURE_TOWER}});
        for (var y=0; y < towers.length; y++){
            roleTower.run(towers[y]);
        }
    }
    
    // Creep orders:
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleCarpenderBee.run(creep);
        }
        if(creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
        if(creep.memory.role == 'defender') {
            roleDefender.run(creep);
        }
        if (creep.memory.role == 'worker') {
            roleWorker.run(creep);
        }
        if (creep.memory.role == 'scout'){
            roleScout.run(creep);
        }
    }
    
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
    
    console.log("Currently " +Game.cpu.bucket + " in the bucket, with " + Game.cpu.tickLimit + " as the current tick limit.");
}