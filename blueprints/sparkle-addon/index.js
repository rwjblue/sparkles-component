'use strict';

const path = require('path');
const stringUtil = require('ember-cli-string-utils');
const pathUtil = require('ember-cli-path-utils');
const getPathOption = require('ember-cli-get-component-path-option');
const normalizeEntityName = require('ember-cli-normalize-entity-name');

module.exports = {
  description: 'Generates a component.',

  fileMapTokens: function() {
    return {
      __path__: function(options) {
        if (options.pod) {
          return path.join(
            options.podPath,
            options.locals.path,
            options.dasherizedModuleName
          );
        }
        return 'components';
      },
      __name__: function(options) {
        if (options.pod) {
          return 'component';
        }
        return options.dasherizedModuleName;
      },
      __root__: function(options) {
        if (options.inRepoAddon) {
          return path.join('lib', options.inRepoAddon, 'app');
        }
        return 'app';
      },
      __templatepath__(options) {
        if (options.pod) {
          return path.join(
            options.podPath,
            options.locals.path,
            options.dasherizedModuleName
          );
        }
        return 'templates/components';
      },
      __templatename__(options) {
        if (options.pod) {
          return 'template';
        }
        return options.dasherizedModuleName;
      }
    };
  },

  normalizeEntityName: function(entityName) {
    return normalizeEntityName(entityName);
  },

  locals: function(options) {
    let templatePath = '';
    let addonRawName = options.inRepoAddon
      ? options.inRepoAddon
      : options.project.name();
    let addonName = stringUtil.dasherize(addonRawName);
    let fileName = stringUtil.dasherize(options.entity.name);
    let importPathName = [addonName, 'components', fileName].join('/');

    // if we're in an addon, build import statement
    if (
      options.project.isEmberCLIAddon() ||
      (options.inRepoAddon && !options.inDummy)
    ) {
      if (options.pod) {
        templatePath = './template';
      } else {
        templatePath = [
          addonName,
          'templates/components',
          stringUtil.dasherize(options.entity.name)
        ].join('/');
      }
    }

    if (options.pod) {
      importPathName = [addonName, 'components', fileName, 'component'].join(
        '/'
      );
    }

    return {
      modulePath: importPathName,
      templatePath,
      path: getPathOption(options)
    };
  }
};
