/**
 * Spacing of the world. Layout coordinates throughout the code are authored at 1.0
 * and multiplied by WORLD_SCALE, so destinations, road and landscaping get more room
 * without the buildings themselves shrinking.
 */
export const WORLD_SCALE = 1.32;
/** Buildings and signboards are enlarged a little so destinations read as the heroes. */
export const BUILDING_SCALE = 1.14;
/** Platform footprints grow with the buildings that sit on them. */
export const PLATFORM_SCALE = 1.1;
