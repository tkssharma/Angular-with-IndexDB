#AngularJS and IndexedDB Demo

### simple CRUD operation on indexDB

IndexedDB is a way for you to persistently store data inside a user's browser. Because it lets you create web applications with rich query abilities regardless of network availability, your applications can work both online and offline. 

- Open a database.
- Create an object store in the database. 
- Start a transaction and make a request to do some database operation,   like adding or retrieving data.
- Wait for the operation to complete by listening to the right kind of DOM event.
- Do something with the results (which can be found on the request object).

```
use latest verion of node v5.x use nvm :)
npm install
npm run lite
open localhost:3000

```
Opening data connection to index DB

```
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

```
Adding Data to local store using angular form to school store

```
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
```
open your browser and go to http://localhost:3000/
in given html form enter data and submit form and check indexdb on chrome console resource tab

Contact
====================
[<img src="https://s3-us-west-2.amazonaws.com/martinsocial/MARTIN2.png" />](http://gennexttraining.herokuapp.com/)
[<img src="https://s3-us-west-2.amazonaws.com/martinsocial/github.png" />](https://github.com/tkssharma)
[<img src="https://s3-us-west-2.amazonaws.com/martinsocial/mail.png" />](mailto:tarun.softengg@gmail.com)
[<img src="https://s3-us-west-2.amazonaws.com/martinsocial/linkedin.png" />](https://www.linkedin.com/in/tkssharma)
[<img src="https://s3-us-west-2.amazonaws.com/martinsocial/twitter.png" />](https://twitter.com/tkssharma)