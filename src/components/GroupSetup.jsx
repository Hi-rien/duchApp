import { useState, useEffect } from 'react'
import Footer from './Footer'

function GroupSetup({ 
  groupName, 
  setGroupName, 
  members, 
  setMembers, 
  onNextStep,
  onNavigate,
  currentPage 
}) {
  const [newMemberName, setNewMemberName] = useState('')
  const [savedGroups, setSavedGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState('')
  const [shouldSaveGroup, setShouldSaveGroup] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // 로컬 스토리지에서 기존 모임 목록 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('dutchPayGroups')
    if (saved) {
      setSavedGroups(JSON.parse(saved))
    }
  }, [])

  // 기존 모임 선택 시 정보 불러오기
  const handleGroupSelect = (groupId) => {
    if (groupId === '') {
      setSelectedGroup('')
      setGroupName('')
      setMembers([])
      return
    }

    const group = savedGroups.find(g => g.id === groupId)
    if (group) {
      setSelectedGroup(groupId)
      setGroupName(group.name)
      setMembers(group.members)
    }
  }

  // 인원 추가
  const addMember = () => {
    if (newMemberName.trim() && !members.includes(newMemberName.trim())) {
      const updatedMembers = [...members, newMemberName.trim()]
      setMembers(updatedMembers)
      setNewMemberName('')
    }
  }

  // 인원 삭제
  const removeMember = (memberToRemove) => {
    const updatedMembers = members.filter(member => member !== memberToRemove)
    setMembers(updatedMembers)
  }

  // 모임 저장
  const saveGroup = () => {
    if (!shouldSaveGroup || !groupName || members.length === 0) {
      return false
    }

    try {
      const groupId = selectedGroup || Date.now().toString()
      const groupData = {
        id: groupId,
        name: groupName,
        members: members,
        createdAt: selectedGroup ? savedGroups.find(g => g.id === selectedGroup)?.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      let updatedGroups
      if (selectedGroup) {
        updatedGroups = savedGroups.map(g => g.id === selectedGroup ? groupData : g)
        setSaveMessage('✅ 모임이 수정되었습니다!')
      } else {
        updatedGroups = [...savedGroups, groupData]
        setSaveMessage('✅ 모임이 저장되었습니다!')
      }

      setSavedGroups(updatedGroups)
      localStorage.setItem('dutchPayGroups', JSON.stringify(updatedGroups))
      
      if (!selectedGroup) {
        setSelectedGroup(groupId)
      }

      setTimeout(() => setSaveMessage(''), 3000)
      return true
    } catch (error) {
      setSaveMessage('❌ 저장에 실패했습니다.')
      setTimeout(() => setSaveMessage(''), 3000)
      return false
    }
  }

  // 다음 단계 처리
  const handleNextStep = () => {
    if (shouldSaveGroup) {
      const saved = saveGroup()
      if (saved) {
        setTimeout(() => {
          onNextStep()
        }, 500)
      }
    } else {
      onNextStep()
    }
  }

  // Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addMember()
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white min-[500px]:shadow-lg border-0 min-[500px]:border border-gray-100 h-full flex flex-col min-[500px]:rounded-xl min-[500px]:m-3 min-[500px]:h-auto">
        {/* 헤더 - 고정 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 text-center flex-shrink-0">
          <h1 className="text-lg font-bold mb-1">더치페이 계산기</h1>
          <p className="text-blue-100 text-xs">모임 정보를 입력해주세요</p>
        </div>

        {/* 콘텐츠 - 스크롤 */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4">
              {/* 상단 영역 */}
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

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">
                    🔄 기존 모임 불러오기
                  </label>
                  <div className="relative">
                    <select
                      value={selectedGroup}
                      onChange={(e) => handleGroupSelect(e.target.value)}
                      className="w-full p-4 pr-12 border-0 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 focus:ring-3 focus:ring-blue-300 focus:outline-none transition-all duration-300 text-sm font-medium text-gray-700 shadow-sm appearance-none cursor-pointer"
                    >
                      <option value="">✨ 새로운 모임 만들기</option>
                      {savedGroups.map(group => (
                        <option key={group.id} value={group.id}>
                          {group.name} ({group.members.length}명)
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">
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

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">
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
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-md disabled:shadow-none text-sm"
                    >
                      추가
                    </button>
                  </div>
                </div>
              </div>

              {/* 참가자 목록 */}
              {members.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700">
                    ✅ 참가자 목록 ({members.length}명)
                  </label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex flex-wrap gap-2">
                      {members.map((member, index) => (
                        <div key={index} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                          <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
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

              {/* 하단 영역 */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={shouldSaveGroup}
                        onChange={(e) => setShouldSaveGroup(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                        shouldSaveGroup 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300 hover:border-green-400'
                      }`}>
                        {shouldSaveGroup && (
                          <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-green-700">💾 이 모임 정보 저장하기</span>
                  </label>
                </div>

                <button
                  onClick={handleNextStep}
                  disabled={!groupName || members.length === 0}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg disabled:shadow-none text-sm"
                >
                  {members.length === 0 
                    ? '참가자를 추가해주세요' 
                    : `다음 단계 (메뉴 입력) →`
                  }
                </button>
              </div>
            </div>
          </div>
        
        {/* 푸터 - 고정 */}
        <Footer currentPage={currentPage} onNavigate={onNavigate} />
      </div>
    </div>
  )
}

export default GroupSetup 