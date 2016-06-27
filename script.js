// Code goes here
var app = angular.module('myApp', []);



app.factory('questionFecthService' , function($http,$q){
    var questionFecthService = {};

   questionFecthService.fetchQuestions = function () {
      var deferredObject = $q.defer();

      $http.get('questions.json')
      .then(function(result) {
        deferredObject.resolve(result);
        // cacheSession();
      }, function(errorMsg) {
        deferredObject.reject(errorMsg);
      });

      return deferredObject.promise;

    };
    return questionFecthService; 

});
app.factory('indexedDBDataSvc', function ($window, $q) {
    var indexedDB = $window.indexedDB;
    console.log(indexedDB);
    var db = null;
    var lastIndex = 0;

    var open = function () {
        var deferred = $q.defer();
        var version = 1;
        var request = indexedDB.open("SchoolData", version);

        request.onupgradeneeded = function (e) {
            db = e.target.result;

            e.target.transaction.onerror = indexedDB.onerror;

            if (db.objectStoreNames.contains("School")) {
                db.deleteObjectStore("School");
            }

            var store = db.createObjectStore("School", {
                keyPath: "id"
            });
        };

        request.onsuccess = function (e) {
            db = e.target.result;
            deferred.resolve();
        };

        request.onerror = function () {
            deferred.reject();
        };

        return deferred.promise;
    };

    var getSchools = function () {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["School"], "readwrite");
            var store = trans.objectStore("School");
            var school = [];

            // Get everything in the store;
            var keyRange = IDBKeyRange.lowerBound(0);
            var cursorRequest = store.openCursor(keyRange);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                if (result === null || result === undefined) {
                    deferred.resolve(school);
                } else {
                    school.push(result.value);
                    if (result.value.id > lastIndex) {
                        lastIndex = result.value.id;
                    }
                    result.
                    continue ();
                }
            };

            cursorRequest.onerror = function (e) {
                console.log(e.value);
                deferred.reject("Something went wrong!!!");
            };
        }

        return deferred.promise;
    };

    var deleteSchool = function (id) {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["School"], "readwrite");
            var store = trans.objectStore("School");

            var request = store.delete(id);

            request.onsuccess = function (e) {
                deferred.resolve();
            };

            request.onerror = function (e) {
                console.log(e.value);
                deferred.reject("school item couldn't be deleted");
            };
        }

        return deferred.promise;
    };

    var addSchool = function (schoolname,location) {
        var deferred = $q.defer();

        if (db === null) {
            deferred.reject("IndexDB is not opened yet!");
        } else {
            var trans = db.transaction(["School"], "readwrite");
            var store = trans.objectStore("School");
            lastIndex++;
            var request = store.put({
                "id": lastIndex,
                "schoolname": schoolname ,
                "location": location
            });

            request.onsuccess = function (e) {
                deferred.resolve();
            };

            request.onerror = function (e) {
                console.log(e.value);
                deferred.reject("School item couldn't be added!");
            };
        }
        return deferred.promise;
    };

    return {
        open: open,
        getSchools: getSchools,
        addSchool: addSchool,
        deleteSchool: deleteSchool
    };

});

app.controller('SchoolController', function ($window, indexedDBDataSvc , questionFecthService) {
    var vm = this;
    vm.school = [];


         questionFecthService.fetchQuestions().then(function (result) {
            vm.schoolQuestionData = result.data;
        }, function (err) {
            $window.alert(err);
        });
    

    vm.refreshList = function () {
        indexedDBDataSvc.getSchools().then(function (data) {
            vm.school = data;
        }, function (err) {
            $window.alert(err);
        });
    };

    vm.addSchool = function () {
        indexedDBDataSvc.addSchool(vm.schoolname,vm.location).then(function () {
            vm.refreshList();
            vm.schoolname = "";
            vm.location = "";
        }, function (err) {
            $window.alert(err);
        });
    };

    vm.deleteSchool = function (id) {
        indexedDBDataSvc.deleteSchool(id).then(function () {
            vm.refreshList();
        }, function (err) {
            $window.alert(err);
        });
    };

    function init() {
        indexedDBDataSvc.open().then(function () {
            vm.refreshList();
        });
    }

    init();
});