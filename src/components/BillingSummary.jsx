import { useState, useEffect, useRef } from 'react'
import Footer from './Footer'

function BillingSummary({ 
  groupName, 
  members, 
  rounds, 
  onPreviousStep,
  onNavigate,
  currentPage,
  // 저장된 정산 데이터를 받을 수 있도록 추가
  savedBilling = null
}) {
  const [copySuccess, setCopySuccess] = useState('')
  const [isKakaoReady, setIsKakaoReady] = useState(false)
  const hasSaved = useRef(false)

  // 카카오 SDK 초기화
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY || 'dummy_key_for_test'
      try {
        window.Kakao.init(kakaoKey)
        setIsKakaoReady(true)
        console.log('카카오 SDK 초기화 성공')
      } catch (error) {
        console.log('카카오 SDK 초기화 실패:', error)
        setIsKakaoReady(false)
      }
    }
  }, [])

  // 데이터 표시 변수들을 먼저 정의
  const displayGroupName = savedBilling ? savedBilling.groupName : (groupName || '')
  const displayMembers = savedBilling ? savedBilling.members : (members || [])
  const displayRounds = savedBilling ? savedBilling.rounds : (rounds || [])

  // 차수별 정산 계산
  const calculateRoundBilling = (round, membersToUse = displayMembers) => {
    if (!round || !round.menus || !membersToUse) {
      return { totalAmount: 0, memberBills: {}, payer: '', payerReceives: 0 }
    }
    
    const totalAmount = round.menus.reduce((sum, menu) => sum + (menu.price * menu.quantity), 0)
    const memberBills = {}
    
    // 각 참여자별 분담 금액 계산
    membersToUse.forEach(member => {
      memberBills[member] = 0
    })

    round.menus.forEach(menu => {
      const menuTotal = menu.price * menu.quantity
      const perPerson = Math.round(menuTotal / menu.participants.length)
      
      menu.participants.forEach(participant => {
        memberBills[participant] += perPerson
      })
    })

    // 결제자가 받을 금액 계산
    const payerReceives = totalAmount - (memberBills[round.payer] || 0)

    return {
      totalAmount,
      memberBills,
      payer: round.payer,
      payerReceives
    }
  }

  // 전체 정산 계산 (새로운 정산용)
  const calculateTotalBilling = () => {
    const totalMemberBills = {}
    const payerTotals = {}
    
    const membersToUse = savedBilling ? savedBilling.members : (members || [])
    const roundsToUse = savedBilling ? savedBilling.rounds : (rounds || [])
    
    if (!membersToUse || !roundsToUse) {
      return { totalMemberBills: {}, payerTotals: {}, finalSettlement: {}, grandTotal: 0 }
    }
    
    membersToUse.forEach(member => {
      totalMemberBills[member] = 0
    })

    roundsToUse.forEach(round => {
      if (!round.payer) return
      
      const roundBilling = calculateRoundBilling(round, membersToUse)
      
      // 각 멤버의 총 분담 금액 누적
      Object.keys(roundBilling.memberBills).forEach(member => {
        totalMemberBills[member] += roundBilling.memberBills[member]
      })

      // 결제자별 받을 총 금액 누적
      if (!payerTotals[round.payer]) {
        payerTotals[round.payer] = 0
      }
      payerTotals[round.payer] += roundBilling.payerReceives
    })

    // 최종 정산 - 각 멤버가 각 결제자에게 보낼 금액
    const finalSettlement = {}
    membersToUse.forEach(member => {
      finalSettlement[member] = {}
      roundsToUse.forEach(round => {
        if (round.payer && round.payer !== member) {
          const roundBilling = calculateRoundBilling(round, membersToUse)
          if (roundBilling.memberBills[member] > 0) {
            if (!finalSettlement[member][round.payer]) {
              finalSettlement[member][round.payer] = 0
            }
            finalSettlement[member][round.payer] += roundBilling.memberBills[member]
          }
        }
      })
    })

    const grandTotal = Object.values(totalMemberBills).reduce((sum, amount) => sum + amount, 0)

    return {
      totalMemberBills,
      payerTotals,
      finalSettlement,
      grandTotal
    }
  }

  // 정산 데이터 저장
  const saveBillingData = () => {
    if (!groupName || !members || !rounds) return false
    
    const billingData = {
      id: Date.now().toString(),
      groupName,
      members,
      rounds,
      createdAt: new Date().toISOString(),
      roundBillings: rounds.map(round => ({
        ...round,
        billing: calculateRoundBilling(round, members)
      })),
      totalBilling: calculateTotalBilling()
    }

    try {
      const existingData = JSON.parse(localStorage.getItem('dutchPayBillings') || '[]')
      
      // 중복 체크 - 같은 ID나 같은 시간에 생성된 데이터가 있는지 확인
      const isDuplicate = existingData.some(existing => 
        existing.id === billingData.id || 
        (existing.groupName === billingData.groupName && 
         Math.abs(new Date(existing.createdAt) - new Date(billingData.createdAt)) < 5000) // 5초 이내
      )
      
      if (isDuplicate) {
        console.log('중복 데이터 감지, 저장하지 않음')
        return false
      }
      
      existingData.push(billingData)
      localStorage.setItem('dutchPayBillings', JSON.stringify(existingData))
      hasSaved.current = true // 저장 완료 표시
      return true
    } catch (error) {
      console.error('저장 실패:', error)
      return false
    }
  }

  // 저장된 데이터 자동 저장 (한 번만) - 새로운 정산일 때만
  useEffect(() => {
    if (rounds && rounds.length > 0 && !hasSaved.current && !savedBilling) {
      saveBillingData()
    }
  }, [rounds, savedBilling])

  // 복사 기능
  const copyToClipboard = () => {
    const copyText = generateBillingText() + `\n📱 더치페이 계산기로 생성됨`

    navigator.clipboard.writeText(copyText).then(() => {
      setCopySuccess('✅ 클립보드에 복사되었습니다!')
      setTimeout(() => setCopySuccess(''), 3000)
    }).catch(() => {
      setCopySuccess('❌ 복사에 실패했습니다.')
      setTimeout(() => setCopySuccess(''), 3000)
    })
  }

  // 정산 내역 텍스트 생성 (복사/공유 공통 사용)
  const generateBillingText = () => {
    const billingData = savedBilling ? savedBilling.totalBilling : calculateTotalBilling()
    let text = `🍽️ ${displayGroupName} 더치페이 정산 결과\n\n`
    
    // 차수별 정산
    if (displayRounds && displayRounds.length > 0) {
      displayRounds.forEach((round, index) => {
        const billing = savedBilling 
          ? savedBilling.roundBillings.find(rb => rb.id === round.id)?.billing 
          : calculateRoundBilling(round, displayMembers)
        text += `📍 ${round.roundNumber}차 - ${round.storeName}\n`
        text += `💰 총 금액: ${billing.totalAmount.toLocaleString()}원\n`
        text += `💳 결제자: ${round.payer}\n`
        
        if (round.menus.length > 0) {
          text += `📝 메뉴:\n`
          round.menus.forEach(menu => {
            text += `  • ${menu.name} ${menu.price.toLocaleString()}원 × ${menu.quantity}개\n`
            text += `    참여자: ${menu.participants.join(', ')}\n`
          })
        }
        
        text += `\n💸 개별 분담:\n`
        Object.entries(billing.memberBills).forEach(([member, amount]) => {
          if (amount > 0) {
            text += `  ${member}: ${amount.toLocaleString()}원\n`
          }
        })
        text += `\n`
      })
    }

    // 전체 정산
    text += `📊 전체 정산 요약\n`
    text += `💰 총 합계: ${billingData.grandTotal.toLocaleString()}원\n\n`
    
    text += `💸 최종 송금 내역:\n`
    Object.entries(billingData.finalSettlement).forEach(([member, payments]) => {
      Object.entries(payments).forEach(([payer, amount]) => {
        if (amount > 0) {
          text += `${member} → ${payer}: ${amount.toLocaleString()}원\n`
        }
      })
    })

    return text
  }

  // 카카오톡 공유
  const shareToKakao = () => {
    if (!window.Kakao || !window.Kakao.Share) {
      // 카카오톡 앱이 없거나 SDK가 로드되지 않은 경우 복사 기능으로 대체
      copyToClipboard()
      alert('카카오톡 공유 기능을 사용할 수 없어 클립보드에 복사했습니다. 카카오톡에서 직접 붙여넣기 해주세요.')
      return
    }

    const billingText = generateBillingText()
    const billingData = savedBilling ? savedBilling.totalBilling : calculateTotalBilling()
    
    try {
      window.Kakao.Share.sendDefault({
        objectType: 'text',
        text: billingText + `\n📱 더치페이 계산기로 생성됨`,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
        buttonTitle: "앱에서 자세히 보기"
      })
    } catch (error) {
      console.log('카카오톡 공유 실패:', error)
      // 공유 실패 시 복사 기능으로 대체
      copyToClipboard()
      alert('카카오톡 공유에 실패했습니다. 클립보드에 복사했으니 직접 붙여넣기 해주세요.')
    }
  }

  const totalBilling = savedBilling ? savedBilling.totalBilling : calculateTotalBilling()

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white min-[500px]:shadow-lg border-0 min-[500px]:border border-gray-100 h-full flex flex-col min-[500px]:rounded-xl min-[500px]:m-3 min-[500px]:h-auto">
        {/* 헤더 - 고정 */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 text-center flex-shrink-0">
          <h1 className="text-lg font-bold mb-1">🍽️ {displayGroupName} - 정산 완료</h1>
          <p className="text-green-100 text-xs">총 {totalBilling.grandTotal.toLocaleString()}원 • {displayRounds ? displayRounds.length : 0}개 차수 • {displayMembers ? displayMembers.length : 0}명 참여</p>
        </div>

        {/* 콘텐츠 - 스크롤 */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="h-full flex flex-col">
              {/* 액션 버튼들 - 고정 */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={onPreviousStep}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm"
                >
                  ← 이전
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm flex items-center justify-center gap-1"
                >
                  📋 전체 복사
                </button>
                <button
                  onClick={shareToKakao}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm"
                >
                  💬 카톡공유
                </button>
              </div>

              {copySuccess && (
                <div className={`p-3 rounded-lg text-sm font-medium text-center mt-4 flex-shrink-0 ${
                  copySuccess.includes('✅') 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {copySuccess}
                </div>
              )}

              {/* 스크롤 가능한 내용 영역 */}
              <div className="flex-1 overflow-y-auto space-y-4 mt-4">
                {/* 전체 정산 요약 */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <h2 className="text-sm font-bold text-green-800 mb-3">📊 전체 정산 요약</h2>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-xs text-green-600">총 금액</div>
                    <div className="text-lg font-bold text-green-800">{totalBilling.grandTotal.toLocaleString()}원</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-green-600">1인당 평균</div>
                    <div className="text-lg font-bold text-green-800">{displayMembers && displayMembers.length > 0 ? Math.round(totalBilling.grandTotal / displayMembers.length).toLocaleString() : 0}원</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-green-700">💸 최종 송금 내역</div>
                  <div className="bg-white rounded-lg p-3 space-y-1">
                    {Object.entries(totalBilling.finalSettlement).map(([member, payments]) => 
                      Object.entries(payments).map(([payer, amount]) => 
                        amount > 0 && (
                          <div key={`${member}-${payer}`} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">{member} → {payer}</span>
                            <span className="font-bold text-green-600">{amount.toLocaleString()}원</span>
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>
              </div>

                {/* 차수별 정산 내역 */}
                <div>
                  <h2 className="text-sm font-bold text-gray-800 mb-2">🏪 차수별 정산 내역</h2>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-4">
                  {displayRounds && displayRounds.length > 0 ? displayRounds.map((round) => {
                    const billing = savedBilling 
                      ? savedBilling.roundBillings.find(rb => rb.id === round.id)?.billing 
                      : calculateRoundBilling(round, displayMembers)
                    return (
                      <div key={round.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-sm font-bold text-gray-800">
                              {round.roundNumber}차 - {round.storeName}
                            </h3>
                            <p className="text-xs text-gray-600">결제자: {round.payer}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-blue-600">{billing.totalAmount.toLocaleString()}원</div>
                            <div className="text-xs text-gray-500">총 금액</div>
                          </div>
                        </div>

                        {round.menus.length > 0 && (
                          <div className="mb-3">
                            <div className="text-xs font-semibold text-gray-700 mb-2">📝 메뉴</div>
                            <div className="space-y-1">
                              {round.menus.map((menu) => (
                                <div key={menu.id} className="bg-gray-50 rounded p-2">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">{menu.name}</span>
                                    <span className="text-sm text-gray-600">
                                      {menu.price.toLocaleString()}원 × {menu.quantity}개
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    참여자: {menu.participants.join(', ')}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <div className="text-xs font-semibold text-gray-700 mb-2">💰 개별 분담</div>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(billing.memberBills).map(([member, amount]) => 
                              amount > 0 && (
                                <div key={member} className="flex justify-between text-sm bg-gray-50 rounded px-2 py-1">
                                  <span>{member}</span>
                                  <span className="font-medium">{amount.toLocaleString()}원</span>
                                </div>
                              )
                            )}
                          </div>
                          {billing.payerReceives > 0 && (
                            <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                              <div className="text-xs text-blue-600 font-semibold">💳 {round.payer}님이 받을 금액</div>
                              <div className="text-sm font-bold text-blue-700">{billing.payerReceives.toLocaleString()}원</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  }) : (
                    <div className="text-center text-gray-500 py-8">
                      <p>정산 내역이 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>

                {/* 새로운 정산 시작 버튼 - 새 정산일 때만 */}
                {!savedBilling && (
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
                  >
                    🆕 새로운 정산 시작하기
                  </button>
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

export default BillingSummary 