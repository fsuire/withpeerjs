angular.module("app.core").run(["$templateCache", function($templateCache) {$templateCache.put("error.html","<html><head><title>test</title><link rel=stylesheet type=text/css href=/assets/style/main.css></head><body><p class=error>Oooups ! File not found !</p></body></html>");
$templateCache.put("index.html","<!doctype html><html ng-app=app ng-strict-di><head><meta charset=utf-8><title>Tchat</title><base href=\"/\"></head><body><div ui-view class=content></div></body></html>");
$templateCache.put("app/tchat/tchat.html","<h1>Tchat</h1><hr><h2>Message List</h2><div><p ng-repeat=\"message in vm.messageList track by $index\">{{ message }}</p></div><hr><h2>Send a message:</h2><form name=message ng-submit=vm.sendMessageAction();><input type=text ng-model=vm.message> <input type=submit value=Send></form>");}]);
