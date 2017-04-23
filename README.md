# synchronised timeout functions in js
make synchronised setTimeout/setInterval on virtual timeline

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Usage](#usage)
	- [additional features](#additional-features)
	- [options](#options)
	- [compatibility](#compatibility)

<!-- /TOC -->

## Usage

    const rt = require('realtimeout');
    const Realtimeout = rt.Realtimeout; // class to create private timeline
---
Application wide  instance:

    const realtimeout = rt.realtimeout;

Local instance:

    const realtimeout = var realtimeout = new Realtimeout({options});

use them as standard js function:

    const {
      setTimeout,
      setInterval,
      clearTimeout,
      clearInterval
    } = realtimeout;

make a timeline tick

    realtimeout.nextTick(); //--> Promise


### additional features

if callback function return a promise, worker will resolve promise before doing next step

    const fs = require('fs-promise');
    setTimeout(() =>
      fs.readFile('file.txt', 'utf-8').then(text=>console.log(text))
    , 10);
    setTimeout(() => console.log("done"), 11);
    for (let i=0;i<100;i++) {
      nextTick();
    }

will type

    file content
    done

`realtimeout.setTimeoutPromise()` - return promise, reject if cleared, timeoiut id will be in `timeoutId` property of returned object

    const promised = realtimeout.setTimeoutPromise(
      ()=>console.log('promisified'), 170).then(()=>console.log('resolved')
    );
    realtimeout.setTimeout(()=>realtimeout.clearTimeout(promised.timeoutId), 100);

### options
    {
      // to bind or not to bind standard js methods
      // (need bind if you plan to call them without object);
      doNotBind: false
    }

### compatibility
if you need to run it in browser, use `require('realtimeout/browser')`;
