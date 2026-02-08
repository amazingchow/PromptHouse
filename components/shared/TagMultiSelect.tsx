'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TagMultiSelectProps {
  availableTags: { id: string; name: string }[];
  value: string[];
  onChange: (value: string[]) => void;
}

export function TagMultiSelect({ availableTags, value, onChange }: TagMultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedTags = value.map((id) => availableTags.find((tag) => tag.id === id)).filter(Boolean) as {
    id: string;
    name: string;
  }[];

  const handleSelect = (currentValue: string) => {
    const newSelectedIds = value.includes(currentValue)
      ? value.filter((id) => id !== currentValue)
      : [...value, currentValue];
    onChange(newSelectedIds);
  };

  const handleRemove = (idToRemove: string) => {
    onChange(value.filter((id) => id !== idToRemove));
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
            {tag.name}
            <button
              type="button"
              onClick={() => handleRemove(tag.id)}
              className="hover:bg-muted-foreground/20 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between font-normal">
            <span className="text-muted-foreground">选择标签...</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="搜索标签..." />
            <CommandEmpty>没有找到标签。</CommandEmpty>
            <CommandGroup>
              {availableTags.map((tag) => (
                <CommandItem key={tag.id} value={tag.id} onSelect={handleSelect}>
                  <Check className={cn('mr-2 h-4 w-4', value.includes(tag.id) ? 'opacity-100' : 'opacity-0')} />
                  {tag.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
