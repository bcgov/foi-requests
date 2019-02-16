/**
 * Interface definition for the route, or step in the process of the FOI request.
 */
export interface FoiRoute {
    route: string;
    back?: string;
    forward?: string;
    progress: number;
    options?: any;
    choices?: any;
}