import Link from "next/link";

export default function Logo() {
  return (
      <div
          id="logo"
      >
          <Link href="/">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="none"/>
              <text x="6" y="16" font-size="20" fill="black">L</text>
            </svg>
            Logo
          </Link>
      </div>
  )
}
