import { useState, useEffect } from 'react'
import Footer from './Footer'

function GroupManagement({ onNavigate, currentPage }) {
  const [savedGroups, setSavedGroups] = useState([])
  const [editingGroup, setEditingGroup] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [members, setMembers] = useState([])
  const [newMemberName, setNewMemberName] = useState('')
  const [saveMessage, setSaveMessage] = useState('')

  // 저장된 모임 목록 불러오기
  useEffect(() => {
    const groups = JSON.parse(localStorage.getItem('dutchPayGroups') || '[]')
    setSavedGroups(groups.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)))
  }, [])

  // 새 모임 추가 시작
  const startAddGroup = () => {
    setShowAddForm(true)
    setEditingGroup(null)
    setGroupName('')
    setMembers([])
    setNewMemberName('')
  }

  // 모임 수정 시작
  const startEditGroup = (group) => {
    setEditingGroup(group)
    setShowAddForm(true)
    setGroupName(group.name)
    setMembers([...group.members])
    setNewMemberName('')
  }

  // 인원 추가
  const addMember = () => {
    if (newMemberName.trim() && !members.includes(newMemberName.trim())) {
      setMembers([...members, newMemberName.trim()])
      setNewMemberName('')
    }
  }

  // 인원 삭제
  const removeMember = (memberToRemove) => {
    setMembers(members.filter(member => member !== memberToRemove))
  }

  // Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addMember()
    }
  }

  // 모임 저장
  const saveGroup = () => {
    if (!groupName.trim() || members.length === 0) {
      setSaveMessage('❌ 모임명과 참가자를 입력해주세요.')
      setTimeout(() => setSaveMessage(''), 3000)
      return
    }

    try {
      const groupId = editingGroup?.id || Date.now().toString()
      const groupData = {
        id: groupId,
        name: groupName.trim(),
        members: members,
        createdAt: editingGroup?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      let updatedGroups
      if (editingGroup) {
        updatedGroups = savedGroups.map(g => g.id === groupId ? groupData : g)
        setSaveMessage('✅ 모임이 수정되었습니다!')
      } else {
        updatedGroups = [groupData, ...savedGroups]
        setSaveMessage('✅ 모임이 추가되었습니다!')
      }

      setSavedGroups(updatedGroups)
      localStorage.setItem('dutchPayGroups', JSON.stringify(updatedGroups))
      
      // 폼 초기화
      setShowAddForm(false)
      setEditingGroup(null)
      setGroupName('')
      setMembers([])
      setNewMemberName('')

      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage('❌ 저장에 실패했습니다.')
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  // 모임 삭제
  const deleteGroup = (groupId, groupName) => {
    if (confirm(`"${groupName}" 모임을 정말로 삭제하시겠습니까?`)) {
      const updatedGroups = savedGroups.filter(g => g.id !== groupId)
      setSavedGroups(updatedGroups)
      localStorage.setItem('dutchPayGroups', JSON.stringify(updatedGroups))
      setSaveMessage('✅ 모임이 삭제되었습니다.')
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  // 폼 취소
  const cancelForm = () => {
    setShowAddForm(false)
    setEditingGroup(null)
    setGroupName('')
    setMembers([])
    setNewMemberName('')
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white min-[500px]:shadow-lg border-0 min-[500px]:border border-gray-100 h-full flex flex-col min-[500px]:rounded-xl min-[500px]:m-3 min-[500px]:h-auto">
        {/* 헤더 - 고정 */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-3 text-center flex-shrink-0">
          <h1 className="text-lg font-bold mb-1">👥 모임 관리</h1>
          <p className="text-purple-100 text-xs">모임과 참가자를 등록하고 관리하세요</p>
        </div>

        {/* 콘텐츠 - 스크롤 */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-4">
              {saveMessage && (
                <div className={`p-3 rounded-lg text-sm font-medium text-center ${
                  saveMessage.includes('✅') 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {saveMessage}
                </div>
              )}

              {/* 새 모임 추가 버튼 */}
              {!showAddForm && (
                <button
                  onClick={startAddGroup}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  새 모임 추가
                </button>
              )}

              {/* 모임 추가/수정 폼 */}
              {showAddForm && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-sm font-bold text-gray-800">
                      {editingGroup ? '모임 수정' : '새 모임 추가'}
                    </h2>
                    <button
                      onClick={cancelForm}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        📝 모임명
                      </label>
                      <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="예: 회사 회식, 동창회 등"
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        👥 참가자 추가
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMemberName}
                          onChange={(e) => setNewMemberName(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="참가자 이름"
                          className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-sm"
                        />
                        <button
                          onClick={addMember}
                          disabled={!newMemberName.trim()}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-md disabled:shadow-none text-sm"
                        >
                          추가
                        </button>
                      </div>
                    </div>

                    {members.length > 0 && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          ✅ 참가자 목록 ({members.length}명)
                        </label>
                        <div className="bg-white rounded-lg p-3 max-h-32 overflow-y-auto">
                          <div className="flex flex-wrap gap-2">
                            {members.map((member, index) => (
                              <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg shadow-sm border border-gray-100">
                                <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {index + 1}
                                </div>
                                <span className="text-gray-800 font-medium text-sm">{member}</span>
                                <button
                                  onClick={() => removeMember(member)}
                                  className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-all duration-200"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={cancelForm}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-all duration-200 text-sm"
                      >
                        취소
                      </button>
                      <button
                        onClick={saveGroup}
                        disabled={!groupName.trim() || members.length === 0}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg disabled:shadow-none text-sm"
                      >
                        {editingGroup ? '수정 완료' : '저장'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

                             {/* 저장된 모임 목록 */}
               <div>
                 <h2 className="text-sm font-bold text-gray-800 mb-2">
                   📋 등록된 모임 ({savedGroups.length}개)
                 </h2>
                 
                 {savedGroups.length > 0 ? (
                   <div className="space-y-3">
                    {savedGroups.map((group) => (
                      <div key={group.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-800">{group.name}</h3>
                            <p className="text-sm text-gray-600">{group.members.length}명 참여</p>
                            <p className="text-xs text-gray-500">
                              수정일: {new Date(group.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditGroup(group)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 text-xs"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => deleteGroup(group.id, group.name)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 text-xs"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {group.members.slice(0, 5).map((member, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {member}
                            </span>
                          ))}
                          {group.members.length > 5 && (
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                              +{group.members.length - 5}명 더
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                                 ) : (
                   <div className="flex items-center justify-center py-12">
                     <div className="text-center space-y-4 p-8">
                       <div className="text-6xl">👥</div>
                       <h2 className="text-xl font-bold text-gray-800">등록된 모임이 없습니다</h2>
                       <p className="text-gray-600">
                         새 모임을 추가하여 시작해보세요.
                       </p>
                     </div>
                   </div>
                 )}
               </div>
             </div>
           </div>
        
        {/* 푸터 - 고정 */}
        <Footer currentPage={currentPage} onNavigate={onNavigate} />
      </div>
    </div>
   )
 }

 export default GroupManagement 