'use server';

import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Admin', 'Agent']).default('Agent'),
});

export async function signup(prevState: any, formData: FormData) {
  try {
    await connectDB();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;

    const validatedFields = signupSchema.safeParse({ name, email, password, role });

    if (!validatedFields.success) {
      return { error: validatedFields.error.flatten().fieldErrors };
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: { email: ['Email already exists'] } };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Signup error:', error);
    return { error: { message: 'Something went wrong. Please try again.' } };
  }
}
