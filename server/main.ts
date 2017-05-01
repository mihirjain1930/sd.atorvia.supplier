import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import './startup/accounts-config';
import './imports/publications/users';
import './imports/routers/places.routes.ts';
import './startup/email-config';

Meteor.startup(() => {
  // send email notification to admin for tours approval
  Meteor.setInterval(() => {
    Meteor.call("tours.requestApproval");
  }, 5 * 60 * 1000)
});
