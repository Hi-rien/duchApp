import { useState, useEffect } from 'react'
import Footer from './Footer'

function Home({ onNavigate, currentPage }) {
  const [savedGroups, setSavedGroups] = useState([])
  const [recentBillings, setRecentBillings] = useState([])

  // 저장된 데이터 불러오기
  useEffect(() => {
    const groups = JSON.parse(localStorage.getItem('dutchPayGroups') || '[]')
    const billings = JSON.parse(localStorage.getItem('dutchPayBillings') || '[]')
    
    setSavedGroups(groups.slice(-3)) // 최근 3개
    setRecentBillings(billings.reverse()) // 전체 정산 내역을 최신순으로
  }, [])

  // 정산 내역 삭제
  const deleteBilling = (billingId, billingName, event) => {
    event.stopPropagation() // 클릭 이벤트 전파 방지
    if (confirm(`"${billingName}" 정산 내역을 정말로 삭제하시겠습니까?`)) {
      const updatedBillings = recentBillings.filter(billing => billing.id !== billingId)
      setRecentBillings(updatedBillings)
      localStorage.setItem('dutchPayBillings', JSON.stringify(updatedBillings.reverse()))
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white min-[500px]:shadow-lg border-0 min-[500px]:border border-gray-100 h-full flex flex-col min-[500px]:rounded-xl min-[500px]:m-3 min-[500px]:h-auto">
        {/* 헤더 - 고정 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 text-center flex-shrink-0">
          <h1 className="text-lg font-bold mb-1">더치페이 계산기</h1>
          <p className="text-blue-100 text-xs">간편하고 정확한 모임비 정산</p>
        </div>

        {/* 콘텐츠 - 스크롤 */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-6 h-full flex flex-col">
              {/* 메인 액션 버튼들 */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => onNavigate('group-setup')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg flex flex-col items-center space-y-2"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>정산 시작</span>
                </button>

                <button
                  onClick={() => onNavigate('billing-history')}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-6 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg flex flex-col items-center space-y-2"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>정산 내역</span>
                </button>
              </div>



              {/* 정산 내역 */}
              {recentBillings.length > 0 ? (
                <div className="space-y-3 flex-1 flex flex-col min-h-0">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    💰 정산 내역 ({recentBillings.length}개)
                  </h2>
                  <div className="flex-1 overflow-y-auto space-y-2" style={{maxHeight: 'calc(100vh - 320px)'}}>
                    {recentBillings.map((billing) => (
                      <div 
                        key={billing.id} 
                        onClick={() => {
                          // 정산 내역 페이지로 이동하면서 해당 내역을 선택 상태로 설정
                          localStorage.setItem('selectedBillingId', billing.id)
                          localStorage.setItem('fromPage', 'home') // 출발지 정보 저장
                          onNavigate('billing-history')
                        }}
                        className="bg-green-50 rounded-lg p-4 border border-green-200 cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-green-800">{billing.groupName}</h3>
                            <p className="text-sm text-green-600">
                              총 {billing.totalBilling.grandTotal.toLocaleString()}원 • {billing.rounds.length}개 차수
                            </p>
                            <div className="text-xs text-green-500 mt-1">
                              {new Date(billing.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <button
                            onClick={(e) => deleteBilling(billing.id, billing.groupName, e)}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-all duration-200 ml-2"
                            title="정산 내역 삭제"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* 첫 사용자를 위한 안내 */}
              {recentBillings.length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="text-6xl">🍽️</div>
                    <h2 className="text-xl font-bold text-gray-800">더치페이 계산기에 오신 것을 환영합니다!</h2>
                    <p className="text-gray-600">
                      모임비 정산을 간편하고 정확하게 계산해보세요.
                    </p>
                    <button
                      onClick={() => onNavigate('group-setup')}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      정산 시작하기 →
                    </button>
                  </div>
                </div>
              )}
                         </div>
           </div>
        
        {/* 푸터 - 고정 */}
        <Footer currentPage={currentPage} onNavigate={onNavigate} />
      </div>
    </div>
   )
}

export default Home 