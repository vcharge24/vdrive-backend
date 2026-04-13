import { useState } from "react";
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, Loader } from "lucide-react";
import { Badge, Modal, Btn, InputField, TabBar } from "../../../components/shared";
import { ROLES, PRIVILEGES } from "../data/userManagementData";
import { getRoles, createRole, getPrivileges, createPrivilege, getScreenEndpoints } from "../../../api/roles";
import C from "../../../styles/colors";

const PORTAL_TYPES = [
  { label: "Admin", value: "ADMIN" },
  { label: "Merchant", value: "MERCHANT" },
];

export default function RolesScreen() {
  const [activeTab, setActiveTab] = useState("Roles");
  const [roles, setRoles] = useState(ROLES);
  const [privileges, setPrivileges] = useState(PRIVILEGES);
  const [expandedRoles, setExpandedRoles] = useState({});
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showCreatePrivilegeModal, setShowCreatePrivilegeModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Form states
  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    privileges: [],
  });

  const [privilegeForm, setPrivilegeForm] = useState({
    name: "",
    description: "",
    endpoint: "",
    method: "GET",
    portalType: "ADMIN",
  });

  const handleCreateRole = async () => {
    if (!roleForm.name || !roleForm.description) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const newRole = {
        id: `ROLE-${String(roles.length + 1).padStart(3, "0")}`,
        ...roleForm,
        privileges: roleForm.privileges.length,
        privilegeIds: roleForm.privileges,
        tenant: "Multi-tenant",
        createdAt: new Date().toISOString().split("T")[0],
      };

      try {
        await createRole(newRole);
      } catch (apiErr) {
        console.warn("API call failed, using mock data:", apiErr);
      }

      setRoles([...roles, newRole]);
      setShowCreateRoleModal(false);
      setRoleForm({ name: "", description: "", privileges: [] });
    } catch (error) {
      console.error("Error creating role:", error);
      alert("Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrivilege = async () => {
    if (!privilegeForm.name || !privilegeForm.description || !privilegeForm.endpoint) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const newPrivilege = {
        id: `PRIV-${String(privileges.length + 1).padStart(3, "0")}`,
        ...privilegeForm,
      };

      try {
        await createPrivilege(newPrivilege);
      } catch (apiErr) {
        console.warn("API call failed, using mock data:", apiErr);
      }

      setPrivileges([...privileges, newPrivilege]);
      setShowCreatePrivilegeModal(false);
      setPrivilegeForm({
        name: "",
        description: "",
        endpoint: "",
        method: "GET",
        portalType: "ADMIN",
      });
    } catch (error) {
      console.error("Error creating privilege:", error);
      alert("Failed to create privilege");
    } finally {
      setLoading(false);
    }
  };

  const toggleRoleExpanded = (roleId) => {
    setExpandedRoles((prev) => ({
      ...prev,
      [roleId]: !prev[roleId],
    }));
  };

  const togglePrivilege = (privilegeId) => {
    setRoleForm((prev) => ({
      ...prev,
      privileges: prev.privileges.includes(privilegeId)
        ? prev.privileges.filter((p) => p !== privilegeId)
        : [...prev.privileges, privilegeId],
    }));
  };

  const getPrivilegeDetails = (privilegeId) => {
    return privileges.find((p) => p.id === privilegeId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Roles & Privileges</h1>
        <p className="text-slate-500 mt-1">Manage system roles and access control</p>
      </div>

      {/* Tabs */}
      <TabBar tabs={["Roles", "Privileges"]} active={activeTab} onChange={setActiveTab} />

      {/* Roles Tab */}
      {activeTab === "Roles" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Btn icon={Plus} onClick={() => setShowCreateRoleModal(true)}>
              Create Role
            </Btn>
          </div>

          <div className="space-y-3">
            {roles.map((role) => (
              <div key={role.id} className="bg-white rounded-xl border border-slate-200">
                {/* Role Header */}
                <button
                  onClick={() => toggleRoleExpanded(role.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRoleExpanded(role.id);
                      }}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {expandedRoles[role.id] ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                    <div className="text-left">
                      <h3 className="text-sm font-semibold text-slate-900">
                        {role.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {role.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge color="blue">{role.privileges} Privileges</Badge>
                    <Badge color="gray">{role.tenant}</Badge>
                  </div>
                </button>

                {/* Expanded Content */}
                {expandedRoles[role.id] && (
                  <div
                    className="border-t px-6 py-4"
                    style={{ borderColor: C.border }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {role.privilegeIds && role.privilegeIds.map((privId) => {
                        const priv = getPrivilegeDetails(privId);
                        return priv ? (
                          <div
                            key={privId}
                            className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                          >
                            <div className="text-xs font-semibold text-slate-900">
                              {priv.name}
                            </div>
                            <div className="text-xs text-slate-600 mt-1">
                              {priv.endpoint}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge color="gray">{priv.method}</Badge>
                              <Badge
                                color={
                                  priv.portalType === "ADMIN" ? "purple" : "teal"
                                }
                              >
                                {priv.portalType}
                              </Badge>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                      <Btn variant="secondary" size="sm">
                        <Edit2 size={14} />
                        Edit
                      </Btn>
                      <Btn variant="danger" size="sm">
                        <Trash2 size={14} />
                        Delete
                      </Btn>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Privileges Tab */}
      {activeTab === "Privileges" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Btn icon={Plus} onClick={() => setShowCreatePrivilegeModal(true)}>
              Create Privilege
            </Btn>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="border-b"
                    style={{ borderColor: C.border, backgroundColor: "#f8fafc" }}
                  >
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">
                      Endpoint
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">
                      Method
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">
                      Portal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {privileges.map((priv) => (
                    <tr
                      key={priv.id}
                      className="border-b hover:bg-slate-50 transition-colors"
                      style={{ borderColor: C.border }}
                    >
                      <td className="py-3 px-4">
                        <span className="text-slate-900 font-medium">
                          {priv.name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {priv.description}
                      </td>
                      <td className="py-3 px-4">
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                          {priv.endpoint}
                        </code>
                      </td>
                      <td className="py-3 px-4">
                        <Badge color="gray">{priv.method}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          color={
                            priv.portalType === "ADMIN" ? "purple" : "teal"
                          }
                        >
                          {priv.portalType}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Role Modal */}
      {showCreateRoleModal && (
        <Modal title="Create New Role" onClose={() => setShowCreateRoleModal(false)}>
          <div className="space-y-4">
            <InputField
              label="Role Name"
              placeholder="e.g., Content Manager"
              value={roleForm.name}
              onChange={(val) => setRoleForm({ ...roleForm, name: val })}
              required
            />
            <InputField
              label="Description"
              placeholder="What is this role for?"
              value={roleForm.description}
              onChange={(val) =>
                setRoleForm({ ...roleForm, description: val })
              }
              required
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Assign Privileges
              </label>
              <div className="max-h-64 overflow-y-auto space-y-2 border border-slate-200 rounded-lg p-3">
                {privileges.map((priv) => (
                  <label
                    key={priv.id}
                    className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={roleForm.privileges.includes(priv.id)}
                      onChange={() => togglePrivilege(priv.id)}
                      className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900">
                        {priv.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {priv.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
            <Btn
              variant="secondary"
              onClick={() => setShowCreateRoleModal(false)}
            >
              Cancel
            </Btn>
            <Btn onClick={handleCreateRole} disabled={loading}>
              {loading ? <Loader size={16} className="animate-spin" /> : null}
              Create Role
            </Btn>
          </div>
        </Modal>
      )}

      {/* Create Privilege Modal */}
      {showCreatePrivilegeModal && (
        <Modal
          title="Create New Privilege"
          onClose={() => setShowCreatePrivilegeModal(false)}
        >
          <div className="space-y-4">
            <InputField
              label="Privilege Name"
              placeholder="e.g., View Reports"
              value={privilegeForm.name}
              onChange={(val) =>
                setPrivilegeForm({ ...privilegeForm, name: val })
              }
              required
            />
            <InputField
              label="Description"
              placeholder="What does this privilege allow?"
              value={privilegeForm.description}
              onChange={(val) =>
                setPrivilegeForm({ ...privilegeForm, description: val })
              }
              required
            />
            <InputField
              label="Endpoint URL"
              placeholder="/api/v1/reports"
              value={privilegeForm.endpoint}
              onChange={(val) =>
                setPrivilegeForm({ ...privilegeForm, endpoint: val })
              }
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="HTTP Method"
                options={["GET", "POST", "PUT", "DELETE"]}
                value={privilegeForm.method}
                onChange={(val) =>
                  setPrivilegeForm({ ...privilegeForm, method: val })
                }
              />
              <InputField
                label="Portal Type"
                options={PORTAL_TYPES}
                value={privilegeForm.portalType}
                onChange={(val) =>
                  setPrivilegeForm({ ...privilegeForm, portalType: val })
                }
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
            <Btn
              variant="secondary"
              onClick={() => setShowCreatePrivilegeModal(false)}
            >
              Cancel
            </Btn>
            <Btn onClick={handleCreatePrivilege} disabled={loading}>
              {loading ? <Loader size={16} className="animate-spin" /> : null}
              Create Privilege
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
