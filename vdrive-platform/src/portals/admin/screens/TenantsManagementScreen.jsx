import { useState } from "react";
import {
  Plus,
  ChevronRight,
  Edit2,
  Trash2,
  ChevronLeft,
  Loader,
} from "lucide-react";
import { Badge, Modal, Btn, InputField } from "../../../components/shared";
import {
  TENANTS,
  COMPANIES,
  LOCATIONS,
} from "../data/userManagementData";
import {
  getTenants,
  createTenant,
  getCompanies,
  createCompany,
  getLocations,
  createLocation,
} from "../../../api/tenants";
import C from "../../../styles/colors";

const STATUS_COLORS = {
  ACTIVE: "green",
  SUSPENDED: "gray",
  DEGRADED: "amber",
};

export default function TenantsManagementScreen() {
  const [tenants, setTenants] = useState(TENANTS);
  const [companies, setCompanies] = useState(COMPANIES);
  const [locations, setLocations] = useState(LOCATIONS);
  const [loading, setLoading] = useState(false);

  // Navigation state
  const [currentLevel, setCurrentLevel] = useState("tenants"); // "tenants", "companies", "locations"
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "tenant", "company", "location"

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: "ACTIVE",
    contactEmail: "",
    contactPhone: "",
    description: "",
  });

  const handleAddTenant = async () => {
    if (!formData.name || !formData.code) {
      alert("Please fill in required fields");
      return;
    }

    try {
      setLoading(true);
      const newTenant = {
        id: `TENANT-${String(tenants.length + 1).padStart(3, "0")}`,
        ...formData,
        companies: 0,
        logo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
        createdAt: new Date().toISOString().split("T")[0],
      };

      try {
        await createTenant(newTenant);
      } catch (apiErr) {
        console.warn("API call failed, using mock data:", apiErr);
      }

      setTenants([...tenants, newTenant]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error("Error creating tenant:", error);
      alert("Failed to create tenant");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = async () => {
    if (!formData.name || !formData.code) {
      alert("Please fill in required fields");
      return;
    }

    if (!selectedTenant) {
      alert("Please select a tenant");
      return;
    }

    try {
      setLoading(true);
      const newCompany = {
        id: `CO-${String(companies.length + 1).padStart(3, "0")}`,
        tenantId: selectedTenant.id,
        ...formData,
        locations: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };

      try {
        await createCompany(newCompany);
      } catch (apiErr) {
        console.warn("API call failed, using mock data:", apiErr);
      }

      setCompanies([...companies, newCompany]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error("Error creating company:", error);
      alert("Failed to create company");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async () => {
    if (!formData.name || !formData.code) {
      alert("Please fill in required fields");
      return;
    }

    if (!selectedCompany) {
      alert("Please select a company");
      return;
    }

    try {
      setLoading(true);
      const newLocation = {
        id: `LOC-${String(locations.length + 1).padStart(3, "0")}`,
        companyId: selectedCompany.id,
        tenantId: selectedTenant.id,
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };

      try {
        await createLocation(newLocation);
      } catch (apiErr) {
        console.warn("API call failed, using mock data:", apiErr);
      }

      setLocations([...locations, newLocation]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error("Error creating location:", error);
      alert("Failed to create location");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      status: "ACTIVE",
      contactEmail: "",
      contactPhone: "",
      description: "",
    });
  };

  const getTenantCompanies = () =>
    companies.filter((c) => c.tenantId === selectedTenant?.id);

  const getCompanyLocations = () =>
    locations.filter((l) => l.companyId === selectedCompany?.id);

  // Level 1: Tenants
  if (currentLevel === "tenants") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Tenant Management
            </h1>
            <p className="text-slate-500 mt-1">
              Manage organizations and their structure
            </p>
          </div>
          <Btn
            icon={Plus}
            onClick={() => {
              setModalType("tenant");
              setShowAddModal(true);
            }}
          >
            Add Tenant
          </Btn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between mb-4">
                <img
                  src={tenant.logo}
                  alt={tenant.name}
                  className="w-12 h-12 rounded-lg"
                />
                <Badge color={STATUS_COLORS[tenant.status]}>
                  {tenant.status}
                </Badge>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                {tenant.name}
              </h3>
              <p className="text-sm text-slate-500 mb-2">Code: {tenant.code}</p>
              <p className="text-xs text-slate-600 mb-3">
                {tenant.contactEmail}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <span className="text-xs font-semibold text-slate-600">
                  {tenant.companies} Companies
                </span>
                <button
                  onClick={() => {
                    setSelectedTenant(tenant);
                    setCurrentLevel("companies");
                  }}
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors group-hover:text-teal-600"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Level 2: Companies
  if (currentLevel === "companies" && selectedTenant) {
    const tenantCompanies = getTenantCompanies();
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setCurrentLevel("tenants")}
            className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            Tenants
          </button>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-medium">{selectedTenant.name}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Companies</h1>
            <p className="text-slate-500 mt-1">
              Manage companies under {selectedTenant.name}
            </p>
          </div>
          <Btn
            icon={Plus}
            onClick={() => {
              setModalType("company");
              setShowAddModal(true);
            }}
          >
            Add Company
          </Btn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tenantCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  {company.name}
                </h3>
                <Badge color={STATUS_COLORS[company.status]}>
                  {company.status}
                </Badge>
              </div>
              <p className="text-sm text-slate-600 mb-1">
                Code: <span className="font-mono">{company.code}</span>
              </p>
              <p className="text-xs text-slate-500 mb-3">
                {company.contactEmail}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <span className="text-xs font-semibold text-slate-600">
                  {company.locations} Locations
                </span>
                <button
                  onClick={() => {
                    setSelectedCompany(company);
                    setCurrentLevel("locations");
                  }}
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors group-hover:text-teal-600"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {tenantCompanies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 mb-4">No companies yet</p>
            <Btn
              icon={Plus}
              onClick={() => {
                setModalType("company");
                setShowAddModal(true);
              }}
            >
              Create First Company
            </Btn>
          </div>
        )}
      </div>
    );
  }

  // Level 3: Locations
  if (currentLevel === "locations" && selectedCompany && selectedTenant) {
    const companyLocations = getCompanyLocations();
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <button
            onClick={() => setCurrentLevel("tenants")}
            className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            Tenants
          </button>
          <span className="text-slate-400">/</span>
          <button
            onClick={() => setCurrentLevel("companies")}
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            {selectedTenant.name}
          </button>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-medium">{selectedCompany.name}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Locations</h1>
            <p className="text-slate-500 mt-1">
              Manage locations under {selectedCompany.name}
            </p>
          </div>
          <Btn
            icon={Plus}
            onClick={() => {
              setModalType("location");
              setShowAddModal(true);
            }}
          >
            Add Location
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
                    Code
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">
                    Address
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {companyLocations.length > 0 ? (
                  companyLocations.map((location) => (
                    <tr
                      key={location.id}
                      className="border-b hover:bg-slate-50 transition-colors"
                      style={{ borderColor: C.border }}
                    >
                      <td className="py-3 px-4 text-slate-900 font-medium">
                        {location.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <code className="bg-slate-100 px-2 py-1 rounded text-xs">
                          {location.code}
                        </code>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {location.address}
                      </td>
                      <td className="py-3 px-4">
                        <Badge color={STATUS_COLORS[location.status]}>
                          {location.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
                            <Edit2 size={16} />
                          </button>
                          <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-slate-600 hover:text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-8 px-4 text-center text-slate-500"
                    >
                      No locations yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;

  // Add Tenant/Company/Location Modal
  {
    showAddModal && (
      <Modal
        title={`Add New ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}
        onClose={() => setShowAddModal(false)}
      >
        <div className="space-y-4">
          <InputField
            label="Name"
            placeholder={`e.g., ${
              modalType === "tenant"
                ? "Al Futtaim Group"
                : modalType === "company"
                ? "Al Futtaim Dubai"
                : "Festival City Mall"
            }`}
            value={formData.name}
            onChange={(val) => setFormData({ ...formData, name: val })}
            required
          />
          <InputField
            label="Code"
            placeholder={`e.g., ${
              modalType === "tenant"
                ? "ALFUTTAIM"
                : modalType === "company"
                ? "AFD"
                : "FCM"
            }`}
            value={formData.code}
            onChange={(val) => setFormData({ ...formData, code: val })}
            required
          />
          {modalType !== "location" && (
            <InputField
              label="Contact Email"
              type="email"
              placeholder="admin@example.com"
              value={formData.contactEmail}
              onChange={(val) =>
                setFormData({ ...formData, contactEmail: val })
              }
            />
          )}
          {modalType !== "location" && (
            <InputField
              label="Contact Phone"
              placeholder="+971 4 123 4567"
              value={formData.contactPhone}
              onChange={(val) =>
                setFormData({ ...formData, contactPhone: val })
              }
            />
          )}
          {modalType === "location" && (
            <InputField
              label="Address"
              placeholder="Street, City"
              value={formData.description}
              onChange={(val) =>
                setFormData({ ...formData, description: val })
              }
            />
          )}
          <InputField
            label="Status"
            options={["ACTIVE", "SUSPENDED", "DEGRADED"]}
            value={formData.status}
            onChange={(val) => setFormData({ ...formData, status: val })}
          />
        </div>
        <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
          <Btn variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Btn>
          <Btn
            onClick={
              modalType === "tenant"
                ? handleAddTenant
                : modalType === "company"
                ? handleAddCompany
                : handleAddLocation
            }
            disabled={loading}
          >
            {loading ? <Loader size={16} className="animate-spin" /> : null}
            Add {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
          </Btn>
        </div>
      </Modal>
    );
  }
}
