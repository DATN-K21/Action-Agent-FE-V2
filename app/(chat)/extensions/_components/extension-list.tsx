'use client';

import { ExtensionCardSkeleton } from '@/components/skeleton/extension-card-skeleton';
import { toast } from '@/components/toast';
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
  activeExtension,
  disconnectExtension,
  ExtensionParams,
  getAllExtensions,
  IPageFilterProps,
} from '@/services/extension-service';
import { IActiveExtensionResponse, IExtension } from '@/types/extension';
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from '@tabler/icons-react';
import { User } from 'next-auth';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SiRetool } from 'react-icons/si';
import InfiniteScroll from 'react-infinite-scroll-component';
import ExtensionDialog from './extension-dialog';
import LoadingDialog from '@/components/loading-dialog';

export type ExtensionListProps = {
  user: User;
};

export default function ExtensionList(props: ExtensionListProps) {
  const { user } = props;

  const isExtensionListFetchedRef = useRef<boolean>(false);
  const loadingMoreRef = useRef<boolean>(false);

  const [extensions, setExtensions] = useState<IExtension[]>([]);
  const [selectedExtension, setSelectedExtension] = useState<IExtension | null>(null);

  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [isLoadingDialogOpen, setIsLoadingDialogOpen] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResult, setTotalResult] = useState<number>(0);

  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const getDisplayedExtensionName = (extName: string) => {
    if (extName.length > 20) {
      return `${extName.slice(0, 20)}...`;
    }
    return extName;
  };

  const [filter, setFilter] = useState<IPageFilterProps>({
    limit: 24,
    category: null,
    sortBy: 'id',
    sortOrder: 'asc',
    search: '',
    connected: null,
  });

  const updateFilter = useCallback((field: string, value: any) => {
    setFilter((prev: IPageFilterProps) => ({
      ...prev,
      [field]: value,
      page: field === 'page' ? value : 1, // Reset page to 1 if any other field is updated
    }));
  }, []);

  const loadMoreExtensions = async () => {
    if (!user || !hasMore || loadingMoreRef.current === true) {
      return;
    }
    loadingMoreRef.current = true;

    try {
      const nextPage = currentPage ? currentPage + 1 : 2;
      const extensionParams: ExtensionParams = {
        user,
        filter: {
          ...filter,
          page: nextPage,
        },
      } as ExtensionParams;
      const { data, meta } = await getAllExtensions(extensionParams);

      if (data.length <= 0 || !meta || meta?.page >= meta?.totalPages) {
        setHasMore(false);
      } else {
        setCurrentPage(nextPage);
        setExtensions((prev: IExtension[]) => [
          ...prev,
          ...data.filter((ext: IExtension) => !prev.some((e: IExtension) => e.key === ext.key)),
        ]);
        setHasMore(meta?.page < meta?.totalPages);
      }
    } catch (error) {
      console.error('Error loading more extensions: ', error);
    } finally {
      loadingMoreRef.current = false;
    }
  };

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

        setHasMore(meta?.page < meta?.totalPages);
        setExtensions(data);
        setTotalResult(meta?.total || data.length);
      } catch (error) {
        console.error('Error fetching extension data: ', error);
      } finally {
        setLoading(false);
        isExtensionListFetchedRef.current = false;
      }
    };

    fetchExtensionData();
  }, [filter, user]);

  const toggleConnectButton = async (extension: IExtension) => {
    if (!extension || extension.connected === null) {
      return;
    }
    if (extension.connected === false) {
      return await handleClickConnect(extension);
    }
    return await handleDisconnectExtension(extension);
  };

  const handleClickConnect = async (extension: IExtension) => {
    setIsLoadingDialogOpen(true);
    try {
      const response: IActiveExtensionResponse = await activeExtension({ user, extension });

      // Check if the extension is already connected
      if (response?.isExisted) {
        toast({ type: 'error', description: 'Extension is already connected' });
        return;
      }

      // Redirect to the extension's connection URL
      toast({ type: 'info', description: 'Redirecting to connect to extension...' });
      window.location.href = response.redirectUrl;
    } catch (error) {
      toast({ type: 'error', description: 'Failed to connect to extension' });
    } finally {
      setIsLoadingDialogOpen(false);
    }
  };

  const handleDisconnectExtension = async (extension: IExtension) => {
    if (!extension || extension.connected === false) {
      return;
    }
    setIsLoadingDialogOpen(true);
    try {
      await disconnectExtension({ user, extension: extension });
      setExtensions((prev) =>
        prev.map((ext) => (ext.key === extension.key ? { ...ext, connected: false } : ext)),
      );
      setSelectedExtension(null);
    } catch (error) {
      console.warn('Error disconnecting extension: ', error);
    } finally {
      setIsLoadingDialogOpen(false);
      toast({ type: 'success', description: 'Extension disconnected successfully' });
    }
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
              value={
                filter.connected === null ? 'all' : filter.connected ? 'connected' : 'notConnected'
              }
              onValueChange={(value) =>
                updateFilter(
                  'connected',
                  value === 'all' ? null : value === 'connected' ? true : false,
                )
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue>
                  {filter.connected === null
                    ? 'All Extensions'
                    : filter.connected === true
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

            <div className="flex items-center gap-1 text-sm bg-yellow-100 px-3 rounded-3xl">
              {loading ? 'Loading ...' : `${totalResult} results.`}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={filter.sortBy}
              onValueChange={(value) =>
                updateFilter('sortBy', value as 'id' | 'name' | 'actionsCount')
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <IconAdjustmentsHorizontal size={18} />
                    <span>Sort By</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="id">
                  <div className="flex items-center gap-4">
                    <span>ID</span>
                  </div>
                </SelectItem>
                <SelectItem value="name">
                  <div className="flex items-center gap-4">
                    <span>Name</span>
                  </div>
                </SelectItem>
                <SelectItem value="actionsCount">
                  <div className="flex items-center gap-4">
                    <span>Actions Count</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filter.sortOrder}
              onValueChange={(value) => updateFilter('sortOrder', value as 'asc' | 'desc')}
            >
              <SelectTrigger className="w-36">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <IconAdjustmentsHorizontal size={18} />
                    <span>Sort Order</span>
                  </div>
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
        </div>

        <Separator className="shadow" />

        {/* Extension List */}
        <div id="extension-list-scroll" className="faded-bottom no-scrollbar">
          {loading ? (
            <ul className="grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <ExtensionCardSkeleton key={`skeleton-${index}`} />
                ))}
            </ul>
          ) : extensions.length > 0 ? (
            <InfiniteScroll
              dataLength={extensions.length}
              next={loadMoreExtensions}
              hasMore={hasMore}
              loader={
                <ul className="grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <ExtensionCardSkeleton key={i} />
                    ))}
                </ul>
              }
            >
              <ul className="grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-2 lg:grid-cols-3">
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
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedExtension(extension);
                          toggleConnectButton(extension);
                        }}
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
              </ul>
            </InfiniteScroll>
          ) : (
            <li className="col-span-full text-center py-10 text-gray-500 list-none">
              No extensions found matching your criteria
            </li>
          )}
        </div>
      </div>

      {/* Extension Dialog */}
      <ExtensionDialog
        user={user}
        extension={selectedExtension!}
        isOpen={isOpenDialog}
        onClose={() => setIsOpenDialog(false)}
      />

      {/* Loading Dialog */}
      <LoadingDialog
        isOpen={isLoadingDialogOpen}
        onClose={() => setIsLoadingDialogOpen(false)}
        title="🚀 Loading"
        description="Please wait for a second while we process your request ..."
      />
    </>
  );
}
