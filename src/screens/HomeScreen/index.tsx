import LoggedLayout from "@/components/LoggedLayout";
import { usePrefetchData } from "@/hooks/usePrefetchData";
import HomeActions from "@/screens/HomeScreen/components/HomeActions";
import PositionsList from "@/screens/HomeScreen/components/PositionsList";

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
