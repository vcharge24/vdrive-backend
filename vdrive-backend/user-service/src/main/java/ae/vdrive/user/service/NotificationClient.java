package ae.vdrive.user.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service", url = "${notification-service.url:http://notification-service:8082}")
public interface NotificationClient {

    @PostMapping("/api/v1/notifications/send-invitation")
    void sendInvitationEmail(@RequestBody InvitationEmailRequest request);

    class InvitationEmailRequest {
        public String email;
        public String firstName;
        public String lastName;
        public String activationLink;

        public InvitationEmailRequest(String email, String firstName, String lastName, String activationLink) {
            this.email = email;
            this.firstName = firstName;
            this.lastName = lastName;
            this.activationLink = activationLink;
        }
    }
}
