import { format } from 'date-fns';

export const getSmartDate = (dateString: string | null): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

    // Otherwise show formatted date
    return format(date, "MMM d, h:mm a");
}; 