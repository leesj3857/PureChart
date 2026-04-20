"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** 자식 간 시차(s) */
  stagger?: number;
  /** 첫 자식 지연(s) */
  delay?: number;
  once?: boolean;
  margin?: `${number}px` | `${number}%` | `-${number}%`;
  /** li 등 다른 태그로 렌더 */
  as?: "div" | "ul" | "ol" | "section";
};

export default function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  once = true,
  margin = "-10%",
  as = "div",
}: Props) {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : stagger,
        delayChildren: reduce ? 0 : delay,
      },
    },
  };

  const MotionTag =
    as === "ul"
      ? motion.ul
      : as === "ol"
        ? motion.ol
        : as === "section"
          ? motion.section
          : motion.div;

  return (
    <MotionTag
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

/**
 * RevealGroup의 자식으로 사용할 아이템.
 */
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const MotionTag =
    as === "li" ? motion.li : as === "article" ? motion.article : motion.div;
  return (
    <MotionTag variants={item} className={className}>
      {children}
    </MotionTag>
  );
}
