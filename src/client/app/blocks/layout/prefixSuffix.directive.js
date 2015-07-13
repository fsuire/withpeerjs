(function() {
  'use strict';

  var FOCUSABLE_ELEMENTS = ['INPUT'];

  angular
    .module('blocks.layout')
    .directive('prefixIcon', prefixIconDirective)
    .directive('suffixIcon', suffixIconDirective);

  ////////////////

  prefixIconDirective.$inject = ['$document'];

  function prefixIconDirective($document) {

    return {
      restrict: 'A',
      link: link
    };

    function link(scope, element, attrs) {
      var _element = element[0];
      var _rootElement = _element.parentElement;
      var _prefixElement = $document[0].createElement('prefix-icon');

      _prefixElement.classList.add(attrs.prefixIcon);

      _rootElement.insertBefore(_prefixElement, _element);
      _rootElement.removeChild(_element);
      _prefixElement.appendChild(_element);

      if(FOCUSABLE_ELEMENTS.indexOf(_element.tagName) !== -1) {
        _prefixElement.addEventListener('click', function() {
          _element.focus();
        });
        _element.addEventListener('focus', function() {
          _prefixElement.classList.add('has-focus');
        });
        _element.addEventListener('blur', function() {
          _prefixElement.classList.remove('has-focus');
        });
      }
    }

  }

  ////////////////

  suffixIconDirective.$inject = ['$document'];

  function suffixIconDirective($document) {

    return {
      restrict: 'A',
      link: link
    };

    function link(scope, element, attrs) {
      var _element = element[0];
      var _rootElement = _element.parentElement;
      var _suffixElement = $document[0].createElement('suffix-icon');

      _suffixElement.classList.add(attrs.suffixIcon);

      _rootElement.insertBefore(_suffixElement, _element);
      _rootElement.removeChild(_element);
      _suffixElement.appendChild(_element);

      if(FOCUSABLE_ELEMENTS.indexOf(_element.tagName) !== -1) {
        _suffixElement.addEventListener('click', function() {
          _element.focus();
        });
        _element.addEventListener('focus', function() {
          _suffixElement.classList.add('has-focus');
        });
        _element.addEventListener('blur', function() {
          _suffixElement.classList.remove('has-focus');
        });
      }
    }

  }

})();
