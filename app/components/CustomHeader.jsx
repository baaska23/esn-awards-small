export default function CustomHeader({header1, header2}) {
  return (
    <div className="text-center px-4 flex flex-col items-center gap-3 md:gap-4"> 
      <div className="glass rounded-3xl px-12 py-3 md:px-16 md:py-4 lg:px-20 min-w-[280px] sm:min-w-[350px] md:min-w-[450px]">
        <div className="relative text-[#CFAA17] font-bold text-lg sm:text-xl md:text-2xl whitespace-nowrap">{header1}</div>
        <div className="relative text-white font-extralight text-base sm:text-lg md:text-xl whitespace-nowrap">{header2}</div>
      </div>
    </div>
  );
}