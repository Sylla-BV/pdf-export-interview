import { Clock } from 'lucide-react';

interface CountdownDisplayProps {
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

export function CountdownDisplay({ hours, minutes, seconds, completed }: CountdownDisplayProps) {
  if (completed) {
    return (
      <div className='mb-4 flex items-center justify-center space-x-2'>
        <span className='text-lg font-bold text-red-600'>Expired</span>
      </div>
    );
  }

  const formattedTime =
    hours > 0
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className='mb-4 flex items-center justify-center space-x-2'>
      <Clock className='h-5 w-5 text-blue-600' />
      <span className='text-sm text-gray-600'>
        Expires in: <span className='font-mono text-lg font-bold'>{formattedTime}</span>
      </span>
    </div>
  );
}
