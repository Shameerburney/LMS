import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <Sidebar />
            <div className="main-container">
                <Header />
                <main className="main-content">{children}</main>
            </div>

            <style jsx>{`
        .layout {
          display: flex;
          min-height: 100vh;
        }

        .main-container {
          flex: 1;
          margin-left: 260px;
          display: flex;
          flex-direction: column;
        }

        .main-content {
          flex: 1;
          padding: var(--space-6);
          background: var(--bg-secondary);
          min-height: calc(100vh - 73px);
        }

        @media (max-width: 1024px) {
          .main-container {
            margin-left: 0;
          }

          .main-content {
            padding-top: calc(var(--space-6) + 60px);
          }
        }

        @media (max-width: 640px) {
          .main-content {
            padding: var(--space-4);
            padding-top: calc(var(--space-4) + 60px);
          }
        }
      `}</style>
        </div>
    );
};

export default Layout;
