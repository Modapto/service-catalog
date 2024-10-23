(function ($, OliveUI, OliveUtils, showdown) {
  'use strict';

  var moduleName = 'newProjectsFromGitLabMarkdownUI';

  var _statics = {
    projectOverviewItemClickHandler: function (_dom, config, gridItemJson) {
      console.log(gridItemJson);
      OliveUtils.callMicroservice(config.mscEndpoint, config.microserviceId, 'getTextFile', {
        fileId: {
          value: gridItemJson.fileId
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
        var metadata = Object.assign({}, gridItemJson); 
        metadata = Object.assign(metadata, converter.getMetadata());

        var newProjectContentUI = OliveUI.modules.newProjectContentUI({});
        var menuItemList = [];
        for (var i = 1;; i++) {
          var menuItem = metadata['menu' + i];
          if (!menuItem)
            break;
          menuItemList.push(menuItem);
        }
        newProjectContentUI.setContent({
          title: metadata.title,
          logoUrl: metadata.imgUrl,
          keywords: metadata.keywords,
          affiliation: metadata.affiliation,
          menuItemList: menuItemList,
          contentHTML: html
        });

        _dom.rootDiv.empty().append(
          newProjectContentUI.render()
        );

      }, function (error) {
        OliveUtils.showError(error, _dom.rootDiv);
      });
    },

    init: function (_dom, _sub, config) {
      var opId = '';
      var opParameters = null;
      if (config.localFolder) {
        opId = 'getOverviewDataLocal';
        opParameters = {
          localFolder: {
            value: config.localFolder
          }
        };
        _dom.titleH2.empty().append(config.localFolder || config.title);
      } else if (config.gitlabUrl && config.gitlabProjectId && config.gitlabProjectFolder) {
        opId = 'getOverviewDataGitlab';
        opParameters = {
          gitlabUrl: {
            value: config.gitlabUrl
          },
          gitlabProjectId: {
            value: config.gitlabProjectId
          },
          gitlabProjectFolder: {
            value: config.gitlabProjectFolder
          }
        };
        _dom.titleH2.empty().append(config.gitlabProjectFolder || config.title);
      } else if (config.gitlabUrl && config.gitlabGroupId) {
        opId = 'getOverviewDataGitlabGroups';
        opParameters = {
          gitlabUrl: {
            value: config.gitlabUrl
          },
          gitlabGroupId: {
            value: config.gitlabGroupId
          }
        };
        _dom.titleH2.empty().append(config.title);
      } else if (config.jsonUrl) {
        opId = 'getOverviewDataUrl';
        opParameters = {
          jsonUrl: {
            value: config.jsonUrl
          }
        };
        _dom.titleH2.empty().append(config.title);
      } else {
        throw 'Incorrect parameters provided';
      }

      OliveUtils.callMicroservice(config.mscEndpoint, config.microserviceId, opId, opParameters, function (data) {
        _sub.projectOverview.setContent({
          gridArray: data.list
        });
      }, function (error) {
        OliveUtils.showError(error, _dom.rootDiv);
      });
    }
  };

  OliveUI.modules[moduleName] = function (config = {}) {
    if (!OliveUI.modules.newProjectsOverviewUI) throw 'Missing newProjectsOverviewUI module';
    if (!OliveUI.modules.newProjectContentUI) throw 'Missing newProjectContentUI module';
    if (!showdown) throw 'Missing showdown library';

    config.mscEndpoint = config.mscEndpoint || '';
    config.microserviceId = config.microserviceId || '';
    config.numColumns = config.numColumns || 4;

    config.title = config.title || '';

    config.localFolder = config.localFolder || '';
    //OR
    config.jsonUrl = config.jsonUrl || '';
    //OR
    config.gitlabUrl = config.gitlabUrl || '';
    config.gitlabProjectId = config.gitlabProjectId || '';
    config.gitlabProjectFolder = config.gitlabProjectFolder || '';
    //OR
    config.gitlabGroupId = config.gitlabGroupId || '';

    config.gitlabGroupPage = config.gitlabGroupPage || '';

    var _dom = {
      rootDiv: $('<div class="container">'),
      titleH2: $('<h2>'),
      editBtn: $('<button title="Edit" class="btn btn-primary"><span>Edit</span></button>').click(function () {
        if (!config.gitlabGroupPage) {
          throw 'gitlabGroupPage is empty';
        }
        //window.open(config.gitlabGroupPage, '_blank');
        var content = $('<div class="container-fluid">').append(
          '<p>In order to edit the content you need a valid Account in <b>'+config.gitlabGroupPage+'</b>.</p>',
          '<p>The content is provided in the README.md file in markdown format. You can use the following code as template for the file:</p>',
          `<code style="display:block; white-space:pre-wrap">
---
keywords: demo
affiliation: BOC
title: Demo Tool
menu1: Item 1
menu2: Item 2
---

# Item 1

No Content

# Item 2

No Content
          </code>`
          );
        OliveUtils.createDialogBootstrap(content, 'Edit Details', function (successFn) {
          window.open(config.gitlabGroupPage, '_blank');
          successFn();
        }, function () {}, function () {}, true, 'Go to Edit');
      })
    };

    var _sub = {
      projectOverview: OliveUI.modules.newProjectsOverviewUI({
        numColumns: config.numColumns,
        onItemClickFn: function (gridItemJson) {
          _statics.projectOverviewItemClickHandler(_dom, config, gridItemJson);
        }
      })
    };

    _statics.init(_dom, _sub, config);

    return {
      render: function () {
        return _dom.rootDiv.append(
          '<br>',
          _dom.titleH2,
          config.gitlabGroupPage?_dom.editBtn:null,
          '<br><br>',
          _sub.projectOverview.render()
        );
      }
    };
  };

}($, OliveUI, OliveUtils, showdown));
