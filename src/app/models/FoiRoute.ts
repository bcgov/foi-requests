/**
 * Interface definition for the route, or step in the process of the FOI request.
 */
export interface FoiRoute {
    route: string;
    progress: number;
    back?: string;
    choices?: any;
    data?: any;
    forward?: string;
}