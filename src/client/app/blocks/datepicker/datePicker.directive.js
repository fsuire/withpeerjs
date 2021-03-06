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
      scope: {
        dateModel: '='
      },
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

    vm.selectedDate = null;
    vm.date = {};
    vm.classShown = false;

    var weekdays = moment.weekdays();
    weekdays.push(weekdays.shift());

    vm.locale = {
      weekdays: weekdays
    };

    vm.cancelAction = cancelAction;
    vm.okAction = okAction;
    vm.hideAction = hideAction;
    vm.previousMonthAction = previousMonthAction;
    vm.nextMonthAction = nextMonthAction;
    vm.previousYearAction = previousYearAction;
    vm.nextYearAction = nextYearAction;
    vm.selectDateAction = selectDateAction;

    $element.on('click', showAction);

    _init();

    ////////////////

    function _init() {
      if (
        vm.dateModel
        && !moment.isMoment(vm.dateModel)
        && angular.isDate(vm.dateModel)
      ) {
        vm.dateModel = moment(vm.dateModel);
      } else if(!vm.dateModel || !moment.isMoment(vm.dateModel)) {
        vm.dateModel = moment(new Date());
      }

      vm.selectedDate = vm.dateModel.clone();
      actualizeDate(null, vm.selectedDate);
    }

    ////////////////

    function actualizeDate(dateModel, momentDate) {
      dateModel = dateModel || {
        momentDate: null,
        matrice: []
      };

      if(momentDate) {
        dateModel.momentDate = momentDate.clone();
      }

      if(!dateModel.momentDate) {
        dateModel.momentDate = moment(new Date());
      }
      createMatrice(dateModel);

      vm.date = dateModel;
    }

    ////////////////

    function cancelAction($event) {
      $event.stopPropagation();
      vm.classShown = false;
    }

    function okAction($event) {
      $event.stopPropagation();
      vm.classShown = false;
      vm.dateModel = vm.selectedDate.clone();
    }

    function showAction($event) {
      $event.stopPropagation();
      if(!vm.classShown) {
        $scope.$apply(function() {
          vm.classShown = true;
        });
      }
    }

    function hideAction($event) {
      $event.stopPropagation();
      if(vm.classShown === true) {
        vm.classShown = false;
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

    function selectDateAction(momentDate, prohibitedClick) {
      if(!prohibitedClick) {
        vm.selectedDate = momentDate.clone();
        actualizeDate(null, vm.selectedDate);
      }
    }

    ////////////////////////////////////////
    // RANGER CE QUI SUIT DANS UN SERVICE //
    ////////////////////////////////////////

    function createMatrice(dateModel) {

      var matrice = [];
      var dateCursor = dateModel.momentDate.clone();
      var referenceMonth = dateCursor.month();
      var nextMonth = referenceMonth + 1;
      if(nextMonth > 11) {
        nextMonth = 0;
      }

      dateCursor.startOf('month');
      dateCursor.day(1);

      var weekIndex = 0;
      matrice[weekIndex] = [createWeekObject(dateCursor)];
      while(dateCursor.month() !== nextMonth) {
        var type = (dateCursor.month() === referenceMonth) ? 'currentMonthDay' : 'day';
        matrice[weekIndex].push(createDayObject(dateCursor, type));
        dateCursor.add(1, 'day');
        if(dateCursor.day() === 1) {
          weekIndex++;
          matrice[weekIndex] = [createWeekObject(dateCursor)];
        }
      }
      while(matrice[weekIndex].length !== 8) {
        matrice[weekIndex].push(createDayObject(dateCursor, 'day'));
        dateCursor.add(1, 'day');
      }

      dateModel.matrice = matrice;

      function createWeekObject(day) {
        day = day.clone();
        day.add(1, 'day');

        return {
          type: 'week',
          value: day.week(),
          selected: (day.week() === vm.selectedDate.week() && day.year() === vm.selectedDate.year()) ? true : false,
          date: day
        };
      }

      function createDayObject(day, type) {
        var selected = (
          day.format('DD') === vm.selectedDate.format('DD')
          && day.month() === vm.selectedDate.month()
          && day.year() === vm.selectedDate.year()
        ) ? true : false;

        return {
          type: type,
          value: day.format('DD'),
          selected: selected,
          date: day.clone()
        };
      }
    }

  }

})();
