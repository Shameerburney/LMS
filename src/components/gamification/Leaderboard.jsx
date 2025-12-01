import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Crown } from 'lucide-react';
import gamificationService from '../../services/gamification';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            const data = await gamificationService.getLeaderboard();
            setLeaders(data);
        } catch (error) {
            console.error('Error loading leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return <Crown size={24} color="#fbbf24" fill="#fbbf24" />;
            case 1: return <Medal size={24} color="#94a3b8" fill="#94a3b8" />;
            case 2: return <Medal size={24} color="#b45309" fill="#b45309" />;
            default: return <span className="rank-number">{index + 1}</span>;
        }
    };

    return (
        <div className="leaderboard-card">
            <div className="leaderboard-header">
                <Trophy size={24} className="trophy-icon" />
                <h3>Top Learners</h3>
            </div>

            <div className="leaders-list">
                {leaders.map((leader, index) => (
                    <div key={leader.id} className={`leader-row ${index < 3 ? 'top-3' : ''}`}>
                        <div className="rank-col">
                            {getRankIcon(index)}
                        </div>
                        <div className="user-col">
                            <span className="user-name">{leader.name}</span>
                            <span className="user-level">Lvl {leader.level}</span>
                        </div>
                        <div className="xp-col">
                            <Star size={14} fill="currentColor" />
                            <span>{leader.xp} XP</span>
                        </div>
                    </div>
                ))}

                {leaders.length === 0 && !loading && (
                    <div className="empty-state">No leaders yet. Be the first!</div>
                )}
            </div>

            <style jsx>{`
        .leaderboard-card {
          background: var(--bg-primary);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border);
          overflow: hidden;
        }

        .leaderboard-header {
          padding: var(--space-4);
          background: linear-gradient(135deg, var(--primary-500), var(--accent-500));
          color: white;
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .leaderboard-header h3 {
          margin: 0;
          font-size: var(--text-lg);
          color: white;
        }

        .leaders-list {
          padding: var(--space-2);
        }

        .leader-row {
          display: flex;
          align-items: center;
          padding: var(--space-3);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-1);
          transition: background var(--transition-fast);
        }

        .leader-row:hover {
          background: var(--bg-secondary);
        }

        .leader-row.top-3 {
          background: rgba(251, 191, 36, 0.05);
        }

        .rank-col {
          width: 40px;
          display: flex;
          justify-content: center;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .user-col {
          flex: 1;
          margin-left: var(--space-3);
        }

        .user-name {
          display: block;
          font-weight: 600;
          color: var(--text-primary);
        }

        .user-level {
          font-size: var(--text-xs);
          color: var(--text-secondary);
        }

        .xp-col {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          font-weight: 700;
          color: var(--primary-500);
          font-size: var(--text-sm);
        }

        .empty-state {
          padding: var(--space-6);
          text-align: center;
          color: var(--text-secondary);
        }
      `}</style>
        </div>
    );
};

export default Leaderboard;
