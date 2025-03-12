import LoggedLayout from "@/components/LoggedLayout";
import { usePrefetchData } from "@/hooks/usePrefetchData";
import HomeActions from "@/components/HomeScreen/HomeActions";
import PositionsList from "@/components/HomeScreen/PositionsList";

const HomeScreen = () => {
  usePrefetchData();

  return (
    <LoggedLayout>
      <PositionsList />
      <HomeActions />
    </LoggedLayout>
  );
};

HomeScreen.displayName = "HomeScreen";
export default HomeScreen;
