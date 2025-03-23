import LoggedLayout from "@/components/LoggedLayout";
import { usePrefetchData } from "@/hooks/usePrefetchData";
import HomeActions from "@/components/HomeScreen/HomeActions";
import PositionsList from "@/components/HomeScreen/PositionsList";

const HomeScreen = () => {
  console.log('HomeScreen');
  usePrefetchData();

  return (
    <LoggedLayout>
      <PositionsList />
      <HomeActions />
    </LoggedLayout>
  );
};

export default HomeScreen;
