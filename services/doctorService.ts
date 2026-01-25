import { Video, Phone, MessageCircle } from 'lucide-react';

export interface Doctor {
    id: string;
    name: string;
    degree: string;
    specialty: string;
    languages: string[];
    experience: string;
    photo: string;
    rating: number;
    availableModes: ('video' | 'audio' | 'chat')[];
    about: string;
}

export interface TimeSlot {
    id: string;
    time: string;
    label: string; // e.g. "Today", "Tomorrow"
    available: boolean;
}

const mockDoctors: Record<string, Doctor[]> = {
    'pregnancy': [
        {
            id: 'd1',
            name: 'Dr. Aditi Sharma',
            degree: 'MBBS, MD (Obstetrics)',
            specialty: 'Prenatal & Postpartum Care',
            languages: ['Hindi', 'English', 'Tamil'],
            experience: '12+ years',
            photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
            rating: 4.9,
            availableModes: ['video', 'audio', 'chat'],
            about: 'Specializes in high-risk pregnancies and natural birthing techniques.'
        },
        {
            id: 'd2',
            name: 'Dr. Rajesh Gupta',
            degree: 'MBBS, MS (Gynecology)',
            specialty: 'Fetal Medicine',
            languages: ['Hindi', 'English'],
            experience: '15+ years',
            photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
            rating: 4.8,
            availableModes: ['video', 'audio'],
            about: 'Expert in fetal health monitoring and growth tracking.'
        }
    ],
    'pre-pregnancy': [
        {
            id: 'd3',
            name: 'Dr. Priya Desai',
            degree: 'MD, Reproductive Medicine',
            specialty: 'Fertility Specialist',
            languages: ['English', 'Marathi', 'Hindi'],
            experience: '10+ years',
            photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face',
            rating: 4.9,
            availableModes: ['video', 'chat'],
            about: 'Helping couples with conception planning and fertility treatments.'
        },
        {
            id: 'd3_2',
            name: 'Dr. Vikram Malhotra',
            degree: 'MBBS, MD',
            specialty: 'Fertility Specialist',
            languages: ['English', 'Hindi'],
            experience: '14+ years',
            photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
            rating: 4.8,
            availableModes: ['video', 'audio'],
            about: 'Expert in IVF and assisted reproductive technologies.'
        }
    ],
    'mental-health': [
        {
            id: 'd4',
            name: 'Dr. Meera Kapoor',
            degree: 'PhD, Clinical Psychology',
            specialty: 'Perinatal Mental Health',
            languages: ['English', 'Hindi'],
            experience: '8+ years',
            photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
            rating: 4.9,
            availableModes: ['video', 'audio', 'chat'],
            about: 'Supporting emotional wellness during and after pregnancy.'
        },
        {
            id: 'd4_2',
            name: 'Dr. Sarah Jenkin',
            degree: 'MSc, Psychology',
            specialty: 'Postpartum Depression',
            languages: ['English'],
            experience: '6+ years',
            photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
            rating: 4.7,
            availableModes: ['video', 'chat'],
            about: 'Specialized therapy for new mothers dealing with anxiety and depression.'
        }
    ],
    'baby': [
        {
            id: 'd5',
            name: 'Dr. Suresh Reddy',
            degree: 'MBBS, MD (Pediatrics)',
            specialty: 'Newborn Care',
            languages: ['English', 'Telugu', 'Hindi'],
            experience: '20+ years',
            photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face',
            rating: 5.0,
            availableModes: ['video', 'audio'],
            about: 'Dedicated to the health and development of newborns and infants.'
        },
        {
            id: 'd5_2',
            name: 'Dr. Amit Patel',
            degree: 'MBBS, DCH',
            specialty: 'Pediatrician',
            languages: ['Hindi', 'Gujarati', 'English'],
            experience: '9+ years',
            photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
            rating: 4.8,
            availableModes: ['video', 'chat'],
            about: 'Friendly pediatric care focusing on growth and immunization.'
        }
    ],
    'nutrition': [
        {
            id: 'd6',
            name: 'Dt. Anjali Singh',
            degree: 'MSc, Food & Nutrition',
            specialty: 'Pregnancy Dietician',
            languages: ['Hindi', 'English', 'Punjabi'],
            experience: '7+ years',
            photo: 'https://images.unsplash.com/photo-1580281658626-ee379f3cce93?w=150&h=150&fit=crop&crop=face',
            rating: 4.7,
            availableModes: ['video', 'chat'],
            about: 'Personalized meal plans for healthy weight gain and nutrition.'
        },
        {
            id: 'd6_2',
            name: 'Dt. Riya Sharma',
            degree: 'BSc, Clinical Nutrition',
            specialty: 'Lactation Consultant',
            languages: ['Hindi', 'English'],
            experience: '5+ years',
            photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face',
            rating: 4.8,
            availableModes: ['video', 'audio'],
            about: 'Guiding mothers on breastfeeding and postnatal nutrition.'
        }
    ]
};

const mockSlots: TimeSlot[] = [
    { id: '1', time: '10:00 AM', label: 'Today', available: true },
    { id: '2', time: '11:30 AM', label: 'Today', available: true },
    { id: '3', time: '2:00 PM', label: 'Today', available: false },
    { id: '4', time: '4:30 PM', label: 'Today', available: true },
    { id: '5', time: '9:00 AM', label: 'Tomorrow', available: true },
    { id: '6', time: '11:00 AM', label: 'Tomorrow', available: true },
];

export const doctorService = {
    getDoctorsByType: async (type: string): Promise<Doctor[]> => {
        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockDoctors[type] || mockDoctors['pregnancy']);
            }, 600);
        });
    },

    getAvailableSlots: async (doctorId: string, date: string): Promise<TimeSlot[]> => {
        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(() => {
                // In a real app, we'd filter by doctorId and date
                resolve(mockSlots);
            }, 500);
        });
    }
};
