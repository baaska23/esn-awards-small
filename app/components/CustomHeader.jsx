export default function CustomHeader({header1, header2}) {
  return (
    <div className="text-center px-4 flex flex-col items-center gap-3 md:gap-4"> 
      <div className="bg-white/30 backdrop-blur-sm border border-white/30 rounded-2xl px-12 py-3 md:px-16 md:py-4 lg:px-20 shadow-lg min-w-[280px] sm:min-w-[350px] md:min-w-[450px]">
        <div className="text-blue-900 font-bold text-lg sm:text-xl md:text-2xl whitespace-nowrap">{header1}</div>
        <div className="text-gray-700 font-semibold text-base sm:text-lg md:text-xl whitespace-nowrap">{header2}</div>
      </div>
    </div>
  );
}