import MenuList from './Menu';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className='layout'>
      {children}
      <MenuList />
    </div>
  );
};
