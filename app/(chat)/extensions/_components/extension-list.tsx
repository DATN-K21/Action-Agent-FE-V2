'use client';

import { ExtensionCardSkeleton } from '@/components/skeleton/extension-card-skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  disconnectExtension,
  ExtensionParams,
  getAllExtensions,
  ICursorFilterProps,
} from '@/services/extension-service';
import { IExtension } from '@/types/extension';
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from '@tabler/icons-react';
import { User } from 'next-auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SiRetool } from 'react-icons/si';
import ExtensionDialog from './extension-dialog';

export type ExtensionListProps = {
  user: User;
};

export default function ExtensionList(props: ExtensionListProps) {
  const { user } = props;

  const isExtensionListFetchedRef = useRef<boolean>(false);
  const loadingMoreRef = useRef<boolean>(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const [extensions, setExtensions] = useState<IExtension[]>([]);
  const [selectedExtension, setSelectedExtension] = useState<IExtension | null>(null);
  const [extensionType, setExtensionType] = useState<'all' | 'connected' | 'notConnected'>('all');
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const getDisplayedExtensionName = (extName: string) => {
    if (extName.length > 20) {
      return `${extName.slice(0, 20)}...`;
    }
    return extName;
  };

  const [filter, setFilter] = useState<ICursorFilterProps>({
    limit: 24,
    category: null,
    sortBy: 'id',
    sortOrder: 'asc',
    search: '',
    connected: null,
  });

  const updateFilter = useCallback((field: string, value: any) => {
    setFilter((prev) => ({
      ...prev,
      [field]: value,
    }));
    setExtensions([]);
    setNextCursor(null);
    setHasMore(true);
    isExtensionListFetchedRef.current = false;
  }, []);

  const loadMoreExtensions = useCallback(async () => {
    if (!user || !nextCursor || !hasMore || loadingMoreRef.current === true) {
      return;
    }

    loadingMoreRef.current = true;
    setLoadingMore(true);

    try {
      const extensionParams: ExtensionParams = {
        user,
        filter: {
          ...filter,
          cursor: nextCursor,
        },
      } as ExtensionParams;
      const { data, meta } = await getAllExtensions(extensionParams);
      if (data.length <= 0 || !meta || !meta.nextCursor || meta.hasMore === false) {
        setHasMore(false);
      } else {
        setNextCursor(meta.nextCursor);
        setExtensions((prev) => [
          ...prev,
          ...data.filter((ext) => !prev.some((e) => e.key === ext.key)),
        ]);
        setHasMore(meta.hasMore);
      }
    } catch (error) {
      console.error('Error loading more extensions: ', error);
    } finally {
      setLoadingMore(false);
      loadingMoreRef.current = false;
    }
  }, [filter, hasMore, nextCursor, user]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loadingMore) {
          loadMoreExtensions();
        }
      },
      { threshold: 1.0, rootMargin: '100px' },
    );
    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [hasMore, loadMoreExtensions, loadingMore]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchExtensionData = async (): Promise<void> => {
      if (isExtensionListFetchedRef.current === true) {
        return;
      }

      setLoading(true);
      try {
        isExtensionListFetchedRef.current = true;
        const extensionParams = {
          user,
          filter,
        } as ExtensionParams;

        const { data, meta } = await getAllExtensions(extensionParams);
        setNextCursor(meta?.nextCursor || null);
        setHasMore(meta?.hasMore || false);
        console.log('Fetched extensions: ', data);
        setExtensions(data);
      } catch (error) {
        console.error('Error fetching extension data: ', error);
      } finally {
        setLoading(false);
        isExtensionListFetchedRef.current = false;
      }
    };

    fetchExtensionData();
  }, [filter, user]);

  const handleDisconnectExtension = async () => {
    if (!selectedExtension || !selectedExtension.connected) {
      return;
    }
    await disconnectExtension({ user, extension: selectedExtension });
    setExtensions((prev) =>
      prev.map((extension) =>
        extension.key === selectedExtension.key ? { ...extension, connected: false } : extension,
      ),
    );
    setSelectedExtension(null);
  };

  return (
    <>
      <div className="flex flex-col w-full px-2 md:px-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight mt-2">Extension Integrations</h1>
          <p className="text-muted-foreground">
            {`Here's a list of your extensions for the integration!`}
          </p>
        </div>

        {/* Filters */}
        <div className="my-4 flex items-end justify-between sm:my-0 sm:items-center">
          <div className="flex flex-col gap-4 sm:my-4 sm:flex-row">
            <Input
              placeholder="Filter apps..."
              className="h-9 w-40 lg:w-[250px]"
              value={filter.search}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
            <Select
              value={extensionType}
              onValueChange={(value) =>
                setExtensionType(value as 'all' | 'connected' | 'notConnected')
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue>
                  {extensionType === 'all'
                    ? 'All Extensions'
                    : extensionType === 'connected'
                      ? 'Connected Apps'
                      : 'Not Connected Apps'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Extensions</SelectItem>
                <SelectItem value="connected">Connected</SelectItem>
                <SelectItem value="notConnected">Not Connected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select
            value={filter.sortOrder}
            onValueChange={(value) => updateFilter('sortOrder', value as 'asc' | 'desc')}
          >
            <SelectTrigger className="w-16">
              <SelectValue>
                <IconAdjustmentsHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="asc">
                <div className="flex items-center gap-4">
                  <IconSortAscendingLetters size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value="desc">
                <div className="flex items-center gap-4">
                  <IconSortDescendingLetters size={16} />
                  <span>Descending</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="shadow" />

        {/* Extension List */}
        <ul className="faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, index) => <ExtensionCardSkeleton key={`skeleton-${index}`} />)
          ) : extensions.length > 0 ? (
            <>
              {extensions.map((extension) => (
                <li
                  key={extension.name}
                  className="rounded-lg border p-4 hover:shadow-md hover:cursor-pointer"
                  onClick={() => {
                    setSelectedExtension(extension);
                    setIsOpenDialog(true);
                  }}
                >
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
                      >
                        {!imageErrors.has(extension.key) ? (
                          // NOTE: it is recommended to use next/image for images
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={extension.logo}
                            alt={extension.name}
                            width={40}
                            height={40}
                            loading="lazy"
                            className="size-8 object-contain"
                            onError={() => {
                              setImageErrors((prev) => new Set(prev).add(extension.key));
                            }}
                          />
                        ) : (
                          <SiRetool className="size-8 text-yellow-500" />
                        )}
                      </div>

                      <div className="flex flex-col items-start gap-2">
                        {/* Only shows 2 categories as maximum for the category list of an extension */}
                        {extension.categories?.slice(0, 2).map((category, index) => {
                          const categoryStyleClass =
                            index % 2 === 0
                              ? `bg-blue-100 text-blue-750 ring-blue-600/20 ring-inset`
                              : `bg-green-100 text-green-750 ring-green-600/20 ring-inset`;
                          return (
                            <span
                              key={category}
                              className={`text-[10px] font-semibold italic px-2 py-1 rounded-full ${categoryStyleClass}`}
                            >
                              {category}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className={`${
                        extension.connected
                          ? 'border border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900'
                          : ''
                      }`}
                    >
                      {extension.connected ? 'Connected' : 'Connect'}
                    </Button>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-start gap-2 px-2 py-1 rounded-md">
                      <h2 className="mb-0 font-semibold">
                        {getDisplayedExtensionName(extension.name.toUpperCase())}
                      </h2>
                      <div className="flex items-center gap-1 text-sm bg-pink-300 px-2 rounded-xl">
                        <SiRetool />
                        {`${extension.actionsCount || 0} Actions`}
                      </div>
                    </div>
                    <p className="line-clamp-2 text-gray-500">{extension.description}</p>
                  </div>
                </li>
              ))}

              {/* Loading more indicator */}
              {loadingMore &&
                Array(3)
                  .fill(0)
                  .map((_, index) => <ExtensionCardSkeleton key={`loading-more-${index}`} />)}

              {/* Observer target for infinite scrolling */}
              {hasMore && <div ref={observerRef} className="col-span-full h-4" />}
            </>
          ) : (
            <li className="col-span-full text-center py-10 text-gray-500">
              No extensions found matching your criteria
            </li>
          )}
        </ul>
      </div>

      {/* Extension Dialog */}
      <ExtensionDialog
        user={user}
        extension={selectedExtension!}
        isOpen={isOpenDialog}
        onClose={() => setIsOpenDialog(false)}
        onDisconnect={handleDisconnectExtension}
      />
    </>
  );
}
