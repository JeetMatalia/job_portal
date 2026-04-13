import * as z from 'zod';

/**
 * Common Zod schemas for the application to ensure consistent validation logic.
 */

export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
    first_name: z.string().min(2, 'First name must be at least 2 characters'),
    last_name: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['job_seeker', 'recruiter'], { 
        required_error: 'Please select your role' 
    }),
});

export const companySchema = z.object({
    name: z.string().min(2, 'Company name is too short'),
    website: z.string().url('Please enter a valid URL (e.g., https://google.com)').or(z.string().min(1, 'Website is required')),
    location: z.string().min(2, 'Location is required'),
    description: z.string().min(20, 'Description should be at least 20 characters'),
});

export const jobSchema = z.object({
    title: z.string().min(3, 'Job title is too short'),
    description: z.string().min(20, 'Job description should be detailed (at least 20 chars)'),
    job_type: z.string().min(1, 'Please select a job type'),
    location: z.string().min(2, 'Location is required'),
    salary_min: z.coerce.number().min(0, 'Min salary must be non-negative'),
    salary_max: z.coerce.number().min(0, 'Max salary must be non-negative'),
    tags: z.array(z.string()).default([]),
    is_active: z.boolean().default(true),
}).refine(data => data.salary_max >= data.salary_min, {
    message: "Maximum salary cannot be less than minimum salary",
    path: ["salary_max"],
});

export const applicationSchema = z.object({
    cover_letter: z.string()
        .min(20, 'Your cover letter is a bit short. Tell them more!')
        .max(5000, 'Cover letter is too long (max 5000 chars)'),
});
