import { OrangTuaRegistrationSchema } from "@/lib/zod/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import OTAPageOne from "./ota-page-one";
import OTAPageTwo from "./ota-page-two";

export type OrangTuaRegistrationFormValues = z.infer<
  typeof OrangTuaRegistrationSchema
>;

function PendaftaranOrangTua() {
  const [page, setPage] = useState(1);

  const form = useForm<OrangTuaRegistrationFormValues>({
    resolver: zodResolver(OrangTuaRegistrationSchema),
  });

  return (
    <div>
      {page === 1 ? (
        <OTAPageOne setPage={setPage} mainForm={form} />
      ) : (
        <OTAPageTwo setPage={setPage} mainForm={form} />
      )}
    </div>
  );
}

export default PendaftaranOrangTua;
