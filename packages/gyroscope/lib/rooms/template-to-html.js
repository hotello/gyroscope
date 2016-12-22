import { Meteor } from 'meteor/meteor';
import { SSR } from 'meteor/meteorhacks:ssr';

import { general } from '../core/settings.js';

export const templateToHTML = function(name, data) {
  // check if an external assets object has been set
  const enclosingAppAssets = general.get('assets');
  // set email templates path
  const emailTemplatePath = general.get('assets.emailTemplates') + `/${name}.html`;
  // try template rendering
  try {
    // parse template
    const template = enclosingAppAssets ?
                     enclosingAppAssets.getText(emailTemplatePath) :
                     Assets.getText(emailTemplatePath);
    // compile template
    SSR.compileTemplate(
      name,
      template
    );
    return SSR.render(name, data);
  } catch (exception) {
    throw new Meteor.Error('500', 'Email template not found.');
  }
};
