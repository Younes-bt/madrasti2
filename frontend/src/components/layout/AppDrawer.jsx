"use client"

import React from 'react'
import { Link } from 'react-router-dom'
import {
    LayoutGrid,
    ChevronLeft,
    ChevronRight,
    Search
} from 'lucide-react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../ui/popover'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { useLanguage } from '../../hooks/useLanguage'
import { Input } from '../ui/input'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip'
import { cn } from '../../lib/utils'

export function AppDrawer({ navigationItems }) {
    const { t, isRTL } = useLanguage()
    const [view, setView] = React.useState('main') // 'main' or 'sub'
    const [selectedItem, setSelectedItem] = React.useState(null)
    const [searchQuery, setSearchQuery] = React.useState('')
    const [isOpen, setIsOpen] = React.useState(false)

    // Reset view when popover closes
    const handleOpenChange = (open) => {
        setIsOpen(open)
        if (!open) {
            setTimeout(() => {
                setView('main')
                setSelectedItem(null)
                setSearchQuery('')
            }, 300)
        }
    }

    const handleItemClick = (item) => {
        if (item.items && item.items.length > 0) {
            setSelectedItem(item)
            setView('sub')
        } else {
            setIsOpen(false)
        }
    }

    const handleBack = () => {
        setView('main')
        setSelectedItem(null)
    }

    const searchResults = React.useMemo(() => {
        if (!searchQuery) return []
        const query = searchQuery.toLowerCase()
        const results = []

        navigationItems.forEach(item => {
            // Check parent
            if (item.label.toLowerCase().includes(query)) {
                results.push({ ...item, isParent: true })
            }
            // Check children
            item.items?.forEach(sub => {
                if (sub.label.toLowerCase().includes(query)) {
                    results.push({ ...sub, parentLabel: item.label, isSub: true })
                }
            })
        })
        return results
    }, [navigationItems, searchQuery])

    return (
        <TooltipProvider>
            <Tooltip>
                <Popover open={isOpen} onOpenChange={handleOpenChange}>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300"
                            >
                                <LayoutGrid className="h-6 w-6" />
                                <span className="sr-only">Open App Drawer</span>
                            </Button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('common.openApps', 'Open School Apps')}</p>
                    </TooltipContent>
                    <PopoverContent
                        className="w-[320px] sm:w-[520px] p-0 border-none shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
                        align={isRTL ? "start" : "end"}
                        sideOffset={8}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-br from-primary/10 via-background to-background p-6 border-b border-primary/5 relative">
                            <div className="flex items-center justify-between gap-4">
                                {view === 'sub' && !searchQuery ? (
                                    <div className="flex items-center gap-3 animate-in slide-in-from-left duration-300">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleBack}
                                            className="h-8 w-8 rounded-full hover:bg-primary/10"
                                        >
                                            <ChevronLeft className={cn("h-5 w-5", isRTL && "rotate-180")} />
                                        </Button>
                                        <div>
                                            <h2 className="text-xl font-bold tracking-tight text-primary">
                                                {selectedItem?.label}
                                            </h2>
                                            <p className="text-xs text-muted-foreground">
                                                {t('common.backToApps', 'Back to all apps')}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="text-xl font-bold tracking-tight text-primary">
                                            {searchQuery ? t('common.searchResults', 'Search Results') : t('common.apps', 'School Apps')}
                                        </h2>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {searchQuery
                                                ? t('common.foundResults', `Found ${searchResults.length} matches`)
                                                : t('common.appsDescription', 'All your school tools in one place')}
                                        </p>
                                    </div>
                                )}

                                {/* Search Bar - Shared */}
                                <div className="relative w-40 sm:w-48">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                                    <Input
                                        placeholder={t('common.search', 'Search...')}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-8 pl-9 bg-background/50 border-primary/10 focus-visible:ring-primary/20 rounded-full text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        <ScrollArea className="h-[400px] sm:h-[500px] p-4">
                            {searchQuery ? (
                                <div className="space-y-1 animate-in fade-in duration-300">
                                    {searchResults.length > 0 ? (
                                        searchResults.map((result, idx) => (
                                            <SearchResultItem
                                                key={`${result.key}-${idx}`}
                                                item={result}
                                                onClick={() => setIsOpen(false)}
                                            />
                                        ))
                                    ) : (
                                        <div className="py-20 text-center space-y-3">
                                            <div className="bg-primary/5 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                                                <Search className="h-8 w-8 text-primary/20" />
                                            </div>
                                            <p className="text-sm text-muted-foreground">{t('common.noResults', 'No apps found matching your search.')}</p>
                                        </div>
                                    )}
                                </div>
                            ) : view === 'main' ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 p-2 animate-in fade-in zoom-in duration-300">
                                    {navigationItems.map((item) => (
                                        <DrawerItem
                                            key={item.key}
                                            item={item}
                                            onClick={() => handleItemClick(item)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-2 animate-in slide-in-from-right duration-300">
                                    {selectedItem?.items?.map((subItem) => (
                                        <SubDrawerItem
                                            key={subItem.key}
                                            item={subItem}
                                            parentIcon={selectedItem.icon}
                                            onClick={() => setIsOpen(false)}
                                        />
                                    ))}
                                </div>
                            )}
                        </ScrollArea>

                        <div className="p-4 bg-muted/30 border-t flex justify-center">
                            <Link
                                to="/settings"
                                onClick={() => setIsOpen(false)}
                                className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium italic"
                            >
                                {t('common.manageAccount', 'Manage your account')}
                                <ChevronRight className={cn("h-3 w-3", isRTL && "rotate-180")} />
                            </Link>
                        </div>
                    </PopoverContent>
                </Popover>
            </Tooltip>
        </TooltipProvider>
    )
}

function DrawerItem({ item, onClick }) {
    const Icon = item.icon
    const hasSubItems = item.items && item.items.length > 0
    const targetPath = item.path || (hasSubItems ? null : (item.items && item.items[0]?.path))

    const content = (
        <>
            <div className="h-12 w-12 rounded-xl bg-background border border-primary/10 shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:shadow-md transition-all duration-300 relative">
                {Icon && <Icon className="h-6 w-6" />}
                {hasSubItems && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center border-2 border-background">
                        {item.items.length}
                    </div>
                )}
            </div>
            <span className="text-[11px] sm:text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors line-clamp-1 w-full text-center">
                {item.label}
            </span>
        </>
    )

    if (hasSubItems) {
        return (
            <button
                onClick={onClick}
                className="group flex flex-col items-center gap-3 p-3 rounded-2xl transition-all duration-300 hover:bg-primary/5 hover:scale-105 active:scale-95"
            >
                {content}
            </button>
        )
    }

    return (
        <Link
            to={targetPath}
            onClick={onClick}
            className="group flex flex-col items-center gap-3 p-3 rounded-2xl transition-all duration-300 hover:bg-primary/5 hover:scale-105 active:scale-95"
        >
            {content}
        </Link>
    )
}

function SubDrawerItem({ item, parentIcon: ParentIcon, onClick }) {
    const Icon = item.icon || ParentIcon

    return (
        <Link
            to={item.path}
            onClick={onClick}
            className="group flex flex-col items-center gap-3 p-3 rounded-2xl transition-all duration-300 hover:bg-primary/5 hover:scale-105 active:scale-95 text-center"
        >
            <div className="h-10 w-10 rounded-lg bg-background border border-primary/5 shadow-sm flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all duration-300">
                {Icon && <Icon className="h-5 w-5" />}
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground group-hover:text-primary transition-colors line-clamp-2 w-full">
                {item.label}
            </span>
        </Link>
    )
}

function SearchResultItem({ item, onClick }) {
    const Icon = item.icon
    const targetPath = item.path || (item.items && item.items[0]?.path)

    return (
        <Link
            to={targetPath}
            onClick={onClick}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-primary/5 transition-all duration-200 group border border-transparent hover:border-primary/10"
        >
            <div className="h-10 w-10 rounded-lg bg-background border border-primary/5 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                {Icon && <Icon className="h-5 w-5" />}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                    {item.label}
                </div>
                {item.parentLabel && (
                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <span>{item.parentLabel}</span>
                        <ChevronRight className="h-2 w-2" />
                        <span>{item.label}</span>
                    </div>
                )}
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
        </Link>
    )
}
