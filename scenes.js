/**
 * Module dependencies.
 */
var _ = require('lodash'),
  S = require('string');


function

// Object to represnt a setting
var Setting = function (location, time, sheltered) {
  this.location = location || null;
  this.time = time || null;
  this.sheltered = sheltered || null;
};

Setting.prototype = new Setting();

// Object to represent a scene
var Scene = function () {
    this.number = number || null;
    this.setting = setting || null;
    this.characters = characters || [];
    this.pos = pos || null; // Parts of speech
    this.text = text || null;
    this.genre = genre || this.classify();

    this.classify = function () {
      var genre = 'Unknown';

      // ...

      return genre;
    }
};

Scene.prototype = new Scene();

exports.generateScenes = function (script) {

};

exports.classifyScene = function (scene) {

};

