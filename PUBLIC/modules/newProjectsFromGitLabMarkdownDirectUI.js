(function ($, OliveUI, OliveUtils, showdown) {
  'use strict';

  var moduleName = 'newProjectsFromGitLabMarkdownDirectUI';

  var _statics = {
    services: {
      gitLab: {
        getGroupProjects: function (gitlabUrl, gitlabGroupId, successCallback, failureCallback) {
          OliveUtils.get(gitlabUrl + '/api/v4/groups/' + gitlabGroupId, 'json', function (data) {
            var projectsList = [];
            data.projects.forEach(function (project) {
              if (project.visibility != 'public')
                return;
                projectsList.unshift({
                id: project.id,
                readme_raw_url: project.readme_url ? project.readme_url.replace('blob', 'raw') : '',
                avatar_url: project.avatar_url,
                name: project.name,
                description: project.description
              });
            });
            successCallback(projectsList);
          }, failureCallback);
        },
        getProjectMDFiles: function (gitlabUrl, gitlabProjectId, gitlabProjectFolder, successCallback, failureCallback) {
          OliveUtils.get(gitlabUrl + '/api/v4/projects/' + gitlabProjectId + '/repository/tree?recursive=false&per_page=100&path=' + (gitlabProjectFolder?encodeURI(gitlabProjectFolder):''), 'json', function (data) {
            var fileList = [];
            data.forEach(function (file) {
              if(file.type == 'blob' && file.name.toLowerCase().endsWith('.md')) {
                fileList.push({
                  id: file.id,
                  name: file.name
                });
              }
            });
            successCallback(fileList);
          }, failureCallback);
        },
        getProjectSubFolders: function (gitlabUrl, gitlabProjectId, gitlabProjectFolder, successCallback, failureCallback) {
          OliveUtils.get(gitlabUrl + '/api/v4/projects/' + gitlabProjectId + '/repository/tree?recursive=false&per_page=100&path=' + (gitlabProjectFolder?encodeURI(gitlabProjectFolder):''), 'json', function (data) {
            var folderList = [];
            data.forEach(function (folder) {
              if(folder.type == 'tree') {
                folderList.push({
                  path: folder.path
                });
              }
            });
            successCallback(folderList);
          }, failureCallback);
        },
        getProjectFileContent: function (gitlabUrl, gitlabProjectId, gitlabFileId, successCallback, failureCallback) {
          OliveUtils.get(gitlabUrl + '/api/v4/projects/' + gitlabProjectId + '/repository/blobs/' + gitlabFileId + '/raw', 'text', successCallback, failureCallback);
        }
      }
    },

    projectClickHandler: function (_dom, config, gridItem) {
      var gitlabUrl = config.gitlabUrl;
      var gitlabProjectId = gridItem.gitlabProjectId;

      _statics.services.gitLab.getProjectMDFiles(gitlabUrl, gitlabProjectId, '', function (fileList) {
        var gitlabFileId = null;
        fileList.forEach(function (file) {
          if (file.name.toLowerCase() == 'readme.md') {
            gitlabFileId = file.id;
          }
        });
        if (! gitlabFileId) {
          OliveUtils.showError('The selected project do not contain a README.md file', _dom.rootDiv);
          return;
        } 
        _statics.services.gitLab.getProjectFileContent(gitlabUrl, gitlabProjectId, gitlabFileId, function (mdData) {
          _statics.renderProjectFromMD(_dom, gridItem, mdData);
        }, function (error) {
          OliveUtils.showError(error, _dom.rootDiv);
        });
      }, function (error) {
        OliveUtils.showError(error, _dom.rootDiv);
      });
    },

    renderProjectFromMD: function (_dom, metadata, mdData) {
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
      converter.setFlavor('github'); //github, vanilla, original
      var htmlData = converter.makeHtml(mdData);
      var _metadata = Object.assign({}, metadata); 
      _metadata = Object.assign(_metadata, converter.getMetadata());

      var newProjectContentUI = OliveUI.modules.newProjectContentUI({});

      var menuItemList = [];
      for (var i = 1;; i++) {
        var menuItem = _metadata['menu' + i];
        if (!menuItem)
          break;
        menuItemList.push(menuItem);
      }
      newProjectContentUI.setContent({
        title: _metadata.title,
        logoUrl: _metadata.imgUrl,
        keywords: _metadata.keywords,
        affiliation: _metadata.affiliation,
        menuItemList: menuItemList,
        contentHTML: htmlData
      });

      _dom.rootDiv.empty().append(
        newProjectContentUI.render()
      );
    },

    init: function (_dom, _sub, config) {
      _dom.titleH2.empty().append(config.title);

      if (config.gitlabUrl && config.gitlabGroupId) {

        _statics.services.gitLab.getGroupProjects(config.gitlabUrl, config.gitlabGroupId, function (projectsList) {
          var gridArray = [];
          projectsList.forEach(function (project) {
            gridArray.push({
              imgUrl: project.avatar_url,
              title: project.name,
              excepit: project.description,
              gitlabProjectId: project.id,
              readmeUrl: project.readme_raw_url
            });
          });
          _sub.projectOverview.setContent({
            gridArray: gridArray
          });
        }, function (error) {
          OliveUtils.showError(error, _dom.rootDiv);
        });
        
      } else {
        throw 'Incorrect parameters provided';
      }
    }
  };

  OliveUI.modules[moduleName] = function (config = {}) {
    if (!OliveUI.modules.newProjectsOverviewUI) throw 'Missing newProjectsOverviewUI module';
    if (!OliveUI.modules.newProjectContentUI) throw 'Missing newProjectContentUI module';
    if (!showdown) throw 'Missing showdown library';

    config.numColumns = config.numColumns || 4;
    config.title = config.title || '';
    config.gitlabUrl = config.gitlabUrl || '';
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
        onItemClickFn: function (gridItem) {
          _statics.projectClickHandler(_dom, config, gridItem);
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
