package com.example.demo;

import com.example.demo.model.Rol;
import com.example.demo.model.Usuario;
import com.example.demo.repository.RolRepository;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.util.Set;


@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    // Este método se ejecuta al iniciar la aplicación
@Bean
CommandLineRunner initDatabase(UsuarioRepository usuarioRepository, RolRepository rolRepository) {
    return args -> {
        usuarioRepository.findByNombreUsuario("admin")
                .ifPresent(usuario -> {
                    usuarioRepository.delete(usuario);
                    System.out.println("Usuario ADMIN borrado para volver a crearlo limpio.");
                });

        Rol rolAdmin = rolRepository.findByNombreRol("ADMINISTRADOR")
                .orElseThrow(() -> new RuntimeException("Rol ADMINISTRADOR no encontrado en la BD"));

        Usuario admin = Usuario.builder()
                .nombreUsuario("admin")
                .password(new BCryptPasswordEncoder().encode("1234"))
                .build();

        admin.getRoles().add(rolAdmin);

        usuarioRepository.save(admin);
        System.out.println("Usuario ADMIN creado con rol ADMINISTRADOR.");
    };
}

}

