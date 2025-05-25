import { use } from "react";
import DownloadClient from "./downloadClient";

export default function DownloadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // React 19-style unwrapping
  return <DownloadClient id={id} />;
}
