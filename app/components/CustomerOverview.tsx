"use client";

import { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import UserModal from "./UserModal";
import React from "react";
import type { UserProfile } from "../../types/user";
import {
  PlusIcon,
  ViewColumnsIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/solid";

interface Column {
  id: keyof UserProfile | "actions";
  label: string;
  visible: boolean;
  sortable: boolean;
}

const defaultColumns: Column[] = [
  { id: "name", label: "Name", visible: true, sortable: true },
  { id: "email", label: "Email", visible: true, sortable: true },
  { id: "role", label: "Role", visible: true, sortable: true },
  { id: "isActive", label: "Status", visible: true, sortable: true },
  { id: "phoneNumber", label: "Phone", visible: false, sortable: true },
  { id: "company", label: "Company", visible: false, sortable: true },
  { id: "department", label: "Department", visible: false, sortable: true },
  { id: "jobTitle", label: "Job Title", visible: false, sortable: true },
  { id: "country", label: "Country", visible: false, sortable: true },
  { id: "lastLoginAt", label: "Last Login", visible: true, sortable: true },
  { id: "createdAt", label: "Created Date", visible: false, sortable: true },
  { id: "actions", label: "Actions", visible: true, sortable: false },
];

const CustomersOverview = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof UserProfile | null;
    direction: "asc" | "desc" | null;
  }>({ key: "createdAt", direction: "desc" });
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.users || []);
      setError(null);
    } catch (err) {
      setError("Error loading users");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleColumn = (columnId: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId
          ? { ...column, visible: !column.visible }
          : column
      )
    );
  };

  // Sorting and Filtering Logic
  const sortedAndFilteredUsers = React.useMemo(() => {
    let filteredUsers = users.filter((user) => {
      const searchFields = [
        user.name,
        user.email,
        user.company,
        user.department,
        user.phoneNumber,
        user.country,
      ].filter(Boolean);

      return searchFields.some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    if (sortConfig.key && sortConfig.direction) {
      filteredUsers.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        // Handle date strings
        if (
          sortConfig.key === "lastLoginAt" ||
          sortConfig.key === "createdAt" ||
          sortConfig.key === "updatedAt"
        ) {
          const dateA = aValue ? new Date(aValue).getTime() : 0;
          const dateB = bValue ? new Date(bValue).getTime() : 0;
          return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
        }

        // Handle boolean values
        if (typeof aValue === "boolean") {
          return sortConfig.direction === "asc"
            ? aValue === bValue
              ? 0
              : aValue
              ? -1
              : 1
            : aValue === bValue
            ? 0
            : aValue
            ? 1
            : -1;
        }

        // Handle strings
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return 0;
      });
    }

    return filteredUsers;
  }, [users, searchTerm, sortConfig]);

  // Pagination
  const paginatedUsers = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAndFilteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedAndFilteredUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedAndFilteredUsers.length / itemsPerPage);

  // Event Handlers
  const handleSort = (key: keyof UserProfile) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleEdit = (user: UserProfile) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderCell = (
    user: UserProfile,
    columnId: keyof UserProfile | "actions"
  ) => {
    if (columnId === "actions") {
      return (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => handleEdit(user)}
            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
          >
            View
          </button>
          <button
            onClick={() => handleDelete(user.id)}
            className="text-red-600 hover:text-red-900 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      );
    }

    if (columnId === "name") {
      return (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {user.image ? (
              <img
                className="h-10 w-10 rounded-full"
                src={user.image}
                alt={user.name}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 font-medium">
                  {user.name?.[0]?.toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            {user.displayName && (
              <div className="text-sm text-gray-500">{user.displayName}</div>
            )}
          </div>
        </div>
      );
    }

    if (columnId === "role") {
      return (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
          ${
            user.role === "ADMIN"
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {user.role}
        </span>
      );
    }

    if (columnId === "isActive") {
      return (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
          ${
            user.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>
      );
    }

    if (
      columnId === "lastLoginAt" ||
      columnId === "createdAt" ||
      columnId === "updatedAt"
    ) {
      return formatDate(user[columnId]);
    }

    return user[columnId] || "N/A";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Customer Overview</h1>
            <p className="text-gray-500 text-sm mt-1">
              {sortedAndFilteredUsers.length} users total
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add User
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsColumnSelectorOpen(!isColumnSelectorOpen)}
              className="px-4 py-2 border rounded-md flex items-center gap-2"
            >
              <ViewColumnsIcon className="h-5 w-5" />
              Columns
            </button>

            {isColumnSelectorOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                {columns.map((column) => (
                  <label
                    key={column.id}
                    className="flex items-center px-4 py-2 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={column.visible}
                      onChange={() => toggleColumn(column.id)}
                      className="mr-2"
                    />
                    {column.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns
                  .filter((col) => col.visible)
                  .map((column) => (
                    <th
                      key={column.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        {column.sortable && (
                          <button
                            onClick={() =>
                              handleSort(column.id as keyof UserProfile)
                            }
                            className="p-1"
                          >
                            {sortConfig.key === column.id
                              ? sortConfig.direction === "asc"
                                ? "↑"
                                : "↓"
                              : "↕"}
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  {columns
                    .filter((col) => col.visible)
                    .map((column) => (
                      <td
                        key={column.id}
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        {renderCell(user, column.id)}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded-md px-2 py-1"
            >
              {[10, 25, 50, 100].map((value) => (
                <option key={value} value={value}>
                  {value} per page
                </option>
              ))}
            </select>
            <span className="text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(
                currentPage * itemsPerPage,
                sortedAndFilteredUsers.length
              )}{" "}
              of {sortedAndFilteredUsers.length}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          onSubmit={async (userData) => {
            // Handle user creation/update
            try {
              const response = await fetch("/api/users", {
                method: selectedUser ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
              });

              if (!response.ok) throw new Error("Failed to save user");

              fetchUsers(); // Refresh the user list
              setIsModalOpen(false);
              setSelectedUser(null);
            } catch (error) {
              console.error("Error saving user:", error);
            }
          }}
        />
      )}
    </div>
  );
};

export default CustomersOverview;
