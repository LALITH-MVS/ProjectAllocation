package com.project.project_management.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    // 🔐 Password encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 🔐 Authentication Manager
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // 🔐 Security Config
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // ✅ FIXED: attach corsConfigurationSource
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // 🔓 PUBLIC APIs
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/auth/**", "/api/users/signup", "/api/users/login").permitAll()

                        // 👨‍🏫 TEACHER ONLY
                        .requestMatchers("/api/classes/**").hasRole("TEACHER")
                        .requestMatchers("/api/ideas/approve/**").hasRole("TEACHER")
                        .requestMatchers("/audit/**").hasRole("TEACHER")
                        .requestMatchers("/project/add").hasRole("TEACHER")
                        .requestMatchers("/project/delete/**").hasRole("TEACHER")
                        .requestMatchers("/ideas/update-status").hasRole("TEACHER")
                        .requestMatchers("/ideas/class/**").hasRole("TEACHER")

                        // 🎓 STUDENT ONLY
                        .requestMatchers("/api/ideas/submit/**").hasRole("STUDENT")
                        .requestMatchers("/student/**").hasRole("STUDENT")
                        .requestMatchers("/ideas/submit").hasRole("STUDENT")
                        .requestMatchers("/available/**").hasRole("STUDENT")
                        .requestMatchers("/selected/**").hasRole("STUDENT")
                        .requestMatchers("/project/select").hasRole("STUDENT")
                        .requestMatchers("/project/select/**").hasRole("STUDENT")

                        // 👥 COMMON
                        .requestMatchers("/api/team/**").authenticated()
                        .requestMatchers("/api/projects/**").authenticated()

                        // 🔒 EVERYTHING ELSE
                        .anyRequest().authenticated()
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        // 🔥 JWT FILTER
        //http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ✅ CORS CONFIG (FIXED for Vercel + Preflight)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // ✅ FIXED: supports all Vercel deployments
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:5173",
                "https://*.vercel.app"
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        // ✅ helps frontend read JWT if needed
        config.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}