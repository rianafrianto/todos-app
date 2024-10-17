import pool from '@/lib/db';
import { formatResponse } from '@/lib/response';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const query = `
            SELECT 
                todos.id, 
                todos.title, 
                todos.description, 
                todos.status, 
                todos.created_at, 
                todos.updated_at, 
                users.name AS assigned_to_name
            FROM 
                todos
            LEFT JOIN 
                users ON todos.assigned_to = users.id
            ORDER BY 
                todos.created_at DESC
        `;
        const result = await pool.query(query);
        return NextResponse.json(formatResponse(true, 200, result.rows, "Get All Todos Successfully"));
    } catch (error) {
        console.error('Error fetching todos:', error);
        return NextResponse.json(formatResponse(false, 500, null, 'Failed to fetch todos'));
    }
}


export async function POST(req) {
    try {
        const { title, status, assigned_to, created_by, description } = await req.json();

        // Validasi input
        if (!title || !status || !assigned_to || !created_by) {
            return NextResponse.json(
                formatResponse(false, 400, null, 'All fields are required')
            );
        }

        const client = await pool.connect();

        try {
            // Mulai transaksi 
            await client.query('BEGIN');

            // Insert ke tabel `todos`
            const todosResult = await client.query(
                `INSERT INTO todos (title, status, assigned_to, created_by, description, created_at, updated_at) 
                 VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
                 RETURNING id, title, status, assigned_to, created_by, description, created_at, updated_at`,
                [title, status, assigned_to, created_by, description] 
              );

            const newTodo = todosResult.rows[0]; 

            // Insert ke tabel `todos_log` dengan action 'created'
            await client.query(
                `INSERT INTO todos_log (todos_id, action, changed_by, description, created_at) 
           VALUES ($1, 'created', $2, $3, NOW())`,
                [newTodo.id, created_by, description || 'Task created']
            );

            // Commit transaksi 
            await client.query('COMMIT');

            // Return response dengan data todo baru (tanpa id dan created_by di response)
            const { id, created_by: _, ...todoResponse } = newTodo;

            return NextResponse.json(
                formatResponse(true, 201, { todo: todoResponse }, 'Task created successfully')
            );
        } catch (error) {
            await client.query('ROLLBACK'); // Rollback jika ada error
            console.error('Transaction error:', error);
            return NextResponse.json(
                formatResponse(false, 500, null, 'Failed to create task')
            );
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Request error:', error);
        return NextResponse.json(
            formatResponse(false, 500, null, 'Internal server error')
        );
    }
}


export async function PUT(req) {
    const { id, title, status, assigned_to, updated_by, description, userRole } = await req.json();

    // Validasi input
    if (!id || !status || !updated_by || !description) {
        return NextResponse.json(formatResponse(false, 400, null, 'All fields are required'));
    }

    try {
        // Cek apakah todo dengan ID tersebut ada
        const todoCheck = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
        if (todoCheck.rowCount === 0) {
            return NextResponse.json(formatResponse(false, 404, null, 'Todo not found'));
        }

        const existingTodo = todoCheck.rows[0];

        // Cek apakah status baru sama dengan status saat ini
        if (existingTodo.status === status) {
            return NextResponse.json(formatResponse(false, 400, null, 'New status cannot be the same as the current status'));
        }

        // Update todo jika validasi lolos
        // Jika role adalah Team, hanya update status dan deskripsi
        let updateQuery;
        let updateValues;

        if (userRole === 'Team') {
            // Hanya update status dan deskripsi
            updateQuery = `
                UPDATE todos 
                SET status = $1, description = $2, updated_at = NOW() 
                WHERE id = $3 
                RETURNING *`;
            updateValues = [status, description, id];
        } else {
            // Update semua field untuk role Lead
            updateQuery = `
                UPDATE todos 
                SET title = $1, status = $2, assigned_to = $3, description = $4, updated_at = NOW() 
                WHERE id = $5 
                RETURNING *`;
            updateValues = [title, status, assigned_to, description, id];
        }

        const updateResult = await pool.query(updateQuery, updateValues);
        const updatedTodo = updateResult.rows[0];

        // Catat perubahan di todos_log
        await pool.query(
            `INSERT INTO todos_log (todos_id, action, changed_by, created_at, description) 
             VALUES ($1, 'status_changed', $2, NOW(), $3)`,
            [updatedTodo.id, updated_by, description]
        );

        return NextResponse.json(formatResponse(true, 200, updatedTodo, 'Todo updated successfully'));
    } catch (error) {
        console.error('Error updating todo:', error);
        return NextResponse.json(formatResponse(false, 500, null, 'Error updating todo'));
    }
}
