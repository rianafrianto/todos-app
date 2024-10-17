const TodoItem = ({ todo }) => {
    return (
      <li className="flex justify-between items-center p-2 border-b">
        <span>{todo.title}</span>
        <span>Keterangan : {todo.description}</span>
        <span className={`text-sm ${getStatusClass(todo.status)}`}>
          {todo.status}
        </span>
      </li>
    );
  };
  
  // Fungsi untuk memberikan kelas status berdasarkan kondisi
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
  
  export default TodoItem;
  