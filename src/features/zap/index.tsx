import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

// Mock
const usdValue = 0.00028;

export function Zap(props: any) {
  const { value, onChange } = props;

  const handleChangeValue = (e: any) => {
    const localValue = e.target.value;
    onChange(localValue);
  };

  return (
    <>
      <div className="flex gap-4 justify-between">
        {/* Custom */}
        <div className="flex flex-col gap-1 items-center">
          <div className="flex">
            <Button
              size="icon"
              variant={value === 0 ? 'outline' : 'secondary'}
              className="rounded-r-none"
              disabled={value === 0}
              onClick={() => onChange(value - 1)}
            >
              <MinusIcon />
            </Button>
            <Input
              type="number"
              defaultValue={value !== 0 ? value : ''}
              placeholder="0"
              className="flex-1 rounded-none max-w-[100px] text-center "
              onChange={handleChangeValue}
              // readOnly
            />
            <Button
              size="icon"
              variant="secondary"
              className="rounded-l-none"
              onClick={() => onChange(value + 1)}
            >
              <PlusIcon />
            </Button>
          </div>
          {(value || value > 0) && (
            <p className="text-sm text-gray-500">≈ {(value * usdValue).toFixed(2)} USD</p>
          )}
        </div>
        {/* Cantidad default */}
        <div className="">
          <div className="flex">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-r-none"
              onClick={() => onChange(3000)}
            >
              3k
            </Button>
            <Separator orientation="vertical" />
            <Button
              size="icon"
              variant="secondary"
              className="rounded-none"
              onClick={() => onChange(5000)}
            >
              5k
            </Button>
            <Separator orientation="vertical" />
            <Button
              size="icon"
              variant="secondary"
              className="rounded-l-none"
              onClick={() => onChange(10000)}
            >
              10k
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function MinusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      color="currentColor"
      fill="none"
    >
      <path
        d="M20 12L4 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={'currentColor'}
    fill={'none'}
    {...props}
  >
    <path
      d="M12 4V20M20 12H4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
