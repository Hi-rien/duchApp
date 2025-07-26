import { useState, useEffect } from 'react'
import Footer from './Footer'
import BillingSummary from './BillingSummary'

function BillingHistory({ onNavigate, currentPage }) {
  const [billingHistory, setBillingHistory] = useState([])
  const [selectedBilling, setSelectedBilling] = useState(null)


  // 정산 내역 불러오기
  useEffect(() => {
    const billings = JSON.parse(localStorage.getItem('dutchPayBillings') || '[]')
    setBillingHistory(billings.reverse()) // 최신순으로 정렬
    
    // 홈에서 선택된 정산 내역이 있으면 자동으로 상세보기로 이동
    const selectedBillingId = localStorage.getItem('selectedBillingId')
    if (selectedBillingId) {
      const selectedBilling = billings.find(b => b.id === selectedBillingId)
      if (selectedBilling) {
        setSelectedBilling(selectedBilling)
      }
      localStorage.removeItem('selectedBillingId') // 한 번 사용 후 제거
    }
  }, [])

  // 정산 내역 삭제
  const deleteBilling = (billingId, billingName = '') => {
    const confirmMessage = billingName 
      ? `"${billingName}" 정산 내역을 정말로 삭제하시겠습니까?`
      : '정말로 이 정산 내역을 삭제하시겠습니까?'
    
    if (confirm(confirmMessage)) {
      const updatedBillings = billingHistory.filter(billing => billing.id !== billingId)
      setBillingHistory(updatedBillings)
      localStorage.setItem('dutchPayBillings', JSON.stringify(updatedBillings.reverse()))
      setSelectedBilling(null)
    }
  }



  if (selectedBilling) {
    // 출발지에 따라 이전 버튼 동작 결정
    const fromPage = localStorage.getItem('fromPage')
    const handlePreviousStep = () => {
      if (fromPage === 'home') {
        localStorage.removeItem('fromPage') // 사용 후 제거
        onNavigate('home')
      } else {
        setSelectedBilling(null)
      }
    }

    return (
      <BillingSummary
        groupName={null}
        members={null}
        rounds={null}
        onPreviousStep={handlePreviousStep}
        onNavigate={onNavigate}
        currentPage={currentPage}
        savedBilling={selectedBilling}
      />
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white min-[500px]:shadow-lg border-0 min-[500px]:border border-gray-100 h-full flex flex-col min-[500px]:rounded-xl min-[500px]:m-3 min-[500px]:h-auto">
        {/* 헤더 - 고정 */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 text-center flex-shrink-0">
          <h1 className="text-lg font-bold mb-1">📋 정산 내역 확인</h1>
          <p className="text-green-100 text-xs">저장된 정산 내역을 확인하고 관리하세요</p>
        </div>

        {/* 콘텐츠 - 스크롤 */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-4 h-full flex flex-col">
              {billingHistory.length > 0 ? (
                <>
                  <div className="text-sm text-gray-600">
                    총 {billingHistory.length}개의 정산 내역
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3" style={{height: '100%'}}>
                                         {billingHistory.map((billing, idx) => (
                       <div
                         key={`${billing.id}-${idx}`}
                         onClick={() => setSelectedBilling(billing)}
                         className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                       >
                         <div className="flex justify-between items-start mb-2">
                           <div className="flex-1">
                             <h3 className="font-bold text-gray-800">{billing.groupName}</h3>
                             <p className="text-sm text-gray-600">
                               {billing.members.length}명 참여 • {billing.rounds.length}개 차수
                             </p>
                           </div>
                           <div className="flex items-center gap-3">
                             <div className="text-right">
                               <div className="text-lg font-bold text-green-600">
                                 {billing.totalBilling.grandTotal.toLocaleString()}원
                               </div>
                               <div className="text-xs text-gray-500">
                                 {new Date(billing.createdAt).toLocaleDateString()}
                               </div>
                             </div>
                             <button
                               onClick={(e) => {
                                 e.stopPropagation()
                                 deleteBilling(billing.id, billing.groupName)
                               }}
                               className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-all duration-200"
                               title="정산 내역 삭제"
                             >
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                               </svg>
                             </button>
                           </div>
                         </div>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {billing.rounds.slice(0, 3).map((round) => (
                            <span key={round.id} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {round.roundNumber}차 {round.storeName}
                            </span>
                          ))}
                          {billing.rounds.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              +{billing.rounds.length - 3}개 더
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="text-6xl">📋</div>
                    <h2 className="text-xl font-bold text-gray-800">저장된 정산 내역이 없습니다</h2>
                    <p className="text-gray-600">
                      모임을 등록하고 정산을 완료하면 여기에서 확인할 수 있습니다.
                    </p>
                    <button
                      onClick={() => onNavigate('group-setup')}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg"
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

export default BillingHistory 