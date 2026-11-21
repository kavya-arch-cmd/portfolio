/** Window event that glides the camera back to the overview. Kept apart from the 3D code so the UI can use it without loading three.js. */
export const RESET_VIEW_EVENT = 'kavya:reset-view';
/** Window event fired if the browser drops the 3D graphics context (GPU reset, too many tabs). */
export const WEBGL_LOST_EVENT = 'kavya:webgl-lost';
