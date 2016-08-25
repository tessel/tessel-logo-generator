#!/usr/bin/env node

var fs = require('fs');
var builder = require('xmlbuilder');

function pathify (points) {
  return 'M' + points.map(function (arr) {
    return arr[0] + ' ' + arr[1]
  }).join(' L');
}

var radius = 435;
var points = [];
var paths = [];
for (var i = 0; i < 3; i++) {
  var t = 0.10;
  var v = 150/180*Math.PI;
  var w = 210/180*Math.PI;
  var x = 270/180*Math.PI;
  var y = -30/180*Math.PI;
  var r = 34;
  paths.push({path: {
    '@transform': 'rotate(' + (i*(360/3)) + ')',
    '@d': 'M 0 -'+radius+' m -' + r+', 0 a '+r+','+r+' 0 1,0 '+r*2+',0 a '+r+','+r+' 0 1,0 -'+r*2+',0'
    + pathify([
      [radius*Math.cos(x)-(r*Math.cos(y)), radius*Math.sin(x)-(r*Math.sin(y))],
      [radius*Math.cos(w), radius*Math.sin(w)],
      [radius*Math.cos(v), radius*Math.sin(v)*t],
    ])
  }})
}

var Twidth = radius/7
var spread = Twidth/7;

var Tpaths = [
  [-Twidth*3 -spread, -Twidth*1.9],
  [-Twidth*3 -spread, -Twidth*.5],
  [-Twidth -spread, -Twidth*.5],
  [-Twidth -spread, Twidth*3.5],
  [-spread, Twidth*3.5],
  [-spread, -Twidth*1.9],
];

// <path stroke-width="10" stroke="black" fill="none"  d="M500 0 L500 1000 Z" />
var xml = builder.create({svg: [{
  '@height': "1000",
  '@width': "1000",
  '@viewBox': "0 0 1000 1000",
},
  // Outer ring
  {g: [
    {
      '@transform': "translate(500, 510)",
      '@stroke-width': 34,
      '@stroke-linecap': 'round',
      '@stroke': '#ff4444',
      '@fill': 'none',
    },
  ].concat(paths)
  },

  // Alignment rectangle
  {
    rect: { "@x": "0", "@y": "0", "@width": "1000", "@height": "1000", "@fill": "none", },
  },

	// Inner T
  { path: [{
    '@transform': "translate(500, 490)",
    '@fill': '#ff4444',
    '@d': pathify(Tpaths) + ' Z'
  }]},

	// Inner T (flipped)
  { path: [{
    '@transform': "translate(500, 490) scale(-1, 1)",
    '@fill': '#ff4444',
    '@d': pathify(Tpaths) + ' Z'
  }]},
]}).toString({pretty: true});

exports.svg = xml;

if (require.main == module) {
  if (process.argv.length < 3) {
    console.error('Usage: tessel-logo-generator');
    console.error('')
    console.error('Outputs an SVG of the Tessel logo.');
    process.exit(1);
  }

  console.log(xml);
}
