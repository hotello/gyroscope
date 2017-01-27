import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { templateToHTML } from './template-to-html.js';

export const sendEmail = (template, { to, from, replyTo, subject, attachments }, payload) => {
  const email = {
    to,
    from,
    replyTo,
    subject,
    html: templateToHTML(template, payload),
  };

  if (attachments) email.attachments = attachments;

  Meteor.defer(() => { Email.send(email); });
};
