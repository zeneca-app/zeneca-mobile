import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { cssInterop } from "nativewind";
import { forwardRef, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// We reexport the components provided by @gorhom/bottom-sheet as a
// convenience to use a single import source
export {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetFlatList,
  BottomSheetFlashList,
  BottomSheetSectionList,
  BottomSheetVirtualizedList,
  BottomSheetFooter,
  BottomSheetTextInput,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
export { default as BottomSheetButton } from "./components/BottomSheetButton";

export type BottomSheetProps = {
  children: React.ReactNode;
  onChange?: () => void;
  indicatorClasses?: string;
  backgroundClasses?: string;
  backdropClasses?: string;
  snapPoints?: (number | `${number}%`)[];
  enablePanDownToClose?: boolean;
  keyboardBehavior?: "extend" | "interactive" | "fillParent" | "fillParentIgnoreKeyboard";
  keyboardBlurBehavior?: "none" | "restore";
  android_keyboardInputMode?: "adjustPan" | "adjustResize";
};

/**
 * NOTE: To display the modal you need to pass a Ref
 * please refer to https://gorhom.dev/react-native-bottom-sheet/
 */

const BottomSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
  (
    {
      children,
      onChange = undefined,
      indicatorClasses = "",
      backgroundClasses = "",
      backdropClasses = "",
      snapPoints = undefined, // Passing an array of values will disable dinamic sizing
    },
    ref,
  ) => {
    const insets = useSafeAreaInsets();

    const indicatorDefaultClasses = "bg-dark-background-80 w-12 my-2";
    const backgroundDefaultClasses = "bg-dark-background-100 rounded m-2";
    const backdropDefaultClasses = "bg-gray-alpha-90";

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.76}
          className={`${backdropDefaultClasses} ${backdropClasses}`}
          {...props}
        />
      ),
      [],
    );
    // Remap classes props to style props of BottomSheet
    cssInterop(BottomSheetModal, {
      indicatorClasses: "handleIndicatorStyle",
      backgroundClasses: "backgroundStyle",
    });

    return (
      <BottomSheetModal
        ref={ref}
        onChange={onChange}
        enablePanDownToClose
        //TODO enhance props to override snappoints if needed
        enableDynamicSizing={!snapPoints}
        snapPoints={snapPoints}
        index={0}
        //Raise it from the bottom using the safe view bottom inset
        bottomInset={insets.bottom}
        // set `detached` to true to lift it from bottom of view port to follow design
        detached={true}
        backdropComponent={renderBackdrop}
        indicatorClasses={`${indicatorDefaultClasses} ${indicatorClasses}`}
        backgroundClasses={`${backgroundDefaultClasses} ${backgroundClasses}`}
      >
        {children}
      </BottomSheetModal>
    );
  },
);

BottomSheet.displayName = "BottomSheet";

export default BottomSheet;
