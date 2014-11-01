var nodejs = (typeof window === 'undefined');
if (nodejs) {
	AgentSmith = require('../src/agent_smith');
	require('../src/agent_smith_cl');
}
var $M = AgentSmith.Matrix;

var nearlyEquals = function(a, b) {
	var tmp = a - b;
	return -0.01 < tmp && tmp < 0.01;
};

var tests = {
	checkEquals : function() {
		var a = new $M(3, 7);
		var b = new $M(3, 7);
		for (var i = 0; i < a.length; i++) {
			var tmp = Math.random();
			a.data[i] = tmp;
			b.data[i] = tmp;
		}
		if (a.nearlyEquals(b) !== true) {
			return false;
		}
		a.set(0, 0, -100);
		if (a.nearlyEquals(b) === true) {
			return false;
		}
		return true;
	},
	checkMap : function() {
		var a = $M.fromArray([
  			[1, 2, 3],
  			[4, 5, 6]
  		]);
  		return a.map(function(datum) { return datum *2; }).equals(
  			$M.fromArray([
  				[2, 4, 6],
  				[8, 10, 12]
  			])
  		);
	},
	checkAdd : function() {
		var a = new $M(3, 7);
		var b = new $M(3, 7);
		a.random();
		b.random();
		var c1 = $M.add(a, b);
		for (var i = 0; i < a.length; i++) {
			if (!nearlyEquals(c1.data[i], a.data[i] + b.data[i])) {
				return false;
			}
		}
		var c2 = a.clone().add(b);
		for (var i = 0; i < a.length; i++) {
			if (!nearlyEquals(c2.data[i], a.data[i] + b.data[i])) {
				return false;
			}
		}
		return true;
	},
	checkSub : function() {
		var a = new $M(3, 7);
		var b = new $M(3, 7);
		a.random();
		b.random();
		var c1 = $M.sub(a, b);
		for (var i = 0; i < a.length; i++) {
			if (!nearlyEquals(c1.data[i], a.data[i] - b.data[i])) {
				return false;
			}
		}
		var c2 = a.clone().sub(b);
		for (var i = 0; i < a.length; i++) {
			if (!nearlyEquals(c2.data[i], a.data[i] - b.data[i])) {
				return false;
			}
		}
		return true;
	},
	checkMulEach : function() {
		var a = new $M(3, 7);
		var b = new $M(3, 7);
		a.random();
		b.random();
		var c1 = $M.mulEach(a, b);
		for (var i = 0; i < a.length; i++) {
			if (!nearlyEquals(c1.data[i], a.data[i] * b.data[i])) {
				return false;
			}
		}
		var c2 = a.clone().mulEach(b);
		for (var i = 0; i < a.length; i++) {
			if (!nearlyEquals(c2.data[i], a.data[i] * b.data[i])) {
				return false;
			}
		}
		return true;
	},
	checkDot : function() {
		var a = new $M(3, 7);
		var b = new $M(3, 7);
		a.random();
		b.random();
		var c1 = $M.dot(a, b);
		var sum1 = 0.0;
		for (var i = 0; i < a.length; i++) {
			sum1 += a.data[i] * b.data[i];
		}
		if (sum1 !== c1) { return false; }
		var c2 = a.clone().dot(b);
		var sum2 = 0.0;
		for (var i = 0; i < a.length; i++) {
			sum2 += a.data[i] * b.data[i];
		}
		if (sum2 !== c2) { return false; }
		return true;
	},
	checkMul : function() {
		var a = $M.fromArray([
			[1, 2, 3],
			[4, 5, 6]
		]);
		var b = $M.fromArray([
			[1, 2, 1],
			[3, 4, 0],
			[5, 6, 0]
		]);
		return 	$M.mul(a, b).equals(
			$M.fromArray([
				[22, 28, 1],
				[49, 64, 4]
			])
		)
		&&
		a.mul(b).equals(
			$M.fromArray([
				[22, 28, 1],
				[49, 64, 4]
			])
		);
	},
	checkTimes : function() {
		var a = $M.fromArray([
			[1, 2, 3],
			[4, 5, 6]
		]);
		return a.times(2).equals(
			$M.fromArray([
				[2, 4, 6],
				[8, 10, 12]
			])
		);
	},
};

var cl_tests = {
	checkAddCl : function() {
		var a = new $M(10, 10);
		a.random();
		var b = new $M(10, 10);
		b.random();
		return $M.CL.add(a, b).nearlyEquals($M.add(a, b));
	},
};

var start_tests = function(tests) {
	var success = 0;
	Object.keys(tests).forEach(function (test_name) {
		var start_time = (new Date()).getTime();
		var result = false;
		console.log('######## test ' + test_name + ' ########');
		try {
			var result = tests[test_name]();
		} catch (exception) {
			console.log('exception catched');
			console.log(exception);
			throw exception;
		} finally {
			console.log(result);
			console.log('elapsed time : ' + ((new Date()).getTime() - start_time) + ' ms');
			if (result) {
				success++;
			}
		};
	});
	console.log();
	console.log(success + ' / ' + Object.keys(tests).length + ' test cases succeeded.');
	console.log();
};

console.log('===================== start tests =====================');
start_tests(tests);
if (typeof $M.CL !== 'undefined') {
	console.log('===================== start tests for webCL =====================');
	start_tests(cl_tests);
}