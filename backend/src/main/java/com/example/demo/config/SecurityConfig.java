package com.example.demo.config;

import com.example.demo.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.disable())
                                .authorizeHttpRequests(auth -> auth
                                                // ======== RECURSOS ESTÁTICOS - PERMITIR TODOS ========
                                                .requestMatchers(
                                                                "/uploads/**",
                                                                "/css/**",
                                                                "/js/**",
                                                                "/images/**",
                                                                "/webjars/**",
                                                                "/favicon.ico",
                                                                "/error",
                                                                "/*.png",
                                                                "/*.jpg",
                                                                "/*.jpeg",
                                                                "/*.gif",
                                                                "/*.svg",
                                                                "/*.css",
                                                                "/*.js")
                                                .permitAll()

                                                // ======== ENDPOINTS PÚBLICOS ========
                                                .requestMatchers(
                                                                "/api/auth/**")
                                                .permitAll()

                                                .requestMatchers("/api/dashboard/**").permitAll()

                                                // ======== ENDPOINTS DE ADMINISTRADOR ========
                                                .requestMatchers(
                                                                "/api/cursos/crear",
                                                                "/api/cursos/editar/**",
                                                                "/api/cursos/eliminar/**",
                                                                "/api/cursos/editores",
                                                                "/api/cursos/categorias",
                                                                "/api/categorias/**",
                                                                "/api/usuarios/**")
                                                .hasRole("ADMINISTRADOR")

                                                .requestMatchers("/api/profesor/mis-cursos").hasRole("EDITOR")

                                                // ======== ENDPOINTS MIXTOS ========
                                                .requestMatchers("/api/cursos/**").authenticated()
                                                .requestMatchers("/api/materiales/**")
                                                .hasAnyRole("ADMINISTRADOR", "EDITOR")

                                                // ======== CUALQUIER OTRA PETICIÓN ========
                                                .anyRequest().authenticated())
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(List.of("http://localhost:4200"));
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
                config.setAllowCredentials(true);
                config.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", config);
                return source;
        }
}