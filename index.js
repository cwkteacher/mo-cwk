'use strict';

var utils = require("utils");
var blocks = require("blocks");
var drone = require("drone");
var events = require("events");

function addArmor(stacks, material) {
  var material = org.bukkit.Material[material];
  var stack = new org.bukkit.inventory.ItemStack(material);

  stacks.push(stack);
}

function stripArmor(player) {
    player.getInventory().setArmorContents(null);
}

// Equip type of armor, type must be like "DIAMOND" "GOLD" etc.
function equipArmor(player, type) {
  var stacks = [];

  addArmor(stacks, type + '_BOOTS');
  addArmor(stacks, type + '_LEGGINGS');
  addArmor(stacks, type + '_CHESTPLATE');
  addArmor(stacks, type + '_BLOCK');

  player.getInventory().setArmorContents(stacks);
}

exports.equipArmor = equipArmor;
exports.stripArmor = stripArmor;

exports.pvpDamage = function(func) {
  events.entityDamageByEntity(function(e, cancel) {
   console.log("entityDamageByEntity!");

    var EntityType = Packages.org.bukkit.entity.EntityType;

      var whoWasHit = e.getEntity();
      var whoHit = e.getDamager();

      if (whoHit.getType() == EntityType.PLAYER 
        && whoWasHit.getType() == EntityType.PLAYER) 
      {
          console.log("thisentity" + this);
          func.call(this, whoHit, whoWasHit, cancel);
      }
  });
}

drone.prototype.arena = function(block, width, height, depth)
{
  var halfWidth = width/2;
  var halfDepth = depth/2;

  this
    .chkpt('arena')
    .back(halfDepth)
    .left(halfWidth)
    .box0(block, width, height, depth)
    .box(block, width, 1, depth)
    .fwd()
    .right()
    .up()
    .box(blocks.air, width-2, height-2, depth-2)
    .move('arena');

  return this;
}

if (!Math.trunc) {
  Math.trunc = function(v) {
    v = +v;
    return (v - v % 1)   ||   (!isFinite(v) || v === 0 ? v : v < 0 ? -0 : 0);
  };
}

var _udef = function(variable, defaultValue) {
  return (typeof variable == 'undefined') 
    ? defaultValue
    : variable;
}


exports.udef = _udef;

// Get a reference to a random rainbowblock
exports.rainbowBlock = function() {
  var rainbowItem = _random(0,blocks.rainbow.length-1);
  return blocks.rainbow[rainbowItem];
}

/* Get a random rainbow block
 */
exports.placeRainbowBlock = function(drone) {
  var rainbowItem = _random(0,blocks.rainbow.length-1);
  drone.box(blocks.rainbow[rainbowItem],1,1,1,true);  // don't schedule
}

exports.randomColorKey = function() {
	var colorNames = Object.keys(require("block-colors"));
	var colorIndex = Math.floor(Math.random()*colorNames.length);
	return colorNames[colorIndex];
}

Number.prototype.pad = function(count) {
   var num = this.valueOf();
   var ret = "";
   for (var i = 0; i < count - num.toString().length; i++) {
       ret += "0";
   }
   ret += num;
   return ret;
}

var _random = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
exports.random = _random;
 
exports.requireOp = function(player) {
  if ( !isOp(player) ) {
      throw player.name + " is not op";
  }  
}

exports.requireParameters = function(parameters, minimum) {
  if (parameters.length < minimum) {
    throw player.name + ' missing required parameter';
  }
}

// Return a new drone.
exports.drone = function(arg1)
{
  var drone = new Drone(arg1);
  // Move out of prototype.. (consider fixing in open source)
  // Having in prototype makes it a static class variable so
  // the drone namespace gets all checkpoints
  drone._checkpoints = {};  
  return drone;
}

exports.playersMsg = function(msg)
{
  utils.players(function(player) {
    echo(player, msg.replace("{player-name}", player.name));
  });
}

// Get the [blocktype:data] formatted string of the current
// block the drone is positioned on.
// @returns [string] matches the values from the blocks 
// used in scriptcraft

    /* Messed around for a bunch here trying to use the
      current API from spigot but just didn't cooperate
      so gave up on getBlockData and used depracated getData
      which does work.. go figure??
      Seems to me the bukkit api around this stuff is
      a big mess and could use a decent wrapper to
      clean it up.

      These functions also may be useful in future to split
      the data apart? 
      function getBlockType(block) {
        return playerDrone.getBlockIdAndMeta(block)[0];
      }

      function getBlockColor(block) {
        return playerDrone.getBlockIdAndMeta(block)[1];
      }
    */
exports.getDroneBlockId = function(drone) {
  var id = "";
  var blockType = drone.getBlock().getType();
  console.log(blockType);
  if (typeof blockType != "undefined") {
    var tmp = drone.getBlockIdAndMeta(blockType);
    if (typeof tmp != "undefined")
     id = id + tmp[0];
  }
  var data = drone.getBlock().getData();
  if (data) {
    id = id + ":" + data;
  }
  return id;
}

/*
 * moveRandom - Move the drone a random maximum distance and 
 * at an optional depth (depth default is 0 which is on top of the higher
 * block at the location
 * @param drone - the drone to move
 * @param minDistance - the minimum distance to move the drone
 * @param maxDistance - the maximum distance to move the drone
 * @param [depth] - optional, the depth to go down
 */
exports.moveRandom = function(drone, minDistance, maxDistance, depth) {
    var angle = Math.random() * Math.PI * 2;
    var distance = Math.random() * (maxDistance - minDistance) + minDistance;

    // console.log("angle:" + angle + ", distance:" + distance);
    drone
      .right(Math.sin(angle)*distance)
      .fwd(Math.cos(angle)*distance);

    // Handle strange positioning of drone that doesn't
    // match where it puts a block exactly (it seems
    // to trun the location instead of floor which is
    // what normal locations do)
    drone.x = Math.trunc(drone.x);
    drone.z = Math.trunc(drone.z);

    drone.y = drone.player.getWorld().getHighestBlockYAt(drone.getLocation());

    depth = _udef(depth, 0);
    for (var i = 0; i<depth; i++) drone.down();
}