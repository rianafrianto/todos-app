// src/app/api/auth/login.js
import pool from '@/lib/db';
import bcrypt from 'bcrypt';
import { generateToken } from '@/lib/token';
import { formatResponse } from '@/lib/response'; // Import fungsi formatResponse
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email, password } = await req.json();

  // Validasi input
  if (!email || !password) {
    return NextResponse.json(formatResponse(false, 400, null, 'Email and password are required'));
  }

  // Validasi format email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(formatResponse(false, 400, null, 'Invalid email format'));
  }

  try {
    // Cek apakah email terdaftar
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rowCount === 0) {
      return NextResponse.json(formatResponse(false, 401, null, 'Invalid email or password'));
    }

    const user = result.rows[0];

    // Periksa password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(formatResponse(false, 401, null, 'Invalid email or password'));
    }

    // Buat token JWT
    const token = generateToken(user); // Menggunakan fungsi generateToken

    // Kirim respons tanpa password dan id
    const { password: userPassword, email: userEmail, created_at, updated_at, ...userData } = user

    return NextResponse.json(formatResponse(true, 200, { user: userData, token }, "Login Successfully"));
  } catch (error) {
    return NextResponse.json(formatResponse(false, 500, null, 'Error logging in'));
  }
}
