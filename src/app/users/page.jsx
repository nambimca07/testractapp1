"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, Trash2, Plus, AlertCircle, CheckCircle  } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from '@/components/dashboard-layout';
import { API_URL, TENANT_ID, getJwtToken, getDefaultHeaders } from '@/config/api-config';

export default function UsersPage() {
  const [userName, setUserName] = useState("");
  const [userCode, setUserCode] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
  const queryClient = useQueryClient();

   // Validation rules
  const validateField = (field, value) => {
    switch (field) {
      case "userName":
        if (!value.trim()) {
          return "User Name is required";
        }
        if (value.trim().length < 2) {
          return "User Name must be at least 2 characters";
        }
        if (value.trim().length > 50) {
          return "User Name must not exceed 50 characters";
        }
        return "";
      case "userCode":
        if (!value.trim()) {
          return "User Code is required";
        }
        if (value.trim().length < 3) {
          return "User Code must be at least 3 characters";
        }
        if (value.trim().length > 20) {
          return "User Code must not exceed 20 characters";
        }
        if (!/^[A-Za-z0-9_-]+$/.test(value.trim())) {
          return "User Code can only contain letters, numbers, hyphens, and underscores";
        }
        return "";
      default:
        return "";
    }
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    newErrors.userName = validateField("userName", userName);
    newErrors.userCode = validateField("userCode", userCode);
    setErrors(newErrors);
    return !newErrors.userName && !newErrors.userCode;
  };

  // Handle field change
  const handleFieldChange = (field, value) => {
    if (field === "userName") {
      setUserName(value);
      if (touched.userName) {
        const error = validateField("userName", value);
        setErrors((prev) => ({ ...prev, userName: error }));
      }
    } else if (field === "userCode") {
      setUserCode(value);
      if (touched.userCode) {
        const error = validateField("userCode", value);
        setErrors((prev) => ({ ...prev, userCode: error }));
      }
    }
  };

  // Handle field blur
  const handleFieldBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(
      field,
      field === "userName" ? userName : userCode,
    );
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  /* // Fetch users
  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      return data.users;
    },
  }); */

// Fetch users
  const {
    data: usersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/MasterUser/GetUserDetails?UserId=0`, {
        method: 'GET',
        headers: getDefaultHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      // Ensure we always return an array, even if data.users is undefined
      return data || [];
    },
  });




  const users = usersData || [];

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: async (newUser) => {
      const response = await fetch(`${API_URL}/MasterUser/InsertUserDetails`, {
        method: "POST",
        headers: getDefaultHeaders(),
        body: JSON.stringify(newUser),
      });
      
      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create user");
        } catch (e) {
          throw new Error(`Failed to create user: ${response.status} ${response.statusText}`);
        }
      }
      
      // Check if there's content to parse
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const text = await response.text();
          return text ? JSON.parse(text) : {};
        } catch (e) {
          console.error("JSON parsing error:", e);
          return {}; // Return empty object if parsing fails
        }
      }
      
      return {}; // Return empty object for non-JSON responses
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setUserName("");
      setUserCode("");
      setErrors({});
      setTouched({});
      toast.success("User created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: async ({ updates }) => {
      const response = await fetch(`${API_URL}/MasterUser/UpdateUserDetails`, {
        method: "PUT",
        headers: getDefaultHeaders(),
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update user");
        } catch (e) {
          throw new Error(`Failed to update user: ${response.status} ${response.statusText}`);
        }
      }
      
      // Check if there's content to parse
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const text = await response.text();
          return text ? JSON.parse(text) : {};
        } catch (e) {
          console.error("JSON parsing error:", e);
          return {}; // Return empty object if parsing fails
        }
      }
      
      return {}; // Return empty object for non-JSON responses
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setUserName("");
      setUserCode("");
      setErrors({});
      setTouched({});
      setEditingId(null);
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${API_URL}/MasterUser/DeleteUserDetails?UserId=${id}`, {
        method: "DELETE",
        headers: getDefaultHeaders(),
      });
      
      if (!response.ok) {
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete user");
        } catch (e) {
          throw new Error(`Failed to delete user: ${response.status} ${response.statusText}`);
        }
      }
      
      // Check if there's content to parse
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const text = await response.text();
          return text ? JSON.parse(text) : {};
        } catch (e) {
          console.error("JSON parsing error:", e);
          return {}; // Return empty object if parsing fails
        }
      }
      
      return {}; // Return empty object for non-JSON responses
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Handle edit button click
  const handleEdit = (user) => {
    setEditingId(user.UserId);
    setUserName(user.UserName);
    setUserCode(user.UserCode);
    setErrors({});
    setTouched({});
  };

   // Handle delete button click
  const handleDelete = (user) => {
    setDeleteModal({ isOpen: true, user });
  };

  // Confirm delete
  const confirmDelete = () => {
    if (deleteModal.user) {
      deleteMutation.mutate(deleteModal.user.UserId);
      setDeleteModal({ isOpen: false, user: null });
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, user: null });
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // if (!userName.trim() || !userCode.trim()) {
    //   toast.error("Please fill in all fields");
    //   return;
    // }

    if (!validateForm()) {
      // Mark all fields as touched to show validation errors
      setTouched({ userName: true, userCode: true });
      toast.error("Please fill in the required fields");
      return;
    }

    if (editingId) {
      updateMutation.mutate({
        updates: { userId: editingId,UserName: userName, UserCode: userCode,pwd: "",bid:0,cid:0  },
      });
    } else {
      createMutation.mutate({ UserName: userName, UserCode: userCode,pwd: "",bid:0,cid:0 });
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setUserName("");
    setUserCode("");
    setEditingId(null);
    setErrors({});
    setTouched({});
  };

  const isFormValid = !errors.userName && !errors.userCode;

  return (
     <DashboardLayout>
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          User Management
        </h1>

        {/* Create/Edit Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingId ? "Edit User" : "Create New User"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* User Name Field */}
              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  User Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    id="userName"
                    type="text"
                    value={userName}
                    onChange={(e) =>
                      handleFieldChange("userName", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("userName")}
                    placeholder="Enter user name (2-50 characters)"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      touched.userName && errors.userName
                        ? "border-red-500 focus:ring-red-500 bg-red-50"
                        : touched.userName && !errors.userName
                          ? "border-green-500 focus:ring-green-500 bg-green-50"
                          : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {touched.userName && !errors.userName && (
                    <CheckCircle
                      className="absolute right-3 top-3 text-green-500"
                      size={20}
                    />
                  )}
                  {touched.userName && errors.userName && (
                    <AlertCircle
                      className="absolute right-3 top-3 text-red-500"
                      size={20}
                    />
                  )}
                </div>
                {touched.userName && errors.userName && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={16} />
                    {errors.userName}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {userName.trim().length}/50 characters
                </p>
              </div>

              {/* User Code Field */}
              <div>
                <label
                  htmlFor="userCode"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  User Code
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    id="userCode"
                    type="text"
                    value={userCode}
                    onChange={(e) =>
                      handleFieldChange("userCode", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("userCode")}
                    placeholder="Enter user code (A-Z, 0-9, -, _)"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      touched.userCode && errors.userCode
                        ? "border-red-500 focus:ring-red-500 bg-red-50"
                        : touched.userCode && !errors.userCode
                          ? "border-green-500 focus:ring-green-500 bg-green-50"
                          : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {touched.userCode && !errors.userCode && (
                    <CheckCircle
                      className="absolute right-3 top-3 text-green-500"
                      size={20}
                    />
                  )}
                  {touched.userCode && errors.userCode && (
                    <AlertCircle
                      className="absolute right-3 top-3 text-red-500"
                      size={20}
                    />
                  )}
                </div>
                {touched.userCode && errors.userCode && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={16} />
                    {errors.userCode}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {userCode.trim().length}/20 characters
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  !isFormValid
                }
                className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={18} />
                {editingId ? "Update User" : "Create User"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    SL #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    User Code
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-red-500"
                    >
                      Error loading users
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr
                      key={user.UserId}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {user.UserName}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">
                        {user.UserCode}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            title="Edit user"
                          >
                            <Edit2 size={18} />
                          </button>

                          {/* direct delete button */}
                          {/* <button
                            onClick={() => deleteMutation.mutate(user.UserId)}
                            disabled={deleteMutation.isPending}
                            className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete user"
                          > */}

                          {/* confirm delete button with model popup */}
                          <button
                            onClick={() => handleDelete(user)}
                            disabled={deleteMutation.isPending}
                            className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete user"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && deleteModal.user && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
              {/* Modal Header */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
                  <AlertCircle size={24} />
                  DELETE USER
                </h3>
              </div>

              {/* Modal Content */}
              <div className="mb-6 space-y-4">
                <p className="text-gray-700 text-sm">
                  You are about to permanently delete the user:
                </p>

                {/* User Details */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">
                        NAME
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {deleteModal.user.UserName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">
                        CODE
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {deleteModal.user.UserCode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Warning Section */}
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-xs font-bold text-red-700 mb-2">
                    ⚠️ WARNING:
                  </p>
                  <ul className="text-xs text-red-600 space-y-1">
                    <li>• This action CANNOT be undone</li>
                    <li>
                      • All data associated with this user will be deleted
                    </li>
                    <li>• This will affect any related records</li>
                  </ul>
                </div>

                <p className="text-sm font-semibold text-gray-900">
                  Do you want to proceed?
                </p>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
    </DashboardLayout>
  );  
}



