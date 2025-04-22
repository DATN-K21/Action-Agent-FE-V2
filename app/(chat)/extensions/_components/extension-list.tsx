'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  IconAdjustmentsHorizontal,
  IconSortAscendingLetters,
  IconSortDescendingLetters,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { extensions, Extension } from '@/constants/data';
import { Separator } from '@/components/ui/separator';
import ExtensionDialog from './extension-dialog';
import {
  disconnectExtension,
  ExtensionParams,
  getAllExtensions,
  getConnectedExtensions,
} from '@/services/extension-service';
import { User } from 'next-auth';
import useChatStore from '@/store/chat-store';

export type ExtensionListProps = {
  user: User;
};

export default function ExtensionList(props: ExtensionListProps) {
  const { user } = props;

  const [sort, setSort] = useState<'ascending' | 'descending'>('ascending');

  const [filteredExtensions, setFilteredExtensions] = useState<Extension[]>([]);
  const [selectedExtension, setSelectedExtension] = useState<Extension | null>(null);

  const [extensionType, setExtensionType] = useState<'all' | 'connected' | 'notConnected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

  const reloadChat = useChatStore((state) => state.reloadChat);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchExtensionData = async () => {
      try {
        const extensionParams = { user } as ExtensionParams;

        const [allExtensionsData, connectedExtensionsData] = await Promise.all([
          getAllExtensions(extensionParams),
          getConnectedExtensions(extensionParams),
        ]);

        const getExtensions = extensions.filter(
          (ext) => ext.key && allExtensionsData?.extensions.includes(ext.key),
        );
        const updatedExtensions = getExtensions.map((extension) => ({
          ...extension,
          connected:
            connectedExtensionsData.connectedApps?.some((ext) => ext.appName === extension.key) ||
            false,
        }));

        const newFilteredExtensions = updatedExtensions
          .sort((a, b) =>
            sort === 'ascending' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
          )
          .filter((extension) =>
            extensionType === 'connected'
              ? extension.connected
              : extensionType === 'notConnected'
                ? !extension.connected
                : true,
          )
          .filter((extension) => extension.name.toLowerCase().includes(searchTerm.toLowerCase()));

        setFilteredExtensions(newFilteredExtensions);
      } catch (error) {
        console.error('Error fetching extension data: ', error);
      }
    };

    reloadChat();
    fetchExtensionData();
  }, [user, extensionType, searchTerm, sort]);

  const handleDisconnectExtension = async () => {
    if (!selectedExtension || !selectedExtension.connected) return;
    await disconnectExtension({ user, extension: selectedExtension });
    setFilteredExtensions((prev) =>
      prev.map((extension) =>
        extension.key === selectedExtension.key ? { ...extension, connected: false } : extension,
      ),
    );
    setSelectedExtension(null);
  };

  return (
    <>
      <div className="flex flex-col h-screen w-full px-4">
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            value={sort}
            onValueChange={(value) => setSort(value as 'ascending' | 'descending')}
          >
            <SelectTrigger className="w-16">
              <SelectValue>
                <IconAdjustmentsHorizontal size={18} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="ascending">
                <div className="flex items-center gap-4">
                  <IconSortAscendingLetters size={16} />
                  <span>Ascending</span>
                </div>
              </SelectItem>
              <SelectItem value="descending">
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
          {filteredExtensions.map((extension) => (
            <li
              key={extension.name}
              className="rounded-lg border p-4 hover:shadow-md hover:cursor-pointer"
              onClick={() => {
                setSelectedExtension(extension);
                setIsOpenDialog(true);
              }}
            >
              <div className="mb-8 flex items-center justify-between">
                <div className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}>
                  <extension.logo />
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
                <h2 className="mb-1 font-semibold">{extension.name}</h2>
                <p className="line-clamp-2 text-gray-500">{extension.desc}</p>
              </div>
            </li>
          ))}
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
