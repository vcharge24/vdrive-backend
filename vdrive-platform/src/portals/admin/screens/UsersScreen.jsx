import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, MoreVertical, Search, Loader } from "lucide-react";
import { Badge, Modal, Btn, InputField } from "../../../components/shared";
import { USERS, ROLES } from "../data/userManagementData";
import { getUsers, createUser, updateUser, deactivateUser, assignRoles } from "../../../api/users";
import C from "../../../styles/colors";

const PHONE_CODES = [
  { label: "+971 (UAE)", value: "+971" },
  { label: "+966 (Saudi Arabia)", value: "+966" },
  { label: "+1 (USA)", value: "+1" },
  { label: "+44 (UK)", value: "+44" },
  { label: "+91 (India)", value: "+91" },
  { label: "+213 (Algeria)", value: "+213" },
  { label: "+355 (Albania)", value: "+355" },
];

const STATUS_COLORS = {
  ACTIVE: "green",
  PENDING_ACTIVATION: "amber",
  DEACTIVATED: "red",
  SUSPENDED: "gray",
};

export default function UsersScreen() {
  const [users, setUsers] = useState(USERS);
  const [filteredUsers, setFilteredUsers] = useState(USERS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "+971",
    phoneNumber: "",
    roles: [],
    iconUrl: "",
  });

  useEffect(() => {
    filterUsers(searchTerm);
  }, [users, searchTerm]);

  const filterUsers = (term) => {
    const filtered = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(term.toLowerCase()) ||
        user.lastName.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleAddUser = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const newUser = {
        id: `USR-${String(users.length + 1).padStart(3, "0")}`,
        ...formData,
        phone: `${formData.phoneCode} ${formData.phoneNumber}`,
        status: "PENDING_ACTIVATION",
        tenant: "Vdrive",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.firstName}`,
        createdAt: new Date().toISOString().split("T")[0],
      };

      // Try API call with fallback to mock
      try {
        await createUser(newUser);
      } catch (apiErr) {
        console.warn("API call failed, using mock data:", apiErr);
      }

      setUsers([...users, newUser]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const updatedUser = {
        ...selectedUser,
        ...formData,
        phone: `${formData.phoneCode} ${formData.phoneNumber}`,
      };

      // Try API call with fallback to mock
      try {
        await updateUser(selectedUser.id, updatedUser);
      } catch (apiErr) {
        console.warn("API call failed, using mock data:", apiErr);
      }

      setUsers(users.map((u) => (u.id === selectedUser.id ? updatedUser : u)));
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRoles = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      // Try API call with fallback to mock
      try {
        await assignRoles(selectedUser.id, formData.roles);
      } catch (apiErr) {
        console.warn("API call failed, using mock data:", apiErr);
      }

      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? { ...u, roles: formData.roles.map((rid) => ROLES.find((r) => r.id === rid)?.name).filter(Boolean) }
            : u
        )
      );
      setShowRolesModal(false);
      resetForm();
    } catch (error) {
      console.error("Error assigning roles:", error);
      alert("Failed to assign roles");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (!confirm("Are you sure you want to deactivate this user?")) return;

    try {
      setLoading(true);
      // Try API call with fallback to mock
      try {
        await deactivateUser(userId);
      } catch (apiErr) {
        console.warn("API call failed, using mock data:", apiErr);
      }

      setUsers(
        users.map((u) => (u.id === userId ? { ...u, status: "DEACTIVATED" } : u))
      );
    } catch (error) {
      console.error("Error deactivating user:", error);
      alert("Failed to deactivate user");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    const [phoneCode, phoneNumber] = user.phone.split(" ");
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneCode: phoneCode || "+971",
      phoneNumber: phoneNumber || "",
      roles: user.roles || [],
      iconUrl: user.avatar || "",
    });
    setShowEditModal(true);
  };

  const openRolesModal = (user) => {
    setSelectedUser(user);
    setFormData({
      ...formData,
      roles: ROLES.filter((r) => user.roles.includes(r.name)).map((r) => r.id),
    });
    setShowRolesModal(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneCode: "+971",
      phoneNumber: "",
      roles: [],
      iconUrl: "",
    });
    setSelectedUser(null);
  };

  const toggleRole = (roleId) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter((r) => r !== roleId)
        : [...prev.roles, roleId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1">Manage system users and permissions</p>
        </div>
        <Btn icon={Plus} onClick={() => setShowAddModal(true)}>
          Add User
        </Btn>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: C.border, backgroundColor: "#f8fafc" }}>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Phone</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Roles</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Tenant</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-slate-50 transition-colors"
                    style={{ borderColor: C.border }}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.firstName}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-slate-900 font-medium">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{user.email}</td>
                    <td className="py-3 px-4 text-slate-600">{user.phone}</td>
                    <td className="py-3 px-4">
                      <Badge color={STATUS_COLORS[user.status]}>
                        {user.status.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {user.roles.slice(0, 2).map((role) => (
                          <Badge key={role} color="blue">
                            {role}
                          </Badge>
                        ))}
                        {user.roles.length > 2 && (
                          <Badge color="gray">+{user.roles.length - 2}</Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{user.tenant}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => openRolesModal(user)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
                          title="Assign Roles"
                        >
                          <MoreVertical size={16} />
                        </button>
                        <button
                          onClick={() => handleDeactivateUser(user.id)}
                          disabled={user.status === "DEACTIVATED"}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-slate-600 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Deactivate"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 px-4 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <Modal title="Add New User" onClose={() => setShowAddModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="First Name"
                placeholder="Ahmed"
                value={formData.firstName}
                onChange={(val) => setFormData({ ...formData, firstName: val })}
                required
              />
              <InputField
                label="Last Name"
                placeholder="Al Mansouri"
                value={formData.lastName}
                onChange={(val) => setFormData({ ...formData, lastName: val })}
                required
              />
            </div>
            <InputField
              label="Email"
              type="email"
              placeholder="ahmed@example.com"
              value={formData.email}
              onChange={(val) => setFormData({ ...formData, email: val })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Country Code"
                options={PHONE_CODES}
                value={formData.phoneCode}
                onChange={(val) => setFormData({ ...formData, phoneCode: val })}
                required
              />
              <InputField
                label="Phone Number"
                placeholder="50 123 4567"
                value={formData.phoneNumber}
                onChange={(val) => setFormData({ ...formData, phoneNumber: val })}
                required
              />
            </div>
            <InputField
              label="Avatar URL (optional)"
              type="url"
              placeholder="https://..."
              value={formData.iconUrl}
              onChange={(val) => setFormData({ ...formData, iconUrl: val })}
            />
            <div className="pt-2">
              <label className="block text-sm font-medium text-slate-700 mb-3">Roles</label>
              <div className="space-y-2">
                {ROLES.slice(0, 6).map((role) => (
                  <label key={role.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.roles.includes(role.id)}
                      onChange={() => toggleRole(role.id)}
                      className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-slate-700">{role.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
            <Btn variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Btn>
            <Btn onClick={handleAddUser} disabled={loading}>
              {loading ? <Loader size={16} className="animate-spin" /> : null}
              Add User
            </Btn>
          </div>
        </Modal>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <Modal title={`Edit User: ${selectedUser.firstName}`} onClose={() => setShowEditModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="First Name"
                value={formData.firstName}
                onChange={(val) => setFormData({ ...formData, firstName: val })}
                required
              />
              <InputField
                label="Last Name"
                value={formData.lastName}
                onChange={(val) => setFormData({ ...formData, lastName: val })}
                required
              />
            </div>
            <InputField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(val) => setFormData({ ...formData, email: val })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Country Code"
                options={PHONE_CODES}
                value={formData.phoneCode}
                onChange={(val) => setFormData({ ...formData, phoneCode: val })}
              />
              <InputField
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={(val) => setFormData({ ...formData, phoneNumber: val })}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
            <Btn variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Btn>
            <Btn onClick={handleEditUser} disabled={loading}>
              {loading ? <Loader size={16} className="animate-spin" /> : null}
              Update User
            </Btn>
          </div>
        </Modal>
      )}

      {/* Assign Roles Modal */}
      {showRolesModal && selectedUser && (
        <Modal title={`Assign Roles: ${selectedUser.firstName}`} onClose={() => setShowRolesModal(false)}>
          <div>
            <p className="text-sm text-slate-600 mb-4">Select one or more roles for this user:</p>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {ROLES.map((role) => (
                <label key={role.id} className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.roles.includes(role.id)}
                    onChange={() => toggleRole(role.id)}
                    className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900">{role.name}</div>
                    <div className="text-xs text-slate-500">{role.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
            <Btn variant="secondary" onClick={() => setShowRolesModal(false)}>
              Cancel
            </Btn>
            <Btn onClick={handleAssignRoles} disabled={loading}>
              {loading ? <Loader size={16} className="animate-spin" /> : null}
              Assign Roles
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
