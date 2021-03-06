(function() {
  'use strict';

  module.exports = tchatRouter;

  tchatRouter['@singleton'] = true;
  tchatRouter['@require'] = ['lodash', 'services/getHtmlFile.service', 'services/sse.service', 'services/peerServer.service', 'services/config'];

  function tchatRouter(_, getHtml, sse, peerServer, config) {

    var clients = {};

    peerServer.on('disconnect', unregisterClient);

    return function(httpApp) {

      httpApp.put('/tchat/register/:nickname/:rtcId/:sseId', registerClient);
      httpApp.get(/^\/tchat/, indexRedirect);

    }

    ////////////////

    function indexRedirect(req, res, next) {
      if(typeof req.headers.accept === 'string' && req.headers.accept.indexOf('text/html') >= 0) {
        getHtml(config.htmlIndexPath)
          .then(function(data) {
            res.setHeader('Content-Type', 'text/html');
            res.send(data);
          });
      } else {
        next();
      }
    }

    function registerClient(req, res, next) {
      clients[req.params.rtcId] = {
        nickname: req.params.nickname,
        rtcId: req.params.rtcId,
        sseId: req.params.sseId
      };
      res.status(201);
      res.send('');

      var sanitizedClientList = _.cloneDeep(clients);
      for(var i in sanitizedClientList) {
        delete sanitizedClientList[i]['sseId'];
      }

      var sseEvent = sse.createEvent('list:change', sanitizedClientList);
      sse.sendToEveryone(sseEvent);
    }

    function unregisterClient(rtcId) {
      if(!_.isUndefined(clients[rtcId])) {
        delete clients[rtcId];

        var sseEvent = sse.createEvent('list:change', clients);
        sse.sendToEveryone(sseEvent);
      }
    }
  }

})();
