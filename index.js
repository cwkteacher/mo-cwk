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

exports.random = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
