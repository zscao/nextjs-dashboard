'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid', 'draft']),
  date: z.string(),
});

const CreateRequest = FormSchema.pick({customerId: true, amount: true, status: true})
const UpdateRequest = FormSchema.pick({customerId: true, amount: true, status: true})

export async function createInvoice(formData: FormData) {

  const rawData = Object.fromEntries(formData.entries());
  const { customerId, amount, status } = CreateRequest.parse(rawData);
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `; 

  const path = '/dashboard/invoices';
  revalidatePath(path);
  redirect(path);
}

export async function updateInvoice(id: string, formData: FormData) {

  const rawData = Object.fromEntries(formData.entries());
  const { customerId, amount, status } = UpdateRequest.parse(rawData);
  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  const path = `/dashboard/invoices`;
  revalidatePath(path);
  redirect(path)
}

export async function deleteInvoice(id: string) {
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}