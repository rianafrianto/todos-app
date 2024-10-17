const EditTask = (props) => {
    const {
        editingTaskTitle,
        setEditingTaskTitle,
        editingTaskDescription,
        setEditingTaskDescription,
        editSelectedTeamMember,
        setEditSelectedTeamMember,
        teamMembers,
        handleEdit,
        cancelEdit,
        statusOptions,
        editingTaskStatus,
        setEditingTaskStatus,
        currentUserRole
    } = props;

    const isLeadFormIncomplete =
        !editingTaskTitle ||
        !editingTaskStatus ||
        !editingTaskDescription ||
        !editSelectedTeamMember;

    const isTeamFormIncomplete =
        !editingTaskDescription ||
        !editingTaskStatus;

    const disabledButton =
        currentUserRole === "Lead" ? isLeadFormIncomplete : isTeamFormIncomplete;

    return (
        <div className="mb-4 flex items-center space-x-2">
            {
                currentUserRole === "Lead" && (
                    <input
                        type="text"
                        placeholder="Edit Judul Tugas"
                        value={editingTaskTitle}
                        onChange={(e) => setEditingTaskTitle(e.target.value)}
                        className="border p-2 rounded mr-2 flex-grow w-1/3"
                    />
                )
            }
            <input
                type="text"
                placeholder="Edit Keterangan"
                value={editingTaskDescription}
                onChange={(e) => setEditingTaskDescription(e.target.value)}
                className="border p-2 rounded mr-2 flex-grow w-1/3"
            />
            {
                currentUserRole === "Lead" && (
                    <select
                        value={editSelectedTeamMember}
                        onChange={(e) => setEditSelectedTeamMember(e.target.value)}
                        className="border p-2 rounded mr-2 flex-grow w-1/4"
                    >
                        <option value="">Pilih Anggota Tim</option>
                        {teamMembers.map(member => (
                            <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                    </select>
                )
            }
            <select
                value={editingTaskStatus}
                onChange={(e) => setEditingTaskStatus(e.target.value)}
                className="border p-2 rounded mr-2 flex-grow w-1/4"
            >
                <option value="">Pilih Status</option>
                {statusOptions.map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                ))}
            </select>

            <button
                onClick={() => handleEdit()}
                className={`flex items-center p-2 rounded transition duration-200 
                    ${disabledButton ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                disabled={disabledButton}
            >
                Simpan
            </button>
            <button
                onClick={cancelEdit}
                className="bg-red-500 text-white p-2 rounded"
            >
                Batal
            </button>
        </div>
    );
};

export default EditTask;
