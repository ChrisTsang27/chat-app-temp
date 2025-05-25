import { useQueryState } from "nuqs";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const useProfileMemberId = () => {
  return useQueryState("profileMemberId");
};
