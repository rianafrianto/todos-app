"use client"
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TodoList from './components/TodoList';
import api from '@/lib/api';
import Swal from 'sweetalert2';
import CreateTask from './components/CreateTask';
import EditTask from './components/EditTask';
import { statusOptions } from '@/lib/status';
import Empty from "../app/icon/empty.svg"
import Image from 'next/image';

const HomePage = () => {
  const [todos, setTodos] = useState([]);
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');
  const [selectedTeamMember, setSelectedTeamMember] = useState('')
  const [editSelectedTeamMember, setEditSelectedTeamMember] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [editingTaskDescription, setEditingTaskDescription] = useState("")
  const [selectedStatus, setSelectedStatus] = useState('')
  const [editingTaskStatus, setEditingTaskStatus] = useState('');
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);


  // Fetch all todos list
  const fetchTodos = async () => {
    try {
      const response = await api.get('/todos');
      if (response.data.success) {
        setTodos(response?.data?.data);
      } else {
        console.log(response.data.message);
      }
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'Cool'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch all users
  const fetchTeamMembers = async () => {
    try {
      const response = await api.get('/users');
      if (response.data.success) {
        const teamMembersData = response.data.data.filter(user => user.role === 'Team');
        setTeamMembers(teamMembersData);
      }
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'Cool',
      });
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Create Todos
  const addTodo = async (newTask) => {
    try {
      const response = await api.post('/todos', newTask);
      if (response.data.success) {
        setTodos((prevTodos) => [...prevTodos, response.data.data]);
        await fetchTodos()
        Swal.fire({
          title: 'success!',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'Tutup'
        });
      } else {
        console.log(response.data.message);
        Swal.fire({
          title: 'Error!',
          text: response.data.message,
          icon: 'error',
          confirmButtonText: 'Tutup'
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'Tutup'
      });
    }
  };

  const handleCreateTask = () => {
    if (newTaskTitle.trim() === '' || !selectedTeamMember || newTaskDescription.trim() === '') return;

    const newTask = {
      title: newTaskTitle,
      description: newTaskDescription,
      status: selectedStatus,
      assigned_to: Number(selectedTeamMember),
      created_by: user?.id
    };

    addTodo(newTask);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setSelectedTeamMember('');
    setSelectedStatus('');
  };

  const editTodo = async (editedTask) => {
    try {
      const response = await api.put('/todos', editedTask);
      if (response.data.success) {
        setTodos(todos.map(todo =>
          todo.id === editedTask.id ? response.data.data : todo
        ));
        await fetchTodos();
        Swal.fire({
          title: 'Success!',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'Tutup'
        });
      } else {
        console.log(response.data.message);
        Swal.fire({
          title: 'Error!',
          text: response.data.message,
          icon: 'error',
          confirmButtonText: 'Tutup'
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'Tutup'
      });
    }
  };
  

  const handleEditTask = (taskId) => {
    const taskToEdit = todos.find(todo => todo.id === taskId);
    if (taskToEdit) {
      setEditingTaskId(taskId);
      setEditingTaskTitle(taskToEdit.title);
      setEditingTaskDescription(taskToEdit.description);
      setEditSelectedTeamMember(taskToEdit.assigned_to);
      setEditingTaskStatus(taskToEdit.status);
    }
  };

  const handleSaveEdit = async () => {
    const editedTask = {
      id: editingTaskId,
      description: editingTaskDescription, 
      status: editingTaskStatus, 
      updated_by: user?.id,
      userRole : user?.role
    };
  
    // Jika role adalah 'Lead', tambahkan title dan assigned_to
    if (user.role === 'Lead') {
      editedTask.title = editingTaskTitle;
      editedTask.assigned_to = Number(editSelectedTeamMember); 
    }
  
    await editTodo(editedTask);
    setEditingTaskId(null);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingTaskTitle('');
    setEditingTaskDescription('');
    setEditSelectedTeamMember(''); 
    setEditingTaskStatus('');
  };


  return (
    <div>
      <Navbar token={token} setToken={setToken} setUser={setUser} user={user} />
      <main className="p-4">
        {token ? (
          <>
            {
              user.role === "Lead" && (
                <h2 className="text-xl font-semibold mb-4">
                  {!editingTaskId ? 'Buat' : 'Edit'} Todo List
                </h2>
              )
            }
            {user?.role === 'Lead' && editingTaskId === null && (
              <CreateTask
                newTaskTitle={newTaskTitle}
                setNewTaskTitle={setNewTaskTitle}
                handleCreateTask={handleCreateTask}
                teamMembers={teamMembers}
                selectedTeamMember={selectedTeamMember}
                setSelectedTeamMember={setSelectedTeamMember}
                setNewTaskDescription={setNewTaskDescription}
                newTaskDescription={newTaskDescription}
                statusOptions={statusOptions}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
              />
            )}

            {editingTaskId && (
              <EditTask
                editingTaskTitle={editingTaskTitle}
                setEditingTaskTitle={setEditingTaskTitle}
                editingTaskDescription={editingTaskDescription}
                setEditingTaskDescription={setEditingTaskDescription}
                editSelectedTeamMember={editSelectedTeamMember}
                setEditSelectedTeamMember={setEditSelectedTeamMember}
                teamMembers={teamMembers}
                handleEdit={handleSaveEdit}
                cancelEdit={handleCancelEdit}
                statusOptions={statusOptions}
                editingTaskStatus={editingTaskStatus}
                setEditingTaskStatus={setEditingTaskStatus}
                currentUserRole={user.role}
              />
            )}

            {
              user.role === "Lead" && (
                <hr className="pt-2" />
              )
            }

            <h2 className="text-xl font-semibold mb-4">Daftar Todo List</h2>

            <TodoList
              todos={todos}
              currentUserRole={user.role}
              handleEditTask={handleEditTask}
              loading={loading}
            />
          </>
        ) : (
          <div className="min-h-screen flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold mb-6">Selamat Datang di Todos App!</h2>
            <p className='text-xl font-semibold mb-5 '>Silahkan Melakukan Login / Register untuk menggunakan aplikasi ini!</p>
            <div className="flex space-x-4">
              <Image src={Empty} width={300} height={200} alt='empty' priority />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
