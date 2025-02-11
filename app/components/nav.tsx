import Link from 'next/link'

const navItems = {
  '/': {
    name: 'home',
  },
  '/blog': {
    name: 'blog',
  },
}

export function Navbar() {
  return (
    <nav
      id="nav"
    >
      <ul>
        {Object.entries(navItems).map(([path, { name }]) => {
          return (
              <li key={name}>
                <Link
                  key={path}
                  href={path}
                >
                  {name}
                </Link>
              </li>
          )
        })}
      </ul>
    </nav>
  )
}
