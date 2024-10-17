import {  AiOutlineUser, AiOutlineEdit, AiOutlineExclamationCircle } from 'react-icons/ai';
import Spinner from './Spinner';

const TodoList = (props) => {
  const { todos,
    handleEditTask,
    loading } = props

  if (loading) {
    return <Spinner/>;
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AiOutlineExclamationCircle className="text-gray-500 mb-2" size={50} />
        <p className="text-gray-500">Tidak ada data tugas yang ditemukan.</p>
      </div>
    );
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'Not Started':
        return 'text-gray-500';
      case 'On Progress':
        return 'text-yellow-500';
      case 'Done':
        return 'text-green-500';
      case 'Reject':
        return 'text-red-500';
      default:
        return '';
    }
  };

  return (
    <div>
      {todos.map((todo, index) => (
        <div key={todo.id || index} className="border p-4 mb-2 rounded flex justify-between items-center">
          <div>
            <h3 className="font-bold">{todo.title}</h3>
            <span className="text-sm">
              <span className="font-medium text-black">Status:</span>{' '}
              <span className={getStatusClass(todo.status)}>
                {todo.status}
              </span>
            </span>
            <p className="text-sm text-gray-500">
              <AiOutlineUser className="inline mr-1" />
              Diberikan kepada: {todo.assigned_to_name || "-"}
            </p>
            <p className="text-sm text-gray-600 ">
              <span className="font-medium text-black">Keterangan:</span>{' '}
              {todo.description || "Tidak ada keterangan."}
            </p>
          </div>
          <div>
            <div>
              <button
                onClick={() => handleEditTask(todo.id)} 
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                <AiOutlineEdit className="inline mr-1" />
                Edit
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
