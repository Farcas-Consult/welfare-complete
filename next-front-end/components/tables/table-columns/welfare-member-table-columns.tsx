"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DragHandle } from "@/components/tables/components/drag-handle";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Ban,
  Check,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import type { MouseEvent } from "react";
import type { WelfareMember } from "@/app/(roles)/dashboard/admin/members/types/member-types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useDeleteMember,
  useUpdateMemberStatus,
} from "@/app/(roles)/dashboard/admin/members/hooks/useMembersHook";

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-green-500/10 text-green-700 dark:text-green-400";
    case "inactive":
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    case "suspended":
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
    case "deceased":
      return "bg-red-500/10 text-red-700 dark:text-red-400";
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
  }
};

type DialogState =
  | { type: "delete"; member: WelfareMember }
  | {
      type: "status";
      member: WelfareMember;
      targetStatus: WelfareMember["status"];
    }
  | null;

export const useWelfareMemberColumns = (): ColumnDef<WelfareMember>[] => {
  const [dialogState, setDialogState] = useState<DialogState>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { mutateAsync: updateStatus } = useUpdateMemberStatus();
  const { mutateAsync: deleteMember } = useDeleteMember();

  const closeDialog = () => {
    if (!isProcessing) {
      setDialogState(null);
    }
  };

  const confirmAction = async () => {
    if (!dialogState) return;
    setIsProcessing(true);
    try {
      if (dialogState.type === "delete") {
        await deleteMember(dialogState.member.id);
      } else if (dialogState.type === "status") {
        await updateStatus({
          id: dialogState.member.id,
          status: dialogState.targetStatus,
        });
      }
      setDialogState(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await confirmAction();
  };

  return [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "memberNo",
      header: "Member No",
      cell: ({ row }) => {
        return (
          <div className="text-sm font-mono text-muted-foreground">
            {row.original.memberNo || "N/A"}
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const member = row.original;
        const displayName = `${member.firstName} ${member.lastName}`.trim();
        const initials = displayName
          .split(" ")
          .map((name) => name.charAt(0))
          .join("")
          .toUpperCase()
          .slice(0, 2);

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{displayName}</span>
              {member.email && (
                <span className="text-sm text-muted-foreground">
                  {member.email}
                </span>
              )}
            </div>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "phonePrimary",
      header: "Phone",
      cell: ({ row }) => {
        return (
          <div className="text-sm">{row.original.phonePrimary || "N/A"}</div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status || "active";
        return (
          <Badge className={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date Joined",
      cell: ({ row }) => {
        const date = row.original.createdAt;
        if (!date)
          return <div className="text-sm text-muted-foreground">N/A</div>;
        return (
          <div className="text-sm">{new Date(date).toLocaleDateString()}</div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const member = row.original;

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/admin/members/${member.id}`}
                    className="cursor-pointer"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/admin/members/${member.id}/edit`}
                    className="cursor-pointer"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Member
                  </Link>
                </DropdownMenuItem>
                {member.status !== "active" ? (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      setDialogState({
                        type: "status",
                        member,
                        targetStatus: "active",
                      })
                    }
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Activate
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      setDialogState({
                        type: "status",
                        member,
                        targetStatus: "inactive",
                      })
                    }
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Deactivate
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer"
                  onClick={() => setDialogState({ type: "delete", member })}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Member
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog
              open={dialogState !== null && dialogState.member.id === member.id}
              onOpenChange={(open: boolean) => {
                if (!open && dialogState?.member.id === member.id) {
                  closeDialog();
                }
              }}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {dialogState?.type === "delete"
                      ? "Delete member?"
                      : dialogState?.targetStatus === "active"
                      ? "Activate member?"
                      : "Deactivate member?"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {dialogState?.type === "delete"
                      ? `This will permanently remove ${dialogState.member?.firstName} from the system.`
                      : dialogState?.targetStatus === "active"
                      ? "The member will regain access immediately."
                      : "The member will be marked as inactive and lose access until reactivated."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isProcessing}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirmClick}
                    disabled={isProcessing}
                    className="gap-2"
                  >
                    {isProcessing && (
                      <Loader2 className="size-4 animate-spin" />
                    )}
                    {dialogState?.type === "delete"
                      ? isProcessing
                        ? "Deleting..."
                        : "Delete"
                      : dialogState?.targetStatus === "active"
                      ? isProcessing
                        ? "Activating..."
                        : "Activate"
                      : isProcessing
                      ? "Deactivating..."
                      : "Deactivate"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        );
      },
    },
  ];
};
