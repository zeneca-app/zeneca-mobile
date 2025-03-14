import SkeletonLoadingView, {
    SkeletonOrderListItem,
} from "@/components/Loading/SkeletonLoadingView";

export const LoadingState = () => (
    <SkeletonLoadingView className="flex-1 flex">
        <SkeletonOrderListItem />
        <SkeletonOrderListItem />
        <SkeletonOrderListItem />
        <SkeletonOrderListItem />
        <SkeletonOrderListItem />
        <SkeletonOrderListItem />
        <SkeletonOrderListItem />
    </SkeletonLoadingView>
); 