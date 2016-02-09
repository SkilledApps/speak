#import "RCTBridgeModule.h"


@interface RCTHelpers : NSObject <RCTBridgeModule>

- (void)trackKeyAction:(NSString *)actionName attributes:(NSDictionary *) attributes;

@end
