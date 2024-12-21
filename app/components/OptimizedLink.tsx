import { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface OptimizedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const OptimizedLink = memo(function OptimizedLink({ href, children, className }: OptimizedLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href}
      className={className}
      prefetch={false} // Only prefetch on hover
    >
      {children}
    </Link>
  );
});

export default OptimizedLink;