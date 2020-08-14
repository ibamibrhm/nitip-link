import Link from 'next/link'

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link href="/"><a>Text</a></Link></li>
        <li><Link href="/images"><a>Images</a></Link></li>
      </ul>
    </nav>
  )
}

export default Navbar