import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { playSelectSound } from "./utils/audio.js";

const defaultBlocks = ["#3d1200", "#db3400", "#f27638"];

function DefaultTransition() {
  return defaultBlocks.map((color, i) => (
    <motion.div
      key={i}
      style={{
        position: "fixed",
        inset: 0,
        background: color,
        zIndex: 999 - i,
        originX: 0,
      }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: [0, 1, 1, 0] }}
      transition={{
        duration: 0.45,
        delay: i * 0.05,
        times: [0, 0.4, 0.6, 1],
        ease: [0.76, 0, 0.24, 1],
      }}
    />
  ));
}

function AboutTransition() {
  const panels = [
    { color: "#3d1200", top: "-12vh", left: "-18vw", width: "86vw", delay: 0 },
    { color: "#f27638", top: "24vh", left: "-10vw", width: "72vw", delay: 0.05 },
    { color: "#fee19b", top: "58vh", left: "-14vw", width: "82vw", delay: 0.1 },
  ];

  return panels.map((panel, i) => (
    <motion.div
      key={i}
      style={{
        position: "fixed",
        top: panel.top,
        left: panel.left,
        width: panel.width,
        height: "26vh",
        background: panel.color,
        zIndex: 999 - i,
        clipPath: "polygon(0 0, 100% 0, calc(100% - 120px) 100%, 0 100%)",
        transform: "rotate(-18deg)",
        transformOrigin: "left center",
      }}
      initial={{ x: -500, opacity: 0 }}
      animate={{ x: [-500, 20, 0], opacity: [1, 1, 0] }}
      transition={{
        duration: 0.52,
        delay: panel.delay,
        times: [0, 0.68, 1],
        ease: [0.22, 1, 0.36, 1],
      }}
    />
  ));
}


function SocialsTransition() {
  const stripes = [
    { color: "#3d1200", left: "72vw", width: "24vw", delay: 0 },
    { color: "#efb85d", left: "80vw", width: "14vw", delay: 0.06 },
    { color: "#fee19b", left: "88vw", width: "8vw", delay: 0.12 },
  ];

  return stripes.map((stripe, i) => (
    <motion.div
      key={i}
      style={{
        position: "fixed",
        top: "-6vh",
        left: stripe.left,
        width: stripe.width,
        height: "112vh",
        background: stripe.color,
        zIndex: 999 - i,
        transform: "skewX(-16deg)",
        transformOrigin: "top",
      }}
      initial={{ y: -1200, opacity: 1 }}
      animate={{ y: [-1200, 0, 0, 1200] }}
      transition={{
        duration: 0.56,
        delay: stripe.delay,
        times: [0, 0.42, 0.58, 1],
        ease: [0.76, 0, 0.24, 1],
      }}
    />
  ));
}

function SideprojTransition() {
  const slabs = [
    { color: "#3d1200", right: "0vw",  width: "72vw", delay: 0 },
    { color: "#f27638", right: "8vw",  width: "58vw", delay: 0.06 },
    { color: "#fee19b", right: "16vw", width: "44vw", delay: 0.12 },
  ];

  return slabs.map((s, i) => (
    <motion.div
      key={i}
      style={{
        position: "fixed",
        top: "-8vh",
        right: s.right,
        width: s.width,
        height: "116vh",
        background: s.color,
        zIndex: 999 - i,
        clipPath: "polygon(0 0, 97% 0, 100% 100%, 3% 100%)",
        transformOrigin: "bottom center",
      }}
      initial={{ y: 1200, opacity: 1 }}
      animate={{ y: [1200, -30, 0, -1200] }}
      transition={{
        duration: 0.58,
        delay: s.delay,
        times: [0, 0.44, 0.6, 1],
        ease: [0.76, 0, 0.24, 1],
      }}
    />
  ));
}

function TransitionOverlay({ variant }) {
  if (variant === "about") return <AboutTransition />;
  if (variant === "resume") return <ResumeTransition />;
  if (variant === "socials") return <SocialsTransition />;
  if (variant === "sideproj") return <SideprojTransition />;
  return <DefaultTransition />;
}

function ResumeTransition() {
  const cards = [
    { top: "14vh", color: "#3d1200", delay: 0 },
    { top: "31vh", color: "#f27638", delay: 0.05 },
    { top: "48vh", color: "#fee19b", delay: 0.1 },
    { top: "65vh", color: "#3d1200", delay: 0.15 },
  ];

  return cards.map((card, i) => (
    <motion.div
      key={i}
      style={{
        position: "fixed",
        left: "-6vw",
        top: card.top,
        width: "78vw",
        height: "14vh",
        background: card.color,
        zIndex: 999 - i,
        clipPath: "polygon(0 0, 97% 0, 100% 100%, 3% 100%)",
        boxShadow: card.color === "#fee19b" ? "10px 0 0 #db3400" : "none",
      }}
      initial={{ x: -900, opacity: 1 }}
      animate={{ x: [-900, 30, 0, 900] }}
      transition={{
        duration: 0.6,
        delay: card.delay,
        times: [0, 0.48, 0.7, 1],
        ease: [0.76, 0, 0.24, 1],
      }}
    />
  ));
}

export default function PageTransition({ children, variant = "default" }) {
  const location = useLocation();

  useEffect(() => {
    playSelectSound();
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} style={{ position: "relative" }}>
        <TransitionOverlay variant={variant} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.18 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
