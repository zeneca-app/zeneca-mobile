import "./ReactotronConfig";
import "fast-text-encoding";
import "react-native-get-random-values";
import "@ethersproject/shims";
import "@/server/config";
import { registerRootComponent } from "expo";
import AppIndex from "./src";

registerRootComponent(AppIndex);
