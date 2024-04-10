import { createContext, useContext, useState } from "react";

const DoctorRatingContext = createContext();

export const DoctorRatingProvider = ({ children }) => {
    const [doctorRating, setDoctorRating] = useState(null);

    const storeDoctorRating = (doctor) => {
        setDoctorRating(doctor);
    };

    return (
        <DoctorRatingContext.Provider value={{ doctorRating, storeDoctorRating }}>
            {children}
        </DoctorRatingContext.Provider>
    );
};

export const useDoctorRating = () => {
    const context = useContext(DoctorRatingContext);
    if (!context) {
        throw new Error('useDoctorRating must be used within a DoctorRatingProvider');
    }
    return context;
};
