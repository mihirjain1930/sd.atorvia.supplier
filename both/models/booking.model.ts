import { CollectionObject } from "./collection-object.model";

export interface Booking extends CollectionObject {
    tour: {
      id: string;
      supplierId: string;
      name: string;
      departure: string;
      destination: string;
      featuredImage: {
        id: string;
        url: string;
        name: string;
      };
      dateRangeId?: string;
    };
    user: {
      id: string;
      firstName: string;
      middleName: string;
      lastName: string;
      email: string;
      contact: string;
      image: {
        id: string;
        url: string;
        name: string;
      };
    };
    numOfTravellers: number;
    startDate: Date;
    endDate: Date;
    numOfAdults: number;
    numOfChild: number;
    pricePerAdult: number;
    pricePerChild: number;
    travellers: [
      {
        firstName: string;
        middleName: string;
        lastName: string;
        email: string;
        contact: string;
        addressLine1: string;
        addressLine2: string;
        town: string;
        state: string;
        postCode: string;
        country: string;
        passport: {
          country: string;
          number: string;
        };
        specialRequest: string;
      }
    ];
    cardDetails: {
      name: string;
      cardNum: number;
      type: string;
      expiry: Date;
    };
    totalPrice: number;
    paymentDate: Date;
    active: boolean;
    confirmed: boolean;
    cancelled: boolean;
    completed: boolean;
    cancellationReason: string;
    denied: boolean;
    deniedReason: string;
    deleted: boolean;
    createdAt: Date;
    modifiedAt: Date;
}