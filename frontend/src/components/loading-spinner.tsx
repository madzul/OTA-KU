import { motion } from "framer-motion";

const spinTransition = {
  repeat: Infinity,
  ease: "easeInOut",
  // width: ['100%', '50%'],
  duration: 1,
};

export default function Spinner() {
  return (
    <main className="flex min-h-[calc(100vh-70px)] flex-col items-center justify-center px-4 py-8 text-4xl md:px-12 lg:min-h-[calc(100vh-96px)]">
      <div className="relative h-[50px] w-[50px]">
        <motion.span
          className="border-t-primary absolute top-0 left-0 box-border block h-[50px] w-[50px] rounded-full border-[7px] border-white"
          animate={{ rotate: 360 }}
          transition={spinTransition}
        />
      </div>
    </main>
  );
}
