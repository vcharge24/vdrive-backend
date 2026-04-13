package ae.vdrive.notification.service.impl;

import ae.vdrive.notification.dto.InvitationEmailRequest;
import ae.vdrive.notification.dto.SendEmailRequest;
import ae.vdrive.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * Implementation of EmailService
 * Handles sending emails using JavaMailSender and Thymeleaf templates
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;
    private final TemplateEngine templateEngine;

    @Override
    public void sendEmail(SendEmailRequest request) {
        try {
            log.info("Sending email to: {}", request.getTo());

            // Process the Thymeleaf template
            Context context = new Context();
            if (request.getTemplateVariables() != null) {
                context.setVariables(request.getTemplateVariables());
            }
            String htmlContent = templateEngine.process(request.getTemplateName(), context);

            // Create and configure MIME message
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    mimeMessage,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            helper.setTo(request.getTo());
            helper.setSubject(request.getSubject());
            helper.setText(htmlContent, true);

            // Send the email
            javaMailSender.send(mimeMessage);
            log.info("Email successfully sent to: {}", request.getTo());

        } catch (MessagingException e) {
            log.error("Failed to send email to: {}", request.getTo(), e);
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error while sending email to: {}", request.getTo(), e);
            throw new RuntimeException("Unexpected error while sending email: " + e.getMessage(), e);
        }
    }

    @Override
    public void sendInvitationEmail(InvitationEmailRequest request) {
        log.info("Preparing invitation email for user: {}", request.getUserName());

        // Build template variables from invitation request
        Map<String, Object> templateVariables = new HashMap<>();
        templateVariables.put("userName", request.getUserName());
        templateVariables.put("inviterName", request.getInviterName());
        templateVariables.put("companyName", request.getCompanyName());
        templateVariables.put("activationLink", request.getActivationLink());

        // Create SendEmailRequest and delegate to sendEmail
        SendEmailRequest emailRequest = SendEmailRequest.builder()
                .to(request.getTo())
                .subject("Welcome to Vdrive - Activate Your Account")
                .templateName("invitation")
                .templateVariables(templateVariables)
                .build();

        sendEmail(emailRequest);
    }
}
