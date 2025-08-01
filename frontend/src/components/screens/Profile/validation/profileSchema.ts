import * as yup from 'yup';

export const profileSchema = yup.object({
    name: yup.string().required('Name is required'),
    role: yup.string().oneOf(['engineer', 'manager']).required('Role is required'),
    skills: yup.string().required('At least one skill is required'),
    seniority: yup.string().oneOf(['junior', 'mid', 'senior']).required('Seniority is required'),
    maxCapacity: yup.number().min(0).max(100).required('Max capacity is required'),
    department: yup.string().required('Department is required'),
  });

  export type ProfileForm = yup.InferType<typeof profileSchema>;    