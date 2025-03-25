import { useState } from "react";

import OTAPageOne from "./ota-page-one";
import OTAPageTwo from "./ota-page-two";

function PendaftaranOrangTua() {
  const [page, setPage] = useState(1);

  return page === 1 ? <OTAPageOne /> : <OTAPageTwo />;
}

export default PendaftaranOrangTua;
