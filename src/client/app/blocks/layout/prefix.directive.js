(function() {
  'use strict';

  angular
    .module('blocks.layout')
    .directive('prefixIcon', prefixIconDirective);

  prefixIconDirective.$inject = ['$document'];

  function prefixIconDirective($document) {

    return {
      restrict: 'A',
      link: link
    };

    function link(scope, element, attrs) {
      var _focusableElement = ['INPUT'];

      var _element = element[0];
      var _rootElement = _element.parentElement;
      var _prefixElement = $document[0].createElement('prefix-icon');

      _prefixElement.setAttribute('icon', attrs.prefixIcon);

      _rootElement.insertBefore(_prefixElement, _element);
      _rootElement.removeChild(_element);
      _prefixElement.appendChild(_element);

      if(_focusableElement.indexOf(_element.tagName) !== -1) {
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

})();
