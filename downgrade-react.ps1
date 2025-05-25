Write-Host "📦 Downgrading React and React DOM to 18.2.0..."
npm install react@18.2.0 react-dom@18.2.0

Write-Host "🧹 Removing node_modules and package-lock.json..."
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

Write-Host "📁 Reinstalling all dependencies..."
npm install

Write-Host "📝 Creating a backup of package.json before editing..."
$backupPath = "package.json.bak"
Copy-Item -Path "package.json" -Destination $backupPath -Force
Write-Host "✅ Backup saved as package.json.bak"

Write-Host "📝 Removing React 19 overrides from package.json..."
# Load the JSON
$json = Get-Content -Raw -Path "package.json" | ConvertFrom-Json

# Remove 'overrides' if it exists
if ($json.PSObject.Properties.Name -contains 'overrides') {
    $json.PSObject.Properties.Remove('overrides')
    $json | ConvertTo-Json -Depth 100 | Set-Content "package.json"
    Write-Host "✅ Removed 'overrides' block."
} else {
    Write-Host "ℹ️ No 'overrides' block found."
}

Write-Host "🔍 Scanning codebase for React 19-specific APIs..."
$patterns = @(
    'use\(\)',
    'useOptimistic',
    'useFormStatus',
    'useActionState',
    '<form[^>]+action='
)

$found = $false
foreach ($pattern in $patterns) {
    $results = Get-ChildItem -Recurse -Include *.js,*.jsx,*.ts,*.tsx | Select-String -Pattern $pattern
    if ($results) {
        Write-Host "🚨 Found possible usage of: $pattern"
        $results | Format-Table -AutoSize
        $found = $true
    }
}

if (-not $found) {
    Write-Host "✅ No React 19-only features found."
}

Write-Host "🚀 Done. You can now run: npm run dev"
