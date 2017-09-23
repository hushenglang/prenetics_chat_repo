/**
 * This service provides a way to communicate with the server for retrieving and storing data
 * @author JoeHu
 * @date 2017-Sep-16
 */

'use strict';

angular
    .module('prenetics_chat')
    .factory('HttpRequestService', ['$http', '$q', '$rootScope', HttpRequestService]);

function HttpRequestService($http, $q) {

    return {
        makePromise: function (context) {
            var deferred = $q.defer();
            context(deferred.resolve, deferred.reject, deferred.notify);
            return deferred.promise;
        },
        get: function (url, params) {
            return this.makePromise(function (resolve, reject) {
                $http.get(url, params)
                    .then(function (response) {
                        if (response.status === 200) {
                            resolve(response.data);
                        } else {
                            reject(new Error('Invalid Data'));
                        }
                    }, function (error) {
                        reject(error);
                    })
            });
        },
        post: function (url, params) {
            return this.makePromise(function (resolve, reject) {
                $http.post(url, params)
                    .then(function (response) {
                        if (response.status === 200) {
                            resolve(response.data);
                        } else {
                            reject(new Error('Invalid Data'));
                        }
                    }, function (error) {
                        reject(error);
                    })

            });
        }
    }
}


