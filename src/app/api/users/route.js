import pool from '@/lib/db';
import { formatResponse } from '@/lib/response';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const result = await pool.query('SELECT id, name, role FROM users ORDER BY created_at DESC');
        return NextResponse.json(formatResponse(true, 200, result.rows, "Get All Users Successfully"));
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(formatResponse(false, 500, null, 'Failed to fetch users'));
    }
}