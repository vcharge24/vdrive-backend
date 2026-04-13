import { useState } from "react";
import { Plus, Search, Loader } from "lucide-react";
import { Badge, Modal, Btn, InputField } from "../../../components/shared";
import { SCREEN_ENDPOINTS } from "../data/userManagementData";
import { getScreenEndpoints, createScreenEndpoint } from "../../../api/roles";
import C from "../../../styles/colors";

const PORTAL_TYPES = [
  { label: "Admin", value: "ADMIN" },
  { label: "Merchant", value: "MERCHANT" },
];

export default function ScreenEndpointsScreen() {
  const [endpoints, setEndpoints] = useState(SCREEN_ENDPOINTS);
  const [filteredEndpoints, setFilteredEndpoints] = useState(SCREEN_ENDPOINTS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPortal, setFilterPortal] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    screenName: "",
    endpoint: "",
    method: "GET",
    portalType: "ADMIN",
    description: "",
  });

  // Filter endpoints
  const filterEndpoints = () => {
    let filtered = endpoints;

    if (searchTerm) {
      filtered = filtered.filter(
        (ep) =>
          ep.screenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ep.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ep.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterPortal) {
      filtered = filtered.filter((ep) => ep.portalType === filterPortal);
    }

    setFilteredEndpoints(filtered);
  };

  // Handle search and filter changes
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setFilterPortal("");
    let filtered = endpoints.filter(
      (ep) =>
        ep.screenName.toLowerCase().includes(term.toLowerCase()) ||
        ep.endpoint.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredEndpoints(filtered);
  };

  const handlePortalFilter = (portal) => {
    setFilterPortal(portal);
    let filtered = endpoints;
    if (portal) {
      filtered = filtered.filter((ep) => ep.portalType === portal);
    }
    setFilteredEndpoints(filtered);
  };

  const handleAddEndpoint = async () => {
    if (!formData.screenName || !formData.endpoint) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const newEndpoint = {
        id: `SE-${String(endpoints.length + 1).padStart(3, "0")}`,
        ...formData,
      };

      try {
        await createScreenEndpoint(newEndpoint);
      } catch (apiErr) {
        console.warn("API call failed, using mock data:", apiErr);
      }

      setEndpoints([...endpoints, newEndpoint]);
      setFilteredEndpoints([...endpoints, newEndpoint]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error("Error adding endpoint:", error);
      alert("Failed to add screen endpoint");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      screenName: "",
      endpoint: "",
      method: "GET",
      portalType: "ADMIN",
      description: "",
    });
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: "blue",
      POST: "green",
      PUT: "amber",
      DELETE: "red",
    };
    return colors[method] || "gray";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Screen Endpoints
          </h1>
          <p className="text-slate-500 mt-1">
            Manage system screens and API endpoints
          </p>
        </div>
        <Btn icon={Plus} onClick={() => setShowAddModal(true)}>
          Add Endpoint
        </Btn>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search screens or endpoints..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
          />
        </div>

        {/* Portal Filter */}
        <div>
          <select
            value={filterPortal}
            onChange={(e) => handlePortalFilter(e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
          >
            <option value="">All Portal Types</option>
            <option value="ADMIN">Admin Portal</option>
            <option value="MERCHANT">Merchant Portal</option>
          </select>
        </div>
      </div>

      {/* Endpoints Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="border-b"
                style={{ borderColor: C.border, backgroundColor: "#f8fafc" }}
              >
                <th className="text-left py-3 px-4 font-semibold text-slate-600">
                  Screen Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">
                  Endpoint URL
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">
                  Method
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">
                  Portal Type
                </th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEndpoints.length > 0 ? (
                filteredEndpoints.map((endpoint) => (
                  <tr
                    key={endpoint.id}
                    className="border-b hover:bg-slate-50 transition-colors"
                    style={{ borderColor: C.border }}
                  >
                    <td className="py-3 px-4">
                      <span className="text-slate-900 font-medium">
                        {endpoint.screenName}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 font-mono">
                        {endpoint.endpoint}
                      </code>
                    </td>
                    <td className="py-3 px-4">
                      <Badge color={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        color={
                          endpoint.portalType === "ADMIN" ? "purple" : "teal"
                        }
                      >
                        {endpoint.portalType}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {endpoint.description}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 px-4 text-center text-slate-500">
                    No endpoints found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-2xl font-bold text-slate-900">
            {endpoints.length}
          </div>
          <div className="text-sm text-slate-500 mt-1">Total Endpoints</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-2xl font-bold text-slate-900">
            {endpoints.filter((ep) => ep.portalType === "ADMIN").length}
          </div>
          <div className="text-sm text-slate-500 mt-1">Admin Screens</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-2xl font-bold text-slate-900">
            {endpoints.filter((ep) => ep.portalType === "MERCHANT").length}
          </div>
          <div className="text-sm text-slate-500 mt-1">Merchant Screens</div>
        </div>
      </div>

      {/* Add Endpoint Modal */}
      {showAddModal && (
        <Modal
          title="Add Screen Endpoint"
          onClose={() => setShowAddModal(false)}
        >
          <div className="space-y-4">
            <InputField
              label="Screen Name"
              placeholder="e.g., User Management"
              value={formData.screenName}
              onChange={(val) =>
                setFormData({ ...formData, screenName: val })
              }
              required
            />
            <InputField
              label="Endpoint URL"
              placeholder="/admin/users"
              value={formData.endpoint}
              onChange={(val) => setFormData({ ...formData, endpoint: val })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="HTTP Method"
                options={["GET", "POST", "PUT", "DELETE"]}
                value={formData.method}
                onChange={(val) => setFormData({ ...formData, method: val })}
              />
              <InputField
                label="Portal Type"
                options={PORTAL_TYPES}
                value={formData.portalType}
                onChange={(val) =>
                  setFormData({ ...formData, portalType: val })
                }
              />
            </div>
            <InputField
              label="Description"
              placeholder="What is this screen for?"
              value={formData.description}
              onChange={(val) =>
                setFormData({ ...formData, description: val })
              }
            />
          </div>
          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
            <Btn variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Btn>
            <Btn onClick={handleAddEndpoint} disabled={loading}>
              {loading ? <Loader size={16} className="animate-spin" /> : null}
              Add Endpoint
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
