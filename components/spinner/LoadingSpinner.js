const LoadingSpinner = ({ width, height, color }) => {
  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full h-${height} w-${width} border-b-2 border-${color}`}></div>
    </div>
  )
}

export default LoadingSpinner
