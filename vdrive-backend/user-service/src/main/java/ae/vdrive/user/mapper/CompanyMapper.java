package ae.vdrive.user.mapper;

import ae.vdrive.user.dto.response.CompanyResponse;
import ae.vdrive.user.entity.Company;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CompanyMapper {

    CompanyResponse toCompanyResponse(Company company);

    Company toCompanyEntity(CompanyResponse companyResponse);
}
