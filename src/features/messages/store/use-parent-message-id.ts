import { useQueryState } from "nuqs";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const useParentMessageId = () => {
  return useQueryState("parentMessageId");
};
