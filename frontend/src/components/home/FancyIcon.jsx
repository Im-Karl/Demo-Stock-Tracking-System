import clsx from 'clsx';

export default function FancyIcon({ Icon, className }) {
  return (
    <div class={clsx('w-14 h-14 rounded flex items-center justify-center border-b-6 border-b-black/20', className)}>
      <Icon class="text-xl" />
    </div>
  );
}
