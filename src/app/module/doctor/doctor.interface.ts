import { Gender } from "../../../generated/prisma/enums";

export interface IUpdateDoctorSpecialtyPayload {
    specialtyId: string;
    shouldDelete?: boolean;
}

export interface IUpgradeDoctorPaylod {
  doctor?:{
        name?: string;
        profilePhoto?: string;
        contactNumber?: string;
        address?: string;
        experience?: number;
        registrationNumber?: string;
        gender?: Gender;
        appointmentFee?: number;
        qualification?: string;
        currentWorkingPlace?: string;
        designation?: string;
    }
  specialization?:IUpdateDoctorSpecialtyPayload[]
}
