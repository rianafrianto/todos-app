import pool from '@/lib/db';
import { formatResponse } from '@/lib/response';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, todos_id, action, changed_by, created_at, description 
      FROM todos_log 
      ORDER BY created_at DESC
    `);
    return NextResponse.json(formatResponse(true, 200, result.rows, "Get Todos Logs Successfully"));
  } catch (error) {
    console.error('Error fetching todos log:', error);
    return NextResponse.json(formatResponse(false, 500, null, 'Failed to fetch todos log'));
  }
}
