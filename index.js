import "./ReactotronConfig";
import "fast-text-encoding";
import "react-native-get-random-values";
import "@ethersproject/shims";
import { registerRootComponent } from "expo";
import AppIndex from "./src";

const App = AppIndex;

registerRootComponent(App);
