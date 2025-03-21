import {
  onboardingOnboardingAddressStepMutation,
  onboardingOnboardingCountryStepMutation,
  onboardingOnboardingNamesStepMutation,
} from "@/client/@tanstack/react-query.gen";
import { useMutation } from "@tanstack/react-query";

export const useOnboardingMutations = (onSuccess: () => void) => {
  const { mutate: updateNamesStep, isPending: isOnboardingNamesStepPending } =
    useMutation({
      ...onboardingOnboardingNamesStepMutation(),
      onError: (error) => {
        console.error("Error updating names:", error);
      },
      onSuccess,
    });

  const {
    mutate: updateCountryStep,
    isPending: isOnboardingCountryStepPending,
  } = useMutation({
    ...onboardingOnboardingCountryStepMutation(),
    onError: (error) => {
      console.error("Error updating country:", error);
    },
    onSuccess,
  });

  const {
    mutate: updateAddressStep,
    isPending: isOnboardingAddressStepPending,
  } = useMutation({
    ...onboardingOnboardingAddressStepMutation(),
    onError: (error) => {
      console.error("Error updating address:", error);
    },
    onSuccess,
  });

  return {
    mutations: {
      updateNamesStep,
      updateCountryStep,
      updateAddressStep,
    },
    isPending:
      isOnboardingNamesStepPending ||
      isOnboardingCountryStepPending ||
      isOnboardingAddressStepPending,
  };
};
