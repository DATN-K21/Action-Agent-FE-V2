export interface IMCP {
  id: string;
  mcpName: string;
  url: string;
  connectionType: 'sse';
  description?: string; // Optional field for description
  transport: string; // Transport type, e.g., 'streamable_http', 'sse'
}
