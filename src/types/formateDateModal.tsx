import { ChannelTypes } from "@prisma/client";
import { useState } from "react";

type FormData = {
  channel?: {
    name: string;
    typeChannel: ChannelTypes;
    isPrivate: boolean;
  };
  category?: {
    name: string;
  };
};

export const useFormData = () => {
  return useState<FormData>({
    channel: {
      name: "",
      typeChannel: "TEXT",
      isPrivate: false,
    },
    category: {
      name: ""
    }
  });
};