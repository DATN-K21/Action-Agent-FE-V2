'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconBrandFigma } from '@tabler/icons-react';
import { AddAssistantDialog } from './add-assistant-dialog';
import { User } from 'next-auth';
import { getConnectedExtensions } from '@/services/extension-service';
import { getMCPs } from '@/services/mcp-service';
import type { IMCPServer } from '@/types/mcp';

import { IConnectedApp } from '@/types/extension';
import { MoreHorizontal, Pencil, Plus, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type AssistantListProps = {
  user: User;
};

export default function AssistantsList(props: AssistantListProps) {
  const { user } = props;

  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [selectedExtension, setSelectedExtension] = useState<IConnectedApp[]>([]);
  const [selectedMCPServer, setSelectedMCPServer] = useState<IMCPServer[]>([]);
  const [type, setType] = useState<'extension' | 'mcp-server'>('extension');

  useEffect(() => {
    if (!user) return;
    const fetchConnectedExtensions = async () => {
      try {
        const response = await getConnectedExtensions({ user, extension: null });
        setSelectedExtension(response.connectedApps);
      } catch (error) {
        console.error('Error fetching connected extensions:', error);
      }
    };

    const fetchConnectedMCPServer = async () => {
      try {
        const response = await getMCPs({ user });
        setSelectedMCPServer(response);
      } catch (error) {
        console.error('Error fetching connected extensions:', error);
      }
    };

    if (type === 'mcp-server') {
      fetchConnectedMCPServer();
    }

    if (type === 'extension') {
      fetchConnectedExtensions();
    }
  }, [user, type]);

  console.log('Selected Extension:', selectedExtension);
  const extension = {
    name: 'Assistant 1',
    desc: 'Assistant for Botion',
    logo: IconBrandFigma,
    connected: true,
  };

  const mcpServer = {
    name: 'Assistant 2',
    desc: 'Assistant for Botion',
    logo: IconBrandFigma,
    connected: true,
  };

  const handleAddExtensionAssistant = () => {
    setIsOpenDialog(true);
  };
  const handleAddMCPServerAssistant = () => {
    setIsOpenDialog(true);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-4 mb-2">
        <Tabs
          defaultValue="extension"
          className="w-full"
          onValueChange={(value) => setType(value as 'extension' | 'mcp-server')}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="extension">Extensions</TabsTrigger>
            <TabsTrigger value="mcp-server">MCP Servers</TabsTrigger>
          </TabsList>
          <TabsContent value="extension">
            <Card>
              <CardHeader>
                <div className="flex flex-row items-center justify-between">
                  <p className="text-sm md:text-base">
                    {`Here's a list of your assistants using Extensions`}
                  </p>
                  <Button variant="outline" size="sm" onClick={handleAddExtensionAssistant}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Assistant
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <ul className="faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 md:grid-cols-2 lg:grid-cols-3">
                  <li
                    key={extension.name}
                    className="rounded-lg border p-4 hover:shadow-md hover:cursor-pointer"
                    // onClick={() => {
                    //   setSelectedExtension(extension);
                    //   setIsOpenDialog(true);
                    // }}
                  >
                    <div className="mb-8 flex items-center justify-between">
                      <div
                        className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
                      >
                        <extension.logo />
                      </div>

                      <div className={`flex size-10 items-center justify-center rounded-lg p-2`}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="bottom" align="start" sideOffset={4}>
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:text-red-700">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div>
                      <h2 className="mb-1 font-semibold">{extension.name}</h2>
                      <p className="line-clamp-2 text-gray-500">{extension.desc}</p>
                    </div>
                    <div className="flex flex-row justify-between items-center mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-green-500 text-green-500 hover:border-green-600 hover:text-green-600 hover:bg-green-100"
                      >
                        Start chat
                      </Button>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="mcp-server">
            <Card>
              <CardHeader>
                <div className="flex flex-row items-center justify-between">
                  <p className="text-sm md:text-base">
                    {`Here's a list of your assistants using MCP Servers`}
                  </p>
                  <Button variant="outline" size="sm" onClick={handleAddMCPServerAssistant}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Assistant
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <ul className="faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 md:grid-cols-2 lg:grid-cols-3">
                  <li
                    key={mcpServer.name}
                    className="rounded-lg border p-4 hover:shadow-md hover:cursor-pointer"
                    // onClick={() => {
                    //   setSelectedExtension(extension);
                    //   setIsOpenDialog(true);
                    // }}
                  >
                    <div className="mb-8 flex items-center justify-between">
                      <div
                        className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
                      >
                        <mcpServer.logo />
                      </div>

                      <div className={`flex size-10 items-center justify-center rounded-lg p-2`}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="bottom" align="start" sideOffset={4}>
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:text-red-700">
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div>
                      <h2 className="mb-1 font-semibold">{mcpServer.name}</h2>
                      <p className="line-clamp-2 text-gray-500">{mcpServer.desc}</p>
                    </div>
                    <div className="flex flex-row justify-between items-center mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-green-500 text-green-500 hover:border-green-600 hover:text-green-600 hover:bg-green-100"
                      >
                        Start chat
                      </Button>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <AddAssistantDialog
        open={isOpenDialog}
        onOpenChange={setIsOpenDialog}
        extensionOptions={selectedExtension.map((ext) => ({ appName: ext.appName, value: ext.id }))}
        mcpOptions={selectedMCPServer.map((mcp) => ({ mcpName: mcp.mcpName, value: mcp.id }))}
        type={type}
      />
    </>
  );
}
