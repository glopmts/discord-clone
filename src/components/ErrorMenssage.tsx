import { Info } from "lucide-react";
import { FC } from "react";

type ErrorProps = {
  error?: string;
}

const ErrorMenssage: FC<ErrorProps> = ({
  error
}) => {
  return (
    <div className="w-full h-full">
      <div className="flex w-full items-center justify-center gap-1.5">
        <Info size={20} />
        <span className="text-red-500 font-semibold text-base">{error}</span>
      </div>
    </div>
  );
}

export default ErrorMenssage;