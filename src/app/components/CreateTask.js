import { AiOutlinePlus } from 'react-icons/ai';

const CreateTask = (props) => {
    const {
        newTaskTitle,
        setNewTaskTitle,
        newTaskDescription,
        setNewTaskDescription,
        handleCreateTask,
        teamMembers,
        selectedTeamMember,
        setSelectedTeamMember,
        statusOptions,
        selectedStatus,
        setSelectedStatus
    } = props;

    const disabledButton = !newTaskTitle || !newTaskDescription || !selectedTeamMember || !selectedStatus
    return (
        <div className="mb-4 flex items-center">
            <input
                type="text"
                placeholder="Masukkan task baru"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="border p-2 rounded mr-2 flex-grow w-1/4"
            />

            <textarea
                placeholder="Keterangan"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="border p-2 rounded mr-2 flex-grow w-1/4"
                rows="1"
            />

            <select
                value={selectedTeamMember}
                onChange={(e) => setSelectedTeamMember(e.target.value)}
                className="border p-2 rounded mr-2 flex-grow w-1/4"
            >
                <option value="">Pilih Anggota Tim</option>
                {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                ))}
            </select>

            <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border p-2 rounded mr-2 flex-grow w-1/4"
            >
                <option value="">Pilih Status</option>
                {statusOptions.map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                ))}
            </select>

            <button
                disabled={disabledButton}
                onClick={handleCreateTask}
                className={`flex items-center p-2 rounded transition duration-200 
                ${disabledButton ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
                <AiOutlinePlus className="mr-1" />
                Simpan
            </button>
        </div>
    );
};

export default CreateTask;
