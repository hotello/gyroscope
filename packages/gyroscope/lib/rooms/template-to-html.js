import { Meteor } from 'meteor/meteor';
import { SSR } from 'meteor/meteorhacks:ssr';

export const templateToHTML = function(name, data) {
  try {
    SSR.compileTemplate(
      name,
      Assets.getText(`email-templates/${name}.html`)
    );
    return SSR.render(name, data);
  } catch (exception) {
    throw new Meteor.Error('500', exception);
  }
};
