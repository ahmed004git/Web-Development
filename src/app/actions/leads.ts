'use server';

import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';
import ActivityLog from '@/models/ActivityLog';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/lib/email';

// Helper to record activity
async function recordActivity(leadId: string, userId: string, action: string, details: string = '') {
  await ActivityLog.create({
    leadId,
    performedBy: userId,
    action,
    details,
  });
}

export async function createLead(formData: FormData) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) throw new Error('Not authenticated');

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const propertyInterest = formData.get('propertyInterest') as string;
    const budget = Number(formData.get('budget'));
    const notes = formData.get('notes') as string;

    const lead = await Lead.create({
      name,
      email,
      phone,
      propertyInterest,
      budget,
      notes,
    });

    await recordActivity(lead._id, (session.user as any).id, 'Lead Creation', `Lead created by ${session.user.name}`);

    // Email notification for new lead
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@example.com',
      subject: 'New Lead Created',
      text: `A new lead has been created: ${name} (${email}) for ${propertyInterest} with budget ${budget}.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #2563eb;">New Lead Alert</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Property:</strong> ${propertyInterest}</p>
          <p><strong>Budget:</strong> ${budget}</p>
          <p><strong>Notes:</strong> ${notes}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">This is an automated notification from PropertyCRM.</p>
        </div>
      `
    });

    revalidatePath('/');
    return { success: true, leadId: lead._id.toString() };
  } catch (error: any) {
    console.error('Create lead error:', error);
    return { error: error.message };
  }
}

export async function updateLead(leadId: string, data: any) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) throw new Error('Not authenticated');

    const oldLead = await Lead.findById(leadId);
    const lead = await Lead.findByIdAndUpdate(leadId, data, { new: true });

    let actionDetails = 'Updated fields: ' + Object.keys(data).join(', ');
    await recordActivity(leadId, (session.user as any).id, 'Lead Update', actionDetails);

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function assignLead(leadId: string, agentId: string) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'Admin') {
      throw new Error('Unauthorized');
    }

    const agent = await User.findById(agentId);
    if (!agent) throw new Error('Agent not found');

    const lead = await Lead.findByIdAndUpdate(leadId, { 
      assignedTo: agentId,
      status: 'Contacted' // Automatically move to contacted when assigned
    }, { new: true });

    await recordActivity(leadId, (session.user as any).id, 'Lead Assignment', `Lead assigned to agent: ${agent.name}`);

    // Notify Agent via Email
    await sendEmail({
      to: agent.email,
      subject: 'New Lead Assigned to You',
      text: `Hi ${agent.name}, you have been assigned a new lead: ${lead.name}.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #2563eb;">Lead Assignment</h2>
          <p>Hi ${agent.name},</p>
          <p>You have been assigned a new lead:</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <p><strong>Name:</strong> ${lead.name}</p>
            <p><strong>Email:</strong> ${lead.email}</p>
            <p><strong>Interest:</strong> ${lead.propertyInterest}</p>
          </div>
          <p>Please follow up with the client as soon as possible.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">PropertyCRM Assignment Notification</p>
        </div>
      `
    });

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteLead(leadId: string) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'Admin') {
      throw new Error('Unauthorized');
    }

    await Lead.findByIdAndDelete(leadId);
    // Optionally delete activity logs too
    await ActivityLog.deleteMany({ leadId });

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getLeadHistory(leadId: string) {
  try {
    await connectDB();
    const logs = await ActivityLog.find({ leadId })
      .populate('performedBy', 'name')
      .sort({ timestamp: -1 });
    return JSON.parse(JSON.stringify(logs));
  } catch (error) {
    return [];
  }
}

export async function getDashboardStats() {
  try {
    await connectDB();
    const totalLeads = await Lead.countDocuments();
    
    const statusDistribution = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const priorityDistribution = await Lead.aggregate([
      { $group: { _id: '$score', count: { $sum: 1 } } }
    ]);

    const agents = await User.find({ role: 'Agent' }).select('name email');
    const agentPerformance = await Promise.all(agents.map(async (agent) => {
      const assignedCount = await Lead.countDocuments({ assignedTo: agent._id });
      const closedCount = await Lead.countDocuments({ assignedTo: agent._id, status: 'Closed' });
      return {
        name: agent.name,
        assigned: assignedCount,
        closed: closedCount,
        efficiency: assignedCount > 0 ? (closedCount / assignedCount) * 100 : 0
      };
    }));

    return {
      totalLeads,
      statusDistribution: statusDistribution.map(s => ({ name: s._id, value: s.count })),
      priorityDistribution: priorityDistribution.map(p => ({ name: p._id, value: p.count })),
      agentPerformance
    };
  } catch (error) {
    console.error('Stats error:', error);
    return null;
  }
}

export async function getLeads(filters: any = {}) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) throw new Error('Not authenticated');

    let query: any = { ...filters };
    
    // Agent can only see their leads
    if ((session.user as any).role === 'Agent') {
      query.assignedTo = (session.user as any).id;
    }

    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    
    return JSON.parse(JSON.stringify(leads));
  } catch (error) {
    return [];
  }
}
