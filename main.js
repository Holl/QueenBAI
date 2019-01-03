var roleHarvester = require('bee.harvester');
var roleScout = require('bee.scout');
var roleCarpenderBee = require('bee.carpender');
var roleWorker = require("bee.worker");
var roleHauler = require("bee.hauler");
var roleDefender = require("bee.defender");
var roleWorker = require("bee.worker");
var roleTower = require("bee.tower");
var roleCapture = require("bee.capture");

var scan = require('queen.scan');
var create = require('queen.creator');

module.exports.loop = function () {
    console.log("~~~~~~~~~~"+ Game.time+"~~~~~~~~~~");
    
    creepObject = {};
    
    // Because creeps can belong to a spawn even though the creep is in a different room,
    // this checks all the creeps and organizes them by spawn.
    for (creep in Game.creeps){
        if (creepObject[Game.creeps[creep].memory.spawn]){
            creepObject[Game.creeps[creep].memory.spawn].push(Game.creeps[creep]);
        }
        else{
            creepObject[Game.creeps[creep].memory.spawn] = [Game.creeps[creep]];
        }
    };

    var scanData = scan(creepObject);
    
    for (var i=0; i < scanData['localData'].length;  i++){
        // Run the main spawning logic:
        create(scanData['localData'][i]);
        // Run the orders:
        for (var y=0; y< creepObject[scanData['localData'][i]['spawnName']].length; y++){
            creep = creepObject[scanData['localData'][i]['spawnName']][y];
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
            if (creep.memory.role == 'capture'){
                roleCapture.run(creep);
            }
        }
        

        // Room tower orders:
        var towers = Game.spawns[scanData['localData'][i]['spawnName']].room.find(FIND_STRUCTURES,
            {filter: {structureType: STRUCTURE_TOWER}});
        for (var y=0; y < towers.length; y++){
            roleTower.run(towers[y]);
        }
    }
    
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
    
    console.log("Currently " +Game.cpu.bucket + " in the bucket, with " + Game.cpu.tickLimit + " as the current tick limit.");
}