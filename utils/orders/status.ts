import { Order } from '@/client';

export type OrderStatus = Order['status'];

export const getStatusColor = (status: OrderStatus): string => {
    const statusColors = {
        FILLED: 'green-500',
        PENDING: 'yellow-500',
        CANCELLED: 'red-500',
        ERROR: 'red-500',
        REJECTED: 'red-500',
        REQUIRING_CONTACT: 'red-500',
        ESCROWED: 'gray-500',
        SUBMITTED: 'gray-500',
        PENDING_CANCEL: 'gray-500',
        PENDING_ESCROW: 'gray-500',
        PENDING_FILL: 'gray-500',
        PENDING_SUBMIT: 'gray-500',
    };

    return statusColors[status] || 'gray-500';
}; 