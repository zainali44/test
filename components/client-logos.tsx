"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

// Logo components with SVG for better quality
const ForbesLogo = () => (
  <svg width="100" height="30" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 5H25V8H19V25H16V8H10V5Z" fill="currentColor" />
    <path
      d="M26 5H39C43 5 45 7 45 11C45 14 43 16 40 16V16.2C43 16.5 44 18 44 21C44 25 42 25 38 25H26V5ZM29 13H37C39 13 40 12 40 10C40 8 39 7 37 7H29V13ZM29 23H37C39 23 40 22 40 20C40 18 39 15 36 15H29V23Z"
      fill="currentColor"
    />
    <path
      d="M47 5H61C65 5 67 7 67 11C67 15 65 17 61 17H50V25H47V5ZM50 14H60C62 14 64 13 64 11C64 9 63 8 60 8H50V14Z"
      fill="currentColor"
    />
    <path
      d="M68 5H82C86 5 88 7 88 11C88 15 86 17 82 17H71V25H68V5ZM71 14H81C83 14 85 13 85 11C85 9 84 8 81 8H71V14Z"
      fill="currentColor"
    />
    <path d="M89 5H92V22H99V25H89V5Z" fill="currentColor" />
  </svg>
)

const PCMagLogo = () => (
  <svg width="100" height="30" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 5H17C21 5 23 7 23 11C23 15 21 17 17 17H13V25H10V5ZM13 14H16C18 14 20 13 20 11C20 9 19 8 16 8H13V14Z"
      fill="currentColor"
    />
    <path
      d="M25 5H37C41 5 43 7 43 11C43 15 41 17 37 17H28V25H25V5ZM28 14H36C38 14 40 13 40 11C40 9 39 8 36 8H28V14Z"
      fill="currentColor"
    />
    <path d="M45 5H48L55 25H52L50 19H43L41 25H38L45 5ZM44 16H49L47 10H46L44 16Z" fill="currentColor" />
    <path d="M57 5H60V22H70V25H57V5Z" fill="currentColor" />
    <path d="M72 5H75V25H72V5Z" fill="currentColor" />
    <path d="M78 5H81L88 19H88.2V5H91V25H88L81 11H80.8V25H78V5Z" fill="currentColor" />
  </svg>
)

const TechRadarLogo = () => (
  <svg width="120" height="30" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 5H23V8H13V13H22V16H13V22H23V25H10V5Z" fill="currentColor" />
    <path d="M25 5H28V22H38V25H25V5Z" fill="currentColor" />
    <path d="M40 5H43V25H40V5Z" fill="currentColor" />
    <path d="M46 5H49L56 19H56.2V5H59V25H56L49 11H48.8V25H46V5Z" fill="currentColor" />
    <path d="M61 5H74V8H64V13H73V16H64V22H74V25H61V5Z" fill="currentColor" />
    <path d="M76 5H79V25H76V5Z" fill="currentColor" />
    <path d="M81 5H84L91 19H91.2V5H94V25H91L84 11H83.8V25H81V5Z" fill="currentColor" />
    <path d="M96 5H109V8H99V13H108V16H99V22H109V25H96V5Z" fill="currentColor" />
  </svg>
)

const MashableLogo = () => (
  <svg width="120" height="30" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 5H13L16 19H16.2L19 5H23L26 19H26.2L29 5H32L28 25H24L21 11H20.8L18 25H14L10 5Z" fill="currentColor" />
    <path d="M34 5H47V8H37V13H46V16H37V22H47V25H34V5Z" fill="currentColor" />
    <path d="M49 5H52L59 19H59.2V5H62V25H59L52 11H51.8V25H49V5Z" fill="currentColor" />
    <path d="M64 5H77V8H67V13H76V16H67V22H77V25H64V5Z" fill="currentColor" />
    <path d="M79 5H82V25H79V5Z" fill="currentColor" />
    <path d="M84 5H87L94 19H94.2V5H97V25H94L87 11H86.8V25H84V5Z" fill="currentColor" />
    <path d="M99 5H112V8H102V13H111V16H102V22H112V25H99V5Z" fill="currentColor" />
  </svg>
)

const YahooLogo = () => (
  <svg width="100" height="30" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 5H14L20 15L26 5H30L21 20V25H18V20L10 5Z" fill="currentColor" />
    <path d="M32 5H35L42 19H42.2V5H45V25H42L35 11H34.8V25H32V5Z" fill="currentColor" />
    <path d="M47 5H50L57 25H54L52 19H45L43 25H40L47 5ZM46 16H51L49 10H48L46 16Z" fill="currentColor" />
    <path d="M59 5H62V25H59V5Z" fill="currentColor" />
    <path d="M64 5H67V22H77V25H64V5Z" fill="currentColor" />
    <path d="M79 5H82V22H92V25H79V5Z" fill="currentColor" />
  </svg>
)

const CnetLogo = () => (
  <svg width="80" height="30" viewBox="0 0 80 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 5H23C27 5 29 7 29 11C29 15 27 17 23 17H13V25H10V5ZM13 14H22C24 14 26 13 26 11C26 9 25 8 22 8H13V14Z"
      fill="currentColor"
    />
    <path d="M31 5H34L41 25H38L36 19H29L27 25H24L31 5ZM30 16H35L33 10H32L30 16Z" fill="currentColor" />
    <path d="M43 5H46V22H56V25H43V5Z" fill="currentColor" />
    <path d="M58 5H71V8H61V13H70V16H61V22H71V25H58V5Z" fill="currentColor" />
  </svg>
)

// Array of logo components
const logos = [
  { component: ForbesLogo, width: 100 },
  { component: PCMagLogo, width: 100 },
  { component: TechRadarLogo, width: 120 },
  { component: MashableLogo, width: 120 },
  { component: YahooLogo, width: 100 },
  { component: CnetLogo, width: 80 },
]

export default function ClientLogos() {
  const [duplicatedLogos, setDuplicatedLogos] = useState<typeof logos>([])

  // Duplicate logos to create a seamless infinite animation
  useEffect(() => {
    setDuplicatedLogos([...logos, ...logos])
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1 }}
      className="mt-20 relative overflow-hidden py-10"
    >
      <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-purple-950 to-transparent z-10"></div>
      <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-purple-950 to-transparent z-10"></div>

      <motion.div
        className="flex gap-16 items-center"
        animate={{ x: [0, -1500] }}
        transition={{
          x: {
            duration: 30,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            repeatType: "loop",
          },
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <motion.div
            key={index}
            className="text-white/50 hover:text-white/80 transition-colors duration-300 flex-shrink-0"
            whileHover={{ scale: 1.05 }}
          >
            <logo.component />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
