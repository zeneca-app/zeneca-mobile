import { useUserStore } from "@/storage/";
import useQuoteStore from "@/storage/quoteStore";
import useRecipientStore from "@/storage/recipientStore";
import useTransferStore from "@/storage/transferStore";
import { NativeModules } from "react-native";
import reactotronZustand from "reactotron-plugin-zustand";
import Reactotron from "reactotron-react-native";

// do not allow Reactotron to be used in production and in tests
if (__DEV__ && process.env.JEST_WORKER_ID === undefined) {
  let host = "localhost"; // default fallback

  try {
    host = NativeModules.SourceCode.scriptURL.split("://")[1].split(":")[0];
  } catch (error) {
    console.warn(
      "Failed to get host from SourceCode, falling back to localhost:",
      error,
    );
  }

  Reactotron.configure({ host })
    .useReactNative()
    .use(
      reactotronZustand({
        stores: [
          { name: "recipient", zustand: useRecipientStore },
          { name: "quote", zustand: useQuoteStore },
          { name: "transfer", zustand: useTransferStore },
          { name: "user", zustand: useUserStore },
        ],
      }),
    )
    .connect();

  // Logs can be displayed on Reactotron app.
  // console.log = Reactotron.log;
  // console.warn = Reactotron.log;
}
