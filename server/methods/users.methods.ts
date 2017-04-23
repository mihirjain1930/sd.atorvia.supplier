import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import { Users } from '../../both/collections/users.collection';

Meteor.methods({
    "users.insert": (userData: {email: string, passwd: string, profile?: any}): string => {
        let userDetails = {
            email: userData.email,
            password: userData.passwd,
            profile: userData.profile
        };
        let userId = Accounts.createUser(userDetails);
        if (userId)
        {
          Meteor.setTimeout(function () {
            Accounts.sendVerificationEmail(userId);
          }, 500);
        }
        return userId;
    },
    "users.update": (userData: {"profile" : any }, email: {oldAddress?: string, newAddress?: string}={}): any => {
      if (! Meteor.userId()) {
        throw new Meteor.Error(403, "Not authorized!");
      }

      if (email.oldAddress != email.newAddress) {
        try {
          let success = Meteor.users.update({ _id: Meteor.userId(), 'emails.address': email.oldAddress },
           { $set: { 'emails.$.address': email.newAddress }});
           if (! success) {
             throw new Meteor.Error(500, "Error while updating email address.");
           }
         } catch (e) {
           switch(e.code) {
             case 11000:
              throw new Meteor.Error(500, "Duplicate email submitted. Please supply unique email address.");
             break;
             default:
              throw new Meteor.Error(500, "Error while updating email address.");
             break;
           }
         }
      }

      return Meteor.users.update({
        _id: Meteor.userId()
      }, {
        $set: userData
      });
    },
    "users.findByPasswdToken": (token: string): any => {
      let userDetail = Meteor.users.findOne({"services.password.reset.token": token});
      if (userDetail && userDetail._id) {
        return userDetail._id;
      } else {
        return null;
      }
    },
    "users.resendVerificationEmail": (email: string) => {
      let user = Meteor.users.findOne({"emails.address": email});
      if (! user || !user._id) {
        throw new Meteor.Error(403, "No matching records found with your email.");
      }

      if (user.emails[0].verified === true) {
        throw new Meteor.Error(403, "Your account is already verified. Please login to continue.");
      }

      Meteor.setTimeout(function () {
        Accounts.sendVerificationEmail(user._id);
      }, 500);
    },
    "users.verifyEmailToken": (token: string): any => {
      let userDetail = Meteor.users.findOne({"services.email.verificationTokens.token": token});
      if (!userDetail || !userDetail._id) {
        return null;
      }
      let userId = userDetail._id;

      // find email address
      let verificationTokens = userDetail.services.email.verificationTokens;
      let emailAddress = null;
      for (let i=0; i<verificationTokens.length; i++) {
        if (verificationTokens[i] ["token"] == token) {
          emailAddress = verificationTokens[i] ["address"];
        }
      }
      // set email verified
      let emails = userDetail.emails;
      for (let i=0; i<emails.length; i++) {
        if (emails[i] ["address"] == emailAddress) {
          emails[i] ["verified"] = true;
        }
      }
      // update emails array in user collection
      Meteor.users.update({_id: userId}, {$set: {emails: emails} });
      return userId;
    },
    "users.resetPasswd": (token: string, newPasswd: string) : void => {
        let userId = Meteor.call("users.findByPasswdToken", token);
        if (! userId || ! userId.length) {
          throw new Meteor.Error(403, "Not authorized");
        }
        return Accounts.setPassword(userId, newPasswd);
    },
    /* find logged-in user */
    "users.findOne": () => {
      let userId = Meteor.userId();
      if (! userId) {
        throw new Meteor.Error(403, "Not authorized!");
      }
      return Meteor.users.findOne({ _id: userId });
    }
})
