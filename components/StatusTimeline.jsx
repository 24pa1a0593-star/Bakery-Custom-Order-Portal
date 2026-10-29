import React from 'react';
import { FaClipboardList, FaCheckCircle, FaUtensils, FaBoxOpen, FaSmile, FaCheck } from 'react-icons/fa';

const STEPS = [
  {
    key: 'pending',
    label: 'Pending',
    desc: 'Order received, awaiting confirmation',
    icon: FaClipboardList,
  },
  {
    key: 'confirmed',
    label: 'Confirmed',
    desc: 'Your order has been confirmed',
    icon: FaCheckCircle,
  },
  {
    key: 'preparing',
    label: 'Preparing',
    desc: 'Our bakers are preparing your order',
    icon: FaUtensils,
  },
  {
    key: 'ready',
    label: 'Ready',
    desc: 'Your order is ready for pickup/delivery',
    icon: FaBoxOpen,
  },
  {
    key: 'completed',
    label: 'Completed',
    desc: 'Order delivered successfully!',
    icon: FaSmile,
  },
];

const StatusTimeline = ({ currentStatus = 'pending' }) => {
  const normalizedStatus = (currentStatus || 'pending').toLowerCase();
  const currentIndex = STEPS.findIndex((step) => step.key === normalizedStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <>
      <style>{`
        .timeline-container {
          padding: 30px 10px;
          position: relative;
        }
        .timeline-steps {
          display: flex;
          justify-content: space-between;
          position: relative;
        }
        .timeline-steps::before {
          content: '';
          position: absolute;
          top: 24px;
          left: 30px;
          right: 30px;
          height: 4px;
          background-color: var(--gray-200);
          z-index: 1;
        }
        .timeline-progress-bar {
          position: absolute;
          top: 24px;
          left: 30px;
          height: 4px;
          background-color: var(--brown);
          z-index: 1;
          transition: width 0.5s ease;
        }
        .timeline-step {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          flex: 1;
        }
        .step-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
          transition: var(--transition);
          margin-bottom: 12px;
          background: var(--white);
          border: 3px solid var(--gray-200);
          color: var(--gray-500);
        }
        .step-completed .step-circle {
          background-color: var(--brown);
          border-color: var(--brown);
          color: var(--white);
        }
        .step-active .step-circle {
          background-color: var(--brown);
          border-color: var(--cream);
          color: var(--white);
          box-shadow: 0 0 0 5px rgba(139, 94, 60, 0.3);
          animation: pulseRing 1.8s infinite;
        }
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(139, 94, 60, 0.6); }
          70% { box-shadow: 0 0 0 12px rgba(139, 94, 60, 0); }
          100% { box-shadow: 0 0 0 0 rgba(139, 94, 60, 0); }
        }
        .step-title {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text);
          margin-bottom: 4px;
        }
        .step-desc {
          font-size: 0.8rem;
          color: var(--text-light);
          max-width: 140px;
          line-height: 1.3;
        }
        @media (max-width: 768px) {
          .timeline-steps {
            flex-direction: column;
            gap: 28px;
          }
          .timeline-steps::before {
            display: none;
          }
          .timeline-step {
            flex-direction: row;
            text-align: left;
            gap: 16px;
          }
          .step-desc {
            max-width: 100%;
          }
        }
      `}</style>

      <div className="timeline-container">
        <div className="timeline-steps">
          {/* Progress fill bar */}
          <div
            className="timeline-progress-bar"
            style={{
              width: `${(activeIndex / (STEPS.length - 1)) * 100}%`,
            }}
          />

          {STEPS.map((step, idx) => {
            const isCompleted = idx < activeIndex;
            const isActive = idx === activeIndex;
            const StepIcon = step.icon;

            return (
              <div
                key={step.key}
                className={`timeline-step ${
                  isCompleted ? 'step-completed' : isActive ? 'step-active' : 'step-upcoming'
                }`}
              >
                <div className="step-circle">
                  {isCompleted ? (
                    <FaCheck size={18} />
                  ) : isActive ? (
                    <StepIcon size={20} />
                  ) : (
                    <StepIcon size={18} />
                  )}
                </div>
                <div>
                  <h4 className="step-title">{step.label}</h4>
                  <p className="step-desc">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default StatusTimeline;
