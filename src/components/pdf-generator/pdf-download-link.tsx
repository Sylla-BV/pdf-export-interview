import React from 'react';
import Link from 'next/link';

interface PdfDownloadLinkProps {
  token: string;
  className?: string;
}

const PdfDownloadLink: React.FC<PdfDownloadLinkProps> = ({
  token,
  className = 'text-blue-600 underline',
}) => (
  <Link href={`/api/pdf/${token}`} target='_blank' rel='noopener noreferrer' className={className}>
    Download PDF
  </Link>
);

export default PdfDownloadLink;
