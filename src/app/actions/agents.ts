'use server';

import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function getAgents() {
  try {
    await connectDB();
    const agents = await User.find({ role: 'Agent', status: 'Active' }).select('name email');
    return JSON.parse(JSON.stringify(agents));
  } catch (error) {
    return [];
  }
}
