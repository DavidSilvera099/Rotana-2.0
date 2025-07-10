import React from 'react';

interface DividerProps {
  orientation: 'horizontal' | 'vertical';
  color: string;
}

const Divider: React.FC<DividerProps> = ({ orientation, color }) => {
  return (
    <div className="relative w-4 h-4 flex items-center justify-center">
      <hr
        className={`
          absolute
          ${orientation === 'vertical'
            ? 'w-40 rotate-90 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
            : 'w-40 left-1/2 top-1/2 -translate-x-1/2'}
          border-t-2 border-${color}
        `}
      />
    </div>
  );
};

export default Divider;