import { ApplicationStatus } from "@/lib/application-status";

export interface Application {
  application_id: string;
  job_post_id: string;
  job_seeker_id: string;
  employer_id: string;
  match_confidence: number;
  status: ApplicationStatus;
  status_changed_at: string;
  source: string;
  resume_url: string;
  created_at: string;
  updated_at: string;
  applicant: {
    name: string;
    email: string;
    phone: string;
    avatar: null;
    experience: string;
  };
  position: string;
  skills: string[];
  coverLetter: string;
  appliedDate: string;
}

export interface Employer {
  company: string;
  company_email: string;
  company_phone_number: string;
  name: string;
}
