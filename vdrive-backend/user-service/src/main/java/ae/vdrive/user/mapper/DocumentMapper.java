package ae.vdrive.user.mapper;

import ae.vdrive.user.dto.response.DocumentResponse;
import ae.vdrive.user.entity.Document;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DocumentMapper {

    DocumentResponse toDocumentResponse(Document document);

    Document toDocumentEntity(DocumentResponse documentResponse);
}
