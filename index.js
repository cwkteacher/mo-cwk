'use strict';

var utils = require("utils");

exports.firstPlayer = function firstPlayer(){
  return utils.players()[0];
};

exports.firstDrone = function firstDrone() {
	return new Drone(firstPlayer());
}

exports.udef = function(variable, defaultValue) {
	return (typeof variable == 'undefined') 
		? defaultValue
		: variable;
}

exports.randomColorKey = function() {
	var colorNames = Object.keys(require("block-colors"));
	var colorIndex = Math.floor(Math.random()*colorNames.length);
	return colorNames[colorIndex];
}

Number.prototype.pad = function (count) {
   var num = this.valueOf();
   var ret = "";
   for (var i = 0; i < count - num.toString().length; i++) {
       ret += "0";
   }
   ret += num;
   return ret;
}
