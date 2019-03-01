import { FoiRequest } from "../models/FoiRequest";
import { FoiRoute } from "../models/FoiRoute";

export class MockDataService {
  getCurrentState(dataKey?: string): FoiRequest {
    const state = { requestData: {} };
    // Ensure that dataKey exists before returning.
    if (dataKey) {
      state.requestData[dataKey] = state.requestData[dataKey] || {};
    }
    return state;
  }
  getRoute(routeUrl: string): FoiRoute {
    const rt: FoiRoute = { route: "/somewhere", progress: 2 };
    return rt;
  }
}
export class MockRouter {
  url: "/general/somewhere";
}
