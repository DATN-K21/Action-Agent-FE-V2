'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User } from 'next-auth';
import { Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { v4 as uuid } from 'uuid';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React, { useState, useEffect, use } from 'react';
import { MCPServerDialog } from './mcp-server-dialog';
import { ConfirmDialog } from './confirm-dialog';
import { createMCP, deleteMCP, getMCPs, updateMCP } from '@/services/mcp-service';
import { ThreadType } from '@/constants/extension-constant';
import { toast } from '@/components/toast';
import useChatStore from '@/store/chat-store';
import { IMCPServer } from '@/types/mcp';

// Add TableSkeleton component at the top level
const TableSkeleton = ({ columns = 4, rows = 5 }: { columns?: number; rows?: number }) => {
  return Array(rows)
    .fill(0)
    .map((_, rowIndex) => (
      <TableRow key={`skeleton-row-${rowIndex}`}>
        {Array(columns)
          .fill(0)
          .map((_, colIndex) => (
            <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
              <div className="h-5 w-full rounded-md bg-gray-200 animate-pulse" />
            </TableCell>
          ))}
      </TableRow>
    ));
};

export default function MCPServerTable(props: { user: User }) {
  const { user } = props;
  const router = useRouter();
  const createThread = useChatStore((state) => state.createThread);
  const reloadChat = useChatStore((state) => state.reloadChat);

  // State for MCP servers
  const [servers, setServers] = useState<IMCPServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [maxPerPage, setMaxPerPage] = useState(10);

  // State for dialog management
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<IMCPServer | null>(null);

  // Table state
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  // Fetch MCP servers
  useEffect(() => {
    const fetchMCPs = async () => {
      try {
        setLoading(true);
        const mcps = await getMCPs({
          user,
          payload: { pageNumber, maxPerPage },
        });
        setServers(mcps);
      } catch (error) {
        toast({
          type: 'error',
          description: 'Failed to fetch MCP servers',
        });
        console.error('Error fetching MCP servers:', error);
      } finally {
        setLoading(false);
      }
    };

    reloadChat();
    fetchMCPs();
  }, [user, pageNumber, maxPerPage]);

  // Handlers for CRUD operations
  const handleAddServer = async (server: { name: string; url: string }) => {
    try {
      setLoading(true);
      const createdMCP = await createMCP({
        user,
        payload: {
          mcpName: server.name,
          url: server.url,
          connectionType: 'sse',
        },
      });

      setServers([...servers, createdMCP]);
      setIsAddDialogOpen(false);
      toast({
        type: 'success',
        description: 'The MCP server was added successfully',
      });
    } catch (error) {
      console.error('Error adding MCP server:', error);
      toast({
        type: 'error',
        description: 'Failed to add MCP server',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditServer = async (server: IMCPServer) => {
    try {
      setLoading(true);
      const updatedMCP = await updateMCP({
        user,
        connectedMcpId: server.id,
        payload: {
          mcpName: server.mcpName,
          url: server.url,
          connectionType: 'sse',
        },
      });

      setServers(servers.map((s) => (s.id === server.id ? updatedMCP : s)));
      setIsEditDialogOpen(false);
      setSelectedServer(null);
      toast({
        type: 'success',
        description: 'The MCP server was updated successfully',
      });
    } catch (error) {
      console.error('Error updating MCP server:', error);
      toast({
        type: 'error',
        description: 'Failed to update MCP server',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteServer = async () => {
    if (selectedServer) {
      try {
        setLoading(true);
        await deleteMCP({
          user,
          connectedMcpId: selectedServer.id,
        });

        setServers(servers.filter((server) => server.id !== selectedServer.id));
        setIsDeleteDialogOpen(false);
        setSelectedServer(null);
        toast({
          type: 'success',
          description: 'The MCP server was deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting MCP server:', error);
        toast({
          type: 'error',
          description: 'Failed to delete MCP server',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Add handler for starting a chat
  const handleStartChat = async () => {
    try {
      setLoading(true);
      const threadId = uuid();
      await createThread(user, threadId, `New MCP Chat`, ThreadType.MCP);

      router.push(`/chat/${threadId}/mcp`);
      toast({
        type: 'success',
        description: `Started a new chat with MCP`,
      });
    } catch (error) {
      console.error('Error starting chat:', error);
      toast({
        type: 'error',
        description: 'Failed to start chat',
      });
    } finally {
      setLoading(false);
    }
  };

  // Define columns with updated action handlers
  const columns: ColumnDef<IMCPServer>[] = [
    {
      id: 'id',
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <div className="capitalize">{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'mcpName',
      header: 'Name',
      cell: ({ row }) => <div className="font-medium">{row.getValue('mcpName')}</div>,
    },
    {
      accessorKey: 'url',
      header: 'URL',
      cell: ({ row }) => (
        <div className="truncate max-w-[200px] md:max-w-md">{row.getValue('url')}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableHiding: false,
      cell: ({ row }) => {
        const server = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedServer(server);
                  setIsEditDialogOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedServer(server);
                  setIsDeleteDialogOpen(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: servers,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      rowSelection,
    },
  });

  return (
    <>
      <div className="flex flex-col h-full w-full px-2 md:px-4">
        {/* Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight mt-2">MCP Server</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {`Add your MCP Server to your account to use it with Botion.`}
          </p>
        </div>

        {/* Filters and Add Button */}
        <div className="my-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <div className="w-full md:w-auto">
            <Input
              placeholder="Search MCP Server"
              value={(table.getColumn('mcpName')?.getFilterValue() as string) ?? ''}
              onChange={(event) => table.getColumn('mcpName')?.setFilterValue(event.target.value)}
              className="w-full max-w-sm"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <Button
              onClick={handleStartChat}
              disabled={loading || servers.length === 0}
              className="w-full md:w-auto bg-green-600 text-white hover:bg-green-700"
              variant="default"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading
                </>
              ) : (
                <>Start Chat</>
              )}
            </Button>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add MCP Server
                </>
              )}
            </Button>
          </div>
        </div>

        <Separator className="shadow" />

        {/* Server List */}
        <div className="rounded-md border mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableSkeleton columns={columns.length} rows={5} />
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No MCP servers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-2 py-4">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
              disabled={loading || pageNumber === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageNumber((prev) => prev + 1)}
              disabled={loading || servers.length < maxPerPage}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Add MCP Server Dialog */}
      <MCPServerDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddServer}
        title="Add MCP Server"
      />

      {/* Edit MCP Server Dialog */}
      {selectedServer && (
        <MCPServerDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedServer(null);
          }}
          onSubmit={handleEditServer}
          title="Edit MCP Server"
          defaultValues={selectedServer}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {selectedServer && (
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedServer(null);
          }}
          onConfirm={handleDeleteServer}
          title="Delete MCP Server"
          description={`Are you sure you want to delete ${selectedServer.mcpName}? This action cannot be undone.`}
        />
      )}
    </>
  );
}
