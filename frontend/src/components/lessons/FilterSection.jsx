import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { cn } from '../../lib/utils';

export function FilterSection({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  isRTL
}) {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-6">
      {/* Status Filter Tabs */}
      <div className="mb-4">
        <label className="text-sm font-medium text-neutral-700 mb-2 block">
          عرض:
        </label>
        <Tabs value={activeFilter} onValueChange={onFilterChange}>
          <TabsList className="w-full justify-start bg-neutral-100 p-1">
            <TabsTrigger value="all">● الكل</TabsTrigger>
            <TabsTrigger value="in_progress">⏳ قيد التقدم</TabsTrigger>
            <TabsTrigger value="completed">✅ مكتملة</TabsTrigger>
            <TabsTrigger value="locked">🔒 مغلقة</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className={cn(
          'absolute top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2',
          isRTL ? 'right-3' : 'left-3'
        )} />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث عن درس باسمه أو رقمه..."
          className={cn(isRTL ? 'pr-10' : 'pl-10', 'py-6 text-base')}
        />
      </div>
    </div>
  );
}
