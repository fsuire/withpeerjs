#withpeerjs

/!\ This application is an experimentation. **It will not be finished or documented.**

withpeerjs is a small angular/webRTC/sse/nodejs chat app, made in order to try the [PeerJS](https://github.com/peers/peerjs) library. 

##Setup

```shell
git clone https://github.com/fsuire/withpeerjs.git
cd withpeerjs
npm install -g bower
npm i && bower i
gulp --dev
```

* Open two different browsers (or use a two different sessions - with one private session - on the same browser) and go, for both of them, to http://localhost:3000
* Choose nicknames in both browsers or sessions
* In one browser, use the "create a public room" functionnality. A public room window will be opened in both browsers
* In one browser, add a user to this new room (with the button on the upper right corner of the room window)
* Begin a RTC chat conversation between the two browsers
