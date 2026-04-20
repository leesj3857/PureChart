"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** 시작 지연(s) */
  delay?: number;
  /** 아래에서 위로 올라오는 거리(px) */
  y?: number;
  /** 애니메이션 길이(s) */
  duration?: number;
  className?: string;
  /** 한번만 실행할지 (true 기본) */
  once?: boolean;
  /** 페이지 진입 시 즉시 재생 (뷰포트 기반 X) */
  immediate?: boolean;
  /** viewport 트리거 마진 */
  margin?: `${number}px` | `${number}%` | `-${number}%`;
};

export default function Reveal({
  children,
  delay = 0,
  y = 16,
  duration = 0.55,
  className,
  once = true,
  immediate = false,
  margin = "-10%",
}: Props) {
  const reduce = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduce ? 0 : duration,
        ease: [0.22, 1, 0.36, 1],
        delay: reduce ? 0 : delay,
      },
    },
  };

  const triggerProps = immediate
    ? { initial: "hidden" as const, animate: "show" as const }
    : {
        initial: "hidden" as const,
        whileInView: "show" as const,
        viewport: { once, margin },
      };

  return (
    <motion.div variants={variants} className={className} {...triggerProps}>
      {children}
    </motion.div>
  );
}
