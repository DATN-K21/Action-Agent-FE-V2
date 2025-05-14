'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddAssistantDialog } from './add-assistant-dialog';
import { EditAssistantDialog } from './edit-assistant-dialog';
import { AssistantCard } from './assistant-card';
import { User } from 'next-auth';
import { getConnectedExtensions } from '@/services/extension-service';
import { getConnectedMCPs } from '@/services/mcp-service';
import { deleteAssistant, getAssistants } from '@/services/assistant-service';
import type { IMCP } from '@/types/mcp';
import { AssistantCardSkeletonList } from '@/components/skeleton/assistant-card-skeleton';
import { type IAssistant } from '@/types/assistant.d';
import { IConnectedExtension } from '@/types/extension';
import { Plus } from 'lucide-react';
import { toast } from '@/components/toast';
import { AssistantType } from '@/constants/assistant-constant';

export type AssistantListProps = {
  user: User;
};

export default function AssistantsList(props: AssistantListProps) {
  const { user } = props;

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [availableExtensions, setAvailableExtensions] = useState<IConnectedExtension[]>([]);
  const [availableMCPServers, setAvailableMCPServers] = useState<IMCP[]>([]);
  const [assistantType, setAssistantType] = useState<AssistantType>(AssistantType.EXTENSION);
  const [extensionAssistants, setExtensionAssistants] = useState<IAssistant[]>([]);
  const [mcpAssistants, setMcpAssistants] = useState<IAssistant[]>([]);
  const [isLoadingAssistants, setIsLoadingAssistants] = useState<boolean>(false);
  const [assistantToUpdate, setAssistantToUpdate] = useState<IAssistant | null>(null);

  const fetchAssistants = useCallback(async () => {
    if (!user) return;
    setIsLoadingAssistants(true);

    try {
      const response = await getAssistants({ user });
      const extensionAssistantsList: IAssistant[] = [];
      const mcpAssistantsList: IAssistant[] = [];

      response.forEach((assistant) => {
        if (assistant.type === AssistantType.EXTENSION) {
          extensionAssistantsList.push(assistant);
        } else if (assistant.type === AssistantType.MCP_SERVER) {
          mcpAssistantsList.push(assistant);
        }
      });

      setExtensionAssistants(extensionAssistantsList);
      setMcpAssistants(mcpAssistantsList);
    } catch (error) {
      console.error('Error fetching assistants:', error);
    } finally {
      setIsLoadingAssistants(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const fetchAvailableExtensions = async () => {
      try {
        const response = await getConnectedExtensions({ user, extension: null });
        setAvailableExtensions(response.connectedExtensions);
      } catch (error) {
        console.error('Error fetching connected extensions:', error);
      }
    };

    const fetchAvailableMCPServers = async () => {
      try {
        const response = await getConnectedMCPs({ user });
        setAvailableMCPServers(response);
      } catch (error) {
        console.error('Error fetching connected MCP servers:', error);
      }
    };

    fetchAvailableMCPServers();
    fetchAvailableExtensions();
    fetchAssistants();
  }, [user]);

  const openUpdateAssistantDialog = (assistant: IAssistant) => {
    setAssistantToUpdate(assistant);
    setIsUpdateDialogOpen(true);
  };

  const handleDeleteAssistant = async (assistantId: string) => {
    try {
      setIsLoadingAssistants(true);
      await deleteAssistant({ user, assistantId });
      await fetchAssistants();

      toast({
        description: 'Assistant deleted successfully',
        type: 'success',
      });
    } catch (error) {
      console.error('Error deleting assistant:', error);
      toast({
        description: 'Failed to delete assistant. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-4 mb-2">
        <Tabs
          defaultValue={AssistantType.EXTENSION}
          className="w-full"
          onValueChange={(value) => setAssistantType(value as AssistantType)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="hover:cursor-pointer" value={AssistantType.EXTENSION}>
              Extensions
            </TabsTrigger>
            <TabsTrigger value={AssistantType.MCP_SERVER}>MCP Servers</TabsTrigger>
          </TabsList>
          <TabsContent value={AssistantType.EXTENSION}>
            <Card>
              <CardHeader>
                <div className="flex flex-row items-center justify-between">
                  <p className="text-sm md:text-base">
                    {`Here's a list of your assistants using Extensions`}
                  </p>
                  <Button
                    className="w-full md:w-auto"
                    onClick={() => setIsCreateDialogOpen(true)}
                    disabled={isLoadingAssistants || availableExtensions.length === 0}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Assistant
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <ul className="faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 md:grid-cols-2 lg:grid-cols-3">
                  {isLoadingAssistants ? (
                    <AssistantCardSkeletonList />
                  ) : extensionAssistants.length > 0 ? (
                    extensionAssistants.map((assistant) => (
                      <AssistantCard
                        key={assistant.id}
                        user={user}
                        assistant={assistant}
                        onEdit={openUpdateAssistantDialog}
                        onDelete={handleDeleteAssistant}
                      />
                    ))
                  ) : !isLoadingAssistants ? (
                    <li className="col-span-full text-center py-8">
                      No extension assistants found. Create one using the &quot;Add Assistant&quot;
                      button.
                    </li>
                  ) : null}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value={AssistantType.MCP_SERVER}>
            <Card>
              <CardHeader>
                <div className="flex flex-row items-center justify-between">
                  <p className="text-sm md:text-base">
                    {`Here's a list of your assistants using MCP Servers`}
                  </p>
                  <Button
                    className="w-full md:w-auto"
                    onClick={() => setIsCreateDialogOpen(true)}
                    disabled={isLoadingAssistants || availableMCPServers.length === 0}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Assistant
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <ul className="faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 md:grid-cols-2 lg:grid-cols-3">
                  {isLoadingAssistants ? (
                    <AssistantCardSkeletonList />
                  ) : mcpAssistants.length > 0 ? (
                    mcpAssistants.map((assistant) => (
                      <AssistantCard
                        key={assistant.id}
                        user={user}
                        assistant={assistant}
                        onEdit={openUpdateAssistantDialog}
                        onDelete={handleDeleteAssistant}
                      />
                    ))
                  ) : !isLoadingAssistants ? (
                    <li className="col-span-full text-center py-8">
                      No MCP server assistants found. Create one using the "Add Assistant" button.
                    </li>
                  ) : null}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <AddAssistantDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        extensionOptions={availableExtensions}
        mcpOptions={availableMCPServers}
        type={assistantType}
        user={user}
        onAssistantCreated={fetchAssistants}
      />
      <EditAssistantDialog
        open={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
        assistant={assistantToUpdate}
        user={user}
        extensionOptions={availableExtensions}
        mcpOptions={availableMCPServers}
        onAssistantUpdated={fetchAssistants}
      />
    </>
  );
}
