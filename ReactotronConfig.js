import { NativeModules } from "react-native";
import Reactotron from "reactotron-react-native";

// do not allow Reactotron to be used in production and in tests
if (__DEV__ && process.env.JEST_WORKER_ID === undefined) {
  const host = NativeModules.SourceCode.scriptURL.split("://")[1].split(":")[0];
  Reactotron.configure({ host }).useReactNative().connect();

  // Logs can be displayed on Reactotron app.
  // console.log = Reactotron.log;
  // console.warn = Reactotron.log;
}
