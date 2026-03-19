"use client";

interface NavBarProps {
  variant: "light" | "dark";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function NavBar({ variant }: NavBarProps) {
  const lineColor = "bg-white";
  const dotColor = "bg-white";
  const textColor = "text-white";
  const logoOpacity = "";

  return (
    <div className="flex items-center gap-3 md:gap-7 px-4 md:px-[70px] pt-4 md:pt-5">
      <p
        className={`font-[family-name:var(--font-space-mono)] font-bold text-[10px] sm:text-[14px] md:text-[24px] ${textColor} tracking-[0.08em] whitespace-nowrap`}
      >
        PERSiAN NEW YEAR
      </p>
      <div className="flex-1 flex items-center">
        <div className={`w-full h-[1px] ${lineColor} relative`}>
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full ${dotColor}`}
          />
          <div
            className={`absolute right-0 top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full ${dotColor}`}
          />
        </div>
      </div>
      <a href="/">
        <img
          src="/logo.svg"
          alt="Home"
          className={`w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] md:w-[100px] md:h-[100px] shrink-0 ${logoOpacity}`}
        />
      </a>
      <div className="flex-1 flex items-center">
        <div className={`w-full h-[1px] ${lineColor} relative`}>
          <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full ${dotColor}`}
          />
          <div
            className={`absolute right-0 top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full ${dotColor}`}
          />
        </div>
      </div>
      <p
        className={`font-[family-name:var(--font-space-mono)] font-bold text-[10px] sm:text-[14px] md:text-[24px] ${textColor} tracking-[0.08em] whitespace-nowrap`}
      >
        SPRiNG EQUiNOX
      </p>
    </div>
  );
}
