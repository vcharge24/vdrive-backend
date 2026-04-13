package ae.vdrive.notification.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Mail configuration properties
 * Binds mail properties from application.yml
 */
@Configuration
@ConfigurationProperties(prefix = "spring.mail")
public class MailConfig {
    // Configuration is automatically bound from application.yml
    // via Spring's @ConfigurationProperties mechanism
}
