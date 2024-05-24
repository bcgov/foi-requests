/**
 * Interface definition for the route, or step in the process of the FOI request.
 */
export interface BlobFile {
  file: Blob;
  filename: string;
}
export interface FoiRequest {
  requestData: any;
  attachments?: Array<BlobFile>;
}
