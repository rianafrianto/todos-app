import pool from '@/lib/db';
import bcrypt from 'bcrypt';
import { generateToken } from '@/lib/token'; 
import { formatResponse } from '@/lib/response';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { name, email, password, role } = await req.json();

  // Validasi input
  if (!name || !email || !password || !role) {
    return NextResponse.json(formatResponse(false, 400, null, 'All fields are required'));
  }

  // Validasi format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(formatResponse(false, 400, null, 'Invalid email format'));
  }

  // Validasi panjang password
  if (password.length < 6) {
    return NextResponse.json(formatResponse(false, 400, null, 'Password must be at least 6 characters long'));
  }

  // Cek apakah email sudah terdaftar
  const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (existingUser.rowCount > 0) {
    return NextResponse.json(formatResponse(false, 400, null, 'Email already registered'));
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, role]
    );

    const token = generateToken(result.rows[0]);

    return NextResponse.json(formatResponse(true, 201, { name: result.rows[0].name, token }, "Create User Successfully"));
  } catch (error) {
    return NextResponse.json(formatResponse(false, 500, null, 'Error creating user'));
  }
}
