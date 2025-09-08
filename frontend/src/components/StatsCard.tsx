import { JSX } from 'solid-js';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: JSX.Element;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
  colorClass?: string;
}

const StatsCard = (props: StatsCardProps) => {
  const getTrendIcon = () => {
    switch (props.trend?.direction) {
      case 'up':
        return (
          <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
        );
      case 'down':
        return (
          <svg class="w-4 h-4 fill-current rotate-180" viewBox="0 0 20 20">
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTrendColorClass = () => {
    switch (props.trend?.direction) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-error';
      default:
        return 'text-base-content/70';
    }
  };

  return (
    <div class="stat bg-base-100 shadow rounded-box">
      {props.icon && (
        <div class={`stat-figure ${props.colorClass || 'text-primary'}`}>
          {props.icon}
        </div>
      )}
      
      <div class="stat-title">{props.title}</div>
      
      <div class={`stat-value ${props.colorClass || 'text-primary'}`}>
        {props.value}
      </div>
      
      {(props.description || props.trend) && (
        <div class="stat-desc flex items-center justify-between">
          {props.description && (
            <span>{props.description}</span>
          )}
          {props.trend && (
            <div class={`flex items-center gap-1 ${getTrendColorClass()}`}>
              {getTrendIcon()}
              <span class="text-sm font-medium">{props.trend.value}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsCard;