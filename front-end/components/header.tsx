import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/groups">Groups</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
