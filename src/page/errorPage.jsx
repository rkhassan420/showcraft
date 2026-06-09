import { Link, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { ThemeContext } from "../page/ThemeContext"

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H15v-6H9v6H4a1 1 0 01-1-1V9.75z" />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
)

export const ErrorPage = () => {
  const { theme } = useContext(ThemeContext)
  const navigate = useNavigate()
  const isDark = theme === 'dark-theme'

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 py-16 ${isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>

      {/* Floating icon with pulse rings */}
      <div className="relative w-44 h-44 mb-10 animate-[float_4s_ease-in-out_infinite]">
        {[0, 400, 800].map((delay, i) => (
          <span
            key={i}
            className={`absolute inset-0 rounded-full border animate-[pulseRing_2.4s_ease-out_infinite] ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
        <div className={`absolute inset-0 rounded-full flex items-center justify-center border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`w-16 h-16 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m-7 4h8a2 2 0 002-2V7.414a2 2 0 00-.586-1.414l-3.414-3.414A2 2 0 0013.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 3v4a1 1 0 001 1h4" />
          </svg>
        </div>
        {/* 404 badge */}
        <div className="absolute top-1 -right-2 flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 text-xs font-medium px-2 py-1 rounded-md">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          404
        </div>
      </div>

      {/* Text */}
      <h1 className="text-2xl font-medium mb-2">Page not found</h1>
      <p className={`text-base mb-8 max-w-sm text-center leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        The page you were looking for doesn't exist or may have been moved. Let's get you back on track.
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/">
          <button className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95 ${isDark ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-800'}`}>
            <HomeIcon /> Back to home
          </button>
        </Link>
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium border transition-all active:scale-95 ${isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`}
        >
          <ArrowLeftIcon /> Go back
        </button>
      </div>

      <p className={`mt-8 text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
        If the problem persists, check the URL or try <code className={`px-1.5 py-0.5 rounded text-xs ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>Ctrl + R</code>
      </p>
    </div>
  )
}