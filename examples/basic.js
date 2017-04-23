const {Realtimeout, realtimeout} = require('../dist/index');
//var realtimeout = new Realtimeout();
const {
	setTimeout,
	setInterval,
	clearTimeout,
	clearInterval
} = realtimeout;
setTimeout(()=>console.log('hello world'), 200);
clearTimeout(setTimeout(()=>console.log('hello world1'), 20));
setTimeout(()=>{
	let c;
	for (var i = 0;i<1000000;i++) {
		c=i^2 * Math.sin(c);
	}
	console.log(c);
	return c;
}, 20);


setTimeout(() =>
	new Promise(resolve => {
		global.setTimeout(()=>{
			console.log('async');
			resolve();
		}, 1000);
	})
);


var interval = setInterval(()=>console.log('interval'), 10);

setTimeout(() => clearInterval(interval), 150);

realtimeout.setTimeoutPromise(()=>console.log('promisified'), 170).then(()=>console.log('resolved'));
var promised = realtimeout.setTimeoutPromise(()=>console.log('promisified1'), 190)
promised.then(()=>console.log('resolved1')).catch((...args)=>console.log('rejected1', args));
setTimeout(()=>clearTimeout(promised.timeoutId), 100);

async function run() {
	for (var i=0;i<210;i++) {
		console.log(i);
		await realtimeout.nextTick();
	}
}


run();
