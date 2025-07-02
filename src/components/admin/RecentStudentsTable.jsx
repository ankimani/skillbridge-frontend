const RecentStudentsTable = () => {
    const recentStudents = [
      { id: 1, name: 'Alex Johnson', grade: '12', subjects: 4, joined: '2024-03-08' },
      { id: 2, name: 'Maria Garcia', grade: '11', subjects: 3, joined: '2024-03-07' },
      { id: 3, name: 'James Wilson', grade: '10', subjects: 2, joined: '2024-03-06' }
    ];
  
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Recent Students</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.grade}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.subjects}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default RecentStudentsTable;