if (Test-Path "server/auth.ts") {
    $content = Get-Content "server/auth.ts" -Raw
    $content = $content -replace "347040324341-[^`"]*", "process.env.GOOGLE_CLIENT_ID"
    $content = $content -replace "GOCSPX-[^`"]*", "process.env.GOOGLE_CLIENT_SECRET"
    Set-Content "server/auth.ts" -Value $content -NoNewline
}
