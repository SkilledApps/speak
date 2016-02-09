//
//  Utils.m
//  Hashley
//
//  Created by Dmitriy Loktev on 7/22/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//
#import "Utils.h"
#import <Crashlytics/Answers.h>

@implementation RCTHelpers

RCT_EXPORT_MODULE()


// RCT_EXPORT_METHOD(trackAction:(NSString *)imageName
//                   callback:(RCTResponseSenderBlock)callback)
// {
//   // TODO: Track the user action that is important for you.
//   [Answers logContentViewWithName:@"Tweet" contentType:@"Video" contentId:@"1234" customAttributes:attributes];
//
// }


RCT_EXPORT_METHOD(trackKeyAction:(NSString *)actionName
                  attributes:(NSDictionary *)attributes)
{
    // TODO: Move this method and customize the name and parameters to track your key metrics
  //       Use your own string attributes to track common values over time
  //       Use your own number attributes to track median value over time
  [Answers logCustomEventWithName:actionName customAttributes:attributes];

}





@end
