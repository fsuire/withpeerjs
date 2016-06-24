#withpeerjs

/!\ This application is an experimentation. **It will never be finished or documented.**

Withpeerjs is a small angular/webRTC/sse/nodejs chat app, made in order to try the [PeerJS](https://github.com/peers/peerjs) library. 

##Setup

```shell
git clone ...
cd withpeerjs
npm install -g bower
npm i && bower i
gulp --dev
```

* Open two different browsers (or use a browser private session) and go, for both of them, to http://localhost:3000
* Choose nicknames in both browsers
* In one browser, use the "create a public room" functionnality
* In one browser, add a user to this new room (look at the upper right corner of the window)
* Begin a RTC chat conversation beetween the two browsers