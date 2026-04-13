package ae.vdrive.user.service;

import ae.vdrive.user.dto.request.CreateCompanyRequest;
import ae.vdrive.user.dto.response.CompanyResponse;

import java.util.List;
import java.util.UUID;

public interface CompanyService {

    CompanyResponse createCompany(CreateCompanyRequest request, UUID creatorUserId);

    CompanyResponse getCompany(UUID companyId);

    List<CompanyResponse> getAllCompanies();

    List<CompanyResponse> getCompaniesByTenant(UUID tenantId);

    CompanyResponse updateCompany(UUID companyId, CreateCompanyRequest request);

    void deleteCompany(UUID companyId);
}
