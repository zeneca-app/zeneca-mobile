import { loginLoginOrCreate } from "@/client/";
import { usersMeOptions } from "@/client/@tanstack/react-query.gen";
import client from "@/client/client";
import { getPimlicoSmartAccountClient } from "@/lib/pimlico";
import { useChainStore } from "@/storage/chainStore";
import { useUserStore } from "@/storage/";
import { useEmbeddedWallet, useLoginWithEmail, usePrivy } from "@privy-io/expo";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "burnt";
import { useCallback, useEffect, useRef, useState } from "react";

const useUserServices = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(undefined);

    const queryClient = new QueryClient();

    const loginOrCreateMutationPending = useRef<boolean>(false);

    const [isNewUser, setIsNewUser] = useState(false);

    const { user, setUser } = useUserStore((state) => state);

    const chain = useChainStore((state) => state.chain);

    const navigation = useNavigation();

    const { user: privyUser, getAccessToken } = usePrivy();

    const wallet = useEmbeddedWallet();

    const [isFocussed, setIsFocussed] = useState<boolean>(false);

    useFocusEffect(
        useCallback(() => {
            setIsFocussed(true);
            return () => {
                setIsFocussed(false);
            };
        }, []),
    );

    const fetchUserData = async () => {
        try {
            const response = await queryClient.fetchQuery({
                ...usersMeOptions({
                    client,
                }),
            });
            console.log("FETCHED USER DATA", response);
            setUser({ ...response, isNewUser: isNewUser });
            setIsLoading(false);
            navigation.navigate("Home");
            return response;
        } catch (err) {
            console.error("FETCH USER DATA", err);
            return false;
        }
    };

    const {
        state: loginWithEmailState,
        sendCode,
        loginWithCode,
    } = useLoginWithEmail({
        onError: (error) => {
            setUser(undefined);
            console.error("ERRRORRRR", error);
            setIsLoading(false);
            setError(true);
            handleLoginError(error);
        },
        onLoginSuccess(user, isNewUser) {
            setUser(undefined);
            setIsNewUser(!!isNewUser);
            setIsLoading(true);
            console.log("LOGGED IN", user);
        },
    });

    //const { login: loginWithOAuth, state } = useLoginWithOAuth();

    useEffect(() => {
        const asyncLoginOrCreate = async () => {
            loginOrCreateMutationPending.current = true;
            const email = privyUser?.linked_accounts.find(
                (account) => account.type === "email",
            );
            const address = wallet?.account?.address;
            const accessToken = await getAccessToken();
            const smartAccount = await getPimlicoSmartAccountClient(
                wallet?.account?.address as `0x${string}`,
                chain,
                wallet,
            );

            try {
                const response = await loginLoginOrCreate({
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: {
                        email: email?.address as string,
                        has_third_party_auth: false,
                        wallet: {
                            address: address as `0x${string}`,
                            smart_account_address: smartAccount?.account
                                ?.address as `0x${string}`,
                        },
                    },
                });
                if (response.response.ok) {
                    console.log("LOGIN OR CREATE SUCCESS");
                } else {
                    console.error(
                        "LOGIN OR CREATE ERROR",
                        JSON.stringify(response.error, null, 2),
                    );
                }
                await fetchUserData();
                loginOrCreateMutationPending.current = false;
            } catch (err) {
                console.error("LOGIN OR CREATE", err);
                loginOrCreateMutationPending.current = false;
            }
        };

        const asyncFetch = async () => {
            await fetchUserData();
        };

        if (isFocussed && !user) {
            //If user has been created and is missing a wallet, create one
            if (
                loginWithEmailState?.status === "done" &&
                wallet?.status === "not-created" &&
                privyUser
            ) {
                //console.log("Privy user created begin embedded wallet creation");
                wallet.create!();
            }

            //If new user has been created and wallet is connected, create smart account and login
            if (
                loginWithEmailState?.status === "done" &&
                wallet?.status === "connected" &&
                privyUser &&
                isNewUser
            ) {
                if (loginOrCreateMutationPending.current) return;
                asyncLoginOrCreate();
            }

            //If returning user
            if (
                loginWithEmailState?.status === "done" &&
                wallet?.status === "connected" &&
                privyUser &&
                !isNewUser
            ) {
                asyncFetch();
            }
        }
    }, [
        isFocussed,
        loginWithEmailState?.status,
        wallet?.status,
        privyUser,
        isNewUser,
        user,
    ]);

    const handleLoginError = (err: Error) => {
        toast({
            title: err.message,
            preset: "error",
        });
    };

    const submitEmail = async (email: string) => {
        /* if (email === TEST_EMAIL) {
          successLogin();
          return;
        } */

        setIsLoading(true);
        //setLoadingMessage(t("loginWithEmail.sendingCode"));
        await sendCode({ email: email! });
        //setLoadingMessage("");
        setIsLoading(false);
        //setLoginStatus(LoginStatus.EMAIL_SEND);
        navigation.navigate("EmailOtpValidation");
    };

    return {
        submitEmail,
        isLoading,
        setIsLoading,
        sendCode,
        error,
        loginWithCode,
        loginWithEmailState,
        fetchUserData,
    };
};

export default useUserServices;