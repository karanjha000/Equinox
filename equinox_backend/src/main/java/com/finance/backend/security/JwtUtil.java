package com.finance.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

 @Value("${jwt.secret:equinox_secret_key_must_be_32_chars!!}")
 private String secret;

 @Value("${jwt.expiration:86400000}")
 private long expiration;

 private Key getSigningKey() {
  return Keys.hmacShaKeyFor(secret.getBytes());
 }

 public String generateToken(String username, String role) {
  return Jwts.builder()
          .setSubject(username)
          .claim("role", role)
          .setIssuedAt(new Date())
          .setExpiration(new Date(System.currentTimeMillis() + expiration))
          .signWith(getSigningKey())
          .compact();
 }

 public String extractUsername(String token) {
  return getClaims(token).getSubject();
 }

 public String extractRole(String token) {
  return getClaims(token).get("role", String.class);
 }

 public boolean isTokenValid(String token) {
  try {
   getClaims(token);
   return true;
  } catch (JwtException e) {
   return false;
  }
 }

 private Claims getClaims(String token) {
  return Jwts.parserBuilder()
          .setSigningKey(getSigningKey())
          .build()
          .parseClaimsJws(token)
          .getBody();
 }
}