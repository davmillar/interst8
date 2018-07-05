var _trackInstalling = function (worker) {
      worker.addEventListener('statechange', function() {
        if (worker.state == 'installed') {
          _updateReady(worker);
        }
      });
    },

    _updateReady = function (worker) {
      var promptResponse = confirm('Interst8 has an update available. Want to reload the app?');

      if (promptResponse) {
        console.log('New ServiceWorker skipping waiting.');
        worker.postMessage({action: 'skipWaiting'});
      }
    },

    _installServiceWorker = function () {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('js/service-worker.js').then(function(registration) {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          if (!navigator.serviceWorker.controller) {
            return;
          }

          if (registration.waiting) {
            _updateReady(registration.waiting);
            return;
          }

          if (registration.installing) {
            _trackInstalling(registration.installing);
            return;
          }

          registration.addEventListener('updatefound', function() {
            _trackInstalling(registration.installing);
          });
        })['catch'](function(err) {
          console.log('ServiceWorker registration failed: ', err);
        });

        var refreshing;

        navigator.serviceWorker.addEventListener('controllerchange', function() {
          if (refreshing) return;
          window.location.reload();
          refreshing = true;
        });
      });
    };

if ('serviceWorker' in navigator) {
  _installServiceWorker();
}
