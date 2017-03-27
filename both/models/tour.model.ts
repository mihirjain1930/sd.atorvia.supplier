import { CollectionObject } from "./collection-object.model";

export interface Tour extends CollectionObject {
    /* step 1 */
    name: string;
    description: string;
    departure: string;
    destination: string;
    noOfDays: number;
    noOfNights: number;
    tourType: string;
    tourPace: string;
    hasGuide: boolean;
    /* step 2 */
    dateRange: [{
      date: Date;
      seats: number;
      price: {
        adult: number;
        child: number;
      },
      hasDeparture: boolean;
    }];
    /* step 3 */
    itenerary: [
      {
        icon: string;
        dayNum: number;
        title: string;
        description: string;
        hotelType?: string;
        hotelName?: string;
        hasBreakfast: boolean;
        hasLunch: boolean;
        hasDinner: boolean;
      }
    ];
    /* step 4 */
    featuredImage: string;
    images: [
      {
        id: string;
      }
    ],
    /*  step 5*/
    inclusions: string;
    exclusions: string;
    cancellationPolicy: string;
    refundPolicy: string;
    /*  default */
    ownerId: string;
    active: boolean;
    approved: boolean;
    deleted: boolean;
    createdAt: Date;
    modifiedAt: Date;
}
