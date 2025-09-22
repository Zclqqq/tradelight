
'use client';
import { usePathname } from 'next/navigation';
import {
  CandlestickChart,
  GitGraph,
  Home,
  Settings,
  Plus,
  CircleUser,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navItems = [
  {
    icon: Home,
    label: 'Home',
    href: '/',
  },
  {
    icon: CandlestickChart,
    label: 'All trades',
    href: '/all-trades',
  },
  {
    icon: GitGraph,
    label: 'PNL',
    href: '/pnl',
  },
];

const secondaryNavItems = [
  {
    icon: CircleUser,
    label: 'Account',
    href: '/account',
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/settings',
  },
];

function Sidebar() {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger>
          <Plus />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you sure absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className='flex flex-col border-r h-full'>
      <div className='flex items-center justify-center my-4 bg-black text-white p-2 rounded-md'>
        <CandlestickChart size={32} />
        <h1 className='text-2xl font-bold ml-2'>TradeLight</h1>
      </div>
      <div className='flex flex-col items-start'>
        <TooltipProvider>
          {navItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger>
                <a
                  href={item.href}
                  className={`flex items-center py-2 px-4 w-full text-left ${
                    pathname === item.href ? 'bg-gray-200' : ''
                  }`}
                >
                  <item.icon />
                  <span className='ml-2'>{item.label}</span>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
      <div className='flex-grow' />
      <div className='flex flex-col items-start'>
        <TooltipProvider>
          {secondaryNavItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger>
                <a
                  href={item.href}
                  className={`flex items-center py-2 px-4 w-full text-left ${
                    pathname === item.href ? 'bg-gray-200' : ''
                  }`}
                >
                  <item.icon />
                  <span className='ml-2'>{item.label}</span>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
      <div className='flex flex-col items-start mt-auto'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <a
                href='/log-day'
                className='flex items-center py-2 px-4 w-full text-left'
              >
                <Plus />
                <span className='ml-2'>Log Day</span>
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>Log Day</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default Sidebar;
