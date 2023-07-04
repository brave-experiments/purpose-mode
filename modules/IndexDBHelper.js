/*
Index DB helper
*/

function IndexDBHelper(db_name, db_version) {
    /*public variables*/
    var _this = this;
    var name;
    var version;
    var db;
    /*private variables*/
  
    /*private methods*/
  
    /*public methods*/

    //constructor
    this.init = function () {
      name = db_name;
      version = db_version;
      //create a new database
      var request = indexedDB.open(name, version);
      request.onerror = function (event) {
        console.log('Unable to open indexedDB');
      };
      request.onupgradeneeded = function (event) {
        db = event.target.result;
        var objectStore;
        console.log("IndexDB: " + name + " version: " + version + " created!");
        //create advertisements table
        if (!db.objectStoreNames.contains('esm')) {
          objectStore = db.createObjectStore('esm', { autoIncrement: false, keyPath: 'id' });
          objectStore.createIndex('id', 'id', { unique: true });
          objectStore.createIndex('esm_site', 'esm_site', { unique: false });
          objectStore.createIndex('esm_time', 'esm_time', { unique: false });
          objectStore.createIndex('distractions', 'distractions', { unique: false });
          console.log("esm table created in IndexDB: " + name + " version: " + version);
        }
        else{
          console.log("esm table already exists.");
        }
      };
    };

    //insert data
    this.insert = function (table_name, data) {
      var open_db_request = indexedDB.open(name, version);
  
      open_db_request.onsuccess = function (event) {
        db = event.target.result;
        var request = db.transaction(table_name, 'readwrite')
          .objectStore(table_name)
          .add(data);
  
        request.onsuccess = function (event) {
          console.log("data inserted in " + table_name + " table in IndexDB: " + name + " version: " + version);
        };
  
        request.onerror = function (event) {
          console.error("failed when trying to insert data in " + table_name + " table in IndexDB: " + name + " version: " + version);
        }
      }
    };

    //get data
    this.select = function (table_name, index_name, value, is_ambiguous, callback) {
      var result = [];
      var open_db_request = indexedDB.open(name, version);
  
      open_db_request.onsuccess = function (event) {
        db = event.target.result;
        var objectStore = db.transaction(table_name).objectStore(table_name);
        var cursorRequest;
        cursorRequest = objectStore.openCursor();
        cursorRequest.onsuccess = function (event) {
          var cursor = event.target.result;
            if (cursor) {
                var this_value = cursor.value;
                this_value['primeKey'] = cursor.key;
                if (is_ambiguous) {
                    if (this_value[index_name].match(value)) {
                        result.push(this_value);
                    }
                }
                else {
                    if (this_value[index_name] == value) {
                        result.push(this_value);
                    }
                }
                cursor.continue();
            } else {
                callback(result);
                // console.log("finish traversing " + table_name + " table in IndexDB: " + name + " version: " + version);
            }
        };
      }
    }

    this.traverse = function (table_name, callback) {
      var result = [];
      var open_db_request = indexedDB.open(name, version);
  
      open_db_request.onsuccess = function (event) {
        db = event.target.result;
        var objectStore = db.transaction(table_name).objectStore(table_name);
        var cursorRequest;
        cursorRequest = objectStore.openCursor();
  
        cursorRequest.onsuccess = function (event) {
          var cursor = event.target.result;
          if (cursor) {
            var this_value = cursor.value;
            this_value['primeKey'] = cursor.key;
            result.push(this_value);
            cursor.continue();
          } 
          else {
            callback(result);
            // console.log("finish traversing " + table_name + " table in IndexDB: " + name + " version: " + version);
          }
        };
      }
    }
  
    this.asyncTraverse = async function (table_name) {
      return new Promise((resolve, reject) => {
        try {
          var result = [];
          var open_db_request = indexedDB.open(name, version);
  
          open_db_request.onsuccess = function (event) {
            db = event.target.result;
            var objectStore = db.transaction(table_name).objectStore(table_name);
            var cursorRequest;
            cursorRequest = objectStore.openCursor();
            
  
            cursorRequest.onsuccess = function (event) {
              var cursor = event.target.result;
              if (cursor) {
                var this_value = cursor.value;
                this_value['primeKey'] = cursor.key;
                result.push(this_value);
                cursor.continue();
              } else {
                resolve(result);
                // console.log("finish traversing " + table_name + " table in IndexDB: " + name + " version: " + version);
              }
            };
          }
        } catch (err) {
          reject("traverse db error: ", err);
        }
      });
    }
  
    this.delete = function (table_name, key) {
      return new Promise((resolve, reject) => {
        var open_db_request = indexedDB.open(name, version);
  
        open_db_request.onsuccess = function (event) {
          db = event.target.result;
          var transaction = db.transaction(table_name, 'readwrite');
          var store = transaction.objectStore(table_name);
          var request = store.delete(key);
  
          request.onsuccess = function (event) {
            console.log("delete item ", key, " in ", table_name);
            resolve(true);
          };
        }
      })
    };
  
  
    //call the constructor
    this.init();
  };