'use strict';

var utils = require("utils");
var blocks = require("blocks");

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

exports.playersMsg = function(msg)
{
  utils.players(function(player) {
    echo(player, msg.replace("{player-name}", player.name));
  });
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