(function () {
  var _utils = {
    showError: function (error, parentDom) {
      console.log(error);
      $('<div class="alert alert-danger fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>Error occurred:<br><pre style="white-space: pre-wrap;">' + error + '</pre></div>')
        .fadeTo(5000, 500)
        .appendTo((parentDom != null) ? parentDom : $('#mainContainer'));
    },

    showSuccess: function (info, parentDom, keep) {
      console.log(info);
      var div = $('<div class="alert alert-success fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + info + '</div>');
      div.fadeTo(5000, 500);
      if (!keep)
        div.slideUp(500, function () {
          $(this).remove();
        });
      div.appendTo((parentDom != null) ? parentDom : $('#mainContainer'));
    },

    getHost: function () {
      var ret = ((window.location.protocol == '') ? 'http:' : window.location.protocol) + '//' + ((window.location.hostname == '') ? '127.0.0.1' : window.location.hostname) + ((window.location.port != '') ? ':' + window.location.port : '');
      return ret;
    },

    getPageUrl: function () {
      return _utils.getHost() + window.location.pathname;
    },

    getURLParameter: function (sParam) {
      var ret = window.location.href.match('[?&]' + sParam + '=([^&]*)');
      if(ret)
        return ret[1];
      else
        return null;
    },

    setURLParameter: function (sParam, sValue) {
      var str = window.location.href;
      str = str.replace(new RegExp('[?&]' + sParam + '=([^&]*)'), '');
      return str + (sValue ? (str.includes('?') ? '&' : '?') + sParam + '=' + sValue : '');
      //return encodeURI(window.location.href.match('[?&]' + sParam + '=([^&]*)') ? window.location.href.replace('[?&]' + sParam + '=([^&]*)', sValue) : window.location.href += (window.location.href.includes('?') ? '&' : '?') + sParam + '=' + sValue);
    },

    neverNull: function (param) {
      return param == null ? '' : param;
    },

    generateUUID: function () {
      var d = new Date().getTime();
      if (typeof performance !== 'undefined' && typeof performance.now === 'function')
        d += performance.now(); //use high-precision timer if available
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    },

    get: function (url, dataType, successCallback, failureCallback) {
      $.ajax({
        type: 'GET',
        url: url,
        dataType: dataType,
        async: true,
        success: function (data) {
          successCallback(data);
        },
        error: function (request, status, error) {
          failureCallback(error);
        }
      });
    },
    
    callService: function (url, paramsQueryString, postData, successCallback, failureCallback) {
      var serviceUrl = url + (paramsQueryString != null ? '?' + paramsQueryString : '');
      var ajaxConfig = {
        type: 'GET',
        url: serviceUrl,
        dataType: 'json',
        async: true,
        success: function (data, status) {
          if (data.status == 0)
            successCallback(data.data);
          else
            failureCallback('Internal error: ' + data.error);
        },
        error: function (request, status, error) {
          failureCallback('Error contacting the service: ' + serviceUrl + ' : ' + status + ' ' + error);
        }
      };

      if (postData != null) {
        ajaxConfig.type = 'POST';
        ajaxConfig.processData = false;
        if (!(postData instanceof ArrayBuffer)) {
          ajaxConfig.contentType = 'application/json';
          ajaxConfig.data = postData;
        } else {
          ajaxConfig.contentType = 'application/octet-stream';
          ajaxConfig.data = postData;
        }
      }

      $.ajax(ajaxConfig);
    },

    callMicroservice: function (mscRestEndpoint, microserviceId, operationId, parameters, successCallback, failureCallback) {
      _utils.callService(mscRestEndpoint + 'msc/callMicroserviceForced', 'microserviceId=' + microserviceId + '&operationId=' + operationId, JSON.stringify(parameters), successCallback, failureCallback);
    },

    createDialogBootstrap: function (content, title, okCallback, onSuccessCallback, onContentLoadedCallback, showCancel, continueName) {
      var modalDiv = document.createElement('div');
      $(modalDiv)
        .prependTo($(document.body))
        .addClass('modal')
        .addClass('fade')
        .attr('role', 'dialog')
        .attr('tabindex', '-1')
        .append(
          $('<div class="modal-dialog" role="document" style="display: table; width: auto; min-width: 800px; max-width: 800px;">').append(
            $('<div class="modal-content">').append(
              $('<div class="modal-header" style="display: block;">').append(
                $('<button title="Close" type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'),
                $('<h4 class="modal-title">' + title + '</h4>')),
              $('<div class="modal-body">').append(content),
              $('<div class="modal-footer">').append(
                showCancel?'<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>':null,
                $('<button type="button" class="btn btn-primary">' + (continueName ? continueName : 'Continue') + '</button>').click(function () {
                  if (okCallback) 
                    okCallback(function () {
                      $(modalDiv).modal('hide');
                      onSuccessCallback();
                    });
                  /*
                  var ok = false;
                  if (okCallback != null && typeof okCallback === 'function')
                    ok = okCallback.call();
                  if (ok === true) {
                    $(modalDiv).modal('hide');
                    onSuccessCallback.call();
                  }*/
                }))))
        ).on('hidden.bs.modal', function () {
          modalDiv.outerHTML = '';
        }).on('shown.bs.modal', function () {
          //$(modalDiv).focus();
          onContentLoadedCallback();
        }).modal('show');
    },

    readFileAsArrayBuffer: function (file, onLoadFunction) {
      if (!file)
        return;
      if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
        alert('The File APIs are not fully supported in this browser.');
        return;
      }
      var reader = new FileReader();
      reader.onload = function (e) {
        var content = e.target.result;
        onLoadFunction(content);
      };
      reader.readAsArrayBuffer(file);
    },

    readFileAsDataURL: function (file, onLoadFunction) {
      if (!file)
        return;
      if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
        alert('The File APIs are not fully supported in this browser.');
        return;
      }
      var reader = new FileReader();
      reader.onload = function (e) {
        var content = e.target.result;
        onLoadFunction(content);
      };
      reader.readAsDataURL(file);
    },

    readFileAsText: function (file, onLoadFunction) {
      if (!file)
        return;
      if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
        alert('The File APIs are not fully supported in this browser.');
        return;
      }
      var reader = new FileReader();
      reader.onload = function (e) {
        var content = e.target.result;
        onLoadFunction(content);
      };
      reader.readAsText(file);
    },

    ab2str: function (ab) {
      if (!(window.TextDecoder)) throw 'This browser does not support TextDecoder';
      return new TextDecoder("utf-8").decode(ab);
    },

    str2ab: function (str) {
      if (!(window.TextEncoder)) throw 'This browser does not support TextEncoder';
      return new TextEncoder().encode(str);
    },

    arr2obj: function (arr, idName) {
      var ret = {};
      arr.forEach(function (arrObj) {
        var key = arrObj[idName];
        delete arrObj[idName];
        ret[key] = arrObj;
      });
      return ret;
    },

    obj2arr: function (obj, idName) {
      var ret = [];
      Object.keys(obj).forEach(function (key) {
        var arrObj = obj[key];
        arrObj[idName] = key;
        ret.push(arrObj);
      });
      return ret;
    },

    clone: function (obj) {
      return JSON.parse(JSON.stringify(obj));
    },

    isStyled: function (className) {
      var re = new RegExp('(^|,)\\s*\\.' + className + '\\s*(\\,|$)');
      var ret = false;
      $.each(document.styleSheets, function () {
        $.each(this.cssRules || this.rules, function () {
          if (re.test(this.selectorText))
            ret = true;
        });
      });
      return ret;
    },

    download: function (data, filename, type) {
      var file = new Blob([data], {
        type: type
      });
      if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
      else { // Others
        var a = document.createElement("a"),
          url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 0);
      }
    },
    /**
    * Decimal adjustment of a number.
    * https: //stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
    * ex:
    * decimalAdjust('round', 55.55, -1);   //55.6
    * decimalAdjust('round', -55.551, -1); //-55.6
    * decimalAdjust('round', 1.005, -2);   //1.01
    * decimalAdjust('floor', 55.59, -1);   //55.5
    * decimalAdjust('floor', -51, 1);      //-60
    * decimalAdjust('ceil', -59, 1);       //-50
    *
    * @param   {String}    type    The type of adjustment. Possible values are: round, floor and ceil
    * @param   {Number}    value   The number.
    * @param   {Integer}   exp     The exponent (the 10 logarithm of the adjustment base).
    * @returns {Number}            The adjusted value.
    */
    decimalAdjust: function (type, value, exp) {
      if (typeof exp === 'undefined' || +exp === 0)
        return Math[type](value);
      value = +value;
      exp = +exp;
      if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
        return NaN;
      value = value.toString().split('e');
      value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
      value = value.toString().split('e');
      return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    },

    parseTimestamp: function (unixTime) {
      var absTime = Math.abs(unixTime);
      var ms = absTime % 1000 | 0;
      absTime /= 1000;
      var s = absTime % 60 | 0;
      absTime /= 60;
      var m = absTime % 60 | 0;
      absTime /= 60;
      var h = absTime % 24 | 0;
      absTime /= 24;
      var d = absTime % 365 | 0;
      var y = absTime / 365 | 0;
      return y + ':' + ('000' + d).slice(-3) + ':' + ('00' + h).slice(-2) + ':' + ('00' + m).slice(-2) + ':' + ('00' + s).slice(-2) + ':' + ('000' + ms).slice(-3);
    },

    setCSS: function (uniqueID, cssLess) {
      if(!less) throw 'less not available';
      var domEl = document.getElementById('style_' + uniqueID);
      if (domEl)
        $(domEl).remove();

      less.render('.style_' + uniqueID + ' { ' + cssLess + ' }', function (error, output) {
        if (error) throw 'Error parsing the style: ' + error + '\nLESS: ' + cssLess;
        $('head').append('<style id="style_' + uniqueID + '">\n' + output.css.replace(new RegExp(uniqueID + ' (html|body|head)', 'gi'), uniqueID) + '\n</style>');
      });
      return 'style_' + uniqueID;
    },

    setCSSNoLess: function (uniqueID, css) {
      var domEl = document.getElementById('style_' + uniqueID);
      if (domEl) {
        domEl.remove();
      }
      var text = '';
      if (typeof css === 'function') {
        text = css('.' + uniqueID);
      } else {
        text = css;
      }
      
      var style = document.createElement('style');
      style.id = 'style_' + uniqueID;
      style.appendChild(document.createTextNode(text));
      document.head.appendChild(style);
      return uniqueID;
    },

    /**
     * Load a script using promise
     * ex: const script = await loadScript('foo.js');
     * @param {String} src The url of the JS script
     */
    loadScript: function (src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.async = true;
        script.src = src;
        script.onload = () => {
          script.onerror = script.onload = null;
          resolve(script);
        };
        script.onerror = () => {
          script.onerror = script.onload = null;
          reject(new Error(`Failed to load ${src}`));
        };
        const node = document.head || document.getElementsByTagName('head')[0];
        node.appendChild(script);
      });
    },

    preloadImage: function (url) {
      (new window.Image()).src = url;
    },

    openInNewTab: function (href) {
      Object.assign(document.createElement('a'), {
        target: '_blank',
        href: href,
      }).click();
    },

    simpleRouter: function (pageKey, rootDiv, defaultPage, pages) {
      //https://github.com/praveen-me/simple-vanila-router/blob/master/app.js
      var _router = {
        goto: function (pageName) {
          if (pages[pageName]) {
            history.pushState({}, pageName, _utils.setURLParameter(pageKey, ''+pageName));
            rootDiv.empty().append(pages[pageName]);
          }
          return this;
        },
        addRoute: function (page, pageContent) {
          pages[page] = pageContent;
          return this;
        },
        init: function () {
          var currentPage = _utils.getURLParameter(pageKey);
          currentPage = currentPage == null || currentPage == '' ? defaultPage : currentPage;
          if (pages[currentPage])
            rootDiv.empty().append(pages[currentPage]);
          else if (pages[defaultPage])
            rootDiv.empty().append(pages[defaultPage]);
          return this;
        }
      };
      $(window).bind('popstate', function () {
        _router.init();
      });
      return _router;
    }

  };
  OliveUtils = _utils;
  window.OliveUI = window.OliveUI || {
    modules: {}
  };
}());
