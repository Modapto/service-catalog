(function ($, OliveUI, OliveUtils, showdown) {
  'use strict';

  var moduleName = 'newPageFromGitLabMarkdownUI';
  var moduleCSS = function (me) { return `
${me} .panel {
  border: 0px
}
${me} .panel img {
  max-width: 100%;
  display: block;
  margin: 0 auto;
}
${me} .content {
  font-size: 16px;
}
`;};

  var _statics = {
    init: function (_dom, config) {
      OliveUtils.callMicroservice(config.mscEndpoint, config.microserviceId, 'getTextFile', {
        fileId: {
          value: config.fileId
        }
      }, function (data) {
        var converter = new showdown.Converter({
          omitExtraWLInCodeBlocks: true,
          noHeaderId: false,
          simplifiedAutoLink: true,
          strikethrough: true,
          tables: true,
          tasklists: true,
          openLinksInNewWindow: true,
          metadata: true
        });
        converter.setFlavor('github');
        var html = converter.makeHtml(data.dataText);
        //var metadata = converter.getMetadata();
        _dom.rootDiv.empty().append(
          $('<div class="panel panel-default">').append(
            $('<div class="panel-body">').append(
              html
            )
          )
          
        );

      }, function (error) {
        OliveUtils.showError(error, _dom.rootDiv);
      });
    }
  };

  OliveUI.modules[moduleName] = function (config = {}) {
    if (!showdown) throw 'Missing showdown library';

    config.mscEndpoint = config.mscEndpoint || '';
    config.microserviceId = config.microserviceId || '';
    config.fileId = config.fileId || '';

    var moduleCSSClass = OliveUtils.setCSSNoLess(moduleName, moduleCSS);

    var _dom = {
      rootDiv: $('<div class="' + moduleCSSClass + ' container content">')
    };

    _statics.init(_dom, config);

    return {
      render: function () {
        return _dom.rootDiv;
      }
    };
  };

}($, OliveUI, OliveUtils, showdown));
