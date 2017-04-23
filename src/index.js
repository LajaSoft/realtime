

function bindStandartFunctions(that) {
	that.setTimeout = that.setTimeout.bind(that);
	that.setInterval = that.setInterval.bind(that);
	that.clearTimeout = that.clearTimeout.bind(that);
	that.clearInterval = that.clearInterval.bind(that);
}
const defaultConfig = {};
const _deleted = Symbol('deleted');
class Realtimeout {
	constructor(config) {
		this._timeoutCounter = 0;
		this._intervalCounter = 0;
		this._timeLine = [];
		this._timeouts = new Map();
		this._intervals = new Map();
		this._promisedTicks = [];
		this.config = config || defaultConfig;
		if (!this.config.doNotBind) {
			bindStandartFunctions(this);
		}
		return this;
	}
	setTimeout(callback, time = 0) {
		throwNotFunction(callback);
		time = parseInt(time);
		this._timeLine[time] = this._timeLine[time] || new Set();
		const id = ++this._timeoutCounter;
		const worker = [callback, id];
		this._timeLine[time].add(worker);
		this._timeouts.set(id, [this._timeLine[time], worker]);
		return id;
	}
	setInterval(callback, time = 0) {
		throwNotFunction(callback);
		const id = ++this._intervalCounter;
		const worker = () => {
			if (!this._intervals.has(id)) {
				return;
			}
			this._intervals.set(id,[this.setTimeout(worker, time - 1)]);
			callback();
		}
		this._intervals.set(id,[this.setTimeout(worker, time)]);
		return id;

	}
	setTimeoutPromise(callback, time = 0) {
		let worker;
		const promise = new Promise((resolve, reject) => {
			worker = () => {
				Promise.resolve(callback()).then((...args)=>resolve.apply(null, args));
			}
			worker.__promise = {resolve, reject}
		});
		promise.timeoutId = this.setTimeout(worker, time);
		return promise;
	}
	clearTimeout(i) {
		if (i && this._timeouts.has(i)) {
			const timeout = this._timeouts.get(i);
			if (timeout[0]) {
				timeout[0].delete(timeout[1]);
				if (timeout[1][0].__promise) {
					timeout[1][0].__promise.reject();
				}
				timeout[1][0] === _deleted;
			}
			this._timeouts.delete(i);
		}
	}
	clearInterval(i) {
		clearTimeout(this._intervals.get(i));
		this._intervals.delete(i);
	}
	async nextTick() {
		const promise = this._promisedTicks.push(this._timeLine.shift());
		return await _nextTick(this);
	}
}
module.exports = {Realtimeout, realtimeout: new Realtimeout()};



async function _nextTick(that) {
		if (that._isBusy) {
			return that._isBusy;
		}
		that._isBusy = true;
		let workers;
		while (workers = that._promisedTicks.shift()) {
			await runWorkers(workers, that.config, that);
		}
		that._isBusy = false;
		if (that._promisedTicks.length) {
			await _nextTick(that);
		}
}

function throwNotFunction(test) {
		if (typeof test !== 'function') {
			test();
		}
}

async function runWorkers(workers, config, that) {
	for (let worker of workers) {
		if (worker[0] && worker[0] !== _deleted) {
			try {
				await worker[0]();
			} catch(e) {
				Promise.reject(e) // make it debuggable in chrome
			}
			that.clearTimeout(worker[1]);
		}
	}
}
