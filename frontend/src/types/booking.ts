export interface Booking {
    _id: string;
    mentorId: string;
    studentId: string;
    date: string;
    startTime: string;
    endTime: string;
    price: number;
    status: 'pending' | 'paid' | 'cancelled' | 'completed';
    payment?: {
        razorpay_order_id?: string;
        razorpay_payment_id?: string;
    };
    createdAt: string;
    updatedAt: string;
}
