import { TouchableOpacity } from 'react-native';
import Text from '@/components/Text';

interface TabButtonProps {
    title: string;
    active: boolean;
    onPress: () => void;
}

export const TabButton = ({ title, active, onPress }: TabButtonProps) => (
    <TouchableOpacity
        className={`py-2 mx-1.5 px-3 rounded-full flex-1 items-center ${
            active ? 'bg-[#2C2C2E] border border-[#2C2C2E]' : 'bg-transparent border border-[#2C2C2E]'
        }`}
        onPress={onPress}
    >
        <Text className="text-sm text-white">
            {title}
        </Text>
    </TouchableOpacity>
); 