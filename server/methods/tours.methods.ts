import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { check } from "meteor/check";
import { Tours } from "../../both/collections/tours.collection";
import { Tour } from "../../both/models/tour.model";
import { User } from "../../both/models/user.model";
import * as _ from 'underscore';

interface Options {
  [key: string]: any;
}

Meteor.methods({
    "tours.find": (options: Options, criteria: any, searchString: string) => {
        let where:any = [];
        let userId = Meteor.userId();
        where.push({
            "$or": [{deleted: false}, {deleted: {$exists: false} }]
        }, {
          "$or": [{active: true}, {active: {$exists: false} }]
        },
        {"owner.id": userId});

        if (!_.isEmpty(criteria)) {
          where.push(criteria);
        }

        // match search string
        if (typeof searchString === 'string' && searchString.length) {
            // allow search on firstName, lastName
            where.push({
                "$or": [
                    { "name": { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { "departure": { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { "destination": { $regex: `.*${searchString}.*`, $options: 'i' } }
                ]
            });
        }

        let cursor = Tours.collection.find({$and: where}, options);
        return {count: cursor.count(), data: cursor.fetch()};
    },
    "tours.findOne": (criteria: any) => {
      let where:any = [];
      where.push({
          "$or": [{deleted: false}, {deleted: {$exists: false} }]
      }, {
        "$or": [{active: true}, {active: {$exists: false} }]
      });
      if (_.isEmpty(criteria)) {
        criteria = { };
      }
      where.push(criteria);

      return Tours.collection.findOne({$and: where});
    },
    "tours.count": ( criteria: any, searchString: string ) => {
      let where:any = [];
      let userId = Meteor.userId();
      where.push({
          "$or": [{deleted: false}, {deleted: {$exists: false} }]
      }, {
        "$or": [{active: true}, {active: {$exists: false} }]
      },
      {"owner.id": userId});

      if (_.isEmpty(criteria)) {
        criteria = { };
      }
      criteria.approved = true;
      where.push(criteria);

      // match search string
      if (typeof searchString === 'string' && searchString.length) {
          // allow search on firstName, lastName
          where.push({
              "$or": [
                  { "name": { $regex: `.*${searchString}.*`, $options: 'i' } },
                  { "departure": { $regex: `.*${searchString}.*`, $options: 'i' } },
                  { "destination": { $regex: `.*${searchString}.*`, $options: 'i' } }
              ]
          });
      }

      let approvedCount =  Tours.collection.find({$and: where}).count();

      // find pending count
      criteria.approved = false;
      let pendingCount =  Tours.collection.find({$and: where}).count();
      let count = { };
      count["approvedCount"] = approvedCount;
      count["pendingCount"] = pendingCount;
      return count;
    },
    "tours.insert": (data: Tour) => {
      if (! Meteor.userId()) {
        throw new Meteor.Error(403, "Not authorized!");
      }

      let user = <User>Meteor.user();

      let owner = {
        id: user._id,
        companyName: user.supplier.companyName,
        agentIdentity: {
          verified: false
        },
        agentCertificate: {
          verified: false
        }
      };

      if (user.supplier.agentIdentity && user.supplier.agentIdentity.verified === true) {
        owner.agentIdentity.verified = true;
      }

      if (user.supplier.agentCertificate && user.supplier.agentCertificate.verified === true) {
        owner.agentCertificate.verified = true;
      }

      data.owner = owner;
      data.active = true;
      data.approved = false;
      data.deleted = false;
      data.createdAt = new Date();
      let tourId = Tours.collection.insert(data);
      return tourId;
    },
    "tours.delete": (id: string) => {
      let tour = Tours.collection.findOne({_id: id});
      if (typeof tour == "undefined" || !tour._id) {
          throw new Meteor.Error(`Invalid tour-id "${id}"`);
      }

      /* reset data in collections */
      Tours.collection.update({_id: tour._id}, {$set : {deleted: true } });
    },
    "tours.update": (data: Tour, id: string) => {
      data.modifiedAt = new Date();
      return Tours.collection.update({_id: id}, {$set: data});
    }
});
