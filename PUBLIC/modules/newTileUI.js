(function ($, OliveUI, OliveUtils) {
  'use strict';

  /*
  This module visualize a project tile from this json:
  {
    imgUrl: ''
    title: '',
    excepit: '',
    detailsHandler: function () {}
  }
  */

  var moduleName = 'newTileUI';
  var moduleCSS = `
.box {
  text-align: center;
  position: relative;
  background: #00000010;
  height: 100%;
  width: 100%;
}
.box .footer {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}
.box h2 {
  font-weight: 300;
  letter-spacing: -0.05em;
  margin-bottom: 15px;
}
.box .footerBtn {
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-radius: 0;
  padding: 25px 0;
}
.box p {
  padding-bottom: 125px;
  font-size: 16px;
  font-weight: 300;
  opacity: 0.8;
  margin: 10px;
}
.box img {
  width: 100%;
  height: 150px;
  object-fit: none;
}`;
  //newTileUI is actually a factory method and should be createTitleUI
  OliveUI.modules[moduleName] = function (config = {}) {

    config.detailsHandler = config.detailsHandler || function () {};
    config.imgUrl = config.imgUrl || '';
    config.title = config.title || '';
    config.excepit = config.excepit || '';

    var moduleCSSClass = OliveUtils.setCSS(moduleName, moduleCSS);
    var _dom = {
      rootDiv: $('<div class="' + moduleCSSClass + '">'),
      titleH2: $('<h2>').append(config.title),
      logoImg: $('<img>').attr('src', config.imgUrl),
      excepitP: $('<p>').append(config.excepit),
      detailsBtn: $('<a class="footerBtn btn btn-primary">Details</a>').click(config.detailsHandler)
    };

    return {
      render: function () {
        return _dom.rootDiv.append(
          $('<div class="box">').append(
            _dom.imgUrl,
            _dom.titleH2,
            _dom.excepitP,
            _dom.detailsBtn
          )
        );
      }
    };
  };

}($, OliveUI, OliveUtils));
