export interface Clip {
  title: string;
  justification: string;
  startTime: string;
  endTime: string;
  caption: string;
}

export interface Project {
  id: string;
  userId: string;
  videoTitle: string;
  transcript: string;
  videoUrl?: string;
  clips: Clip[];
  createdAt: any;
  status: 'completed' | 'processing' | 'failed' | 'queued';
  batchId?: string;
  platform?: 'tiktok' | 'reels' | 'shorts';
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: any;
}
