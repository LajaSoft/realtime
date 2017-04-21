const rt = require('../index');
const Realtime = rt.Realtime;
const realtime = rt.realtime;
//var realtime = new Realtime();
const setTimeout = realtime.setTimeout;
const setInterval = realtime.setInterval;
const clearInterval = realtime.clearInterval;
const clearTimeout = realtime.clearTimeout;
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

realtime.setTimeoutPromise(()=>console.log('promisified'), 170).then(()=>console.log('resolved'));
var promised = realtime.setTimeoutPromise(()=>console.log('promisified1'), 190)
promised.then(()=>console.log('resolved1')).catch((...args)=>console.log('rejected1', args));
setTimeout(()=>clearTimeout(promised.timeoutId), 100);

async function run() {
	for (var i=0;i<210;i++) {
		console.log(i);
		await realtime.nextTick();
	}
}


run();
