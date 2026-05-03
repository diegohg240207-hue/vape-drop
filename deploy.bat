@echo off
REM ═══════════════════════════════════════════════════════
REM  VAPE DROP — Deploy a Vercel
REM  Completar las 3 variables y ejecutar este archivo
REM ═══════════════════════════════════════════════════════

set VERCEL_TOKEN=PEGAR_TOKEN_AQUI
set SUPABASE_URL=PEGAR_SUPABASE_URL_AQUI
set SUPABASE_KEY=PEGAR_SUPABASE_ANON_KEY_AQUI

echo Deploying VAPE DROP a Vercel...

vercel --token %VERCEL_TOKEN% --yes --prod ^
  -e VITE_SUPABASE_URL=%SUPABASE_URL% ^
  -e VITE_SUPABASE_ANON_KEY=%SUPABASE_KEY%

echo.
echo Deploy completado. Revisa la URL de arriba.
pause
