"use server"

import Razorpay from 'razorpay';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// The ! assumes we have these in environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createEscrowOrder(postId: string, freelancerId: string, amount: number) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("You must be logged in to fund an escrow.");
    }

    // Escrow fee: WRKZ takes 15% platform fee
    const fee = Math.floor(amount * 0.15);
    const totalAmount = amount + fee;

    // Create razorpay order
    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // amount in paise (1 INR = 100 paise)
      currency: "INR",
      receipt: `receipt_${postId}_${Date.now()}`,
    });
    
    // Save to escrows table as 'locked'
    const { error } = await supabase.from('escrows').insert({
      post_id: postId,
      client_id: user.id,
      freelancer_id: freelancerId,
      amount,
      fee,
      razorpay_order_id: order.id,
      status: 'locked'
    });

    if (error) {
      throw error;
    }

    return { 
      orderId: order.id, 
      amount: order.amount, 
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID // Safe to send public key to frontend
    };
  } catch (err: any) {
    console.error(err);
    return { error: err.message };
  }
}

export async function verifyPayment(orderId: string, paymentId: string, signature: string) {
  try {
    const text = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex");

    if (expectedSignature === signature) {
      const supabase = await createClient();
      
      // Update escrow status to funded
      await supabase.from('escrows').update({
        status: 'funded',
        razorpay_payment_id: paymentId
      }).eq('razorpay_order_id', orderId);

      return { success: true };
    } else {
      return { error: "Invalid payment signature" };
    }
  } catch (err: any) {
    return { error: err.message };
  }
}
