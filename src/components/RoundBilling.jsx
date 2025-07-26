import { useState, useRef } from 'react'
import Footer from './Footer'

function RoundBilling({ 
  groupName, 
  members, 
  rounds, 
  setRounds, 
  onPreviousStep,
  onNextStep,
  onNavigate,
  currentPage 
}) {
  const [newRoundStoreName, setNewRoundStoreName] = useState('')
  const [newMenuName, setNewMenuName] = useState('')
  const [newMenuPrice, setNewMenuPrice] = useState('')
  const [newMenuQuantity, setNewMenuQuantity] = useState(1)
  
  // 스크롤 영역 ref
  const scrollRef = useRef(null)

  // 차수 추가
  const addRound = () => {
    if (!newRoundStoreName.trim()) return

    const newRound = {
      id: Date.now().toString(),
      roundNumber: rounds.length + 1,
      storeName: newRoundStoreName.trim(),
      payer: '',
      menus: []
    }

    setRounds([...rounds, newRound])
    setNewRoundStoreName('')
    
    // 새 차수 추가 후 스크롤을 맨 아래로 이동
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }, 100)
  }

  // 차수 삭제
  const removeRound = (roundId) => {
    const updatedRounds = rounds.filter(round => round.id !== roundId)
      .map((round, index) => ({ ...round, roundNumber: index + 1 }))
    setRounds(updatedRounds)
  }

  // 결제자 변경
  const updatePayer = (roundId, payer) => {
    const updatedRounds = rounds.map(round =>
      round.id === roundId 
        ? { 
            ...round, 
            payer,
            // 결제자 변경 시 모든 메뉴에 새 결제자가 포함되도록 업데이트
            menus: round.menus.map(menu => ({
              ...menu,
              participants: payer && !menu.participants.includes(payer)
                ? [...menu.participants, payer]
                : menu.participants
            }))
          }
        : round
    )
    setRounds(updatedRounds)
  }

  // 메뉴 추가
  const addMenu = (roundId) => {
    if (!newMenuName.trim() || !newMenuPrice || newMenuQuantity < 1) return

    const round = rounds.find(r => r.id === roundId)
    if (!round) return

    // 결제자가 확실히 포함되도록 설정
    let participants = [...members]
    if (round.payer && !participants.includes(round.payer)) {
      participants.push(round.payer)
    }

    const newMenu = {
      id: Date.now().toString(),
      name: newMenuName.trim(),
      price: parseInt(newMenuPrice),
      quantity: parseInt(newMenuQuantity),
      participants: participants
    }

    const updatedRounds = rounds.map(round =>
      round.id === roundId 
        ? { ...round, menus: [...round.menus, newMenu] }
        : round
    )

    setRounds(updatedRounds)
    setNewMenuName('')
    setNewMenuPrice('')
    setNewMenuQuantity(1)
  }

  // 메뉴 삭제
  const removeMenu = (roundId, menuId) => {
    const updatedRounds = rounds.map(round =>
      round.id === roundId
        ? { ...round, menus: round.menus.filter(menu => menu.id !== menuId) }
        : round
    )
    setRounds(updatedRounds)
  }

  // 메뉴 참여자 토글
  const toggleMenuParticipant = (roundId, menuId, member) => {
    // 결제자는 토글할 수 없음
    const round = rounds.find(r => r.id === roundId)
    if (round && round.payer === member) {
      return
    }

    const updatedRounds = rounds.map(round =>
      round.id === roundId
        ? {
            ...round,
            menus: round.menus.map(menu =>
              menu.id === menuId
                ? {
                    ...menu,
                    participants: menu.participants.includes(member)
                      ? menu.participants.filter(p => p !== member)
                      : [...menu.participants, member]
                  }
                : menu
            )
          }
        : round
    )
    setRounds(updatedRounds)
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white min-[500px]:shadow-lg border-0 min-[500px]:border border-gray-100 h-full flex flex-col min-[500px]:rounded-xl min-[500px]:m-3 min-[500px]:h-auto">
        {/* 헤더 - 고정 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 text-center flex-shrink-0">
          <h1 className="text-lg font-bold mb-1">{groupName} - 차수별 정산</h1>
          <p className="text-blue-100 text-xs">차수별로 메뉴와 결제자를 입력해주세요</p>
        </div>

        {/* 콘텐츠 - 스크롤 */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-4 flex flex-col">
              {/* 이전 버튼 */}
              <button
                onClick={onPreviousStep}
                className="self-start bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm"
              >
                ← 이전 단계
              </button>

              {/* 차수 추가 */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">
                  🏪 새 차수 추가
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newRoundStoreName}
                    onChange={(e) => setNewRoundStoreName(e.target.value)}
                    placeholder="가게명 (예: 홍길동 숯불고기)"
                    className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 text-sm"
                  />
                  <button
                    onClick={addRound}
                    disabled={!newRoundStoreName.trim()}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-md disabled:shadow-none text-sm"
                  >
                    추가
                  </button>
                </div>
              </div>

              {/* 차수 목록 - 스크롤 가능 */}
              <div className="flex-1 flex flex-col min-h-0">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  📋 차수별 정산 내역 ({rounds.length}개)
                </label>
                <div ref={scrollRef} className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-3 space-y-4" style={{maxHeight: 'calc(100vh - 420px)'}}>
                  {rounds.map((round) => (
                    <div key={round.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                      {/* 차수 헤더 */}
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-gray-800">
                          {round.roundNumber}차 - {round.storeName}
                        </h3>
                        <button
                          onClick={() => removeRound(round.id)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-all duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* 결제자 선택 */}
                      <div className="mb-3">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          💳 결제자
                        </label>
                        <div className="relative">
                          <select
                            value={round.payer}
                            onChange={(e) => updatePayer(round.id, e.target.value)}
                            className={`w-full p-3 pr-10 border-0 rounded-xl focus:ring-3 focus:outline-none transition-all duration-300 text-sm font-medium shadow-sm appearance-none cursor-pointer ${
                              round.payer 
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 focus:ring-green-300 text-gray-700'
                                : 'bg-gradient-to-r from-red-50 to-pink-50 focus:ring-red-300 text-red-700 ring-2 ring-red-200'
                            }`}
                          >
                            <option value="">{round.payer ? "결제자를 선택하세요" : "⚠️ 결제자를 선택하세요"}</option>
                            {members.map(member => (
                              <option key={member} value={member}>{member}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className={`w-4 h-4 ${round.payer ? 'text-green-500' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* 메뉴 추가 */}
                      <div className={`mb-3 p-3 rounded-lg border-2 ${round.menus.length === 0 ? 'border-red-200 bg-red-50' : 'border-transparent bg-transparent'}`}>
                        <label className={`block text-xs font-semibold mb-1 ${round.menus.length === 0 ? 'text-red-700' : 'text-gray-700'}`}>
                          {round.menus.length === 0 ? '⚠️ 메뉴 추가 (필수)' : '🍽️ 메뉴 추가'}
                        </label>
                        <div className="grid grid-cols-12 gap-2">
                          <input
                            type="text"
                            value={newMenuName}
                            onChange={(e) => setNewMenuName(e.target.value)}
                            placeholder="메뉴명"
                            className="col-span-5 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                          />
                          <input
                            type="number"
                            value={newMenuPrice}
                            onChange={(e) => setNewMenuPrice(e.target.value)}
                            placeholder="가격"
                            className="col-span-3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                          />
                          <input
                            type="number"
                            value={newMenuQuantity}
                            onChange={(e) => setNewMenuQuantity(e.target.value)}
                            min="1"
                            className="col-span-2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                          />
                          <button
                            onClick={() => addMenu(round.id)}
                            disabled={!newMenuName.trim() || !newMenuPrice || newMenuQuantity < 1}
                            className="col-span-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-all duration-200 text-sm"
                          >
                            추가
                          </button>
                        </div>
                      </div>

                      {/* 메뉴 목록 */}
                      {round.menus.length > 0 ? (
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-gray-700">
                            📝 메뉴 목록 ({round.menus.length}개)
                          </label>
                          {round.menus.map((menu) => (
                            <div key={menu.id} className="bg-white p-3 rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <span className="font-medium text-sm">{menu.name}</span>
                                  <span className="text-gray-500 text-xs ml-2">
                                    {menu.price.toLocaleString()}원 × {menu.quantity}개
                                  </span>
                                </div>
                                <button
                                  onClick={() => removeMenu(round.id, menu.id)}
                                  className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-all duration-200"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                              
                              {/* 참여자 선택 */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                  참여자 ({menu.participants.length}명)
                                </label>
                                <div className="flex flex-wrap gap-1">
                                  {members.map(member => {
                                    const isPayer = round.payer === member
                                    const isParticipant = menu.participants.includes(member)
                                    
                                    return (
                                      <button
                                        key={member}
                                        onClick={() => toggleMenuParticipant(round.id, menu.id, member)}
                                        disabled={isPayer}
                                        className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                                          isPayer
                                            ? 'bg-green-500 text-white cursor-not-allowed ring-2 ring-green-300'
                                            : isParticipant
                                              ? 'bg-blue-500 text-white hover:bg-blue-600'
                                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                        title={isPayer ? '결제자는 필수 참여자입니다' : ''}
                                      >
                                        {isPayer ? `💳 ${member}` : member}
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
                          <p className="text-red-700 text-sm font-medium">📝 메뉴를 추가해주세요</p>
                          <p className="text-red-600 text-xs mt-1">정산을 위해 최소 1개 이상의 메뉴가 필요합니다</p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {rounds.length === 0 && (
                    <div className="text-center text-gray-500 py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                      <p className="text-sm font-medium">아직 추가된 차수가 없습니다.</p>
                      <p className="text-xs mt-1">위에서 가게명을 입력하여 첫 번째 차수를 추가해보세요!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 정산 완료 버튼 */}
              <button
                onClick={onNextStep}
                disabled={rounds.length === 0 || rounds.some(round => !round.payer || round.menus.length === 0)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 disabled:scale-100 shadow-lg disabled:shadow-none text-sm"
              >
                {rounds.length === 0 
                  ? '차수를 추가해주세요' 
                  : rounds.some(round => !round.payer)
                    ? '모든 차수의 결제자를 선택해주세요'
                    : rounds.some(round => round.menus.length === 0)
                      ? '모든 차수에 메뉴를 추가해주세요'
                      : `정산 결과 보기 →`
                }
              </button>
                         </div>
           </div>
        
        {/* 푸터 - 고정 */}
        <Footer currentPage={currentPage} onNavigate={onNavigate} />
      </div>
    </div>
   )
}

export default RoundBilling 