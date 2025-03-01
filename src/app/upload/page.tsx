import { div } from "framer-motion/client";
import UploadRequest from "./upload-request";
import Navigation from "../components/navigation";

export default function Page() {
  return( <div>
    <Navigation />
    <UploadRequest />
  </div>);
}
