package com.finance.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtUtil {

 @Value("${jwt.secret:#{null}}")
 private String secret;

 @PostConstruct
 public void init() {
  if (secret == null || secret.isBlank()) {
   byte[] keyBytes = new byte[32];
   new SecureRandom().nextBytes(keyBytes);
   secret = Base64.getEncoder().encodeToString(keyBytes);
   log.warn("No jwt.secret configured. Generating a random key for this session. THIS IS UNSAFE FOR PRODUCTION!");
  }
 }

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