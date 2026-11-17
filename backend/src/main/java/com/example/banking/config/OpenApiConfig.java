// package com.example.banking.config;

// import io.swagger.v3.oas.models.OpenAPI;
// import io.swagger.v3.oas.models.info.Info;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;

// @Configuration
// public class OpenApiConfig {

//     @Bean
//     public OpenAPI bankingOpenAPI() {
//         return new OpenAPI()
//                 .info(new Info()
//                         .title("TrustBank Online Banking API")
//                         .description("REST API for managing accounts, transactions, and user authentication for the Transaction Management System.")
//                         .version("v1.0"));
//     }
// }

package com.example.banking.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String BEARER_SCHEME_NAME = "bearerAuth";

    @Bean
    public OpenAPI bankingOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("TrustBank Online Banking API")
                        .description("REST API for managing accounts, transactions, and user authentication for the Transaction Management System.")
                        .version("v1.0"))
                // Registers the "Authorize" button in Swagger UI: paste the JWT returned by
                // POST /api/auth/login (no "Bearer " prefix needed, Swagger adds it) and every
                // "Try it out" call on a protected endpoint will include it automatically.
                .components(new Components().addSecuritySchemes(BEARER_SCHEME_NAME,
                        new SecurityScheme()
                                .name(BEARER_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")))
                .addSecurityItem(new SecurityRequirement().addList(BEARER_SCHEME_NAME));
    }
}