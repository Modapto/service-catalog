(function ($, OliveUI) {
  'use strict';


//https://scotch.io/bar-talk/different-tricks-on-how-to-make-bootstrap-columns-all-the-same-height
//https://getflywheel.com/layout/flexbox-create-modern-card-design-layout/
//https://codepen.io/mcraiganthony/pen/NxGxqm
/*
.box {
  padding: 25px 7% 0;
  text-align: center;
  position: static;
  background: #fff;
  .footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }
}
*/
  var moduleName = 'newLayout_grid';
  var moduleCSS = function (me) { return `
${me} .row.is-flex {
  display: flex;
  flex-wrap: wrap;
}

${me} .row.is-flex > [class*='col-'] {
  display: flex;
  flex-direction: column;
  padding-bottom: 30px;
}

${me} .row.is-flex > [class*='col-'] > * {
  height: 100%;
} `; };

  var _statics = {
    addDomEl: function (_dom, config, domEl) {
      var columnWidth = Math.round(12/ config.numColumns);
      _dom.gridDiv.append(
        $('<div class="col-sm-' + columnWidth + '">').append(
          domEl
        )
      );
    }
  };

  var _newLayout_grid = function (config = {}) {
    config.numColumns = config.numColumns || 3;
    config.numColumns = !isNaN(config.numColumns) && config.numColumns >= 1 && config.numColumns <= 12 ? config.numColumns : 3;

    var moduleCSSClass = OliveUtils.setCSSNoLess(moduleName, moduleCSS);

    var _dom = {
      rootDiv: $('<div class="' + moduleCSSClass + '">'),
      gridDiv: $('<div class="row is-flex">')
    };

    return {
      render: function () {
        return _dom.rootDiv.append(
          _dom.gridDiv
        );
      },
      getContent: function () {
        return {};
      },
      setContent: function (content = {}) {
        _dom.gridDiv.empty();
      },
      addDomEl: function (uuid, domEl) {
        _statics.addDomEl(_dom, config, domEl);
      }
    };
  };
  OliveUI.modules[moduleName] = _newLayout_grid;
}($, OliveUI));
