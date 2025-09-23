export interface DownloadLinkProps {
  downloadUrl: string;
  expiresAt: Date;
  onCountdownComplete?: () => void;
}
