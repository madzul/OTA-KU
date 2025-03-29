import { cn } from "@/lib/utils";

interface CountDataCardProps {
  title: string;
  count: number;
  color: string;
}

function CountDataCard({ title, count, color }: CountDataCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-[#BBBAB8] bg-white p-4">
      <p className="text-sm font-medium text-[#BBBAB8]">{title}</p>
      <p className={cn("text-[26px] font-bold", color)}>{count}</p>
    </div>
  );
}

export default CountDataCard;
