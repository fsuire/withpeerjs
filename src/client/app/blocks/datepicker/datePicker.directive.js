(function() {
  'use strict';

  angular
    .module('blocks.datepicker')
    .directive('datePicker', datePickerDirective);

  datePickerDirective.$inject = ['$http', '$compile'];

  function datePickerDirective($http, $compile) {

    return {
      restrict: 'E',
      link: link,
      controller: DatePickerDirectiveController,
      bindToController: true,
      controllerAs: 'datepicker'
    };

    function link(scope, element, attributes) {
      element[0].style.cursor = 'pointer';

      $http.get('app/blocks/datepicker/datepicker.html').then(function(response) {
        element.append($compile(response.data)(scope));
      });

    }

  }



  DatePickerDirectiveController.$inject = ['$scope', '$element', 'moment'];

  function DatePickerDirectiveController($scope, $element, moment) {
    var vm = this;

    vm.date = {};
    vm.classShown = false;

    vm.ok = okAction;
    vm.previousMonthAction = previousMonthAction;
    vm.nextMonthAction = nextMonthAction;
    vm.previousYearAction = previousYearAction;
    vm.nextYearAction = nextYearAction;

    $element.on('click', showAction);

    ////////////////

    function initializeDate(date) {
      var momentDate = moment(date);
      date = {
        momentDate: momentDate,
        locale: {
          weekdays: moment.weekdays()
        }
      };
      actualizeDate(date);
    }

    function actualizeDate(date) {
      var momentDate = date.momentDate;
      date.month = momentDate.format('MMMM');
      date.year = momentDate.format('YYYY');
      date.matrice = createMatrice(date);

      vm.date = date;
    }

    function createMatrice(date) {
      var matrice = [];
      var referenceDay = date.momentDate.clone();
      var d = date.momentDate.clone().startOf('month');
      var currentMonth = d.month();
      var nextMonth = currentMonth + 1;
      var matriceWeekCounter = 0;

      if(d.day() > 0) {
        d.subtract(d.day(), 'days');
      }

      matrice[matriceWeekCounter] = [createWeekObject(d, referenceDay)];
      while(nextMonth > d.month()) {

        matrice[matriceWeekCounter].push(createDayObject(d, referenceDay));

        d.add(1, 'day');
        if(d.day() === 0) {
          matriceWeekCounter++;
          matrice[matriceWeekCounter] = [createWeekObject(d, referenceDay)];
        }

      }
      while(matrice[matriceWeekCounter].length !== 8) {
        matrice[matriceWeekCounter].push(createDayObject(d, referenceDay));
        d.add(1, 'day');
      }

      return matrice;

      function createWeekObject(day, referenceDay) {
        return {
          type: 'week',
          value: day.week() + 1,
          selected: (day.week() === referenceDay.week()) ? true : false
        };
      }

      function createDayObject(day, referenceDay) {
        return {
          type: (day.month() !== referenceDay.month()) ? 'day' : 'currentMonthDay',
          value: day.format('DD'),
          selected: (day.format('DD') === referenceDay.format('DD')) ? true : false
        };
      }
    }



    ////////////////

    function okAction() {
      console.log('OK !!');
      console.log($element);
    }

    function showAction() {
      if(!vm.classShown) {
        $scope.$apply(function() {
          initializeDate(new Date());
          vm.classShown = true;
        });
      }
    }

    function previousMonthAction() {
      vm.date.momentDate.subtract(1, 'month');
      actualizeDate(vm.date);
    }

    function nextMonthAction() {
      vm.date.momentDate.add(1, 'month');
      actualizeDate(vm.date);
    }

    function previousYearAction() {
      vm.date.momentDate.subtract(1, 'year');
      actualizeDate(vm.date);
    }

    function nextYearAction() {
      vm.date.momentDate.add(1, 'year');
      actualizeDate(vm.date);
    }

  }

})();
