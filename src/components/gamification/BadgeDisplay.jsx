import React from 'react';
import { Award, Lock } from 'lucide-react';

const BadgeDisplay = ({ badges = [], earnedBadges = [] }) => {
    const allBadges = [
        { id: 'first-course', name: 'First Steps', icon: '🎓', description: 'Completed your first course' },
        { id: 'quiz-master', name: 'Quiz Master', icon: '💯', description: 'Scored 100% on a quiz' },
        { id: 'streak-7', name: 'Week Warrior', icon: '🔥', description: '7-day learning streak' },
        { id: 'social-butterfly', name: 'Helper', icon: '💬', description: 'Posted 10 forum replies' },
        { id: 'code-ninja', name: 'Code Ninja', icon: '💻', description: 'Completed 5 coding exercises' },
        { id: 'early-bird', name: 'Early Bird', icon: '🌅', description: 'Completed a lesson before 8 AM' },
    ];

    const isEarned = (badgeId) => {
        return earnedBadges.some(b => b.id === badgeId);
    };

    return (
        <div className="badge-display">
            <h3>Your Achievements</h3>

            <div className="badges-grid">
                {allBadges.map(badge => {
                    const earned = isEarned(badge.id);
                    return (
                        <div key={badge.id} className={`badge-card ${earned ? 'earned' : 'locked'}`}>
                            <div className="badge-icon">
                                {earned ? badge.icon : <Lock size={20} />}
                            </div>
                            <div className="badge-info">
                                <h4>{badge.name}</h4>
                                <p>{badge.description}</p>
                            </div>
                            {earned && <div className="earned-check"><Award size={14} /></div>}
                        </div>
                    );
                })}
            </div>

            <style jsx>{`
        .badge-display {
          background: var(--bg-primary);
          padding: var(--space-6);
          border-radius: var(--radius-xl);
          border: 1px solid var(--border);
        }

        .badge-display h3 {
          margin-bottom: var(--space-6);
        }

        .badges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: var(--space-4);
        }

        .badge-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          transition: all var(--transition-base);
          position: relative;
        }

        .badge-card.earned {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1));
          border-color: var(--primary-500);
        }

        .badge-card.locked {
          background: var(--bg-secondary);
          opacity: 0.7;
          filter: grayscale(1);
        }

        .badge-icon {
          font-size: 2rem;
          margin-bottom: var(--space-3);
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .badge-info h4 {
          margin: 0 0 var(--space-1) 0;
          font-size: var(--text-sm);
        }

        .badge-info p {
          margin: 0;
          font-size: var(--text-xs);
          color: var(--text-secondary);
        }

        .earned-check {
          position: absolute;
          top: 8px;
          right: 8px;
          color: var(--success);
        }
      `}</style>
        </div>
    );
};

export default BadgeDisplay;
