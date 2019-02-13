/**
 * Interface definition for the route, or step in the process of the FOI request.
 */
export interface FoiRoute {
    route: string;
    progress: string;
    options?: any;
    choices?: any;
}