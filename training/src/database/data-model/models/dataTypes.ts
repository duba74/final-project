export type VillageData = {
    id: string;
    name: string;
    zone_code: string;
    zone_name: string;
    district_code: string;
    district_name: string;
    country_code: string;
    country_name: string;
    is_active: boolean;
    latitude: number | null;
    longitude: number | null;
};

export type ClientData = {
    id: string;
    first_name: string;
    last_name: string | null;
    village: string;
    sex: string | null;
    age_group: string | null;
    phone_1: string | null;
    phone_2: string | null;
    is_leader: boolean;
};

export type TrainingModuleData = {
    id: string;
    name: string;
    topic: string;
    country: string;
    start_date: number;
    end_date: number;
    is_active: boolean;
};

export type StaffData = {
    id: string;
    first_name: string;
    last_name: string;
    role_id: string;
    role_name: string;
    country: string;
};

export type AssignmentData = {
    id: string;
    staff: string;
    village: string;
    start_date: number;
    end_date: number;
};
