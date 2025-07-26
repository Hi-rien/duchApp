import { useState } from 'react'
import GroupSetup from './components/GroupSetup'
import RoundBilling from './components/RoundBilling'
import BillingSummary from './components/BillingSummary'
import Home from './components/Home'
import BillingHistory from './components/BillingHistory'
import GroupManagement from './components/GroupManagement'

function App() {
  // 페이지 상태 관리
  const [currentPage, setCurrentPage] = useState('home') // 'home' | 'group-setup' | 'round-billing' | 'billing-summary' | 'billing-history' | 'group-management'
  
  // 공통 상태 관리
  const [groupName, setGroupName] = useState('')
  const [members, setMembers] = useState([])
  const [rounds, setRounds] = useState([])

  // 페이지 전환 함수들
  const handleNavigate = (page) => {
    // 새로운 모임 등록 시작 시 기존 데이터 초기화
    if (page === 'group-setup' && currentPage !== 'round-billing') {
      setGroupName('')
      setMembers([])
      setRounds([])
    }
    setCurrentPage(page)
  }

  const handleGoToRoundBilling = () => {
    setCurrentPage('round-billing')
  }

  const handleGoToGroupSetup = () => {
    setCurrentPage('group-setup')
  }

  const handleGoToBillingSummary = () => {
    setCurrentPage('billing-summary')
  }

  const handleGoBackToRoundBilling = () => {
    setCurrentPage('round-billing')
  }

  // 현재 페이지에 따른 컴포넌트 렌더링
  if (currentPage === 'home') {
    return <Home onNavigate={handleNavigate} currentPage={currentPage} />
  }

  if (currentPage === 'group-setup') {
    return (
      <GroupSetup
        groupName={groupName}
        setGroupName={setGroupName}
        members={members}
        setMembers={setMembers}
        onNextStep={handleGoToRoundBilling}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
    )
  }

  if (currentPage === 'round-billing') {
    return (
      <RoundBilling
        groupName={groupName}
        members={members}
        rounds={rounds}
        setRounds={setRounds}
        onPreviousStep={handleGoToGroupSetup}
        onNextStep={handleGoToBillingSummary}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
    )
  }

  if (currentPage === 'billing-summary') {
    return (
      <BillingSummary
        groupName={groupName}
        members={members}
        rounds={rounds}
        onPreviousStep={handleGoBackToRoundBilling}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
    )
  }

  if (currentPage === 'billing-history') {
    return <BillingHistory onNavigate={handleNavigate} currentPage={currentPage} />
  }

  if (currentPage === 'group-management') {
    return <GroupManagement onNavigate={handleNavigate} currentPage={currentPage} />
  }

  return <Home onNavigate={handleNavigate} currentPage={currentPage} />
}

export default App
