package com.example.demo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

     // Clave secreta segura (mín 32 bytes)
    private static final String SECRET_KEY = "CLAVE_SUPER_SECRETA_DEL_SISTEMA_DE_CURSOS_ONLINE_1234567890";

    // Tiempo de expiración (1 hora)
    private static final long EXPIRATION_TIME = 60 * 60 * 1000;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // Generar token temporal
    public String generarToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    //  Obtener nombre de usuario desde el token
    public String obtenerUsuarioDesdeToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    //  Validar token
    public boolean validarToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);

            return true;

        } catch (ExpiredJwtException e) {
            System.out.println("Error: Token expirado");
        } catch (JwtException e) {
            System.out.println("Error: Token inválido");
        }

        return false;
    }
}
