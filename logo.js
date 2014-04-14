#!/usr/bin/env node

var fs = require('fs');
var builder = require('xmlbuilder');

// var offset = [500, 0];

function pathify (points) {
	return 'M' + points.map(function (arr) {
		return arr[0] + ' ' + arr[1]
	}).join(' L');
}

var radius = 430;
var points = [];
var paths = [];
for (var i = 0; i < 3; i++) {
	var t = 0.12;
	var v = 150/180*Math.PI;
	var w = 210/180*Math.PI;
	var x = 270/180*Math.PI;
	var y = -30/180*Math.PI;
	var r = 36;
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
// for (var i = 0; i < 360; i += 60) {
// 	points.push([radius*Math.cos((i+30)/180 * Math.PI), radius*Math.sin((i+30)/180 * Math.PI)])
// }

var Twidth = radius/7
var spread = Twidth/7;

var Tpaths = [
	[-Twidth*3 -spread, -Twidth*2],
	[-Twidth*3 -spread, -Twidth*.5],
	[-Twidth -spread, -Twidth*.5],
	[-Twidth -spread, Twidth*3.5],
	[-spread, Twidth*3.5],
	[-spread, -Twidth*2],
];

// <path stroke-width="10" stroke="black" fill="none"  d="M500 0 L500 1000 Z" />
var xml = builder.create({svg: [{
	'@height': "1000",
	'@width': "1000",
	'@viewBox': "0 0 1000 1000",
},
	{g: [{
		'@transform': "translate(500, 500)",
		'@stroke-width': 36,
		'@stroke-linecap': 'round',
		'@stroke': '#ff3333',
		'@fill': 'none',
	}].concat(paths)
	},
	{ path: [{
		'@transform': "translate(500, 480)",
		'@fill': '#ff3333',
		'@d': pathify(Tpaths) + ' Z'
	}]},
	{ path: [{
		'@transform': "translate(500, 480) scale(-1, 1)",
		'@fill': '#ff3333',
		'@d': pathify(Tpaths) + ' Z'
	}]},
]}).toString({pretty: true});

exports.svg = xml;

if (require.main == module) {
	if (process.argv.length < 3) {
		console.error('Usage: tessel-logo [svg|png|gif|jpg|pdf|html]');
	}

	switch (process.argv[2]) {
		case 'svg':
			console.log(xml);
			break;

		case 'html':
			var template = fs.readFileSync(__dirname + '/template.html', 'utf-8');
			console.log(template.replace('<!--svg-->', xml));
			break;

		case 'png':
		case 'gif':
		case 'jpg':
		case 'pdf':
			console.log('Rendering using phantomjs (make sure you have this installed)...')
			var rendersvg = require('rendersvg');
			rendersvg.render(xml, process.argv[2], function (err, data) {
				process.stdout.write(data);
			})
			break;

		default:
			console.error('Unknown format ', process.argv[2]);
			process.exit(1);
	}
}