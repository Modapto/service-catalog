(function ($, OliveUI, OliveUtils) {
  'use strict';

  /*
  This module visualize a project from this json:
  {
    title: '',
    logoUrl: '',
    keywords: '',
    affiliation: '',
    menuItemList: ['Introduction', ...],
    contentHTML: ''
  }
  */

  var moduleName = 'newProjectContentUI';
  var moduleCSS = function (me) { return `
${me} .panel img {
  max-width: 100%;
}
${me} .logo {
  max-width: 100%;
  max-height: 110px;
  margin: 10px 0 0 0;
}
${me} .margin {
  margin: 10px 0 10px 0;
}
${me} .padding {
  padding-top: 2em;
  padding-bottom: 3em;
}
${me} .content {
  font-size: 16px;
}


${me} .project-nav-list {
  list-style: none;
  padding: 0;
  border: 1px solid #ddd;
  background-color: #eff9ff;
  border-radius: 4px;
  /* font-size: 14px; */
}

${me} .project-nav-item {
  border-bottom: 1px solid #ddd;
  min-height: 48px;
  line-height: 48px;
  word-wrap: break-word;
}

${me} .project-nav-item:last-child{
  border: 0;
}

${me} .project-nav-item-link {
  display: block;
  /*height: 100%;*/
  padding: 0 0 0 0.6em;
}

${me} .project-nav-item:first-child .project-nav-item-link {
  border-radius: 4px 4px 0 0;
}

${me} .project-nav-item:last-child .project-nav-item-link {
  border-radius: 0 0 4px 4px;
}

${me} .project-nav-subitem{
  font-size: 0.8em;
}

${me} .project-nav-subitem-link{
  padding: 0 0 0 1.2em;
  background-color: #eff9ff;
}

${me} .project-nav-active{
  font-weight: 700;
}

${me} .project-nav-item a:hover,
${me} .project-nav-item a:active,
${me} .project-nav-item a:focus {
  background-color: #d1dae0;
  text-decoration: none;
}
`;}; // TODO: move the relevant psm css here

  OliveUI.modules[moduleName] = function (config = {}) {

    var moduleCSSClass = OliveUtils.setCSSNoLess(moduleName, moduleCSS);
    var _dom = {
      rootDiv: $('<div class="' + moduleCSSClass + ' container">'),
      titleH2: $('<h2 class="margin">'),
      navUl: $('<ul class="project-nav-list">'),
      logoImg: $('<img class="logo">'),
      keywordsSpan: $('<span>'),
      affiliationSpan: $('<span>'),
      contentDiv: $('<div>')
    };

    return {
      render: function () {
        return _dom.rootDiv.append(
          $('<div class="row projectheader">').append(
            $('<div class="col-sm-3 text-center">').append(
              _dom.logoImg
            ),
            $('<div class="col-sm-9">').append(
              _dom.titleH2,
              $('<p>').append(
                '<strong>Keywords: </strong>',
                _dom.keywordsSpan
              ),
              $('<p>').append(
                '<strong>Affiliation: </strong>',
                _dom.affiliationSpan
              )
            )
          ),
          $('<div class="row padding content">').append(
            $('<div class="col-sm-3">').append(
              _dom.navUl
            ),
            $('<div class="col-sm-9">').append(
              $('<div class="panel panel-default">').append(
                $('<div class="panel-body">').append(
                  _dom.contentDiv
                )
              )
            )
          )
        );
      },
      setContent: function (content = {}) {
        _dom.titleH2.empty().append(content.title || '');
        _dom.logoImg.attr('src', content.logoUrl || '');
        _dom.keywordsSpan.empty().append(content.keywords || '');
        _dom.affiliationSpan.empty().append(content.affiliation || '');
        _dom.contentDiv.empty().append(content.contentHTML || '');

        _dom.navUl.empty();
        content.menuItemList.forEach(function (menuItem) {
          _dom.navUl.append(
            '<li class="project-nav-item"><a class="project-nav-item-link" href="#' + menuItem.toLowerCase().replace(' ', '') + '">' + menuItem + '</a></li>'
          );
        });
      }
    };
  };

}($, OliveUI, OliveUtils));
