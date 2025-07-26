function Footer({ currentPage, onNavigate }) {
  return (
    <div className="bg-white border-t border-gray-200 min-[500px]:rounded-b-xl overflow-hidden" style={{paddingBottom: 'max(12px, env(safe-area-inset-bottom))'}}>
      <div className="grid grid-cols-3 h-16">
        {/* 모임등록 */}
        <button
          onClick={() => onNavigate('group-management')}
          className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
            currentPage === 'group-management'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="text-xs font-medium">모임등록</span>
        </button>

        {/* 홈 */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
            currentPage === 'home'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs font-medium">홈</span>
        </button>

        {/* 정산내역 */}
        <button
          onClick={() => onNavigate('billing-history')}
          className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
            currentPage === 'billing-history'
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-xs font-medium">정산내역</span>
        </button>
      </div>
    </div>
  )
}

export default Footer 