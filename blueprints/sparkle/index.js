'use strict';

const path = require('path');
const stringUtil = require('ember-cli-string-utils');
const pathUtil = require('ember-cli-path-utils');
const getPathOption = require('ember-cli-get-component-path-option');
const normalizeEntityName = require('ember-cli-normalize-entity-name');
const isModuleUnificationProject = require('../module-unification')
  .isModuleUnificationProject;

module.exports = {
  description: 'Generates a component.',

  availableOptions: [
    {
      name: 'path',
      type: String,
      default: 'components',
      aliases: [{ 'no-path': '' }]
    },
    {
      name: 'lang',
      type: String
    }
  ],

  filesPath: function() {
    let filesDirectory = 'files';

    if (isModuleUnificationProject(this.project)) {
      filesDirectory = 'module-unification-files';
    }

    return path.join(this.path, filesDirectory);
  },

  fileMapTokens: function() {
    const tokens = {
      __ext__(options) {
        return options.locals.lang;
      }
    };
    if (isModuleUnificationProject(this.project)) {
      tokens.__root__ = options => {
        if (options.inRepoAddon) {
          return path.join('packages', options.inRepoAddon, 'src');
        }
        if (options.inDummy) {
          return path.join('tests', 'dummy', 'src');
        }
        return 'src';
      };
      tokens.__path__ = options => {
        return path.join('ui', 'components', options.dasherizedModuleName);
      };
    } else {
      tokens.__path__ = options => {
        if (options.pod) {
          return path.join(
            options.podPath,
            options.locals.path,
            options.dasherizedModuleName
          );
        } else {
          return 'components';
        }
      };
      tokens.__templatepath__ = options => {
        if (options.pod) {
          return path.join(
            options.podPath,
            options.locals.path,
            options.dasherizedModuleName
          );
        }
        return 'templates/components';
      };
      tokens.__templatename__ = options => {
        if (options.pod) {
          return 'template';
        }
        return options.dasherizedModuleName;
      };
    }
    return tokens;
  },

  normalizeEntityName: function(entityName) {
    return normalizeEntityName(entityName);
  },
  getDefaultLang(options) {
    if ('ember-cli-typescript' in options.project.addonPackages) return 'ts';
    else return 'js';
  },
  locals: function(options) {
    let templatePath = '';
    let contents = '';
    const { lang = this.getDefaultLang(options) } = options;
    // if we're in an addon, build import statement
    if (
      options.project.isEmberCLIAddon() ||
      (options.inRepoAddon && !options.inDummy)
    ) {
      if (options.pod) {
        templatePath = './template';
      } else {
        templatePath =
          pathUtil.getRelativeParentPath(options.entity.name) +
          'templates/components/' +
          stringUtil.dasherize(options.entity.name);
      }
      contents = '\n  layout';
    }

    const classifiedModuleName = stringUtil.classify(options.entity.name);
    return {
      classifiedModuleName,
      contents,
      lang,
      path: getPathOption(options)
    };
  }
};
