type PropTypes = {
  text: string,
  children?: React.ReactNode
}

const Header = ({text , children}: PropTypes) => {
  return (
    <header className='sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4'>
      <h1 className='text-xl font-semibold'>{text}</h1>

      {children}
    </header>
  )
}

export default Header
